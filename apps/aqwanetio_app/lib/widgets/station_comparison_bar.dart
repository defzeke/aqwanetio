import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import '../main.dart';
import '../models.dart';
import '../theme.dart';
import '../translations.dart';

// ponytail: exact port of website features/ponds/components/StationComparisonBar.tsx — hybrid Neon + mock
class StationComparisonBar extends StatelessWidget {
  final ChartMetric metric;
  const StationComparisonBar({super.key, this.metric = ChartMetric.p209});

  Color _metricColor(ChartMetric m) {
    if (m == ChartMetric.ammonia) return AppColors.cyan;
    final hex = kMetricConfig[m]!.colorHex;
    return Color(int.parse(hex.replaceFirst('#', ''), radix: 16) + 0xFF000000);
  }

  double _metricFromReading(Reading r, ChartMetric m) => getMetricValue(r, m);

  @override
  Widget build(BuildContext context) {
    final stations = pondsProvider.ponds;
    final cfg = kMetricConfig[metric]!;
    final label = t(cfg.labelKey);
    final color = _metricColor(metric);

    if (stations.isEmpty) {
      return Container(
        decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('${t('charts.barTitle')} – $label', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.text)),
          const SizedBox(height: 4),
          Text(t('charts.comparisonDesc', {'count': '0', 'label': label}), style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
          const SizedBox(height: 16),
          Center(child: Text('No stations yet – add via Admin POST /stations', style: TextStyle(fontSize: 13, color: AppColors.textMuted))),
          const SizedBox(height: 8),
        ]),
      );
    }

    final data = stations.map((s) {
      final rs = getReadings(s.id, limit: 1);
      final r = rs.isNotEmpty ? rs.first : null;
      final v = r != null ? _metricFromReading(r, metric) : 0.0;
      return {'name': s.name, 'value': double.parse(v.toStringAsFixed(2))};
    }).toList();

    final maxY = data.isEmpty ? 1.0 : (data.map((e) => e['value'] as double).reduce((a, b) => a > b ? a : b) * 1.2).clamp(0.5, double.infinity);

    return Container(
      decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text('${t('charts.barTitle')} – $label', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.text)),
        const SizedBox(height: 4),
        Text(t('charts.comparisonDesc', {'count': stations.length.toString(), 'label': label}), style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
        const SizedBox(height: 16),
        SizedBox(
          height: 220,
          child: BarChart(
            BarChartData(
              maxY: maxY,
              barGroups: [
                for (int i = 0; i < data.length; i++)
                  BarChartGroupData(
                    x: i,
                    barRods: [
                      BarChartRodData(
                        toY: data[i]['value'] as double,
                        color: color,
                        width: 16,
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(8)),
                      ),
                    ],
                  ),
              ],
              gridData: FlGridData(show: true, drawVerticalLine: false, horizontalInterval: maxY / 4, getDrawingHorizontalLine: (_) => FlLine(color: AppColors.chartGrid, strokeWidth: 1)),
              borderData: FlBorderData(show: false),
              titlesData: FlTitlesData(
                leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: true, reservedSize: 40, getTitlesWidget: (v, meta) => SideTitleWidget(axisSide: meta.axisSide, child: Text(v.toStringAsFixed(1), style: TextStyle(fontSize: 10, color: AppColors.textMuted))))),
                bottomTitles: AxisTitles(
                  sideTitles: SideTitles(
                    showTitles: true,
                    reservedSize: 36,
                    getTitlesWidget: (v, meta) {
                      final idx = v.toInt();
                      if (idx < 0 || idx >= data.length) return const SizedBox.shrink();
                      final name = data[idx]['name'] as String;
                      final short = name.length > 12 ? name.substring(0, 12) : name;
                      return SideTitleWidget(axisSide: meta.axisSide, child: Text(short, style: TextStyle(fontSize: 9, color: AppColors.textMuted), overflow: TextOverflow.ellipsis));
                    },
                  ),
                ),
                topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
              ),
              barTouchData: BarTouchData(
                touchTooltipData: BarTouchTooltipData(
                  tooltipBorder: BorderSide(color: AppColors.border),
                  getTooltipColor: (_) => AppColors.surface,
                  getTooltipItem: (group, idx, rod, rodIdx) => BarTooltipItem(
                    '${data[group.x]['name']}\n${rod.toY.toStringAsFixed(2)}',
                    TextStyle(fontSize: 11, color: AppColors.text),
                  ),
                ),
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Row(children: [
          Text('$label across ${stations.length} stations', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.text)),
          const SizedBox(width: 6),
          Icon(Icons.trending_up, size: 14, color: AppColors.textMuted),
        ]),
        const SizedBox(height: 2),
        Text('Showing current ${label.toLowerCase()} values', style: TextStyle(fontSize: 10, color: AppColors.textMuted)),
      ]),
    );
  }
}
