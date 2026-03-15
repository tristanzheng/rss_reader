# D. 内容展示 API（Content API）

## Current Status
- 状态：`已完成（核心查询+）`
- 完成日期：`2026-03-08`

## Done
- [x] 文章列表接口（过滤 + 分页 + 时间排序）
- [x] 文章详情接口
- [x] 已读/收藏筛选
- [x] 关键词搜索（跨 title/content）
- [x] Postgres FTS 查询路径已接入（非 Postgres 保持 LIKE 兼容）
- [x] Postgres FTS GIN 索引迁移已新增

## Pending
- [ ] Postgres FTS 排名/高亮（`ts_rank` 等）
- [ ] 查询性能基准与 explain 验证

## Test Plan (TDD) Status
- [x] 列表组合过滤测试
- [x] 详情查询测试
- [x] 已读/收藏状态查询测试
- [x] 关键词大小写/空白兼容测试
- [ ] Postgres 环境 migration 验证（运行态）

## Kanban

| Status | Item | Owner | Notes |
| --- | --- | --- | --- |
| Done | 列表 API | Agent D | 过滤/分页已可用 |
| Done | 详情 API | Agent D | 基础字段返回 |
| Done | FTS 查询路径 | Agent D | Postgres FTS + fallback LIKE |
| Done | FTS 索引迁移 | Agent D | 新增 `IDX_ENTRIES_FTS` |
| In Progress | 排名与性能优化 | Agent D | `ts_rank` + explain 待补 |
| Done | 单元+集成测试 | Agent D | 核心分支覆盖 |
