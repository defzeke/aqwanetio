import 'package:flutter/material.dart';
import '../models.dart';
import '../theme.dart';

class ReadingsTable extends StatelessWidget {
  final List<Reading> readings;
  const ReadingsTable({super.key, required this.readings});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: DataTable(
        headingRowColor: WidgetStateProperty.all(AppColors.background),
        border: TableBorder.all(color: AppColors.border, borderRadius: BorderRadius.circular(8)),
        columnSpacing: 24,
        columns: const [
          DataColumn(label: Text('Time', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted))),
          DataColumn(label: Text('NH₃ (ppm)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted))),
          DataColumn(label: Text('Temp (°C)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted))),
          DataColumn(label: Text('pH', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted))),
          DataColumn(label: Text('DO (mg/L)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted))),
        ],
        rows: readings.map((r) => DataRow(cells: [
          DataCell(Text('${r.timestamp.hour.toString().padLeft(2, '0')}:${r.timestamp.minute.toString().padLeft(2, '0')}', style: const TextStyle(color: AppColors.textMuted))),
          DataCell(Text(r.ammonia.toStringAsFixed(3))),
          DataCell(Text(r.temperature.toStringAsFixed(1))),
          DataCell(Text(r.ph.toStringAsFixed(2))),
          DataCell(Text(r.dissolvedOxygen.toStringAsFixed(1))),
        ])).toList(),
      ),
    );
  }
}
