# B. 抓取与解析引擎（Fetch & Parse Engine）

## Current Status
- 状态：`已完成（核心）`
- 完成日期：`2026-03-08`

## Done
- [x] 接入 `rss-parser` 并统一输出结构
- [x] 去重策略实现：GUID / URL / content-hash
- [x] BullMQ 队列接入，poll job 入队
- [x] worker scaffold 完成（独立进程入口）
- [x] 失败计数持久化（`fetch_failures`）
- [x] Feed 轮询状态持久化（`lastPolledAt` / `lastPollStatus` / `pollFailureCount`）
- [x] 按 interval 的 due feed 调度能力

## Pending
- [ ] 真正的 backoff/jitter 策略参数化
- [ ] 抓取日志与指标上报（结构化）

## Test Plan (TDD) Status
- [x] parser 单测
- [x] dedupe 单测
- [x] executor 失败/成功分支单测
- [x] queue service/controller 单测

## Kanban

| Status | Item | Owner | Notes |
| --- | --- | --- | --- |
| Done | 解析器封装 | Agent B | `rss-parser` |
| Done | 去重策略 | Agent B | GUID/URL/hash |
| Done | 队列任务与调度 | Agent B | BullMQ + due scheduling |
| Done | 失败统计 | Agent B | DB 持久化 |
| In Progress | 重试策略细化 | Agent B | backoff/jitter 待补 |
