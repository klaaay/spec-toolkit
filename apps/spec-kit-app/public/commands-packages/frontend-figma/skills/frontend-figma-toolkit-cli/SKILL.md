---
name: frontend-figma-toolkit-cli
description: 使用 figma-toolkit CLI 从 Figma 获取设计文件、节点信息和图片资源，并对下载的图片按视觉语义重命名。适用于跨项目的素材准备、资源批量下载和资产落盘场景。
---

# 使用 Figma Toolkit CLI 准备设计素材

通过 `figma-toolkit` CLI 直接调用 Figma 官方 REST API，在本地完成设计文件查询、节点数据获取、图片资源下载和语义化重命名。这个技能是通用工具型能力，适合和 `frontend-figma-implementation`、项目级 Figma 还原技能配合使用。

## 适用场景

- 需要批量读取 Figma 文件结构
- 需要查看单个或多个节点详情
- 需要下载图片、SVG、背景填充资源
- 需要在正式编码前先把素材落到仓库目录
- 需要核验资源真实格式，而不仅仅依赖文件后缀

## 前置准备

### 安装

```bash
npm install -g @klaaay/figma-toolkit-cli
```

安装完成后验证：

```bash
figma-toolkit --help
```

### 配置 Figma Token

```bash
figma-toolkit config set-token <your-figma-token>
```

单次覆盖：

```bash
figma-toolkit figma file "<figma-link>" --token <token>
```

配置优先级：

- `--token` 参数
- 环境变量 `FIGMA_TOOLKIT_FIGMA_TOKEN` 或 `FIGMA_TOKEN`
- 本地配置文件 `~/.figma-toolkit-cli/config.json`

## 推荐工作流

### 1. 先看文件结构

```bash
figma-toolkit figma file "<figma-link>" --depth 2
```

必要时配合 `jq` 过滤节点：

```bash
figma-toolkit figma file "<figma-link>" --depth 1 | jq '.document.children[] | {id, name, type}'
```

### 2. 再看目标节点

```bash
figma-toolkit figma nodes "<figma-link-with-node-id>"
```

或者手动指定节点：

```bash
figma-toolkit figma nodes <fileKey> --ids 699:1625,699:1626
```

### 3. 下载图片资源

```bash
figma-toolkit figma images "<figma-link-with-node-id>" \
  --format png \
  --scale 2 \
  --output-dir ./src/assets/figma
```

SVG 常用参数：

```bash
figma-toolkit figma images "<link>" \
  --format svg \
  --svg-outline-text \
  --svg-simplify-stroke \
  --output-dir ./src/assets/icons
```

### 4. 下载后必须做语义化重命名

CLI 默认常用节点 ID 作为文件名，这对开发维护没有帮助。下载后要按视觉语义改名，统一使用 kebab-case。

命名建议：

- `hero-background.png`
- `rank-crown-icon.svg`
- `btn-start-default.png`
- `top-left-decoration.svg`

不要保留类似 `699-1625.png` 这种只对 Figma 节点有意义的名字。

### 5. 校验文件真实格式

```bash
file ./src/assets/figma/*
```

常见修正：

- 实际是 SVG，但后缀是 `.png`，改成 `.svg`
- 实际是 PNG，但后缀是 `.svg`，改成 `.png`

改名后要同步更新代码引用。

## 输入格式

所有 `figma` 子命令都支持两种输入：

- 直接传 `fileKey`
- 直接传 Figma 链接

例如：

```bash
figma-toolkit figma file Bqh5yKWAdgxfhVR7FkqHzW
figma-toolkit figma file "https://www.figma.com/design/Bqh5yKWAdgxfhVR7FkqHzW/demo?node-id=699-1625"
```

## 关键原则

- 先看结构，再下素材
- 批量下载后一定做人类可读的重命名
- 不要只相信后缀，要核验真实格式
- 这个技能负责准备素材，不负责决定组件如何拆分
