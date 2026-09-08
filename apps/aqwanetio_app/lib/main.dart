import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'theme.dart';
import 'translations.dart';
import 'models.dart';
import 'map_styles.dart';
import 'screens/home_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';

final authProvider = AuthProvider();
final settingsProvider = SettingsProvider();
final pondFocus = PondFocusBus();

const kThemePrefKey = 'aqw-theme';

/// Mirror of the website's aqw:pond-focus window event:
/// fire-and-consume request for the map to center on a pond.
class PondFocusBus extends ChangeNotifier {
  String? _pending;

  void focus(String pondId) {
    _pending = pondId;
    notifyListeners();
  }

  String? consume() {
    final id = _pending;
    _pending = null;
    return id;
  }
}

void main() {
  runApp(const AqwaNetioApp());
}

class AqwaNetioApp extends StatefulWidget {
  const AqwaNetioApp({super.key});
  @override
  State<AqwaNetioApp> createState() => _AqwaNetioAppState();
}

class _AqwaNetioAppState extends State<AqwaNetioApp> {
  @override
  void initState() {
    super.initState();
    settingsProvider.addListener(_onSettingsChange);
  }

  @override
  void dispose() {
    settingsProvider.removeListener(_onSettingsChange);
    super.dispose();
  }

  void _onSettingsChange() => setState(() {});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AquaNetIO - DOST-ASTI',
      theme: aqwaTheme(),
      initialRoute: '/home',
      routes: {
        '/home': (_) => const HomeScreen(),
        '/login': (_) => const LoginScreen(),
        '/register': (_) => const RegisterScreen(),
      },
      debugShowCheckedModeBanner: false,
    );
  }
}

class AuthProvider extends ChangeNotifier {
  User? _user;
  User? get user => _user;
  bool get isLoggedIn => _user != null;

  Future<bool> login(String email, String password) async {
    _user = User(id: '1', email: email, name: email.split('@').first, role: UserRole.unverified);
    notifyListeners();
    return true;
  }

  void logout() {
    _user = null;
    notifyListeners();
  }

  Future<bool> register(String email, String password, String name) async {
    _user = User(id: '1', email: email, name: name, role: UserRole.unverified);
    notifyListeners();
    return true;
  }
}

class SettingsProvider extends ChangeNotifier {
  Language _language = Language.fil;
  bool _notifications = false;
  MapStyleId _mapStyle = MapStyleId.colored;
  bool _dark = false; 

  Language get language => _language;
  bool get notifications => _notifications;
  MapStyleId get mapStyle => _mapStyle;
  bool get isDark => _dark;

  SettingsProvider() {
    AppColors.isDark = _dark;
    _loadPrefs();
  }

  Future<void> _loadPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    final storedStyle = prefs.getString(kMapStylePrefKey);
    if (storedStyle != null && MapStyleId.values.any((v) => v.name == storedStyle) && _mapStyle.name != storedStyle) {
      _mapStyle = MapStyleId.values.byName(storedStyle);
    }
    final storedTheme = prefs.getString(kThemePrefKey);
    if (storedTheme == 'light') {
      _dark = false;
    } else if (storedTheme == 'dark') {
      _dark = true;
    }
    AppColors.isDark = _dark;
    notifyListeners();
  }

  void setMapStyle(MapStyleId id) {
    if (id == _mapStyle) return;
    _mapStyle = id;
    SharedPreferences.getInstance().then((p) => p.setString(kMapStylePrefKey, id.name));
    notifyListeners();
  }

  void toggleTheme() {
    _dark = !_dark;
    AppColors.isDark = _dark;
    // Site parity: switching to dark snaps the map style back to colored.
    if (_dark && _mapStyle != MapStyleId.colored) setMapStyle(MapStyleId.colored);
    SharedPreferences.getInstance().then((p) => p.setString(kThemePrefKey, _dark ? 'dark' : 'light'));
    notifyListeners();
  }

  void toggleLanguage() {
    _language = _language == Language.en ? Language.fil : Language.en;
    notifyListeners();
  }

  void toggleNotifications() {
    _notifications = !_notifications;
    notifyListeners();
  }
}
