import 'package:flutter/material.dart';
import '../translations.dart';
import '../theme.dart';
import '../main.dart';

class MenuSheet extends StatelessWidget {
  const MenuSheet({super.key});

  void _go(BuildContext context, String route) {
    final nav = Navigator.of(context);
    nav.pop();
    nav.pushNamed(route);
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: settingsProvider,
      builder: (context, _) => Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(child: Container(width: 32, height: 4, decoration: BoxDecoration(color: AppColors.gray300, borderRadius: BorderRadius.circular(2)))),
            const SizedBox(height: 16),
            ListenableBuilder(
              listenable: authProvider,
              builder: (context, _) {
                final u = authProvider.user;
                return Column(children: [
                  if (u == null) ...[
                    ListTile(
                      leading: Icon(Icons.login_outlined, size: 20, color: AppColors.textMuted),
                      title: Text(t('header.signIn'), style: TextStyle(fontSize: 14, color: AppColors.text)),
                      onTap: () => _go(context, '/login'),
                    ),
                    ListTile(
                      leading: Icon(Icons.person_add_outlined, size: 20, color: AppColors.textMuted),
                      title: Text(t('header.register'), style: TextStyle(fontSize: 14, color: AppColors.text)),
                      onTap: () => _go(context, '/register'),
                    ),
                  ] else
                    ListTile(
                      leading: Icon(Icons.logout_outlined, size: 20, color: AppColors.textMuted),
                      title: Text('${t('header.signOut')} (${u.name})', style: TextStyle(fontSize: 14, color: AppColors.text)),
                      onTap: () {
                        authProvider.logout();
                        Navigator.of(context).pop();
                      },
                    ),
                ]);
              },
            ),
            Divider(color: AppColors.border, height: 24),
            Text(t('settings.title'), style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textMuted, letterSpacing: 1)),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(Icons.dark_mode_outlined, size: 18, color: AppColors.textMuted),
                    const SizedBox(width: 8),
                    Text(t('settings.darkMode'), style: TextStyle(fontSize: 14, color: AppColors.text)),
                  ],
                ),
                Switch.adaptive(
                  value: settingsProvider.isDark,
                  onChanged: (_) => settingsProvider.toggleTheme(),
                  activeTrackColor: const Color(0xFF00aeef),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(Icons.language, size: 18, color: AppColors.textMuted),
                    const SizedBox(width: 8),
                    Text(t('settings.language'), style: TextStyle(fontSize: 14, color: AppColors.text)),
                  ],
                ),
                GestureDetector(
                  onTap: settingsProvider.toggleLanguage,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(border: Border.all(color: AppColors.border), borderRadius: BorderRadius.circular(4)),
                    child: Text(
                      settingsProvider.language == Language.en ? 'EN' : 'FIL',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textMuted),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(Icons.notifications_outlined, size: 18, color: AppColors.textMuted),
                    const SizedBox(width: 8),
                    Text(t('settings.notifications'), style: TextStyle(fontSize: 14, color: AppColors.text)),
                  ],
                ),
                Switch.adaptive(
                  value: settingsProvider.notifications,
                  onChanged: (_) => settingsProvider.toggleNotifications(),
                  activeTrackColor: AppColors.primary,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}