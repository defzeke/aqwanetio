import 'package:flutter/material.dart';
import '../models.dart';
import '../theme.dart';

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
        columns: const [
          DataColumn(label: Text('Forecast', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted))),
          DataColumn(label: Text('Predicted NH₃', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted))),
          DataColumn(label: Text('Range', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted))),
          DataColumn(label: Text('Bias', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted))),
        ],
        rows: predictions.map((p) => DataRow(cells: [
          DataCell(Text('${p.timestamp.hour.toString().padLeft(2, '0')}:${p.timestamp.minute.toString().padLeft(2, '0')}', style: const TextStyle(color: AppColors.textMuted))),
          DataCell(Text(p.predictedAmmonia.toStringAsFixed(3), style: const TextStyle(fontWeight: FontWeight.w500))),
          DataCell(Text('${p.lowerBound.toStringAsFixed(3)} – ${p.upperBound.toStringAsFixed(3)}', style: const TextStyle(color: AppColors.textMuted))),
          DataCell(Text(p.biasCorrection.toStringAsFixed(3))),
        ])).toList(),
      ),
    );
  }
}
