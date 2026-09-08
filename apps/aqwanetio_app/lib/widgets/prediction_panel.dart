import 'package:flutter/material.dart';
import '../models.dart';
import '../theme.dart';
import '../translations.dart';

class PredictionPanel extends StatelessWidget {
  final List<Prediction> predictions;
  const PredictionPanel({super.key, required this.predictions});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: DataTable(
        headingRowColor: WidgetStateProperty.all(AppColors.background),
        border: TableBorder.all(color: AppColors.border, borderRadius: BorderRadius.circular(8)),
        columnSpacing: 24,
        columns: [
          DataColumn(label: Text(t('table.forecast'), style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted))),
          DataColumn(label: Text(t('table.predictedAmmonia'), style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted))),
          DataColumn(label: Text(t('table.range'), style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted))),
          DataColumn(label: Text(t('table.bias'), style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted))),
        ],
        rows: predictions.map((p) => DataRow(cells: [
          DataCell(Text('${p.timestamp.hour.toString().padLeft(2, '0')}:${p.timestamp.minute.toString().padLeft(2, '0')}', style: TextStyle(color: AppColors.textMuted))),
          DataCell(Text(p.predictedAmmonia.toStringAsFixed(3), style: TextStyle(fontWeight: FontWeight.w500, color: AppColors.text))),
          DataCell(Text('${p.lowerBound.toStringAsFixed(3)} – ${p.upperBound.toStringAsFixed(3)}', style: TextStyle(color: AppColors.textMuted))),
          DataCell(Text(p.biasCorrection.toStringAsFixed(3), style: TextStyle(color: AppColors.text))),
        ])).toList(),
      ),
    );
  }
}
