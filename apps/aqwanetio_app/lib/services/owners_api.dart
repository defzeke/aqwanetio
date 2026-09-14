import 'dart:convert';
import 'package:http/http.dart' as http;
import 'auth_api.dart';

// POST /owners/claims like website ClaimPondModal.tsx:87, reuse AuthApi.resolveBaseUrl + 15s timeout
class OwnersApi {
  OwnersApi({String? baseUrl}) : baseUrl = baseUrl ?? AuthApi.resolveBaseUrl();
  final String baseUrl;

  Future<Map<String, dynamic>> submitClaim(
    String idToken, {
    required String firstName,
    required String lastName,
    required String email,
    required String phone,
    required String documentUrl,
    required int stationId,
  }) async {
    final res = await http
        .post(
          Uri.parse('$baseUrl/owners/claims'),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $idToken',
          },
          body: jsonEncode({
            'first_name': firstName.trim(),
            'last_name': lastName.trim(),
            'email': email.trim().toLowerCase(),
            'phone_number': phone.trim(),
            'document_url': documentUrl.trim(),
            'station_id': stationId,
          }),
        )
        .timeout(const Duration(seconds: 15));
    Map<String, dynamic> body = {};
    try {
      body = jsonDecode(res.body) as Map<String, dynamic>;
    } catch (_) {
      body = {'detail': res.body};
    }
    if (res.statusCode < 200 || res.statusCode >= 300) {
      final detail = body['detail'];
      String msg;
      if (detail is String) msg = detail;
      else if (detail is List) msg = detail.map((e) => e is Map ? (e['msg'] ?? e.toString()) : e.toString()).join('; ');
      else msg = detail?.toString() ?? 'Request failed (${res.statusCode})';
      throw Exception(msg);
    }
    return body;
  }
}
