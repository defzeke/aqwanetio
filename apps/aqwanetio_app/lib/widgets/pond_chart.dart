import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../models.dart';
import '../translations.dart';

class PondChart extends StatefulWidget {
  final List<Reading> readings;
  final List<Prediction> predictions;
  const PondChart({super.key, required this.readings, required this.predictions});

  @override
  State<PondChart> createState() => _PondChartState();
}

class _PondChartState extends State<PondChart> {
  static const _warning = 1.0;
  static const _color = Color(0xFF22c55e);
  int? _hoveredIdx;

  List<Reading> get _history => widget.readings.reversed.toList();

  @override
  Widget build(BuildContext context) {
    final history = _history;
    final vals = history.map((r) => r.ammonia).toList();

    final forecastVals = widget.predictions.map((p) => p.predictedAmmonia).toList();
    final upper = widget.predictions.map((p) => p.upperBound).toList();
    final lower = widget.predictions.map((p) => p.lowerBound).toList();

    final allVals = [...vals, ...forecastVals];
    final minV = allVals.isEmpty ? 0.0 : allVals.reduce(math.min) * 0.92;
    final maxV = allVals.isEmpty ? 1.0 : allVals.reduce(math.max) * 1.08;

    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      SizedBox(
        height: 260,
        child: GestureDetector(
          onHorizontalDragUpdate: (d) {
            final box = context.findRenderObject() as RenderBox?;
            if (box == null) return;
            final total = vals.length + forecastVals.length;
            if (total == 0) return;
            final pos = (d.localPosition.dx - 40) / (box.size.width - 80);
            final idx = (pos * total).round().clamp(0, total - 1);
            setState(() => _hoveredIdx = idx);
          },
          onTapDown: (d) {
            final box = context.findRenderObject() as RenderBox?;
            if (box == null) return;
            final total = vals.length + forecastVals.length;
            if (total == 0) return;
            final pos = (d.localPosition.dx - 40) / (box.size.width - 80);
            final idx = (pos * total).round().clamp(0, total - 1);
            setState(() => _hoveredIdx = _hoveredIdx == idx ? null : idx);
          },
          child: CustomPaint(
            size: Size.infinite,
            painter: _ChartPainter(
              vals: vals,
              forecastVals: forecastVals,
              upper: upper,
              lower: lower,
              minV: minV,
              maxV: maxV,
              warning: _warning,
              color: _color,
              hoveredIdx: _hoveredIdx,
              historyCount: vals.length,
            ),
          ),
        ),
      ),
      const SizedBox(height: 8),
      Row(
        children: [
          _buildTile(history.isEmpty ? 0 : vals.last, t('modal.ammonia'), _color),
        ],
      ),
    ]);
  }

  Widget _buildTile(double val, String label, Color color) {
    final safe = val < _warning;
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: safe ? const Color(0xFFbbf7d0) : const Color(0xFFfecaca)),
          color: safe ? const Color(0xFFf0fdf4) : const Color(0xFFfef2f2),
        ),
        child: Row(children: [
          Container(width: 10, height: 10, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
          const SizedBox(width: 8),
          Text(label.split(' ')[0], style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: safe ? const Color(0xFF166534) : const Color(0xFF991b1b))),
          const Spacer(),
          Text(val.toStringAsFixed(2), style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: safe ? const Color(0xFF15803d) : const Color(0xFFdc2626))),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(color: safe ? const Color(0xFFbbf7d0) : const Color(0xFFfecaca), borderRadius: BorderRadius.circular(12)),
            child: Text(safe ? t('status.safe') : t('status.critical'), style: TextStyle(fontSize: 10, fontWeight: FontWeight.w500, color: safe ? const Color(0xFF166534) : const Color(0xFF991b1b))),
          ),
        ]),
      ),
    );
  }
}

class _ChartPainter extends CustomPainter {
  final List<double> vals;
  final List<double> forecastVals;
  final List<double> upper;
  final List<double> lower;
  final double minV;
  final double maxV;
  final double warning;
  final Color color;
  final int? hoveredIdx;
  final int historyCount;

  _ChartPainter({required this.vals, required this.forecastVals, required this.upper, required this.lower, required this.minV, required this.maxV, required this.warning, required this.color, this.hoveredIdx, required this.historyCount});

  @override
  void paint(Canvas canvas, Size size) {
    final total = vals.length + forecastVals.length;
    if (total == 0) return;
    final padL = 44.0, padR = 12.0, padT = 16.0, padB = 36.0;
    final iW = size.width - padL - padR;
    final iH = size.height - padT - padB;

    double scaleX(int i) => padL + (i / math.max(total - 1, 1)) * iW;
    double scaleY(double v) => padT + iH - ((v - minV) / (maxV - minV)) * iH;

    final gridPaint = Paint()..color = const Color(0xFFe5e7eb)..strokeWidth = 1;
    for (int i = 0; i <= 4; i++) {
      final y = padT + (i / 4) * iH;
      canvas.drawLine(Offset(padL, y), Offset(padL + iW, y), gridPaint);
    }

    final warnPaint = Paint()..color = const Color(0xFFef4444)..strokeWidth = 1.5;
    final warnY = scaleY(warning);
    if (warnY >= padT && warnY <= padT + iH) {
      canvas.drawLine(Offset(padL, warnY), Offset(padL + iW, warnY), warnPaint);
    }

    if (forecastVals.isNotEmpty && upper.length == lower.length) {
      final band = Paint()..color = const Color(0xFFfecaca).withValues(alpha: 0.4);
      final path = Path();
      final start = vals.length;
      for (int i = 0; i < upper.length; i++) {
        final x = scaleX(start + i);
        if (i == 0) { path.moveTo(x, scaleY(upper[i])); }
        else { path.lineTo(x, scaleY(upper[i])); }
      }
      for (int i = lower.length - 1; i >= 0; i--) {
        path.lineTo(scaleX(start + i), scaleY(lower[i]));
      }
      path.close();
      canvas.drawPath(path, band);
    }

    if (vals.isNotEmpty) {
      final linePaint = Paint()..color = color..strokeWidth = 2..style = PaintingStyle.stroke..strokeJoin = StrokeJoin.round;
      final pts = vals.asMap().entries.map((e) => Offset(scaleX(e.key), scaleY(e.value))).toList();
      _drawPolyline(canvas, pts, linePaint);
      for (final p in pts) {
        canvas.drawCircle(p, 3, Paint()..color = color);
      }
    }

    if (forecastVals.isNotEmpty) {
      final start = vals.length;
      final pts = forecastVals.asMap().entries.map((e) => Offset(scaleX(start + e.key), scaleY(e.value))).toList();
      final dashPaint = Paint()..color = color..strokeWidth = 2..style = PaintingStyle.stroke..strokeJoin = StrokeJoin.round;
      _drawDashedPolyline(canvas, pts, dashPaint);
      if (vals.isNotEmpty && pts.isNotEmpty) {
        final linePaint = Paint()..color = color..strokeWidth = 2..style = PaintingStyle.stroke..strokeJoin = StrokeJoin.round;
        canvas.drawLine(Offset(scaleX(start - 1), scaleY(vals.last)), pts[0], linePaint);
      }
    }

    if (hoveredIdx != null && hoveredIdx! < total) {
      final x = scaleX(hoveredIdx!);
      final linePaint = Paint()..color = const Color(0xFF94a3b8)..strokeWidth = 1;
      canvas.drawLine(Offset(x, padT), Offset(x, padT + iH), linePaint);
    }

    yAxisLabels(canvas, padL, padT, iH, scaleY);
    xAxisLabels(canvas, total, padT, iH, scaleX);
  }

  void _drawPolyline(Canvas canvas, List<Offset> pts, Paint paint) {
    if (pts.length < 2) return;
    final path = Path();
    path.moveTo(pts[0].dx, pts[0].dy);
    for (int i = 1; i < pts.length; i++) { path.lineTo(pts[i].dx, pts[i].dy); }
    canvas.drawPath(path, paint);
  }

  void _drawDashedPolyline(Canvas canvas, List<Offset> pts, Paint paint) {
    if (pts.length < 2) return;
    const dash = 6.0, gap = 3.0;
    for (int i = 1; i < pts.length; i++) {
      final from = pts[i - 1], to = pts[i];
      final dx = to.dx - from.dx, dy = to.dy - from.dy;
      final len = math.sqrt(dx * dx + dy * dy);
      double drawn = 0;
      while (drawn < len) {
        final start = drawn;
        final end = math.min(drawn + dash, len);
        final s = Offset(from.dx + (start / len) * dx, from.dy + (start / len) * dy);
        final e = Offset(from.dx + (end / len) * dx, from.dy + (end / len) * dy);
        canvas.drawLine(s, e, paint);
        drawn = end + gap;
      }
    }
  }

  void yAxisLabels(Canvas canvas, double padL, double padT, double iH, double Function(double) scaleY) {
    for (int i = 0; i <= 4; i++) {
      final v = minV + (i / 4) * (maxV - minV);
      final y = padT + (i / 4) * iH;
      final tp = TextPainter(text: TextSpan(text: v.toStringAsFixed(2), style: const TextStyle(fontSize: 10, color: Color(0xFF6b7280))), textDirection: TextDirection.ltr);
      tp.layout();
      tp.paint(canvas, Offset(padL - 6 - tp.width, y - tp.height / 2));
    }
  }

  void xAxisLabels(Canvas canvas, int total, double padT, double iH, double Function(int) scaleX) {
    final step = math.max(1, total ~/ 5);
    for (int i = 0; i < total; i += step) {
      final x = scaleX(i);
      final tp = TextPainter(text: TextSpan(text: '${i}h', style: const TextStyle(fontSize: 10, color: Color(0xFF6b7280))), textDirection: TextDirection.ltr);
      tp.layout();
      tp.paint(canvas, Offset(x - tp.width / 2, padT + iH + 6));
    }
  }

  @override
  bool shouldRepaint(_ChartPainter old) => old.vals != vals || old.forecastVals != forecastVals || old.hoveredIdx != hoveredIdx;
}
