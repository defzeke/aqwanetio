import 'package:flutter/material.dart';
import '../translations.dart';
import '../theme.dart';
import '../main.dart';

class SettingsSheet extends StatelessWidget {
  const SettingsSheet({super.key});

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: settingsProvider,
      builder: (context, _) {
        return Container(
          padding: const EdgeInsets.all(24),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(child: Container(width: 32, height: 4, decoration: BoxDecoration(color: AppColors.gray300, borderRadius: BorderRadius.circular(2)))),
              const SizedBox(height: 16),
              Text(t('settings.title'), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textMuted, letterSpacing: 1)),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.language, size: 18, color: AppColors.textMuted),
                      const SizedBox(width: 8),
                      Text(t('settings.language'), style: const TextStyle(fontSize: 14, color: AppColors.text)),
                    ],
                  ),
                  GestureDetector(
                    onTap: settingsProvider.toggleLanguage,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(border: Border.all(color: AppColors.border), borderRadius: BorderRadius.circular(4)),
                      child: Text(
                        settingsProvider.language == Language.en ? 'EN' : 'FIL',
                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textMuted),
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
                      const Icon(Icons.notifications_outlined, size: 18, color: AppColors.textMuted),
                      const SizedBox(width: 8),
                      Text(t('settings.notifications'), style: const TextStyle(fontSize: 14, color: AppColors.text)),
                    ],
                  ),
                  Switch.adaptive(
                    value: settingsProvider.notifications,
                    onChanged: (_) => settingsProvider.toggleNotifications(),
                    activeTrackColor: AppColors.navy,
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}
