# F. 离线与全文缓存（Offline & Fulltext Cache）

## Current Status
- 状态：`部分完成`

## Done
- [x] 服务端全文接口已实现：`POST /fulltext/:id/fetch`
- [x] fulltext 写回 entries

## Pending
- [ ] 真正全文抽取策略（当前为占位拼接）
- [ ] 客户端离线缓存策略与同步
- [ ] 容量/过期策略

## Test Plan (TDD) Status
- [x] 服务端全文成功路径测试
- [ ] 离线缓存与同步测试（客户端）

## Kanban

| Status | Item | Owner | Notes |
| --- | --- | --- | --- |
| Done | 服务端全文接口 | Agent F | 基础可用 |
| In Progress | 全文抓取策略升级 | Agent F | 抽取器待接入 |
| Todo | 客户端离线策略 | Agent F | 依赖 Flutter 端 |
