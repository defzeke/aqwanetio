import 'package:flutter/material.dart';
import '../translations.dart';
import '../theme.dart';

class AuthFooter extends StatelessWidget {
  const AuthFooter({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: const BoxDecoration(
        color: AppColors.gray200,
        border: Border(top: BorderSide(color: AppColors.border)),
      ),
      child: SafeArea(
        top: false,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(t('footer.brand'), style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.navy)),
                const SizedBox(height: 2),
                Text('© ${DateTime.now().year} DOST-ASTI. All Rights Reserved.', style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
              ],
            ),
            const Spacer(),
            Wrap(
              spacing: 16,
              runSpacing: 4,
              children: [
                Text(t('footer.contact'), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted)),
                Text(t('footer.privacy'), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted)),
                Text(t('footer.dost'), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted)),
                Text(t('footer.tos'), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
