# Spec-Kit 插件系统

Spec-Kit 支持通过插件系统扩展核心功能。插件可以在核心工作流的关键生命周期点注入自定义逻辑。

## 插件概念

### 生命周期钩子

插件通过**钩子（hooks）**在不同阶段介入核心流程：

| 钩子名称 | 触发时机 | 用途示例 |
|---------|---------|---------|
| `pre-plan` | `/speckit.plan` 执行前 | 检查前端规则文档是否存在 |
| `post-plan` | `plan.md` 生成后 | 注入前端技术栈约束章节 |
| `pre-tasks` | `/speckit.tasks` 执行前 | 添加前端特定任务、检测 UI 需求并提示 Figma 集成 |
| `post-tasks` | `tasks.md` 生成后 | 验证任务格式、检查任务完整性 |

### 退出码约定

钩子脚本通过退出码与核心系统通信：

- `0`: 成功，继续执行
- `10`: 警告（非阻塞），显示提示但继续
- `20`: 建议（非阻塞），提供可选建议
- `其他`: 错误，报告失败（可能阻塞执行）

## 现有插件

### 1. fe-rule（前端工程规则插件）

**目的**: 定义和维护前端技术栈约束，确保整个开发流程遵守一致的技术规范。

**配置文件**: `.specify/memory/fe-rule.md`

**钩子**:
- `pre-plan`: 检查 `fe-rule.md` 是否存在，如不存在则建议运行配置命令
- `post-plan`: 在 `plan.md` 中注入前端约束章节
- `pre-tasks`: 添加前端项目初始化和验证任务

**命令**:
- `/speckit.fe-rule.wizard`: 交互式向导配置前端规则
- `/speckit.fe-rule.scan`: 自动分析现有项目生成规则
- `/speckit.fe-rule.run`: 根据规则实现前端需求代码

**使用场景**:
```bash
# 新项目：通过向导配置
/speckit.fe-rule.wizard "Next.js + Tailwind + shadcn + Zustand"

# 现有项目：自动分析
/speckit.fe-rule.scan

# 之后运行核心流程，自动应用约束
/speckit.plan
/speckit.tasks
/speckit.implement
```

### 2. fe-figma-gen（Figma 代码生成插件）

**目的**: 从 Figma 设计稿自动生成前端组件和页面代码。

**配置文件**: `.specify/memory/fe-figma-gen.md`

**依赖**: `fe-rule` 插件

**钩子**:
- `post-plan` (suggest): 检测 UI 相关需求，建议配置 Figma 集成
- `post-plan` (inject): 在 `plan.md` 中注入 Figma 构建约束章节
- `pre-tasks` (prepare): 检测 UI 任务并提示 Figma 代码生成功能

**注意**: `fe-figma-gen` 的钩子包含多个操作：
1. **post-plan/suggest**: 检测是否需要 Figma 集成并提供建议
2. **post-plan/inject**: 如果 `fe-figma-gen.md` 存在，将约束注入到 `plan.md`
3. **pre-tasks/prepare**: 在生成任务前检测 UI 需求并提供 Figma 集成提示

**命令**:
- `/speckit.fe-figma-gen.wizard`: 交互式配置 Figma 构建约束
- `/speckit.fe-figma-gen.scan`: 自动扫描项目推断约束
- `/speckit.fe-figma-gen.run`: 从 Figma 设计生成代码

**使用场景**:
```bash
# 配置 Figma 集成（二选一）
/speckit.fe-figma-gen.wizard
/speckit.fe-figma-gen.scan

# 在实施过程中生成组件
/speckit.fe-figma-gen.run "https://figma.com/file/xxx" "登录页面"
```

## 创建自定义插件

### 1. 在 `plugins.json` 中注册

编辑 `.specify/plugins.json`：

```json
{
  "plugins": [
    {
      "id": "my-plugin",
      "name": "My Custom Plugin",
      "version": "1.0.0",
      "description": "插件描述",
      "enabled": true,
      "hooks": {
        "pre-plan": {
          "check": ".specify/plugins/my-plugin/hooks/pre-plan-check.sh",
          "priority": 10
        },
        "post-plan": {
          "inject": ".specify/plugins/my-plugin/hooks/post-plan-inject.sh",
          "suggest": ".specify/plugins/my-plugin/hooks/post-plan-suggest.sh",
          "priority": 15
        }
      },
      "commands": ["speckit.my-plugin.setup"],
      "templates": [
        {
          "name": "my-template.md",
          "path": ".specify/templates/my-template.md",
          "output": ".specify/memory/my-config.md"
        }
      ],
      "dependencies": [],
      "config": {}
    }
  ]
}
```

**注意**: 一个钩子可以包含多个操作（如 `inject` 和 `suggest`），它们会按照在 JSON 中定义的顺序执行。

### 2. 创建插件目录

```bash
mkdir -p .specify/plugins/my-plugin/{hooks,utils}
```

### 3. 创建钩子脚本

`.specify/plugins/my-plugin/hooks/pre-plan-check.sh`:

```bash
#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$PLUGIN_ROOT/../../.." && pwd)"

# 你的检查逻辑
if [[ ! -f "$REPO_ROOT/.specify/memory/my-config.md" ]]; then
    cat >&2 << 'EOF'
⚠️  配置文件缺失

建议运行: /speckit.my-plugin.setup
EOF
    exit 10  # 警告但不阻塞
fi

exit 0
```

### 4. 添加执行权限

```bash
chmod +x .specify/plugins/my-plugin/hooks/*.sh
```

### 5. 创建命令

`.claude/commands/speckit.my-plugin.setup.md`:

```markdown
---
description: 配置 my-plugin
---

## 目标

配置 my-plugin 所需的参数...

## 执行步骤

1. 收集配置信息
2. 写入 `.specify/memory/my-config.md`
3. 报告完成状态
```

## 插件最佳实践

### 1. 最小侵入性

- ✅ 插件应该是可选的，不影响核心流程
- ✅ 使用退出码 10/20 进行非阻塞提示
- ❌ 不要在钩子中修改核心文件（除非明确说明）

### 2. 依赖声明

```json
{
  "dependencies": ["fe-rule"],
  "config": {
    "detection": {
      "required_files": [".specify/memory/fe-rule.md"]
    }
  }
}
```

### 3. 优先级

多个插件的同一钩子按优先级执行（数字越小越早）：

```json
{
  "hooks": {
    "pre-plan": {
      "check": "...",
      "priority": 10  // 较早执行
    }
  }
}
```

### 4. 错误处理

```bash
# 在钩子脚本中
if [[ $ERROR_CONDITION ]]; then
    echo "ERROR: 详细错误信息" >&2
    exit 1  # 阻塞执行
fi
```

### 5. 输出 JSON（用于任务增强）

```bash
#!/usr/bin/env bash
# pre-tasks hook 示例

cat << 'EOF'
{
  "plugin": "my-plugin",
  "additional_tasks": [
    {
      "phase": "setup",
      "task_id": "setup-x.y",
      "description": "任务描述",
      "details": "详细说明",
      "parallel": false,
      "dependencies": []
    }
  ]
}
EOF
```

## 调试插件

### 启用详细输出

```bash
.specify/scripts/bash/plugin-loader.sh --hook pre-plan --verbose
```

### 测试单个钩子

```bash
.specify/plugins/fe-rule/hooks/pre-plan-check.sh
echo "Exit code: $?"
```

### 检查插件配置

```bash
cat .specify/plugins.json | jq '.plugins[] | {id, enabled, hooks}'
```

## 禁用插件

在 `plugins.json` 中设置 `"enabled": false`：

```json
{
  "plugins": [
    {
      "id": "fe-figma-gen",
      "enabled": false,
      ...
    }
  ]
}
```

## 常见问题

### Q: 插件钩子不执行？

检查：
1. 脚本是否有执行权限？`chmod +x`
2. `plugins.json` 中是否启用？`"enabled": true`
3. 路径是否正确？使用相对于仓库根目录的路径

### Q: 钩子脚本报错但不显示？

确保错误信息输出到 `stderr`：

```bash
echo "ERROR: message" >&2
```

### Q: 如何让插件只在特定条件下执行？

在钩子脚本中添加检测逻辑：

```bash
# 只在前端项目中执行
if ! grep -qE '"(react|vue)"' package.json 2>/dev/null; then
    exit 0  # 静默跳过
fi
```

---

**更多信息**: 查看现有插件源码作为参考
- `.specify/plugins/fe-rule/`
- `.specify/plugins/fe-figma-gen/`
