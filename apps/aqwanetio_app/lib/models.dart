import 'dart:math';

enum PondStatus { safe, warning, toxic }
enum UserRole { anonymous, unverified, verifiedOwner }

class Pond {
  final String id;
  final int stationId;
  final String name;
  final double lat;
  final double lng;
  final double ammoniaLevel;
  final PondStatus status;
  final String? ownerId;
  final String? ownerName;
  Pond({required this.id, required this.stationId, required this.name, required this.lat, required this.lng, required this.ammoniaLevel, required this.status, this.ownerId, this.ownerName});

  // ponytail: station has no ammonia yet, cycle mock like website PondMap.tsx:148 stations[idx % ponds.length]
  factory Pond.fromStation(Map<String, dynamic> j, Pond fallback) {
    final rawId = (j['stationId'] as num).toInt();
    final id = 'pond-$rawId';
    final name = (j['location'] as String?)?.trim().isNotEmpty == true ? (j['location'] as String) : fallback.name;
    final lat = (j['latitude'] as num?)?.toDouble() ?? fallback.lat;
    final lng = (j['longitude'] as num?)?.toDouble() ?? fallback.lng;
    final ownerId = j['ownerId'] as String?;
    final ownerName = (j['ownerName'] as String?)?.trim();
    return Pond(id: id, stationId: rawId, name: name, lat: lat, lng: lng, ammoniaLevel: fallback.ammoniaLevel, status: fallback.status, ownerId: ownerId, ownerName: (ownerName != null && ownerName.isNotEmpty) ? ownerName : null);
  }
}

class Reading {
  final DateTime timestamp;
  final double ammonia;
  final double param210; // Ammonium mg/L
  final double param218; // Ammonium alt mg/L
  final double param176; // Dissolved Oxygen mg/L
  final double param177; // DO Saturation %
  final double param209; // pH Value
  final double param217; // pH mV
  final double param170; // Water Temperature °C
  final double param173; // Water Salinity PSU
  // legacy aliases for backward compat
  double get temperature => param170;
  double get ph => param209;
  double get dissolvedOxygen => param176;

  Reading({
    required this.timestamp,
    required this.ammonia,
    required this.param210,
    required this.param218,
    required this.param176,
    required this.param177,
    required this.param209,
    required this.param217,
    required this.param170,
    required this.param173,
  });
}

enum ChartMetric { ammonia, p210, p218, p176, p177, p209, p217, p170, p173 }

// exact copy of website PondChart.tsx:19 METRIC_CONFIG
class MetricConfig {
  final String colorHex;
  final String unit;
  final String labelKey;
  const MetricConfig({required this.colorHex, required this.unit, required this.labelKey});
}

const kMetricConfig = <ChartMetric, MetricConfig>{
  ChartMetric.ammonia: MetricConfig(colorHex: 'cyan', unit: 'ppm', labelKey: 'modal.ammonia'),
  ChartMetric.p210: MetricConfig(colorHex: '#0e7490', unit: 'mg/L', labelKey: 'metrics.p210'),
  ChartMetric.p218: MetricConfig(colorHex: '#0891b2', unit: 'mg/L', labelKey: 'metrics.p218'),
  ChartMetric.p176: MetricConfig(colorHex: '#2563eb', unit: 'mg/L', labelKey: 'metrics.p176'),
  ChartMetric.p177: MetricConfig(colorHex: '#38bdf8', unit: '%', labelKey: 'metrics.p177'),
  ChartMetric.p209: MetricConfig(colorHex: '#9333ea', unit: 'pH', labelKey: 'metrics.p209'),
  ChartMetric.p217: MetricConfig(colorHex: '#7c3aed', unit: 'mV', labelKey: 'metrics.p217'),
  ChartMetric.p170: MetricConfig(colorHex: '#ea580c', unit: '°C', labelKey: 'metrics.p170'),
  ChartMetric.p173: MetricConfig(colorHex: '#0d9488', unit: 'PSU', labelKey: 'metrics.p173'),
};

double getMetricValue(Reading r, ChartMetric m) => switch (m) {
      ChartMetric.p210 => r.param210,
      ChartMetric.p218 => r.param218,
      ChartMetric.p176 => r.param176,
      ChartMetric.p177 => r.param177,
      ChartMetric.p209 => r.param209,
      ChartMetric.p217 => r.param217,
      ChartMetric.p170 => r.param170,
      ChartMetric.p173 => r.param173,
      ChartMetric.ammonia => r.ammonia,
    };

ChartMetric chartMetricFromId(String id) => switch (id) {
      '210' => ChartMetric.p210,
      '218' => ChartMetric.p218,
      '176' => ChartMetric.p176,
      '177' => ChartMetric.p177,
      '209' => ChartMetric.p209,
      '217' => ChartMetric.p217,
      '170' => ChartMetric.p170,
      '173' => ChartMetric.p173,
      _ => ChartMetric.ammonia,
    };

String chartMetricId(ChartMetric m) => switch (m) {
      ChartMetric.ammonia => 'ammonia',
      ChartMetric.p210 => '210',
      ChartMetric.p218 => '218',
      ChartMetric.p176 => '176',
      ChartMetric.p177 => '177',
      ChartMetric.p209 => '209',
      ChartMetric.p217 => '217',
      ChartMetric.p170 => '170',
      ChartMetric.p173 => '173',
    };

class Prediction {
  final DateTime timestamp;
  final double predictedAmmonia;
  final double upperBound;
  final double lowerBound;
  final double biasCorrection;
  Prediction({required this.timestamp, required this.predictedAmmonia, required this.upperBound, required this.lowerBound, required this.biasCorrection});
}

class User {
  final String id;
  final String email;
  final String name;
  final UserRole role;
  final String? phone;
  User({required this.id, required this.email, required this.name, required this.role, this.phone});
}

PondStatus ammoniaToStatus(double a) {
  if (a < 0.4) return PondStatus.safe;
  if (a <= 1.0) return PondStatus.warning;
  return PondStatus.toxic;
}

List<Pond> mockPonds = [
  Pond(id: 'pond-1', stationId: 1, name: 'Laguna Lake Pond A', lat: 14.375, lng: 121.245, ammoniaLevel: 0.2, status: PondStatus.safe),
  Pond(id: 'pond-2', stationId: 2, name: 'Batangas Tilapia Farm', lat: 13.756, lng: 121.058, ammoniaLevel: 0.6, status: PondStatus.warning),
  Pond(id: 'pond-3', stationId: 3, name: 'Pampanga River Aqua', lat: 14.943, lng: 120.698, ammoniaLevel: 1.2, status: PondStatus.toxic),
  Pond(id: 'pond-4', stationId: 4, name: 'Bulacan Bangus Pond', lat: 14.794, lng: 120.879, ammoniaLevel: 0.1, status: PondStatus.safe),
  Pond(id: 'pond-5', stationId: 5, name: 'Nueva Ecija Fish Farm', lat: 15.473, lng: 120.947, ammoniaLevel: 0.5, status: PondStatus.warning),
  Pond(id: 'pond-6', stationId: 6, name: 'Quezon Shrimp Hatchery', lat: 13.833, lng: 121.667, ammoniaLevel: 0.3, status: PondStatus.safe),
  Pond(id: 'pond-7', stationId: 7, name: 'Cavite Coastal Pond', lat: 14.483, lng: 120.900, ammoniaLevel: 0.8, status: PondStatus.warning),
  Pond(id: 'pond-8', stationId: 8, name: 'Rizal Highland Aqua', lat: 14.600, lng: 121.200, ammoniaLevel: 1.5, status: PondStatus.toxic),
  Pond(id: 'pond-9', stationId: 9, name: 'Pangasinan Milkfish', lat: 16.050, lng: 120.333, ammoniaLevel: 0.15, status: PondStatus.safe),
  Pond(id: 'pond-10', stationId: 10, name: 'Isabela Integrated Farm', lat: 17.050, lng: 121.733, ammoniaLevel: 0.45, status: PondStatus.warning),
];

int _seedFor(String pondId) {
  final m = RegExp(r'\d+').firstMatch(pondId);
  return m != null ? int.parse(m.group(0)!) : 1;
}

List<Reading> _buildReadings(int seed, int count, {DateTime? anchor}) {
  // exact copy of website readings.mock.ts:3-22 — phase = seed*1.3 + endTs/3_600_000*0.35 even for live
  final endMs = (anchor ?? DateTime.now()).millisecondsSinceEpoch;
  final phase = seed * 1.3 + (endMs / 3600000) * 0.35;
  return List.generate(count, (i) {
    final hoursAgo = i;
    final baseAmmonia = 0.25 + sin((hoursAgo + phase) / 6) * 0.15;
    final noise = sin(hoursAgo * 7.3 + seed) * 0.04;
    double mk(double base, double amp, double period, double n) =>
        double.parse((base + sin((hoursAgo + phase) / period) * amp + sin(hoursAgo * n + seed * 0.7) * amp * 0.25).toStringAsFixed(3));
    return Reading(
      timestamp: DateTime.fromMillisecondsSinceEpoch(endMs - hoursAgo * 3600000),
      ammonia: max(0, double.parse((baseAmmonia + noise).toStringAsFixed(3))),
      param210: max(0, mk(0.35, 0.12, 7, 5.3)),
      param218: max(0, mk(0.30, 0.10, 8, 6.1)),
      param176: max(0.5, mk(6.2, 0.9, 9, 4.2)),
      param177: max(60, mk(88, 10, 10, 3.8)),
      param209: mk(7.6, 0.35, 12, 3.1),
      param217: mk(5, 18, 11, 4.5),
      param170: mk(27.5, 1.2, 14, 2.9),
      param173: max(0, mk(2.5, 0.8, 13, 5.7)),
    );
  });
}

List<Prediction> _buildPredictions(int seed, {DateTime? anchor}) {
  // exact copy of website predictions.mock.ts:3-21 — endTs-based phase, hoursAhead=i+1, 3-decimals
  final endMs = (anchor ?? DateTime.now()).millisecondsSinceEpoch;
  final phase = seed * 1.3 + (endMs / 3600000) * 0.35;
  return List.generate(6, (i) {
    final hoursAhead = i + 1;
    final predicted = max(0, 0.3 + sin((endMs / 3600000 + hoursAhead + phase) / 6) * 0.2 + sin(hoursAhead * 5.1 + seed) * 0.03);
    final bias = -0.014;
    return Prediction(
      timestamp: DateTime.fromMillisecondsSinceEpoch(endMs + hoursAhead * 3600000),
      predictedAmmonia: double.parse((predicted + bias).toStringAsFixed(3)),
      upperBound: double.parse((predicted + bias + 0.1).toStringAsFixed(3)),
      lowerBound: double.parse(max(0, predicted + bias - 0.1).toStringAsFixed(3)),
      biasCorrection: bias,
    );
  });
}

final _readingsCache = <String, List<Reading>>{};
final _predictionsCache = <String, List<Prediction>>{};

List<Reading> getReadings(String pondId, {int limit = 48}) {
  _readingsCache.putIfAbsent(pondId, () => _buildReadings(_seedFor(pondId), 96));
  return _readingsCache[pondId]!.take(limit).toList();
}

List<Prediction> getPredictions(String pondId) {
  _predictionsCache.putIfAbsent(pondId, () => _buildPredictions(_seedFor(pondId)));
  return _predictionsCache[pondId]!;
}

List<Prediction> getPredictionsAt(String pondId, DateTime anchor) {
  return _buildPredictions(_seedFor(pondId), anchor: anchor);
}

List<Reading> getHistoricalReadings(String pondId, DateTime anchor, {int count = 48}) {
  return _buildReadings(_seedFor(pondId), count, anchor: anchor);
}
