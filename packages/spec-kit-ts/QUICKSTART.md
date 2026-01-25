# 快速入门

## 项目结构

```
spec-kit-ts/
├── src/
│   ├── commands/          # CLI 命令实现
│   │   ├── init.ts       # init 命令
│   │   └── check.ts      # check 命令
│   ├── types/            # TypeScript 类型定义
│   │   └── index.ts      # 所有类型和配置
│   ├── utils/            # 工具函数
│   │   ├── download.ts   # GitHub 模板下载
│   │   ├── tools.ts      # 工具检查和 Git 操作
│   │   └── ui.ts         # 终端 UI 组件
│   └── index.ts          # CLI 入口文件
├── dist/                 # 构建输出目录
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── README.md
├── CHANGELOG.md
└── LICENSE
```

## 开发流程

### 1. 安装依赖

```bash
pnpm install
```

### 2. 开发模式

```bash
pnpm dev  # 监听文件变化并自动重建
```

### 3. 构建

```bash
pnpm build
```

### 4. 测试 CLI

```bash
# 测试帮助信息
node dist/index.js --help

# 测试 check 命令
node dist/index.js check

# 测试 init 命令（需要指定 AI 助手）
node dist/index.js init test-project --ai claude
```

## 核心功能

### 命令

1. **init** - 初始化新项目
   - 从本地复制模板（所有模板都已打包）
   - 支持 AI 助手：claude, codex, copilot, cursor-agent, gemini
   - 支持 Shell 和 PowerShell 脚本
   - 自动初始化 Git 仓库
   - 离线可用，无需网络连接

2. **check** - 检查工具安装状态
   - 检查 Git
   - 检查所有 AI 助手
   - 检查 VS Code

### 主要特性

- ✅ **完整的 TypeScript 类型支持**
- ✅ **美观的终端 UI**（使用 Chalk 和 Ora）
- ✅ **完整的错误处理**
- ✅ **中文界面和提示**
- ✅ **跨平台支持**（macOS、Linux、Windows）

## 技术栈

| 技术         | 用途        |
| ------------ | ----------- |
| TypeScript   | 类型安全    |
| Commander.js | CLI 框架    |
| Chalk        | 终端样式    |
| Ora          | 加载动画    |
| Axios        | HTTP 客户端 |
| extract-zip  | ZIP 解压    |
| execa        | 进程执行    |
| tsup         | 打包工具    |

## 与原版对比

### 原版（Python）
- 使用 Typer + Rich
- 约 1125 行代码
- 依赖 Python 3.11+

### TypeScript 版
- 使用 Commander.js + Chalk
- 模块化设计
- 更好的类型安全
- 更快的启动速度
- 更容易集成到 Node.js 项目

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 发布

```bash
# 构建
pnpm build

# 发布到内部 npm 注册表
pnpm publish
```

## 问题排查

### 依赖安装失败

如果 `pnpm install` 失败，尝试清理缓存：

```bash
pnpm store prune
rm -rf node_modules
pnpm install
```

### 构建失败

确保 TypeScript 版本正确：

```bash
pnpm add -D typescript@latest
pnpm build
```

### CLI 无法运行

确保构建输出存在：

```bash
ls dist/
node dist/index.js --version
```
