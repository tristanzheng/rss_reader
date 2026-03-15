# H. 部署与运维（Deployment & Ops）

## Current Status
- 状态：`已完成（基础部署）`
- 完成日期：`2026-03-14`

## Done
- [x] `Dockerfile` 已实现
- [x] `docker-compose.yml` 已实现（api/worker/db/redis/nginx）
- [x] API 与 worker 已拆分进程
- [x] Nginx 反向代理配置已提供
- [x] 2C2G 部署可行性已评估（适合小规模）

## Pending
- [ ] HTTPS（Let’s Encrypt）自动化落地
- [ ] 生产级监控与告警
- [ ] 部署健康检查脚本化
- [ ] 2C2G 专用资源限制 compose 配置模板

## Test Plan (TDD) Status
- [x] 本地 build/test 流程通过
- [ ] compose 端到端启动验证（依赖运行环境）

## Kanban

| Status | Item | Owner | Notes |
| --- | --- | --- | --- |
| Done | Dockerfile/compose | Agent H | 服务编排完成 |
| Done | Worker 进程管理 | Agent H | 独立入口 `start:worker` |
| Done | 部署可行性评估 | Agent H | 2C2G 可用（轻负载） |
| In Progress | Nginx + HTTPS | Agent H | HTTPS 待自动化 |
| Todo | 运维可观测性 | Agent H | 指标/告警待加 |
