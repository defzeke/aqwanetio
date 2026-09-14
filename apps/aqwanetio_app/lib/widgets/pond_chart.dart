import 'dart:math' as math;
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import '../models.dart';
import '../theme.dart';
import '../translations.dart';

// ponytail: exact port of website features/ponds/components/PondChart.tsx — 9 metrics, fl_chart replaces recharts
class PondChart extends StatelessWidget {
  final List<Reading> readings;
  final List<Prediction> predictions;
  final ChartMetric metric;
  const PondChart({super.key, required this.readings, required this.predictions, this.metric = ChartMetric.ammonia});

  Color _metricColor(ChartMetric m) {
    if (m == ChartMetric.ammonia) return AppColors.cyan;
    final hex = kMetricConfig[m]!.colorHex;
    return Color(int.parse(hex.replaceFirst('#', ''), radix: 16) + 0xFF000000);
  }

  @override
  Widget build(BuildContext context) {
    final cfg = kMetricConfig[metric]!;
    final label = t(cfg.labelKey);
    final unit = cfg.unit;
    final color = _metricColor(metric);

    // history reversed like website useMemo: hist = [...readings].reverse()
    final hist = readings.reversed.toList();
    final histVals = hist.map((r) => getMetricValue(r, metric)).toList();
    final isForecast = metric == ChartMetric.ammonia && predictions.isNotEmpty;
    final forecastVals = isForecast ? predictions.map((p) => p.predictedAmmonia).toList() : <double>[];
    final forecastDates = isForecast ? predictions.map((p) => p.timestamp).toList() : <DateTime>[];

    final allVals = [...histVals, ...forecastVals];
    final minV = allVals.isEmpty ? 0.0 : allVals.reduce(math.min) * 0.92;
    final maxV = allVals.isEmpty ? 1.0 : allVals.reduce(math.max) * 1.08;
    final range = (maxV - minV).abs() < 0.001 ? 1.0 : (maxV - minV);

    final histSpots = <FlSpot>[
      for (int i = 0; i < histVals.length; i++) FlSpot(i.toDouble(), histVals[i]),
    ];
    final forecastSpots = <FlSpot>[];
    if (isForecast && forecastVals.isNotEmpty && histVals.isNotEmpty) {
      // connector point at last history index then forecast points
      forecastSpots.add(FlSpot((histVals.length - 1).toDouble(), histVals.last));
      for (int i = 0; i < forecastVals.length; i++) {
        forecastSpots.add(FlSpot((histVals.length + i).toDouble(), forecastVals[i]));
      }
    } else if (isForecast && forecastVals.isNotEmpty) {
      for (int i = 0; i < forecastVals.length; i++) {
        forecastSpots.add(FlSpot(i.toDouble(), forecastVals[i]));
      }
    }

    final totalPoints = histVals.length + (isForecast ? forecastVals.length : 0);
    final lastVal = histVals.isEmpty ? 0.0 : histVals.last;
    final isAmmoniaSafe = metric == ChartMetric.ammonia ? lastVal < 1.0 : true;

    // dates for x-axis lookup
    final histDates = hist.map((r) => r.timestamp).toList();

    String fmtX(double v) {
      final idx = v.round().clamp(0, totalPoints - 1);
      DateTime d;
      if (idx < histDates.length) {
        d = histDates[idx];
      } else if (isForecast) {
        final fIdx = idx - histDates.length;
        d = fIdx < forecastDates.length ? forecastDates[fIdx] : DateTime.now();
      } else {
        d = DateTime.now();
      }
      // website: toLocaleString month short day numeric hour numeric
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      final mon = months[d.month - 1];
      final hour = d.hour % 12 == 0 ? 12 : d.hour % 12;
      final ampm = d.hour >= 12 ? 'PM' : 'AM';
      return '$mon ${d.day}, $hour $ampm';
    }

    String fmtTooltipDate(double v) {
      final idx = v.round().clamp(0, totalPoints - 1);
      DateTime d;
      if (idx < histDates.length) {
        d = histDates[idx];
      } else if (isForecast) {
        final fIdx = idx - histDates.length;
        d = fIdx < forecastDates.length ? forecastDates[fIdx] : DateTime.now();
      } else {
        d = DateTime.now();
      }
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return '${months[d.month - 1]} ${d.day}, ${d.year} ${d.hour.toString().padLeft(2, '0')}:${d.minute.toString().padLeft(2, '0')}';
    }

    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      // header like website CardHeader
      Container(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
        decoration: BoxDecoration(
          color: AppColors.surface,
          border: Border(bottom: BorderSide(color: AppColors.border)),
          borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
        ),
        child: Row(children: [
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(label, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.text)),
              const SizedBox(height: 2),
              Text('$label – ${lastVal.toStringAsFixed(2)} $unit',
                  style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
            ]),
          ),
        ]),
      ),
      Container(
        height: 250,
        padding: const EdgeInsets.fromLTRB(8, 16, 16, 8),
        decoration: BoxDecoration(
          color: AppColors.surface,
          border: Border.all(color: AppColors.border),
          borderRadius: const BorderRadius.vertical(bottom: Radius.circular(12)),
        ),
        child: totalPoints == 0
            ? Center(child: Text(t('search.empty'), style: TextStyle(color: AppColors.textMuted)))
            : LineChart(
                LineChartData(
                  minX: 0,
                  maxX: math.max(0, totalPoints - 1).toDouble(),
                  minY: minV,
                  maxY: maxV,
                  gridData: FlGridData(
                    show: true,
                    drawVerticalLine: false,
                    horizontalInterval: range / 4,
                    getDrawingHorizontalLine: (_) => FlLine(color: AppColors.chartGrid, strokeWidth: 1),
                  ),
                  borderData: FlBorderData(show: false),
                  titlesData: FlTitlesData(
                    leftTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        reservedSize: 44,
                        interval: range / 4,
                        getTitlesWidget: (v, meta) => SideTitleWidget(
                          axisSide: meta.axisSide,
                          child: Text(v.toStringAsFixed(2), style: TextStyle(fontSize: 10, color: AppColors.textMuted)),
                        ),
                      ),
                    ),
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        reservedSize: 32,
                        interval: math.max(1, totalPoints / 4),
                        getTitlesWidget: (v, meta) {
                          // show ~4 ticks like website minTickGap 32
                          final step = math.max(1, totalPoints ~/ 4);
                          final idx = v.round();
                          if (idx % step != 0 && idx != totalPoints - 1) return const SizedBox.shrink();
                          return SideTitleWidget(
                            axisSide: meta.axisSide,
                            child: Text(fmtX(v), style: TextStyle(fontSize: 10, color: AppColors.textMuted)),
                          );
                        },
                      ),
                    ),
                    topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  ),
                  lineTouchData: LineTouchData(
                    touchTooltipData: LineTouchTooltipData(
                      tooltipRoundedRadius: 8,
                      tooltipBorder: BorderSide(color: AppColors.border),
                      getTooltipColor: (_) => AppColors.surface,
                      getTooltipItems: (spots) => spots.map((s) {
                        final isF = s.barIndex == 1;
                        final lbl = isF ? t('modal.forecastLegend') : label;
                        return LineTooltipItem(
                          '$lbl\n${s.y.toStringAsFixed(2)} $unit\n${fmtTooltipDate(s.x)}',
                          TextStyle(fontSize: 11, color: AppColors.text, fontWeight: FontWeight.w500),
                        );
                      }).toList(),
                    ),
                  ),
                  extraLinesData: metric == ChartMetric.ammonia
                      ? ExtraLinesData(horizontalLines: [
                          HorizontalLine(
                            y: 1.0,
                            color: AppColors.alert.withValues(alpha: 0.7),
                            strokeWidth: 1.5,
                            dashArray: [6, 3],
                          ),
                        ])
                      : null,
                  lineBarsData: [
                    if (histSpots.isNotEmpty)
                      LineChartBarData(
                        spots: histSpots,
                        isCurved: true,
                        color: color,
                        barWidth: 2,
                        isStrokeCapRound: true,
                        dotData: const FlDotData(show: false),
                        belowBarData: BarAreaData(show: false),
                      ),
                    if (forecastSpots.isNotEmpty)
                      LineChartBarData(
                        spots: forecastSpots,
                        isCurved: true,
                        color: color,
                        barWidth: 2,
                        isStrokeCapRound: true,
                        dashArray: [6, 3],
                        dotData: const FlDotData(show: false),
                        belowBarData: BarAreaData(show: false),
                      ),
                  ],
                ),
              ),
      ),
      const SizedBox(height: 8),
      // banner like website PondChart.tsx:130
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isAmmoniaSafe ? AppColors.safe.withValues(alpha: 0.3) : AppColors.alert.withValues(alpha: 0.3)),
          color: isAmmoniaSafe ? AppColors.safe.withValues(alpha: 0.1) : AppColors.alert.withValues(alpha: 0.1),
        ),
        child: Row(children: [
          Container(width: 10, height: 10, decoration: BoxDecoration(color: isAmmoniaSafe ? AppColors.safe : AppColors.alert, shape: BoxShape.circle)),
          const SizedBox(width: 8),
          Text('${t('modal.current')} $label:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: isAmmoniaSafe ? AppColors.safe : AppColors.alert)),
          const SizedBox(width: 6),
          Text('${lastVal.toStringAsFixed(2)} $unit', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: isAmmoniaSafe ? AppColors.safe : AppColors.alert)),
          const Spacer(),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(color: isAmmoniaSafe ? AppColors.safe.withValues(alpha: 0.15) : AppColors.alert.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(12)),
            child: Text(isAmmoniaSafe ? t('status.safe') : t('status.critical'), style: TextStyle(fontSize: 10, fontWeight: FontWeight.w500, color: isAmmoniaSafe ? AppColors.safe : AppColors.alert)),
          ),
        ]),
      ),
    ]);
  }
}
