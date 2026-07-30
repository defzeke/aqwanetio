import 'package:flutter/material.dart';
import 'theme.dart';
import 'translations.dart';
import 'models.dart';
import 'screens/home_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';

final authProvider = AuthProvider();
final settingsProvider = SettingsProvider();

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

  Language get language => _language;
  bool get notifications => _notifications;

  void toggleLanguage() {
    _language = _language == Language.en ? Language.fil : Language.en;
    notifyListeners();
  }

  void toggleNotifications() {
    _notifications = !_notifications;
    notifyListeners();
  }
}
