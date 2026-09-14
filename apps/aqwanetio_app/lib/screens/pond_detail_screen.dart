import 'package:flutter/material.dart';
import '../models.dart';
import '../translations.dart';
import '../theme.dart';
import '../main.dart';
import '../widgets/pond_chart.dart';
import '../widgets/pond_health_radar.dart';
import '../widgets/claim_pond_modal.dart';
import '../widgets/gradient_button.dart';
import '../widgets/station_comparison_bar.dart';

class PondDetailScreen extends StatefulWidget {
  final Pond pond;
  const PondDetailScreen({super.key, required this.pond});

  @override
  State<PondDetailScreen> createState() => _PondDetailScreenState();
}

class _PondDetailScreenState extends State<PondDetailScreen> {
  bool _historical = false;
  DateTime _selected = DateTime.now();
  ChartMetric _metric = ChartMetric.ammonia;
  ChartMetric _barMetric = ChartMetric.p209;

  Color get _statusColor => switch (widget.pond.status) { PondStatus.safe => AppColors.safe, PondStatus.warning => AppColors.warning, PondStatus.toxic => AppColors.alert };

  bool get _isOwner {
    final u = authProvider.user;
    if (u == null) return false;
    final ownerId = widget.pond.ownerId;
    if (ownerId == null || ownerId.isEmpty) return false;
    return u.id == ownerId;
  }

  @override
  void initState() {
    super.initState();
    authProvider.addListener(_onAuth);
    pondsProvider.addListener(_onPonds);
  }

  @override
  void dispose() {
    authProvider.removeListener(_onAuth);
    pondsProvider.removeListener(_onPonds);
    super.dispose();
  }

  void _onAuth() => setState(() {
        if (!_isOwner) _metric = ChartMetric.ammonia;
      });
  void _onPonds() => setState(() {});

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
    final effectiveMetric = _isOwner ? _metric : ChartMetric.ammonia;
    final endTs = _selected.isAfter(DateTime.now()) ? DateTime.now() : _selected;
    final readings = _historical ? getHistoricalReadings(widget.pond.id, endTs) : getReadings(widget.pond.id, limit: 12);
    final predictions = _historical ? getPredictionsAt(widget.pond.id, endTs) : getPredictions(widget.pond.id);
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
          // metric selector like website PondDetailModal.tsx:204 disabled={!isOwner}
          Row(children: [
            Text('${t('modal.metricLabel')} ', style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
            const SizedBox(width: 8),
            Expanded(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(8), border: Border.all(color: AppColors.border)),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<ChartMetric>(
                    value: effectiveMetric,
                    isExpanded: true,
                    style: TextStyle(fontSize: 13, color: AppColors.text),
                    dropdownColor: AppColors.surface,
                    onChanged: _isOwner ? (v) { if (v != null) setState(() => _metric = v); } : null,
                    items: [
                      for (final m in ChartMetric.values)
                        DropdownMenuItem(value: m, child: Text(t(kMetricConfig[m]!.labelKey))),
                    ],
                  ),
                ),
              ),
            ),
          ]),
          if (!_isOwner) ...[
            const SizedBox(height: 6),
            Text(t('ctaCard.title'), style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
          ],
          const SizedBox(height: 16),
          Text(t('charts.lineTitle'), style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.text)),
          const SizedBox(height: 8),
          PondChart(readings: readings, predictions: effectiveMetric == ChartMetric.ammonia ? predictions : const [], metric: effectiveMetric),
          const SizedBox(height: 12),
          // claim ownership row like website PondMap.tsx:189 — detail trigger
          if (widget.pond.ownerId != null && widget.pond.ownerId!.isNotEmpty)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              decoration: BoxDecoration(color: AppColors.gray100, borderRadius: BorderRadius.circular(8), border: Border.all(color: AppColors.border)),
              child: Text(t('mapPopup.ownedBy', {'name': widget.pond.ownerName ?? '—'}), style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
            )
          else if (authProvider.isLoggedIn)
            SizedBox(width: double.infinity, child: GradientButton(label: t('mapPopup.claimPond'), onTap: () => showDialog(context: context, builder: (_) => ClaimPondModal(pond: widget.pond))))
          else
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(onPressed: () => Navigator.of(context).pushNamed('/login'), child: Text(t('mapPopup.claimPond'))),
            ),
          // ponytail: tables removed per request — charts only (website tables are ReadingsTable/PredictionPanel)
          // owner-only extra charts like website PondDetailModal.tsx:230
          if (_isOwner) ...[
            const SizedBox(height: 24),
            Text(t('charts.barTitle'), style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.text)),
            const SizedBox(height: 8),
            // bar metric selector 209/210/176/170 like website StationComparisonBar barMetric
            Row(children: [
              Text('${t('modal.metricLabel')} ', style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
              const SizedBox(width: 8),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(8), border: Border.all(color: AppColors.border)),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<ChartMetric>(
                      value: _barMetric,
                      isExpanded: true,
                      style: TextStyle(fontSize: 13, color: AppColors.text),
                      dropdownColor: AppColors.surface,
                      onChanged: (v) { if (v != null) setState(() => _barMetric = v); },
                      items: [
                        for (final m in [ChartMetric.p209, ChartMetric.p210, ChartMetric.p176, ChartMetric.p170])
                          DropdownMenuItem(value: m, child: Text(t(kMetricConfig[m]!.labelKey))),
                      ],
                    ),
                  ),
                ),
              ),
            ]),
            const SizedBox(height: 12),
            StationComparisonBar(metric: _barMetric),
            const SizedBox(height: 16),
            Text(t('charts.radarTitle'), style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.text)),
            const SizedBox(height: 8),
            PondHealthRadar(pondId: widget.pond.id),
          ],
        ]),
      ),
      ),
    );
  }

  Widget _datetimeField() {
    final tSel = _selected;
    final period = tSel.hour >= 12 ? 'PM' : 'AM';
    final hour = (tSel.hour % 12 == 0 ? 12 : tSel.hour % 12).toString().padLeft(2, '0');
    final formatted = '${tSel.month.toString().padLeft(2, '0')}/${tSel.day.toString().padLeft(2, '0')}/${tSel.year} $hour:${tSel.minute.toString().padLeft(2, '0')} $period';
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
