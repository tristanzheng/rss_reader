# Client Implementation Status (E/G)

Date: 2026-03-08

## Current state
- Flutter and Dart are installed.
- Flutter project is initialized and runnable.
- Client now calls real NestJS endpoints via HTTP abstraction.

## Done now
- [x] Generated Flutter project files via `flutter create .`.
- [x] Added app entry and shell (`lib/main.dart`, `lib/app/app.dart`).
- [x] Implemented server-first state layer (`lib/core/state/app_state.dart`).
- [x] Added HTTP client + token store:
  - `lib/core/api/http_client.dart`
  - `lib/core/api/token_store.dart`
- [x] Integrated real API calls:
  - `GET /feeds`
  - `GET /entries`
  - `POST/DELETE /entries/:id/read`
  - `POST/DELETE /entries/:id/save`
  - `POST /auth/dev-token` (bootstrap)
- [x] Added runtime config (`lib/core/config/app_config.dart`).
- [x] Added tests and passed `flutter test` + `flutter analyze`.

## Pending
- [ ] Replace dev bootstrap with formal auth domain.
- [ ] Persist token securely (Keychain/Keystore).
- [ ] Add Drift offline cache and sync strategy.
- [ ] Implement G module advanced UX polish (gestures/shortcuts).
