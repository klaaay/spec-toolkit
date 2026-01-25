---
name: superpowers-writing-plans
description: 设计完成后使用，为几乎不了解代码库的工程师生成详细的实施任务。产出包含精确路径、完整代码示例与验证步骤的实施计划，假设工程师的领域知识极少
---

# 编写实施计划

## 概览

编写全面的实施计划，假设工程师对代码库一无所知、经验有限。详细说明他们需要的所有信息：每个任务要修改或创建哪些文件、使用什么代码、如何测试、需要参考哪些文档。将整个计划拆分为颗粒化的任务。遵循 DRY、YAGNI、TDD 原则，并保持频繁提交。

假设他们是熟练的开发者，但对本工具栈或领域几乎不了解，也不擅长测试设计。

**开场声明：** "我将使用 `skills/superpowers-writing-plans` 技能编写实施计划。"

**计划存放：** `docs/plans/YYYY-MM-DD-<feature-name>.md`

## 颗粒化任务粒度

**每一步是一个动作（2-5 分钟）：**
- "编写失败的测试" — 步骤
- "运行测试确认失败" — 步骤
- "编写最小实现使测试通过" — 步骤
- "再次运行测试确认通过" — 步骤
- "提交代码" — 步骤

## 计划文档头部

**每个计划必须以此开头：**

```markdown
# [功能名称] 实现计划

> **对于 Claude：** 需要使用的子技能：使用 skills/superpowers-executing-plans 逐步实施此计划。

**目标：** [一句话描述这构建什么]

**架构：** [2-3句话关于方法]

**技术栈：** [关键技术/库]

---
```

## 任务结构

```markdown
### 任务 N: [组件名称]

**文件：**
- 创建： `exact/path/to/file.py`
- 修改： `exact/path/to/existing.py:123-145`
- 测试： `tests/exact/path/to/test.py`

**步骤 1: 编写失败的测试**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

**步骤 2: 运行测试验证失败**

运行: `pytest tests/path/test.py::test_name -v`
预期: 失败并显示 "function not defined"

**步骤 3: 编写最小实现**

```python
def function(input):
    return expected
```

**步骤 4: 运行测试验证通过**

运行: `pytest tests/path/test.py::test_name -v`
预期: 通过

**步骤 5: 提交**

```bash
git add tests/path/test.py src/path/file.py
git commit -m "feat: add specific feature"
```

## 记住

- 始终使用精确的文件路径
- 计划中包含完整代码（不要只写"添加验证"这样的描述）
- 包含预期输出的精确命令
- 使用 @ 语法引用相关技能
- 遵循 DRY、YAGNI、TDD 原则，保持频繁提交

## 执行移交

保存计划后，给出执行选项：

**计划完成并保存到 `docs/plans/<filename>.md`。两种执行选项：**

**1. 子代理驱动（本会话）** - 我为每个任务派遣新的子代理，任务间进行审查，快速迭代

**2. 并行会话（单独）** - 在新会话中打开 executing-plans，批量执行并设置检查点

**选择哪种方法？**

**如果选择子代理驱动：**
- **需要使用的子技能：** 使用 `skills/superpowers-subagent-driven-development` 技能
- 保持在此会话中
- 每个任务使用新的子代理 + 代码审查

**如果选择并行会话：**
- 引导用户在工作树中打开新会话
- **需要使用的子技能：** 新会话使用 `skills/superpowers-executing-plans` 技能