# E. 客户端基础（Client Basics）

## Current Status
- 状态：`已完成（可运行 + 已接入后端基础 API）`
- 完成日期：`2026-03-14`

## Done
- [x] Flutter 工程已初始化（`flutter create .`）
- [x] App Shell 与三页导航已实现（订阅/文章/设置）
- [x] Server-first 状态层已实现（`AppState` + 可注入 API 边界）
- [x] HTTP 客户端与 token store 已实现
- [x] 已接入真实后端 API：`feeds` / `entries` / read-save mutations
- [x] 开发态 token bootstrap 已接入（`/auth/dev-token`）
- [x] 订阅页已支持手动刷新与下拉刷新
- [x] 错误可见化（页面红字 + 顶部错误提示）
- [x] 客户端测试与静态检查已通过（`flutter test` / `flutter analyze`）

## Pending
- [ ] 正式登录/刷新 token 流（替换 dev bootstrap）
- [ ] token 持久化（安全存储）
- [ ] 本地缓存（SQLite/Drift）
- [ ] Widget tests 进一步覆盖交互细节

## Test Plan (TDD) Status
- [x] 状态层逻辑测试（注入式）
- [x] 基础 widget 测试
- [x] 刷新逻辑测试
- [x] 分析检查通过

## Kanban

| Status | Item | Owner | Notes |
| --- | --- | --- | --- |
| Done | Flutter 工程初始化 | Agent E | 已可运行 |
| Done | 页面与状态管理 | Agent E | server-first 抽象 |
| Done | API 基础接入 | Agent E | feeds/entries/read/save |
| Done | 刷新与错误提示 | Agent E | 便于联调排障 |
| In Progress | Auth 正式化 | Agent E | 仍使用 dev bootstrap |
| Todo | Drift 缓存 | Agent E | 后续离线能力 |
