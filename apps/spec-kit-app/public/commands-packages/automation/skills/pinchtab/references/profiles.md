# 用户档案（Profile）管理

运行 `pinchtab` 时，用户档案通过 **9867 端口** 上的 Dashboard API 管理。

## 列出档案

```bash
curl http://localhost:9867/profiles
```

返回档案数组，字段包括 `id`、`name`、`accountEmail`、`useWhen` 等。

## 启动档案

```bash
# 自动分配端口（推荐）
curl -X POST http://localhost:9867/profiles/<ID>/start

# 指定端口与无头模式
curl -X POST http://localhost:9867/profiles/<ID>/start \
  -H 'Content-Type: application/json' \
  -d '{"port": "9868", "headless": true}'

# 短路径别名
curl -X POST http://localhost:9867/start/<ID>
```

响应里会包含分配的 `port`，后续所有 API 请求都使用该端口。

## 停止档案

```bash
curl -X POST http://localhost:9867/profiles/<ID>/stop

# 短路径别名
curl -X POST http://localhost:9867/stop/<ID>
```

## 查看实例状态

```bash
# 按档案 ID（推荐）
curl http://localhost:9867/profiles/<ID>/instance

# 按档案名称（URL 编码）
curl http://localhost:9867/profiles/My%20Profile/instance
```

## 按名称启动实例

```bash
curl -X POST http://localhost:9867/instances/launch \
  -H 'Content-Type: application/json' \
  -d '{"name": "work", "port": "9868"}'
```

## CLI 与用户档案的配合

CLI 目前还没有完整的 `profile` 子命令体系——**档案管理请用 `curl`**。

档案对应的实例跑起来后，用 `--server` 把 CLI 指到该端口：

```bash
# 先拿到实例端口，再调用 CLI
pinchtab --server http://localhost:9868 snap -i
```

## 典型 Agent 流程

```bash
# 1. 列出档案
PROFILES=$(curl -s http://localhost:9867/profiles)

# 2. 启动档案（自动分配端口）
INSTANCE=$(curl -s -X POST http://localhost:9867/profiles/$PROFILE_ID/start)
PORT=$(echo $INSTANCE | jq -r .port)

# 3. 使用该实例
curl -X POST http://localhost:$PORT/navigate -H 'Content-Type: application/json' \
  -d '{"url": "https://mail.google.com"}'
curl http://localhost:$PORT/snapshot?maxTokens=4000

# 4. 结束后停止
curl -s -X POST http://localhost:9867/profiles/$PROFILE_ID/stop
```

## 档案 ID

每个档案有一个稳定的 12 位十六进制 ID（由名称经 SHA-256 截断得到），存在 `profile.json` 里。ID 对 URL 安全且不变——自动化里请优先用 ID，而不是易变的显示名称。

## 有头模式（Headed）

有头模式 = 由 PinchTab 管理的、**可见的** Chrome 窗口。

- 人类可以登录、过 2FA/验证码、确认状态
- Agent 对**同一运行中实例**调用 HTTP API
- 会话状态持久化在档案目录（Cookie / 存储会延续）

推荐「人类 + Agent」协作流程：

```bash
# 人类启动控制台并完成档案初始化
pinchtab

# Agent 解析档案对应端点
PINCHTAB_BASE_URL="$(pinchtab connect <profile-name>)"
curl "$PINCHTAB_BASE_URL/health"
```
