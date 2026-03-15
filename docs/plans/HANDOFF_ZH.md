# RSS Reader 服务端交接文档（中文）

更新时间：2026-03-14

## 1. 当前交付范围（服务端）
- NestJS + TypeORM 架构已落地
- 鉴权：全局 JWT Bearer（非公开接口均需 Token）
- 路由级角色控制（`@Roles`）已启用
- 公开接口：`GET /queue/health`、`POST /auth/dev-token`（仅开发开关开启时）
- 核心模块已完成：
  - 订阅/文件夹 CRUD
  - 文章列表/详情、已读/收藏
  - RSS/Atom 解析与去重入库
  - OPML 导入导出
  - 队列调度 + worker 骨架
  - 全文缓存基础接口
- 内容搜索：
  - 通用 LIKE 路径
  - Postgres FTS 查询路径 + GIN 索引迁移
- 部署基础：`Dockerfile` + `docker-compose.yml` + `nginx`

## 2. 关键修复（本轮）
- 修复 TypeORM migration CLI 配置问题：
  - 新增 `src/database/typeorm.datasource.ts`（仅供 migration CLI）
  - `typeorm:migrate` 脚本已切换到新 data source
- 解决“无表”问题的标准流程：先 `typeorm:migrate` 再 `npm start`

## 3. 关键环境变量
- `JWT_SECRET`：JWT 签名密钥
- `ENABLE_DEV_AUTH_ENDPOINT`：是否启用开发 token 接口（`1` 启用）
- `DB_TYPE`：`postgres` 或 `sqlite`
- `DB_NAME`：sqlite 文件名（sqlite 模式）
- `DATABASE_URL`：数据库连接串（postgres 模式）
- `REDIS_URL`：Redis 连接串
- `REDIS_DISABLED`：`1` 表示 API 进程使用内存队列（开发联调）
- `WORKER_DISABLED`：`1` 表示 API 进程不启动 worker
- `WORKER_SCHEDULE_USER_ID`：worker 周期调度的用户 ID
- `WORKER_SCHEDULE_INTERVAL_MINUTES`：按“距上次轮询间隔”判断是否到期
- `WORKER_TICK_MS`：worker 周期检查间隔（毫秒）

## 4. 本地运行（推荐联调）
```bash
export DB_TYPE=sqlite
export DB_NAME=dev.sqlite
export ENABLE_DEV_AUTH_ENDPOINT=1
export JWT_SECRET=dev-secret
export REDIS_DISABLED=1
export WORKER_DISABLED=1

npm run build
npm -w @rss/server run typeorm:migrate
npm test
npm run test:e2e
npm start
```

## 5. JWT 鉴权流程（开发）
### 5.1 获取开发 Token
```bash
curl -s -X POST http://localhost:3000/auth/dev-token \
  -H 'Content-Type: application/json' \
  -d '{"userId":"u1","roles":["worker"]}'
```

### 5.2 创建并查询 Feeds
```bash
TOKEN='<JWT_TOKEN>'

curl -s -X POST http://localhost:3000/feeds \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"title":"HN","url":"https://hnrss.org/frontpage"}'

curl -s http://localhost:3000/feeds \
  -H "Authorization: Bearer $TOKEN"
```

## 6. 已知限制 / 下一步
- 正式用户域与登录流程未落地（当前为 dev-token）
- 当前全文抽取仍是基础实现
- 客户端 Drift 离线缓存未接入
- 生产部署需补：HTTPS 自动化、监控告警、资源限额模板（2C2G）
