import 'dart:math';

enum PondStatus { safe, warning, toxic }
enum UserRole { anonymous, unverified, verifiedOwner }
enum AlertSeverity { warning, toxic }

class Pond {
  final String id;
  final String name;
  final double lat;
  final double lng;
  final double ammoniaLevel;
  final PondStatus status;
  final String? ownerId;
  Pond({required this.id, required this.name, required this.lat, required this.lng, required this.ammoniaLevel, required this.status, this.ownerId});
}

class Reading {
  final DateTime timestamp;
  final double ammonia;
  final double temperature;
  final double ph;
  final double dissolvedOxygen;
  Reading({required this.timestamp, required this.ammonia, required this.temperature, required this.ph, required this.dissolvedOxygen});
}

class Prediction {
  final DateTime timestamp;
  final double predictedAmmonia;
  final double upperBound;
  final double lowerBound;
  final double biasCorrection;
  Prediction({required this.timestamp, required this.predictedAmmonia, required this.upperBound, required this.lowerBound, required this.biasCorrection});
}

class Alert {
  final String id;
  final String pondId;
  final AlertSeverity severity;
  final String message;
  final String recommendation;
  final DateTime timestamp;
  bool acknowledged;
  Alert({required this.id, required this.pondId, required this.severity, required this.message, required this.recommendation, required this.timestamp, this.acknowledged = false});
}

class User {
  final String id;
  final String email;
  final String name;
  final UserRole role;
  User({required this.id, required this.email, required this.name, required this.role});
}

PondStatus ammoniaToStatus(double a) {
  if (a < 0.4) return PondStatus.safe;
  if (a <= 1.0) return PondStatus.warning;
  return PondStatus.toxic;
}

List<Pond> mockPonds = [
  Pond(id: 'pond-1', name: 'Laguna Lake Pond A', lat: 14.375, lng: 121.245, ammoniaLevel: 0.2, status: PondStatus.safe),
  Pond(id: 'pond-2', name: 'Batangas Tilapia Farm', lat: 13.756, lng: 121.058, ammoniaLevel: 0.6, status: PondStatus.warning),
  Pond(id: 'pond-3', name: 'Pampanga River Aqua', lat: 14.943, lng: 120.698, ammoniaLevel: 1.2, status: PondStatus.toxic),
  Pond(id: 'pond-4', name: 'Bulacan Bangus Pond', lat: 14.794, lng: 120.879, ammoniaLevel: 0.1, status: PondStatus.safe),
  Pond(id: 'pond-5', name: 'Nueva Ecija Fish Farm', lat: 15.473, lng: 120.947, ammoniaLevel: 0.5, status: PondStatus.warning),
  Pond(id: 'pond-6', name: 'Quezon Shrimp Hatchery', lat: 13.833, lng: 121.667, ammoniaLevel: 0.3, status: PondStatus.safe),
  Pond(id: 'pond-7', name: 'Cavite Coastal Pond', lat: 14.483, lng: 120.900, ammoniaLevel: 0.8, status: PondStatus.warning),
  Pond(id: 'pond-8', name: 'Rizal Highland Aqua', lat: 14.600, lng: 121.200, ammoniaLevel: 1.5, status: PondStatus.toxic),
  Pond(id: 'pond-9', name: 'Pangasinan Milkfish', lat: 16.050, lng: 120.333, ammoniaLevel: 0.15, status: PondStatus.safe),
  Pond(id: 'pond-10', name: 'Isabela Integrated Farm', lat: 17.050, lng: 121.733, ammoniaLevel: 0.45, status: PondStatus.warning),
];

int _seedFor(String pondId) {
  final m = RegExp(r'\d+').firstMatch(pondId);
  return m != null ? int.parse(m.group(0)!) : 1;
}

List<Reading> _buildReadings(int seed, int count) {
  final now = DateTime.now();
  return List.generate(count, (i) {
    final phase = seed * 1.3;
    final baseAmmonia = 0.25 + sin((i + phase) / 6) * 0.15;
    final noise = sin(i * 7.3 + seed) * 0.04;
    return Reading(
      timestamp: now.subtract(Duration(hours: i)),
      ammonia: max(0, baseAmmonia + noise),
      temperature: 26 + sin((i + phase) / 24) * 2 + sin(i * 3.1) * 0.2,
      ph: 7.5 + sin((i + phase) / 12) * 0.3 + sin(i * 2.7) * 0.05,
      dissolvedOxygen: 5 + sin((i + phase) / 8) * 0.5 + sin(i * 4.1) * 0.15,
    );
  });
}

List<Prediction> _buildPredictions(int seed) {
  final now = DateTime.now();
  final phase = seed * 1.3;
  return List.generate(6, (i) {
    final bias = -0.014;
    final predicted = max(0, 0.3 + sin((now.millisecondsSinceEpoch / 3600000 + i + phase) / 6) * 0.2 + sin(i * 5.1 + seed) * 0.03);
    return Prediction(
      timestamp: now.add(Duration(hours: i + 1)),
      predictedAmmonia: predicted + bias,
      upperBound: predicted + bias + 0.1,
      lowerBound: max(0, predicted + bias - 0.1),
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

List<Alert> mockAlerts = [
  Alert(id: 'alert-1', pondId: 'pond-3', severity: AlertSeverity.toxic, message: 'Ammonia level at Pampanga River Aqua is 1.2 ppm — above toxic threshold.', recommendation: 'Initiate immediate water exchange and increase aeration.', timestamp: DateTime.now()),
  Alert(id: 'alert-2', pondId: 'pond-8', severity: AlertSeverity.toxic, message: 'Ammonia level at Rizal Highland Aqua is 1.5 ppm — critically toxic.', recommendation: 'Emergency: Stop feeding, initiate full water exchange, check aeration systems.', timestamp: DateTime.now()),
  Alert(id: 'alert-3', pondId: 'pond-2', severity: AlertSeverity.warning, message: 'Ammonia level at Batangas Tilapia Farm approaching warning threshold.', recommendation: 'Monitor closely. Consider partial water exchange if trend continues.', timestamp: DateTime.now()),
];

List<Alert> getActiveAlerts() => mockAlerts.where((a) => !a.acknowledged).toList();

void acknowledgeAlert(String id) {
  mockAlerts = mockAlerts.map((a) => a.id == id ? Alert(id: a.id, pondId: a.pondId, severity: a.severity, message: a.message, recommendation: a.recommendation, timestamp: a.timestamp, acknowledged: true) : a).toList();
}
