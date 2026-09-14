import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import '../models.dart';
import '../theme.dart';
import '../translations.dart';

// ponytail: exact port of website features/ponds/components/PondHealthRadar.tsx
class PondHealthRadar extends StatelessWidget {
  final String pondId;
  const PondHealthRadar({super.key, required this.pondId});

  double _normalize(double v, double min, double max, {bool invert = false}) {
    final n = ((v - min) / (max - min)).clamp(0.0, 1.0);
    return invert ? 1 - n : n;
  }

  @override
  Widget build(BuildContext context) {
    final r = getReadings(pondId, limit: 1).isNotEmpty ? getReadings(pondId, limit: 1).first : null;
    if (r == null) return const SizedBox.shrink();

    final scores = <Map<String, dynamic>>[
      {'label': t('metrics.p209'), 'value': (_normalize(r.param209, 6.5, 9) * 100).round().clamp(0, 100).toDouble()},
      {'label': t('metrics.p176'), 'value': (_normalize(r.param176, 3, 8) * 100).round().clamp(0, 100).toDouble()},
      {'label': t('metrics.p170'), 'value': ((1 - (r.param170 - 27.5).abs() / 3) * 100).clamp(0, 100).roundToDouble()},
      {'label': t('metrics.p173'), 'value': (_normalize(r.param173, 5, 0, invert: true) * 100).round().clamp(0, 100).toDouble()},
      {'label': t('metrics.p210'), 'value': (_normalize(r.param210, 1, 0, invert: true) * 100).round().clamp(0, 100).toDouble()},
    ];

    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
      child: Column(children: [
        Text(t('charts.radarTitle'), style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.text)),
        const SizedBox(height: 4),
        Text(t('charts.radarDesc'), style: TextStyle(fontSize: 11, color: AppColors.textMuted), textAlign: TextAlign.center),
        const SizedBox(height: 12),
        SizedBox(
          height: 250,
          child: RadarChart(
            RadarChartData(
              dataSets: [
                RadarDataSet(
                  fillColor: AppColors.cyan.withValues(alpha: 0.3),
                  borderColor: AppColors.cyan,
                  entryRadius: 0,
                  dataEntries: [for (final s in scores) RadarEntry(value: s['value'] as double)],
                  borderWidth: 2,
                ),
              ],
              radarBackgroundColor: Colors.transparent,
              radarBorderData: BorderSide(color: AppColors.border),
              gridBorderData: BorderSide(color: AppColors.chartGrid),
              titlePositionPercentageOffset: 0.15,
              titleTextStyle: TextStyle(fontSize: 10, color: AppColors.textMuted),
              getTitle: (index, angle) => RadarChartTitle(text: scores[index]['label'] as String),
              tickCount: 4,
              ticksTextStyle: TextStyle(fontSize: 9, color: AppColors.textMuted.withValues(alpha: 0.6)),
              tickBorderData: BorderSide(color: AppColors.border.withValues(alpha: 0.4)),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          Icon(Icons.trending_up, size: 14, color: AppColors.textMuted),
          const SizedBox(width: 4),
          Flexible(child: Text(t('charts.radarDesc'), style: TextStyle(fontSize: 11, color: AppColors.textMuted), textAlign: TextAlign.center)),
        ]),
        const SizedBox(height: 2),
        Text('Health 0-100 – higher is healthier', style: TextStyle(fontSize: 10, color: AppColors.textMuted.withValues(alpha: 0.7))),
      ]),
    );
  }
}
