import 'dart:convert';

import 'package:flutter/foundation.dart' show defaultTargetPlatform, kIsWeb;
import 'package:flutter/material.dart' show TargetPlatform;
import 'package:http/http.dart' as http;

/// Thin client for FastAPI routers in apps/aqwanetio_backend.
/// Endpoints: POST /auth/register, POST /auth/login,
/// GET /auth/me, GET /auth/profile, PUT /auth/profile.
class AuthApi {
  AuthApi({String? baseUrl}) : baseUrl = baseUrl ?? resolveBaseUrl();

  final String baseUrl;

  /// Override with: flutter run --dart-define=API_URL=http://192.168.1.5:8000
  /// Defaults: Android emulator -> 10.0.2.2, web/desktop -> 127.0.0.1.
  static String resolveBaseUrl() {
    const defined = String.fromEnvironment('API_URL');
    if (defined.isNotEmpty) return defined;
    if (kIsWeb) return 'https://aqwanetio.onrender.com';
    if (defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:8000';
    }
    return 'http://127.0.0.1:8000';
  }

  Future<Map<String, dynamic>> register({
    required String firstName,
    required String lastName,
    required String email,
    required String phone,
    required String password,
    String? idToken,
  }) async {
    final headers = <String, String>{'Content-Type': 'application/json'};
    if (idToken != null && idToken.isNotEmpty) {
      headers['Authorization'] = 'Bearer $idToken';
    }
    final res = await http
        .post(
          Uri.parse('$baseUrl/auth/register'),
          headers: headers,
          body: jsonEncode({
            'firstName': firstName.trim(),
            'lastName': lastName.trim(),
            'email': email.trim().toLowerCase(),
            'phone': phone.trim(),
            if (password.isNotEmpty) 'password': password,
          }),
        )
        .timeout(const Duration(seconds: 15));
    return _decode(res);
  }

  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final res = await http
        .post(
          Uri.parse('$baseUrl/auth/login'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'email': email.trim().toLowerCase(),
            'password': password,
          }),
        )
        .timeout(const Duration(seconds: 15));
    return _decode(res);
  }

  Future<Map<String, dynamic>> me(String idToken) async {
    final res = await http
        .get(
          Uri.parse('$baseUrl/auth/me'),
          headers: {'Authorization': 'Bearer $idToken'},
        )
        .timeout(const Duration(seconds: 15));
    return _decode(res);
  }

  Future<Map<String, dynamic>> getProfile(String idToken) async {
    final res = await http
        .get(
          Uri.parse('$baseUrl/auth/profile'),
          headers: {'Authorization': 'Bearer $idToken'},
        )
        .timeout(const Duration(seconds: 15));
    return _decode(res);
  }

  Future<Map<String, dynamic>> updateProfile(String idToken, {required String firstName, required String lastName, required String phone}) async {
    final res = await http
        .put(
          Uri.parse('$baseUrl/auth/profile'),
          headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $idToken'},
          body: jsonEncode({'firstName': firstName.trim(), 'lastName': lastName.trim(), 'phone': phone.trim()}),
        )
        .timeout(const Duration(seconds: 15));
    return _decode(res);
  }

  Map<String, dynamic> _decode(http.Response res) {
    Map<String, dynamic> body = {};
    try {
      body = jsonDecode(res.body) as Map<String, dynamic>;
    } catch (_) {
      body = {'detail': res.body};
    }
    if (res.statusCode < 200 || res.statusCode >= 300) {
      final detail = body['detail'] ?? 'Request failed (${res.statusCode})';
      throw Exception(detail is String ? detail : detail.toString());
    }
    return body;
  }
}
