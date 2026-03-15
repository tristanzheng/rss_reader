class AppConfig {
  static const apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:3000',
  );

  static const devUserId = String.fromEnvironment(
    'DEV_USER_ID',
    defaultValue: 'u1',
  );

  static const enableDevTokenBootstrap = bool.fromEnvironment(
    'ENABLE_DEV_TOKEN_BOOTSTRAP',
    defaultValue: true,
  );
}
