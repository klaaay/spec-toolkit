# @klaaay/figma-toolkit-cli

独立发布的 Figma CLI，负责直接调用 Figma 官方 REST API，并在本地保存 Figma Token / 服务地址配置。

## 设计目标

- 技术栈保持轻量，沿用 `a lightweight CLI scaffold` 的 `commander + tsup + axios` 组合
- 配置持久化到 `~/.figma-toolkit-cli/config.json`
- 聚焦与 `figma-backend/src/routes/figma/figma.index.ts` 同范围的 4 个官方接口

## 支持的官方接口

- `GET /v1/files/{file_key}`
- `GET /v1/files/{file_key}/nodes`
- `GET /v1/images/{file_key}`
- `GET /v1/files/{file_key}/images`

## 本地开发

```bash
pnpm --filter @klaaay/figma-toolkit-cli build
pnpm --filter @klaaay/figma-toolkit-cli exec node dist/index.js --help
pnpm --filter @klaaay/figma-toolkit-cli test
```

如果作为 npm 包使用，安装后可直接执行：

```bash
figma-toolkit --help
```

## 配置命令

```bash
# 保存 token
figma-toolkit config set-token <your-figma-token>

# 保存 Figma API 地址
figma-toolkit config set-base-url https://api.figma.com

# 查看配置文件路径
figma-toolkit config path

# 查看当前配置（token 会脱敏）
figma-toolkit config list

# 删除某一项配置
figma-toolkit config remove figmaToken
figma-toolkit config remove baseUrl
```

## 输入规则

- 所有命令都支持直接传 `fileKey`
- `figma file`、`figma nodes`、`figma images`、`figma image-fills` 都支持直接传完整 Figma 链接
- 对 `nodes` 和 `images`，如果链接里包含 `node-id`，CLI 会自动解析成 `ids`
- 如果链接里没有 `node-id`，而当前命令又需要节点 ID，则需要补 `--ids`

例如下面这个链接：

```text
https://www.figma.com/design/Bqh5yKWAdgxfhVR7FkqHzW/%E9%BE%99%E8%99%BE%E6%9D%80V0.1?node-id=699-1625&m=dev
```

会自动解析为：

- `fileKey = Bqh5yKWAdgxfhVR7FkqHzW`
- `ids = 699:1625`

## Figma 接口命令

### 获取文件

```bash
figma-toolkit figma file <fileKey> \
  --ids 1:2,1:3 \
  --depth 2 \
  --geometry paths \
  --branch-data

# 对应 Figma 官方 GET /v1/files/{file_key}
```

也可以直接传 Figma 链接：

```bash
figma-toolkit figma file "https://www.figma.com/design/Bqh5yKWAdgxfhVR7FkqHzW/demo?node-id=699-1625&m=dev"
```

### 获取节点

```bash
figma-toolkit figma nodes <fileKey> \
  --ids 1:2,1:3 \
  --depth 2 \
  --geometry paths

# 对应 Figma 官方 GET /v1/files/{file_key}/nodes
```

也可以直接传带 `node-id` 的 Figma 链接，CLI 会自动解析 `fileKey` 和 `ids`：

```bash
figma-toolkit figma nodes "https://www.figma.com/design/Bqh5yKWAdgxfhVR7FkqHzW/demo?node-id=699-1625&m=dev"
```

### 获取图片资源

```bash
figma-toolkit figma images <fileKey> \
  --ids 1:2 \
  --format png \
  --scale 2 \
  --svg-outline-text

# 对应 Figma 官方 GET /v1/images/{file_key}
# 默认下载到 ./figma-images/<fileKey>
```

同样支持直接传 Figma 链接：

```bash
figma-toolkit figma images "https://www.figma.com/design/Bqh5yKWAdgxfhVR7FkqHzW/%E9%BE%99%E8%99%BE%E6%9D%80V0.1?node-id=699-1625&m=dev" \
  --format svg \
  --scale 2 \
  --svg-outline-text \
  --output-dir ./tmp/figma-assets
```

常用下载示例：

```bash
# 下载单个节点 PNG 到默认目录
figma-toolkit figma images "https://www.figma.com/design/Bqh5yKWAdgxfhVR7FkqHzW/demo?node-id=699-1625&m=dev"

# 下载 SVG 到指定目录，并保留 svg 参数能力
figma-toolkit figma images "https://www.figma.com/design/Bqh5yKWAdgxfhVR7FkqHzW/demo?node-id=699-1625&m=dev" \
  --format svg \
  --scale 2 \
  --svg-outline-text \
  --output-dir ./tmp/figma-assets

# 不带 node-id 的情况下，手动指定 ids
figma-toolkit figma images <fileKey> \
  --ids 699:1625,699:1626 \
  --format png \
  --scale 2 \
  --output-dir ./tmp/figma-assets
```

### 获取图片填充资源

```bash
figma-toolkit figma image-fills <fileKey>

# 对应 Figma 官方 GET /v1/files/{file_key}/images
```

同样支持直接传 Figma 链接：

```bash
figma-toolkit figma image-fills "https://www.figma.com/design/Bqh5yKWAdgxfhVR7FkqHzW/demo?node-id=699-1625&m=dev"
```

## 配置优先级

命令执行时按以下优先级解析配置：

1. 命令行参数 `--token`、`--base-url`
2. 环境变量 `FIGMA_TOOLKIT_FIGMA_TOKEN`、`FIGMA_TOKEN`、`FIGMA_TOOLKIT_BASE_URL`
3. 本地配置文件 `~/.figma-toolkit-cli/config.json`
4. 默认官方地址 `https://api.figma.com`
