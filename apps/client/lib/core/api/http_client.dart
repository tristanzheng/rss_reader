import 'dart:convert';

import 'package:http/http.dart' as http;

class HttpClient {
  HttpClient({required this.baseUrl, required this.tokenProvider});

  final String baseUrl;
  final Future<String?> Function() tokenProvider;

  Future<dynamic> getJson(String path, {Map<String, String>? query}) async {
    final token = await tokenProvider();
    final uri = Uri.parse('$baseUrl$path').replace(queryParameters: query);

    final response = await http.get(
      uri,
      headers: {
        'Content-Type': 'application/json',
        if (token != null && token.isNotEmpty) 'Authorization': 'Bearer $token',
      },
    );

    _ensureSuccess(response);
    return jsonDecode(response.body);
  }

  Future<dynamic> postJson(String path, {Object? body}) async {
    final token = await tokenProvider();
    final uri = Uri.parse('$baseUrl$path');

    final response = await http.post(
      uri,
      headers: {
        'Content-Type': 'application/json',
        if (token != null && token.isNotEmpty) 'Authorization': 'Bearer $token',
      },
      body: body == null ? null : jsonEncode(body),
    );

    _ensureSuccess(response);
    return response.body.isEmpty ? null : jsonDecode(response.body);
  }

  Future<void> deleteJson(String path) async {
    final token = await tokenProvider();
    final uri = Uri.parse('$baseUrl$path');

    final response = await http.delete(
      uri,
      headers: {
        'Content-Type': 'application/json',
        if (token != null && token.isNotEmpty) 'Authorization': 'Bearer $token',
      },
    );

    _ensureSuccess(response);
  }

  void _ensureSuccess(http.Response response) {
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('HTTP ${response.statusCode}: ${response.body}');
    }
  }
}
