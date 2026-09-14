import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart'; 
import 'firebase_options.dart'; 
import 'package:shared_preferences/shared_preferences.dart';
import 'theme.dart';
import 'translations.dart';
import 'models.dart';
import 'map_styles.dart';
import 'services/auth_api.dart';
import 'screens/home_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/profile_screen.dart';

final authProvider = AuthProvider();
final settingsProvider = SettingsProvider();
final pondFocus = PondFocusBus();

const kThemePrefKey = 'aqw-theme';
// ponytail: SharedPreferences is already installed; no need for secure_storage for dev tokens
const kAuthIdTokenKey = 'aqw-idToken';
const kAuthRefreshTokenKey = 'aqw-refreshToken';
const kAuthUidKey = 'aqw-uid';

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

// 3. Make main async and initialize Firebase
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
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
        '/profile': (_) => const ProfileScreen(),
      },
      debugShowCheckedModeBanner: false,
    );
  }
}

class AuthProvider extends ChangeNotifier {
  final AuthApi _api = AuthApi();
  User? _user;
  String? _idToken;
  String? _refreshToken;

  User? get user => _user;
  String? get idToken => _idToken;
  String? get refreshToken => _refreshToken;
  bool get isLoggedIn => _user != null;

  AuthProvider() {
    _loadSession();
  }

  Future<void> _loadSession() async {
    final prefs = await SharedPreferences.getInstance();
    _idToken = prefs.getString(kAuthIdTokenKey);
    _refreshToken = prefs.getString(kAuthRefreshTokenKey);
    final uid = prefs.getString(kAuthUidKey);
    final email = prefs.getString('aqw-email');
    final name = prefs.getString('aqw-name');
    if (uid != null && email != null) {
      _user = User(id: uid, email: email, name: name ?? email.split('@').first, role: UserRole.unverified);
      notifyListeners();
    }
  }

  Future<void> _persist(String uid, String email, String name, {String? idToken, String? refreshToken}) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(kAuthUidKey, uid);
    await prefs.setString('aqw-email', email);
    await prefs.setString('aqw-name', name);
    if (idToken != null) {
      _idToken = idToken;
      await prefs.setString(kAuthIdTokenKey, idToken);
    }
    if (refreshToken != null) {
      _refreshToken = refreshToken;
      await prefs.setString(kAuthRefreshTokenKey, refreshToken);
    }
  }

  Future<bool> login(String email, String password) async {
    final data = await _api.login(email: email, password: password);
    final uid = (data['uid'] ?? data['localId']) as String;
    final idToken = data['idToken'] as String?;
    final refreshToken = data['refreshToken'] as String?;
    final profile = data['profile'] as Map<String, dynamic>?;
    final rawEmail = (profile?['email'] as String?) ?? email.trim().toLowerCase();
    final name = profile?['firstName'] != null
        ? '${profile!['firstName']} ${profile['lastName'] ?? ''}'.trim()
        : rawEmail.split('@').first;
    final role = profile?['role'] == 'verified_owner' ? UserRole.verifiedOwner : UserRole.unverified;
    _user = User(id: uid, email: rawEmail, name: name, role: role, phone: profile?['phone'] as String?);
    await _persist(uid, rawEmail, name, idToken: idToken, refreshToken: refreshToken);
    notifyListeners();
    return true;
  }

  Future<void> logout() async {
    _user = null;
    _idToken = null;
    _refreshToken = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(kAuthUidKey);
    await prefs.remove('aqw-email');
    await prefs.remove('aqw-name');
    await prefs.remove(kAuthIdTokenKey);
    await prefs.remove(kAuthRefreshTokenKey);
    notifyListeners();
  }

  Future<bool> register(String firstName, String lastName, String email, String phone, String password) async {
    final data = await _api.register(firstName: firstName, lastName: lastName, email: email, phone: phone, password: password);
    final uid = data['uid'] as String;
    final rawEmail = email.trim().toLowerCase();
    final name = '$firstName $lastName'.trim();
    _user = User(id: uid, email: rawEmail, name: name.isEmpty ? rawEmail.split('@').first : name, role: UserRole.unverified, phone: phone.trim());
    await _persist(uid, rawEmail, _user!.name);
    notifyListeners();
    return true;
  }

  Future<Map<String, dynamic>?> fetchProfile() async {
    final token = _idToken;
    if (token == null || token.isEmpty) return null;
    final data = await _api.getProfile(token);
    final p = data['profile'] as Map<String, dynamic>?;
    if (p != null) {
      final uid = (p['uid'] as String?) ?? _user?.id ?? '';
      final email = (p['email'] as String?) ?? _user?.email ?? '';
      final name = p['firstName'] != null ? '${p['firstName']} ${p['lastName'] ?? ''}'.trim() : (_user?.name ?? email.split('@').first);
      final role = p['role'] == 'verified_owner' ? UserRole.verifiedOwner : UserRole.unverified;
      final phone = p['phone'] as String?;
      _user = User(id: uid, email: email, name: name, role: role, phone: phone);
      await _persist(uid, email, name);
      notifyListeners();
    }
    return data;
  }

  Future<Map<String, dynamic>> updateProfile({required String firstName, required String lastName, required String phone}) async {
    final token = _idToken;
    if (token == null || token.isEmpty) throw Exception('Not authenticated');
    final data = await _api.updateProfile(token, firstName: firstName, lastName: lastName, phone: phone);
    final p = data['profile'] as Map<String, dynamic>?;
    if (p != null) {
      final uid = (p['uid'] as String?) ?? _user!.id;
      final email = (p['email'] as String?) ?? _user!.email;
      final name = '${p['firstName']} ${p['lastName'] ?? ''}'.trim();
      final role = p['role'] == 'verified_owner' ? UserRole.verifiedOwner : UserRole.unverified;
      final newPhone = p['phone'] as String?;
      _user = User(id: uid, email: email, name: name, role: role, phone: newPhone);
      await _persist(uid, email, name);
      notifyListeners();
    }
    return data;
  }

  // ponytail: keep phone edits disabled like web, but payload requires it — expose current phone
  String get currentPhone => _user?.phone ?? '';
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