import 'dart:convert';
import 'package:http/http.dart' as http;
import 'auth_api.dart';
import '../models.dart'; // Pond.fromStation

// thin GET /stations client reusing AuthApi.resolveBaseUrl + 15s timeout, no extra deps
class StationsApi {
  StationsApi({String? baseUrl}) : baseUrl = baseUrl ?? AuthApi.resolveBaseUrl();
  final String baseUrl;

  Future<List<Pond>> fetchStations() async {
    final res = await http
        .get(Uri.parse('$baseUrl/stations'))
        .timeout(const Duration(seconds: 15));
    if (res.statusCode < 200 || res.statusCode >= 300) {
      var detail = res.body;
      try {
        final body = jsonDecode(res.body);
        if (body is Map && body['detail'] != null) detail = body['detail'].toString();
      } catch (_) {}
      throw Exception(detail);
    }
    final decoded = jsonDecode(res.body);
    final List<dynamic> rows;
    if (decoded is List) {
      rows = decoded;
    } else if (decoded is Map && decoded['stations'] is List) {
      rows = decoded['stations'] as List;
    } else {
      return [];
    }
    if (rows.isEmpty) return [];
    // website cycles mock ponds for NH3/status since station has no ammonia yet — do same
    return rows.asMap().entries.map((e) {
      final j = e.value as Map<String, dynamic>;
      final fallback = mockPonds[e.key % mockPonds.length];
      return Pond.fromStation(j, fallback);
    }).toList();
  }
}
