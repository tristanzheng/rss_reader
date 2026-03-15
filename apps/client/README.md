# Flutter Client (Server-first)

This client is scaffolded and runnable locally with Flutter.

## Current state
- Flutter project is initialized in `apps/client`.
- Real HTTP client path is wired to NestJS APIs.
- Dev token bootstrap is integrated for local development.
- Implemented screens:
  - Subscriptions
  - Entries
  - Settings (dark mode / font size / line height)
- Tests and static checks are passing.

## API integration
- Base URL: `--dart-define=API_BASE_URL=http://localhost:3000`
- Dev user ID: `--dart-define=DEV_USER_ID=u1`
- Dev token bootstrap switch: `--dart-define=ENABLE_DEV_TOKEN_BOOTSTRAP=true`
- Required backend env for bootstrap:
  - `ENABLE_DEV_AUTH_ENDPOINT=1`
  - `JWT_SECRET=dev-secret`

## Run
```bash
cd apps/client
flutter pub get
flutter run \
  --dart-define=API_BASE_URL=http://localhost:3000 \
  --dart-define=DEV_USER_ID=u1 \
  --dart-define=ENABLE_DEV_TOKEN_BOOTSTRAP=true
```

## Verify
```bash
cd apps/client
flutter test
flutter analyze
```

## Next steps
1. Replace dev-token bootstrap with real login/refresh flow.
2. Add persistent token storage.
3. Add Drift/SQLite offline cache and sync strategy.
