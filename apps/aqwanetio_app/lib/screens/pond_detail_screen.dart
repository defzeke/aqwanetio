import 'package:flutter/material.dart';
import '../models.dart';
import '../translations.dart';
import '../theme.dart';
import '../main.dart';
import '../widgets/pond_chart.dart';
import '../widgets/readings_table.dart';
import '../widgets/prediction_panel.dart';

class PondDetailScreen extends StatelessWidget {
  final Pond pond;
  const PondDetailScreen({super.key, required this.pond});

  Color get _statusColor => switch (pond.status) { PondStatus.safe => AppColors.safe, PondStatus.warning => AppColors.warning, PondStatus.toxic => AppColors.alert };

  @override
  Widget build(BuildContext context) {
    final readings = getReadings(pond.id, limit: 12);
    final predictions = getPredictions(pond.id);
    return ListenableBuilder(
      listenable: settingsProvider,
      builder: (context, _) => Scaffold(
      appBar: AppBar(
        title: Row(children: [
          Expanded(child: Text(pond.name, overflow: TextOverflow.ellipsis)),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
            decoration: BoxDecoration(color: _statusColor.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12), border: Border.all(color: _statusColor.withValues(alpha: 0.2))),
            child: Text('NH₃: ${pond.ammoniaLevel.toStringAsFixed(2)} ppm', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w500, color: _statusColor)),
          ),
        ]),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          PondChart(readings: readings, predictions: predictions),
          const SizedBox(height: 16),
          Text(t('modal.readings'), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.text)),
          const SizedBox(height: 8),
          ReadingsTable(readings: readings),
          const SizedBox(height: 16),
          Text(t('modal.forecast'), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.text)),
          const SizedBox(height: 8),
          PredictionPanel(predictions: predictions),
        ]),
      ),
      ),
    );
  }
}
