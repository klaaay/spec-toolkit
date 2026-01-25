# Superpowers 工作流

基于 [superpowers](https://github.com/obra/superpowers)提炼出了核心的主 commands、skill 和 agent。

本文档说明 `superpowers` 命令包的命令、skills、agents 及其调用关系。

## 概述

`superpowers` 提供一组通用工作流组件：
- 命令：brainstorm / write-plan / execute-plan，覆盖从脑暴到计划执行的链路。
- skills：支撑执行的能力模块（brainstorming、writing-plans、executing-plans、receiving/requesting-code-review、subagent-driven-development、finishing-a-development-branch、test-driven-development、writing-clearly-and-concisely）及其相关模板文件。
- agents：code-reviewer，用于代码审查。

## 调用关系图

```mermaid
flowchart TD
    subgraph Commands
      C1[superpowers.brainstorm]
      C2[superpowers.write-plan]
      C3[superpowers.execute-plan]
    end

    subgraph Skills
      S1[brainstorming]
      S2[writing-plans]
      S3[executing-plans]
      S4[requesting-code-review]
      S5[receiving-code-review]
      S6[subagent-driven-development]
      S7[finishing-a-development-branch]
      S8[test-driven-development]
      S9[writing-clearly-and-concisely]
    end

    subgraph Agents
      A1[code-reviewer]
    end

    C1 -->|使用 skill| S1
    C1 -->|输出设计/思路| C2
    C2 -->|使用 skill| S2
    C2 -->|产出计划| C3
    C3 -->|使用 skill| S3
    S3 -->|评审模板| S4
    S4 -->|调用 agent| A1
    S4 -->|处理反馈| S5
    S3 -->|可选并行| S6
    S3 -->|收尾| S7
    S2 & S3 -->|写作/表达| S9
    S3 & S6 -->|实施前后| S8
```

### 命令流程图

```mermaid
flowchart LR
    C1[superpowers.brainstorm<br/>脑暴收敛] --> C2[superpowers.write-plan<br/>生成计划]
    C2 --> C3[superpowers.execute-plan<br/>分批执行]

    style C1 fill:#e1f5ff
    style C2 fill:#e8f5e9
    style C3 fill:#f3e5f5
```

### Skills 触发关系

```mermaid
flowchart TD
    S1[brainstorming] --> S2[writing-plans]
    S2 --> S3[executing-plans]
    S3 --> S4[requesting-code-review]
    S4 --> S5[receiving-code-review]
    S3 --> S6[subagent-driven-development]
    S3 --> S7[finishing-a-development-branch]
    S3 --> S8[test-driven-development]
    S2 --> S9[writing-clearly-and-concisely]
    S3 --> S9

    classDef main fill:#e8f5e9,stroke:#999;
    class S1,S2,S3,S4,S5,S6,S7,S8,S9 main;
```

### 评审 Agent 链路

```mermaid
flowchart LR
    R1[requesting-code-review] -->|派发模板<br/>code-reviewer.md| A1[code-reviewer agent]
    A1 -->|返回审查结论| R2[receiving-code-review]
```

### Subagent 驱动开发链路

```mermaid
flowchart TD
    S6[subagent-driven-development] -->|分派实现者| T1[implementer-prompt]
    T1 -->|实现完成| T2[spec-reviewer-prompt]
    T2 -->|规范合规通过| T3[code-quality-reviewer-prompt]
    T3 -->|调用| A1[code-reviewer agent]
    A1 -->|质量审查通过| S6
```

## 命令速览

| 命令                       | 作用                                               | 主要产出                             |
| -------------------------- | -------------------------------------------------- | ------------------------------------ |
| `superpowers.brainstorm`   | 按脑暴 skill 结构化提问，收敛方案。                | 对话中的设计方向与摘要               |
| `superpowers.write-plan`   | 基于确定的思路生成可执行计划（路径、步骤、命令）。 | `docs/plans/YYYY-MM-DD-<feature>.md` |
| `superpowers.execute-plan` | 读取计划，分批执行并校验 checkpoint。              | 执行进度与校验输出                   |

## Skills 速览（核心职责）

### 核心 Skills
- `brainstorming`：结构化脑暴、提问、收敛方案。
- `writing-plans`：生成颗粒化实施计划（精确路径、示例、验证步骤）。
- `executing-plans`：分批执行计划并在批次间汇报。
- `requesting-code-review` + `code-reviewer` agent + `receiving-code-review`：发起与接收代码评审。
- `subagent-driven-development`：同会话内任务级并行执行（每任务新 subagent，任务间 code review）。
- `finishing-a-development-branch`：收尾开发分支，提供合并/PR/保留/丢弃选项并清理。
- `test-driven-development`：先失败测试再实现，若项目无测试则声明跳过。
- `writing-clearly-and-concisely`：中文写作清晰简练，主动、具体、删繁。

### 模板文件（Templates）
- `requesting-code-review/code-reviewer.md`：code-reviewer subagent 请求评审时使用的模板。
- `subagent-driven-development/implementer-prompt.md`：实现者子代理提示模板，用于分派实现者子代理。
- `subagent-driven-development/spec-reviewer-prompt.md`：规范合规性审查者提示模板，用于分派规范合规性审查者子代理。
- `subagent-driven-development/code-quality-reviewer-prompt.md`：代码质量审查者提示模板，用于分派代码质量审查者子代理。
- `test-driven-development/testing-anti-patterns.md`：测试反模式参考文档，帮助避免常见的测试错误。

## 使用建议

1) 先用 `superpowers.brainstorm` 收敛方案；必要时结合 `brainstorming` skill。  
2) 运行 `superpowers.write-plan` 生成计划，依据 `writing-plans` / `writing-clearly-and-concisely` 优化表述。  
3) 用 `superpowers.execute-plan` 按批次执行，执行过程中：  
   - 按需触发 `requesting-code-review` + `code-reviewer` + `receiving-code-review`（使用 `code-reviewer.md` 模板）。  
   - 需要并行/同会话执行时用 `subagent-driven-development`（使用 `implementer-prompt.md`、`spec-reviewer-prompt.md`、`code-quality-reviewer-prompt.md` 模板）。  
   - 收尾前调用 `finishing-a-development-branch`。  
   - 确保按 `test-driven-development` 原则执行（参考 `testing-anti-patterns.md` 避免常见错误；如缺少测试框架，先声明无法执行 TDD）。
