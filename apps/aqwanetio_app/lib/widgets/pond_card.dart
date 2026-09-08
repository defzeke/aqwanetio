import 'package:flutter/material.dart';
import '../models.dart';
import '../theme.dart';
import '../translations.dart';

class PondCard extends StatelessWidget {
  final Pond pond;
  final VoidCallback onTap;
  const PondCard({super.key, required this.pond, required this.onTap});

  Color get _statusColor => switch (pond.status) { PondStatus.safe => AppColors.safe, PondStatus.warning => AppColors.warning, PondStatus.toxic => AppColors.alert };

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 150),
      curve: Curves.easeInOut,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.border),
      ),
      child: Card(
        margin: EdgeInsets.zero,
        color: Colors.transparent,
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(8),
          child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(pond.name, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.text)),
                    const SizedBox(height: 4),
                    Text('NH₃: ${pond.ammoniaLevel.toStringAsFixed(2)} ppm', style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(color: _statusColor.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12), border: Border.all(color: _statusColor.withValues(alpha: 0.2))),
                child: Text(t('status.${pond.status.name}'), style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: _statusColor)),
              ),
            ],
          ),
        ),
      ),
    ));
  }
}
