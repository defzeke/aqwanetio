import 'package:flutter/material.dart';
import '../models.dart';
import '../theme.dart';
import '../translations.dart';

class ReadingsTable extends StatelessWidget {
  final List<Reading> readings;
  const ReadingsTable({super.key, required this.readings});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border.all(color: AppColors.border),
        borderRadius: BorderRadius.circular(8),
      ),
      clipBehavior: Clip.antiAlias,
      child: Table(
        columnWidths: const {
          0: FlexColumnWidth(1.5),
          1: FlexColumnWidth(1),
        },
        defaultVerticalAlignment: TableCellVerticalAlignment.middle,
        border: TableBorder(horizontalInside: BorderSide(color: AppColors.border)),
        children: [
          TableRow(
            decoration: BoxDecoration(color: AppColors.background),
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Text(t('table.time'), style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted)),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Text(t('modal.ammonia'), style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted)),
              ),
            ],
          ),
          ...readings.map((r) => TableRow(
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                child: Text('${r.timestamp.hour.toString().padLeft(2, '0')}:${r.timestamp.minute.toString().padLeft(2, '0')}', style: TextStyle(color: AppColors.textMuted)),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                child: Text(r.ammonia.toStringAsFixed(3), style: TextStyle(color: AppColors.text)),
              ),
            ],
          )),
        ],
      ),
    );
  }
}
