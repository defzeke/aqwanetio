import 'package:flutter/material.dart';
import '../models.dart';
import '../translations.dart';
import '../theme.dart';
import '../main.dart';
import '../widgets/pond_chart.dart';
import '../widgets/readings_table.dart';
import '../widgets/prediction_panel.dart';

class PondDetailScreen extends StatefulWidget {
  final Pond pond;
  const PondDetailScreen({super.key, required this.pond});

  @override
  State<PondDetailScreen> createState() => _PondDetailScreenState();
}

class _PondDetailScreenState extends State<PondDetailScreen> {
  bool _historical = false;
  DateTime _selected = DateTime.now();

  Color get _statusColor => switch (widget.pond.status) { PondStatus.safe => AppColors.safe, PondStatus.warning => AppColors.warning, PondStatus.toxic => AppColors.alert };

  Future<void> _pickDateTime() async {
    final now = DateTime.now();
    final date = await showDatePicker(
      context: context,
      initialDate: _selected.isAfter(now) ? now : _selected,
      firstDate: now.subtract(const Duration(days: 30)),
      lastDate: now,
    );
    if (date == null || !mounted) return;
    final time = await showTimePicker(context: context, initialTime: TimeOfDay.fromDateTime(_selected));
    if (time == null) return;
    setState(() => _selected = DateTime(date.year, date.month, date.day, time.hour, time.minute));
  }

  @override
  Widget build(BuildContext context) {
    final readings = _historical ? getHistoricalReadings(widget.pond.id, _selected) : getReadings(widget.pond.id, limit: 12);
    final predictions = _historical ? const <Prediction>[] : getPredictions(widget.pond.id);
    return ListenableBuilder(
      listenable: settingsProvider,
      builder: (context, _) => Scaffold(
      appBar: AppBar(
        title: Row(children: [
          Expanded(child: Text(widget.pond.name, overflow: TextOverflow.ellipsis)),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
            decoration: BoxDecoration(color: _statusColor.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12), border: Border.all(color: _statusColor.withValues(alpha: 0.2))),
            child: Text('NH₃: ${widget.pond.ammoniaLevel.toStringAsFixed(2)} ppm', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w500, color: _statusColor)),
          ),
        ]),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          SegmentedButton<bool>(
            segments: [
              ButtonSegment(value: false, icon: const Icon(Icons.show_chart, size: 18), label: Text(t('chart.modeLive') == 'chart.modeLive' ? 'Live' : t('chart.modeLive'))),
              ButtonSegment(value: true, icon: const Icon(Icons.history, size: 18), label: Text(t('chart.modeHistorical') == 'chart.modeHistorical' ? 'Historical' : t('chart.modeHistorical'))),
            ],
            selected: {_historical},
            onSelectionChanged: (s) => setState(() => _historical = s.first),
            showSelectedIcon: false,
            style: ButtonStyle(
              visualDensity: VisualDensity.compact,
              side: WidgetStateProperty.all(BorderSide(color: AppColors.border)),
            ),
          ),
          if (_historical) ...[
            const SizedBox(height: 12),
            _datetimeField(),
          ],
          const SizedBox(height: 16),
          PondChart(readings: readings, predictions: predictions),
          const SizedBox(height: 16),
          Text(t('modal.readings'), style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.text)),
          const SizedBox(height: 8),
          ReadingsTable(readings: readings.take(12).toList()),
          if (!_historical) ...[
            const SizedBox(height: 16),
            Text(t('modal.forecast'), style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.text)),
            const SizedBox(height: 8),
            PredictionPanel(predictions: predictions),
          ],
        ]),
      ),
      ),
    );
  }

  Widget _datetimeField() {
    final t = _selected;
    final period = t.hour >= 12 ? 'PM' : 'AM';
    final hour = (t.hour % 12 == 0 ? 12 : t.hour % 12).toString().padLeft(2, '0');
    final formatted = '${t.month.toString().padLeft(2, '0')}/${t.day.toString().padLeft(2, '0')}/${t.year} $hour:${t.minute.toString().padLeft(2, '0')} $period';
    return InkWell(
      borderRadius: BorderRadius.circular(12),
      onTap: _pickDateTime,
      child: Container(
        height: 48,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border, width: 1.4),
        ),
        child: Row(children: [
          Icon(Icons.calendar_month_outlined, size: 18, color: AppColors.textMuted),
          const SizedBox(width: 12),
          Expanded(child: Text(formatted, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.text))),
          Icon(Icons.chevron_right, size: 18, color: AppColors.textMuted),
        ]),
      ),
    );
  }
}