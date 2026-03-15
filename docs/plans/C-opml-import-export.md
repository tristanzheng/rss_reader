# C. OPML 导入/导出（OPML Import/Export）

## Current Status
- 状态：`已完成（基础版）`
- 完成日期：`2026-03-08`

## Done
- [x] `POST /opml/import` 已实现
- [x] `GET /opml/export` 已实现
- [x] 导入去重（按 feed URL）
- [x] 与 folders/feeds 数据结构联动

## Pending
- [ ] 更严格 OPML 规范兼容（边界 XML 结构）
- [ ] 文件上传流式处理（当前以文本为主）

## Test Plan (TDD) Status
- [x] 导入去重测试
- [x] 导出内容测试
- [x] 基础结构解析测试

## Kanban

| Status | Item | Owner | Notes |
| --- | --- | --- | --- |
| Done | OPML 解析规则 | Agent C | 覆盖基础 outline |
| Done | 导入接口 | Agent C | 含统计结果 |
| Done | 导出接口 | Agent C | 可回放导入 |
| In Progress | 兼容性增强 | Agent C | 边界样例待补 |
