# A. 后端基础（Backend Basics）

## Current Status
- 状态：`已完成（核心+）`
- 完成日期：`2026-03-14`

## Done
- [x] TypeORM 实体已落地：`feeds` / `folders` / `entries` / `entry_reads` / `entry_saves` / `fetch_failures`
- [x] 初始迁移已创建并可执行：`1700000000000-init.ts`
- [x] 订阅源与文件夹 CRUD API 已实现
- [x] 阅读/收藏状态 API 已实现（幂等）
- [x] 全局鉴权已启用（JWT Bearer），并接入用户上下文
- [x] 关键 mutating 接口已做 user-scope（所有权）限制
- [x] 路由级角色授权已接入（`@Roles` + guard 内校验）
- [x] 开发 token 支持 roles claim（用于 worker/admin 路径）
- [x] migration CLI 已修复（DataSource 独立导出）

## Pending
- [ ] `users` 实体与完整用户域（当前使用 JWT `sub`）
- [ ] 正式登录/刷新 token 流程（替换 dev-token）

## Test Plan (TDD) Status
- [x] 服务层单测（CRUD、状态切换、ownership）
- [x] 集成测试（模块组合）
- [x] 鉴权 guard 单测（含 roles 场景）
- [x] auth controller / token service 单测（含 roles claim）
- [x] migration 命令运行验证

## Kanban

| Status | Item | Owner | Notes |
| --- | --- | --- | --- |
| Done | 数据模型设计与迁移 | Agent A | TypeORM + init migration |
| Done | 订阅源 CRUD | Agent A | 已做用户范围控制 |
| Done | 文件夹 CRUD | Agent A | 已做用户范围控制 |
| Done | 阅读/收藏 API | Agent A | 幂等通过测试 |
| Done | JWT + 角色授权 | Agent A | `@Roles` + claim 校验 |
| Done | migration CLI 修复 | Agent A | `typeorm.datasource.ts` |
| Done | 单元+集成测试 | Agent A | 核心分支覆盖 |
| Todo | users 域模型 | Agent A | 下一阶段 |
