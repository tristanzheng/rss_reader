class TokenStore {
  String? _token;

  Future<void> setToken(String token) async {
    _token = token;
  }

  Future<String?> getToken() async {
    return _token;
  }

  Future<void> clear() async {
    _token = null;
  }
}
