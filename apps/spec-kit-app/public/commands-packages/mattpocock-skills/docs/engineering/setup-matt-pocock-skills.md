快速开始：

```bash
npx skills add mattpocock/skills --skill=setup-matt-pocock-skills
```

```bash
npx skills update setup-matt-pocock-skills
```

[来源](https://github.com/mattpocock/skills/tree/main/skills/engineering/setup-matt-pocock-skills)

## 它做什么

`setup-matt-pocock-skills` 会教一个 repo 里的 engineering Skill 应该如何行动：issue 在哪里、triage label 叫什么、domain docs 放在哪里。然后把这些答案记录为其他 Skill 会读取的 **config**。

它写 config，不 hard-code 行为。engineering chain 假设 `docs/agents/` 下存在三个文件；这个 Skill 是一次性 bootstrap，会根据你的真实 repo（`git remote`、既有 label、既有 `CONTEXT.md`）发现答案，并和你确认，而不是猜。它是 prompt-driven：探索、展示发现、确认、写入；不是 deterministic scaffold。

## 什么时候用

你通过输入 `/setup-matt-pocock-skills` 调用它。Agent 不会主动调用。

**每个 repo 第一次使用任何其他 engineering Skill 前** 先运行一次。如果 [triage](https://aihero.dev/skills-triage)、[to-prd](https://aihero.dev/skills-to-prd) 或 [to-issues](https://aihero.dev/skills-to-issues) 开始猜 issue 在哪里，或应用不存在的 label，说明还没在这里 setup。只有在切换 issue tracker 或想从头开始时才重新运行；日常调整就是编辑 `docs/agents/*.md`。

## 三个决策

它会带你逐个完成三个选择，每个都带 plain-language explainer（它假设你不已经知道这些术语）：

- **Issue tracker**：work 在哪里追踪。这样 `triage` / `to-prd` / `to-issues` 才知道该调用 `gh`、`glab`、在 `.scratch/` 下写 markdown，还是遵循你描述的 workflow。选项包括 GitHub、GitLab、本地 Markdown 或其他。
- **Triage labels**：五个 canonical role（`needs-triage`、`needs-info`、`ready-for-agent`、`ready-for-human`、`wontfix`）背后的字符串，映射到你实际配置的 label，避免 `triage` 创建重复 label。
- **Domain docs**：repo 是一个 `CONTEXT.md`，还是有 multi-context map，让读取 domain language 的 Skill 找到正确位置。

输出是三个文件：`docs/agents/issue-tracker.md`、`docs/agents/triage-labels.md`、`docs/agents/domain.md`；另外会在 repo 已使用的 `CLAUDE.md` 或 `AGENTS.md` 中添加一个 `## Agent skills` 块指向它们。这些文件是整套 toolkit 站立的共享基底。

## 它工作正常的信号

- `docs/agents/` 下出现三个文件，`CLAUDE.md` 或 `AGENTS.md` 中出现 `## Agent skills` 小节。
- 它提出的 tracker 符合真实 `git remote`，label 匹配 repo 中已经存在的字符串。
- 之后，`triage` 和 `to-issues` 会在正确位置使用正确 label，而不是询问或猜测。

## 它放在哪里

`setup-matt-pocock-skills` 是 **run-once setup**：整套 engineering Skill 的基础，不是需要重复执行的步骤。它的邻居是读取其产物的 Skill：[triage](https://aihero.dev/skills-triage) 使用这里配置的 label vocabulary，[to-prd](https://aihero.dev/skills-to-prd) / [to-issues](https://aihero.dev/skills-to-issues) 发布到这里配置的 issue tracker。先运行它；下游都假设它已经运行过。拿不准哪个 Skill 或 flow 适合当前任务时，用 [ask-matt](https://aihero.dev/skills-ask-matt) 路由。
