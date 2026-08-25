import 'package:flutter/material.dart';
import '../translations.dart';
import '../theme.dart';

class AuthHeader extends StatelessWidget {
  final bool isLogin;
  const AuthHeader({super.key, required this.isLogin});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 64,
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border(bottom: BorderSide(color: AppColors.border)),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          GestureDetector(
            onTap: () => Navigator.of(context).pop(),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.chevron_left, size: 20, color: AppColors.navy),
                const SizedBox(width: 4),
                Text(t('authHeader.back'), style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.navy)),
              ],
            ),
          ),
          const Spacer(),
          Text(
            isLogin ? t('authHeader.hasAccount') : t('authHeader.noAccount'),
            style: TextStyle(fontSize: 14, color: AppColors.textMuted),
          ),
          const SizedBox(width: 4),
          TextButton(
            onPressed: () => Navigator.of(context).pushReplacementNamed(isLogin ? '/register' : '/login'),
            style: TextButton.styleFrom(foregroundColor: AppColors.navy, padding: EdgeInsets.zero, minimumSize: const Size(0, 0)),
            child: Text(isLogin ? t('header.register') : t('header.signIn'), style: const TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
