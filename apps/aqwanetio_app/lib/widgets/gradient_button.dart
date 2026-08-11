import 'package:flutter/material.dart';
import '../theme.dart';

class GradientButton extends StatelessWidget {
  final String label;
  final VoidCallback? onTap;
  const GradientButton({super.key, required this.label, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 52,
      decoration: BoxDecoration(
        gradient: onTap == null
            ? null
            : const LinearGradient(colors: [AppColors.primary, AppColors.accent], begin: Alignment.topLeft, end: Alignment.bottomRight),
        color: onTap == null ? AppColors.gray200 : null,
        borderRadius: BorderRadius.circular(14),
        boxShadow: onTap == null ? null : [BoxShadow(color: AppColors.primary.withValues(alpha: 0.35), blurRadius: 12, offset: const Offset(0, 6))],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(14),
          child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
            Text(label, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: onTap == null ? AppColors.textMuted : Colors.white)),
            const SizedBox(width: 8),
            Icon(Icons.arrow_forward, size: 18, color: onTap == null ? AppColors.textMuted : Colors.white),
          ]),
        ),
      ),
    );
  }
}