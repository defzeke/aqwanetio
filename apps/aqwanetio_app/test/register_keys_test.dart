import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:aqwanetio_app/translations.dart';
import 'package:aqwanetio_app/main.dart';

void main() {
  test('fil register keys resolve', () async {
    TestWidgetsFlutterBinding.ensureInitialized();
    SharedPreferences.setMockInitialValues({});
    // Wait for prefs load, then force Filipino.
    await Future<void>.delayed(const Duration(milliseconds: 200));
    if (settingsProvider.language != Language.fil) {
      settingsProvider.toggleLanguage();
    }
    expect(settingsProvider.language, Language.fil);
    final keys = [
      'auth.firstName',
      'auth.firstNamePlaceholder',
      'auth.lastName',
      'auth.lastNamePlaceholder',
      'auth.phoneNumber',
      'auth.phonePlaceholder',
    ];
    for (final k in keys) {
      final v = t(k);
      // ignore: avoid_print
      print('$k => $v');
      expect(v, isNot(k), reason: '$k fell through to path');
    }
  });
}
