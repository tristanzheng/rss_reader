# RSS 阅读器：技术选型、架构与任务拆解

本文档用于在多 Agent 并行协作下推进项目开发，包含技术选型、系统架构与任务拆解。

## 技术选型（推荐）

- 客户端：Flutter（一次开发，多端覆盖：macOS / Windows11 / Android）
- 服务端：Node.js + NestJS（或 Fastify）
- 数据库：PostgreSQL
- 搜索：Postgres 全文索引（后续可替换为 Meilisearch）
- 抓取调度：BullMQ + Redis + cron
- 部署：Docker + Nginx + HTTPS（Let’s Encrypt）

## 系统架构

```
Flutter 客户端  <——>  API 服务（NestJS）  <——>  PostgreSQL
                                  |
                                  +—— 抓取服务（队列/定时任务） -> RSS/Atom 解析 -> 入库
```

- 客户端负责：订阅管理、文章列表/详情、阅读状态、收藏、离线缓存。
- 服务端负责：订阅源管理、抓取与解析、全文缓存、搜索与过滤、权限与同步。
- 抓取服务负责：定时拉取、失败重试、去重策略、任务统计。

## 任务拆解（支持并行协作）

### A. 后端基础（Agent A）

- 设计数据模型：feeds / folders / entries / entry_reads / entry_saves / users
- 订阅源 CRUD + 文件夹管理
- 阅读状态、收藏、稍后阅读 API

### B. 抓取与解析引擎（Agent B）

- RSS/Atom 解析器
- 去重规则（GUID/URL/hash）
- 定时任务 + 重试 + 失败统计

### C. OPML 导入/导出（Agent C）

- OPML 解析
- 导入到文件夹结构
- OPML 导出

### D. 内容展示 API（Agent D）

- 文章列表（时间排序、来源）
- 搜索/过滤（关键词、来源、日期）
- 文章详情接口

### E. 客户端基础（Agent E）

- 订阅列表 / 文章列表 / 详情页
- 读/未读切换、收藏
- 本地缓存（SQLite/Drift）

### F. 离线与全文缓存（Agent F）

- 服务端抓取全文（可选）
- 客户端离线缓存策略

### G. 阅读体验优化（Agent G）

- 字体大小/行距切换
- 暗色模式
- 快捷操作

### H. 部署与运维（Agent H）

- Dockerfile + docker-compose
- Nginx 反代 + HTTPS
- 定时任务和队列进程管理

## 并行协作建议

- 每个 Agent 只负责自己模块的实现与文档维护。
- 接口与数据模型由 Agent A 统一输出规范，其它 Agent 对齐。
- 每个模块完成后提供：接口说明、数据结构、测试方式。

