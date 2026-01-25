# Spec-Kit 插件化架构设计

## 🎯 架构概览

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Spec-Kit 核心系统                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐│
│  │ specify  │─────▶│  plan    │─────▶│  tasks   │─────▶│implement ││
│  └────┬─────┘      └────┬─────┘      └────┬─────┘      └────┬─────┘│
│       │                 │                  │                 │      │
│       │                 │                  │                 │      │
│       ▼                 ▼                  ▼                 ▼      │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │              插件生命周期钩子系统 (Plugin Loader)             │  │
│   └───────┬──────────────┬──────────────┬──────────────┬─────────┘  │
│           │              │              │              │            │
└───────────┼──────────────┼──────────────┼──────────────┼────────────┘
            │              │              │              │
            ▼              ▼              ▼              ▼
    ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐
    │ pre-plan  │  │post-plan  │  │ pre-tasks │  │post-tasks   │
    └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘
          │              │              │              │
    ┌─────▼──────────────▼──────────────▼──────────────▼─────┐
    │                    插件生态系统                          │
    ├────────────────────────────────────────────────────────┤
    │                                                          │
    │  ┌──────────────────┐        ┌──────────────────┐      │
    │  │   fe-rule        │        │  fe-figma-gen    │      │
    │  ├──────────────────┤        ├──────────────────┤      │
    │  │ • 技术栈约束     │───────▶│ • Figma 集成     │      │
    │  │ • 工程规范       │  依赖  │ • 代码生成       │      │
    │  │ • 前端验证       │        │ • 设计约束       │      │
    │  └──────────────────┘        └──────────────────┘      │
    │                                                          │
    │  ┌──────────────────┐        ┌──────────────────┐      │
    │  │  自定义插件 1    │        │  自定义插件 2    │      │
    │  └──────────────────┘        └──────────────────┘      │
    │                                                          │
    └──────────────────────────────────────────────────────────┘
```

## 📂 目录结构

```
spec-kit-template-claude-sh-v0.0.64/
├── .claude/
│   └── commands/                      # 核心命令
│       ├── speckit.specify.md
│       ├── speckit.plan.md            # ✨ 集成插件钩子
│       ├── speckit.tasks.md           # ✨ 集成插件钩子
│       ├── speckit.implement.md       # ✨ 集成插件钩子
│       │
│       ├── speckit.fe-rule.wizard.md         # 🔌 插件命令
│       ├── speckit.fe-rule.scan.md        # 🔌 插件命令
│       ├── speckit.fe-rule.run.md            # 🔌 插件命令
│       ├── speckit.fe-figma-gen.wizard.md    # 🔌 插件命令
│       ├── speckit.fe-figma-gen.scan.md      # 🔌 插件命令
│       └── speckit.fe-figma-gen.run.md       # 🔌 插件命令
│
└── .specify/
    ├── plugins.json                   # 🔧 插件注册表
    ├── PLUGINS.md                     # 📖 插件文档
    │
    ├── scripts/bash/
    │   ├── common.sh                  # 核心工具
    │   ├── check-prerequisites.sh     # 前置检查
    │   └── plugin-loader.sh           # 🔌 插件加载器（核心）
    │
    ├── templates/
    │   ├── spec-template.md           # 核心模板
    │   ├── plan-template.md
    │   ├── tasks-template.md
    │   ├── fe-rule-template.md        # 🔌 插件模板
    │   └── fe-figma-gen-template.md   # 🔌 插件模板
    │
    ├── memory/
    │   ├── constitution.md            # 项目宪法
    │   ├── fe-rule.md                 # 🔌 插件生成（前端规则）
    │   └── fe-figma-gen.md            # 🔌 插件生成（Figma约束）
    │
    └── plugins/                       # 🔌 插件目录
        ├── fe-rule/
        │   ├── hooks/
        │   │   ├── pre-plan-check.sh       # ✅ 检查前端规则
        │   │   ├── post-plan-inject.sh     # ✅ 注入约束章节
        │   │   └── pre-tasks-augment.sh    # ✅ 增强任务
        │   └── utils/
        │       └── detect.sh                # 检测前端项目
        │
        └── fe-figma-gen/
            └── hooks/
                ├── post-plan-suggest.sh     # 💡 建议 Figma 集成
                └── pre-tasks-prepare.sh # 💡 提示生成命令
```

## 🔄 执行流程

### 完整工作流（前端项目）

```
1️⃣  用户: /speckit.specify "用户登录页面"
    └─▶ 生成: specs/001-user-login/spec.md

2️⃣  用户: /speckit.plan
    ├─▶ 运行: plugin-loader.sh --hook pre-plan
    │   └─▶ fe-rule 插件: 检查 fe-rule.md
    │       ├─▶ 存在: ✓ 继续
    │       └─▶ 缺失: ⚠️  建议运行 /speckit.fe-rule.wizard
    │
    ├─▶ 加载上下文:
    │   ├─ spec.md
    │   ├─ constitution.md
    │   └─ fe-rule.md (如果存在)
    │
    ├─▶ 执行核心规划逻辑:
    │   ├─ 生成 plan.md
    │   ├─ 生成 research.md
    │   ├─ 生成 data-model.md
    │   └─ 生成 contracts/
    │
    └─▶ 运行: plugin-loader.sh --hook post-plan
        ├─▶ fe-rule 插件: 注入前端约束到 plan.md
        └─▶ fe-figma-gen 插件: 检测 UI 需求
            └─▶ 💡 建议配置 Figma 集成

3️⃣  用户: /speckit.fe-figma-gen.wizard (可选)
    └─▶ 生成: .specify/memory/fe-figma-gen.md

4️⃣  用户: /speckit.tasks
    ├─▶ 运行: plugin-loader.sh --hook pre-tasks
    │   └─▶ fe-rule 插件: 添加前端验证任务
    │       └─▶ 输出: JSON 格式的额外任务
    │
    └─▶ 生成 tasks.md (包含核心任务 + 插件任务)

5️⃣  用户: /speckit.implement
    ├─▶ 运行: plugin-loader.sh --hookpre-tasks
    │   └─▶ fe-figma-gen 插件: 提示可用命令
    │       └─▶ 💡 "可使用 /speckit.fe-figma-gen.run"
    │
    └─▶ 执行任务实施

6️⃣  用户: /speckit.fe-figma-gen.run "figma-url" "登录表单"
    ├─▶ 读取约束: fe-figma-gen.md + fe-rule.md
    ├─▶ 调用 Figma 工具
    └─▶ 生成组件代码
```

## 🔌 插件系统设计

### 核心组件

#### 1. plugins.json - 插件注册表

```json
{
  "plugins": [
    {
      "id": "fe-rule",
      "name": "Frontend Rule Plugin",
      "version": "1.0.0",
      "enabled": true,
      "hooks": {
        "pre-plan": {
          "check": ".specify/plugins/fe-rule/hooks/pre-plan-check.sh",
          "priority": 10
        },
        "post-plan": {
          "inject": ".specify/plugins/fe-rule/hooks/post-plan-inject.sh",
          "priority": 10
        }
      },
      "commands": ["speckit.fe-rule.wizard", ...],
      "templates": [...],
      "dependencies": [],
      "config": {...}
    }
  ]
}
```

#### 2. plugin-loader.sh - 插件加载器

**职责**:
- 读取 `plugins.json`
- 按优先级执行钩子
- 处理退出码
- 聚合插件输出

**用法**:
```bash
.specify/scripts/bash/plugin-loader.sh --hook <hook-name> [--verbose]
```

#### 3. 钩子脚本

**标准结构**:
```bash
#!/usr/bin/env bash
set -e

# 1. 获取路径
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$PLUGIN_ROOT/../../.." && pwd)"

# 2. 加载工具
source "$PLUGIN_ROOT/utils/detect.sh"
source "$REPO_ROOT/.specify/scripts/bash/common.sh"

# 3. 执行检查/增强逻辑
if ! is_frontend_project; then
    exit 0  # 跳过
fi

# 4. 返回适当的退出码
exit 0  # 成功
```

**退出码约定**:
- `0`: 成功
- `10`: 警告（非阻塞）
- `20`: 建议（非阻塞）
- `其他`: 错误

### 生命周期钩子详解

| 钩子 | 时机 | fe-rule 行为 | fe-figma-gen 行为 |
|-----|------|-------------|------------------|
| `pre-plan` | plan 前 | ✅ 检查 fe-rule.md | - |
| `post-plan` | plan 后 | ✅ 注入约束章节 | 💡 建议配置 Figma<br>✅ 注入 Figma 约束章节 |
| `pre-tasks` | tasks 前 | ✅ 添加前端任务 | - |
| `post-tasks` | tasks 后 | - | - |

## 🎨 插件类型

### 1. 约束类插件（fe-rule）

**特点**:
- 定义全局规则
- 注入到核心文档
- 影响整个流程

**实现方式**:
```bash
# post-plan-inject.sh
extract_fe_rule_summary() {
    # 从 fe-rule.md 提取关键信息
    # 生成 markdown 章节
}

# 在 plan.md 中插入
grep -n "## Constitution Check" "$PLAN_FILE"
# 在此行前插入前端约束章节
```

### 2. 工具类插件（fe-figma-gen）

**特点**:
- 提供额外命令
- 可选使用
- 不修改核心文档

**实现方式**:
```bash
# post-plan-suggest.sh
if has_ui_requirements "$SPEC_FILE"; then
    cat >&2 << 'EOF'
💡 建议配置 Figma 集成...
EOF
    exit 20  # 建议但不阻塞
fi
```

### 3. 增强类插件

**特点**:
- 添加任务
- 增强验证
- 扩展功能

**实现方式**:
```bash
# pre-tasks-augment.sh
cat << 'EOF'
{
  "plugin": "fe-rule",
  "additional_tasks": [...]
}
EOF
```

## 🔄 数据流

```
核心命令
   │
   ├─▶ 读取: plugins.json
   │
   ├─▶ 执行: plugin-loader.sh --hook <name>
   │      │
   │      ├─▶ 遍历: enabled plugins
   │      │     │
   │      │     ├─▶ 执行: hook script
   │      │     │     │
   │      │     │     ├─▶ 读取: .specify/memory/*.md
   │      │     │     ├─▶ 检测: 项目类型/需求
   │      │     │     ├─▶ 输出: 警告/建议/数据
   │      │     │     └─▶ 返回: 退出码
   │      │     │
   │      │     └─▶ 收集: 输出和退出码
   │      │
   │      └─▶ 返回: 聚合结果
   │
   └─▶ 继续: 核心逻辑
         │
         ├─▶ 应用: 插件提供的数据
         └─▶ 生成: 最终文档
```

## 🎯 设计原则

### 1. 最小侵入

```
✅ 插件是可选的
✅ 核心流程独立运行
✅ 插件失败不影响核心（除非严重错误）
```

### 2. 清晰边界

```
核心系统:
- 规范定义（spec.md）
- 技术规划（plan.md）
- 任务分解（tasks.md）
- 实施执行（implement）

插件系统:
- 领域特定约束（fe-rule.md）
- 工具集成（Figma）
- 额外验证
- 增强功能
```

### 3. 可组合性

```
插件 A ──依赖──▶ 插件 B

fe-figma-gen ──依赖──▶ fe-rule
   (需要前端规则)       (提供技术栈)
```

### 4. 可扩展性

```
添加新插件只需:
1. 在 plugins.json 注册
2. 创建 hooks/ 目录
3. 编写钩子脚本
4. 添加命令和模板
```

## 📊 对比：插件化前后

### 之前（耦合设计）

```
speckit.plan.md:
  ├─ 硬编码前端逻辑
  ├─ 硬编码 Figma 集成
  └─ 难以扩展

问题:
❌ 代码臃肿
❌ 难以维护
❌ 无法禁用功能
❌ 添加新功能需要修改核心
```

### 之后（插件化设计）

```
speckit.plan.md:
  ├─ 核心规划逻辑
  ├─ 插件钩子调用 (2行)
  └─ 干净简洁

优势:
✅ 核心保持简洁
✅ 功能可插拔
✅ 易于扩展
✅ 各插件独立维护
```

## 🚀 未来扩展

### 可能的插件类型

1. **后端框架插件**:
   - be-rule: 后端技术栈约束
   - be-openapi-gen: OpenAPI 规范生成

2. **测试插件**:
   - test-coverage: 测试覆盖率检查
   - e2e-generator: E2E 测试生成

3. **文档插件**:
   - doc-generator: 自动文档生成
   - api-docs: API 文档同步

4. **CI/CD 插件**:
   - github-actions: GitHub Actions 配置
   - deployment: 部署脚本生成

5. **安全插件**:
   - security-scan: 安全检查
   - dependency-audit: 依赖审计

---

**总结**: 通过插件化设计，Spec-Kit 从单体系统演进为可扩展的生态系统，核心保持简洁，功能按需添加！🎉
