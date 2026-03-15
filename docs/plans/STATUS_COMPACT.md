# Project Plan Status (Compact)

Updated: 2026-03-14

| Task | Status | Notes |
| --- | --- | --- |
| A Backend 基础 | Done (core+) | DB entities/migration + JWT + ownership + roles guard + migration CLI fix |
| B 抓取解析引擎 | Done (core) | parser + dedupe + queue + worker scaffold |
| C OPML 导入导出 | Done (basic) | import/export + dedupe |
| D 内容 API | Done (core+) | list/detail/filter + Postgres FTS path + GIN index migration |
| E 客户端基础 | Done (core+) | Flutter runnable + real API integration + refresh/error UX + passing test/analyze |
| F 离线与全文 | Partial | server fulltext done, client offline pending |
| G 阅读体验 | Partial | basic settings UI done, persistence/shortcuts pending |
| H 部署运维 | Done (basic) | docker/compose/nginx/worker split + 2C2G feasibility checked |

## Recent Verification
1. `npm run build` passed
2. `npm test` and `npm run test:e2e` passed
3. `flutter test` and `flutter analyze` passed
4. `typeorm:migrate` passed with dedicated `typeorm.datasource.ts`

## Next Priority
1. Client auth formalization + secure token persistence
2. Drift offline cache + settings persistence
3. Backend auth domain (real login/refresh, replace dev-token)
4. 2C2G production hardening (resource limits + HTTPS automation)
