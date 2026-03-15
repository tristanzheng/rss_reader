# RSS Reader 配置与运行说明（服务端 + 客户端）

> 适用于当前仓库的本地联调与基础部署。

## 1. 目录说明
- 服务端：`apps/server`
- 客户端：`apps/client`

## 2. 服务端配置

### 2.1 推荐本地联调环境变量（sqlite + 禁用 redis）
```bash
export DB_TYPE=sqlite
export DB_NAME=dev.sqlite
export ENABLE_DEV_AUTH_ENDPOINT=1
export JWT_SECRET=dev-secret
export REDIS_DISABLED=1
export WORKER_DISABLED=1
```

### 2.2 启动前初始化
```bash
npm run build
npm -w @rss/server run typeorm:migrate
```

### 2.3 启动服务端
```bash
npm start
```

### 2.4 健康检查
```bash
curl -s http://localhost:3000/queue/health
```

### 2.5 开发 token 与基础数据
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/auth/dev-token \
  -H 'Content-Type: application/json' \
  -d '{"userId":"u1","roles":["worker"]}' | jq -r .token)

curl -s -X POST http://localhost:3000/feeds \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"title":"HN","url":"https://hnrss.org/frontpage"}'

curl -s http://localhost:3000/feeds -H "Authorization: Bearer $TOKEN"
```

## 3. 客户端配置

### 3.1 启动参数
```bash
--dart-define=API_BASE_URL=http://localhost:3000
--dart-define=DEV_USER_ID=u1
--dart-define=ENABLE_DEV_TOKEN_BOOTSTRAP=true
```

### 3.2 macOS 启动
```bash
cd apps/client
flutter run -d macos \
  --dart-define=API_BASE_URL=http://localhost:3000 \
  --dart-define=DEV_USER_ID=u1 \
  --dart-define=ENABLE_DEV_TOKEN_BOOTSTRAP=true
```

### 3.3 客户端验证点
- `Feeds` 页：可见订阅列表
- `Feeds` 页：支持下拉刷新 / 刷新按钮
- `Entries` 页：读/未读与收藏切换
- `Settings` 页：暗色、字号、行高可切换
- 异常时：页面可见错误文本，顶部错误图标可查看提示

## 4. 测试命令

### 4.1 服务端
```bash
npm run build
npm test
npm run test:e2e
```

### 4.2 客户端
```bash
cd apps/client
flutter test
flutter analyze
```

## 5. 常见问题

### 5.1 `SQLITE_ERROR: no such table: feeds`
- 原因：未执行 migration
- 处理：先执行
```bash
npm -w @rss/server run typeorm:migrate
```

### 5.2 `ECONNREFUSED 127.0.0.1:6379`
- 原因：Redis 未启动但队列尝试连接
- 处理：联调时设置
```bash
export REDIS_DISABLED=1
export WORKER_DISABLED=1
```

### 5.3 客户端看不到 feeds
- 先确认后端有数据：`GET /feeds`
- 在客户端 `Feeds` 页手动点击刷新或下拉刷新

## 6. 生产部署简述（2C2G）
- 可行：小规模/低频抓取
- 建议：
  - 降低 worker 轮询频率
  - 设置 Node 内存上限（如 `--max-old-space-size=512`）
  - 使用 Postgres + Redis 独立持久化卷
  - 补充 HTTPS 自动化与监控告警
