快速开始：

```bash
npx skills add mattpocock/skills --skill=to-issues
```

```bash
npx skills update to-issues
```

[来源](https://github.com/mattpocock/skills/tree/main/skills/engineering/to-issues)

## 它做什么

`to-issues` 会把 plan、spec 或 PRD 拆成一组可独立领取的 issues，并按 dependency order 发布到项目的 issue tracker。

每个 issue 都是 **tracer bullet**：一个很薄的 _vertical_ slice，端到端穿过所有 integration layer（schema、API、UI、tests），绝不是某一层的 horizontal slice。完成后的 slice 可以独立 demo 或验证，这使得生成的 ticket 可以安全交给独立 Agent。

## 什么时候用

你通过输入 `/to-issues` 调用它。Agent 不会主动调用。

当你已经有 agreed plan 或 written spec，并希望把它拆成 Agent 可领取的 ticket 时，用它。你可以指向当前 conversation，也可以传入已有 issue reference；它会先抓取 body 和 comments。如果 change 还没写成 spec，先产出 spec；这时用 [to-prd](https://aihero.dev/skills-to-prd)。

## 前置条件

`to-issues` 会发布到 issue tracker，所以 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 必须先为此 repo 配置 tracker 和 triage label vocabulary。发布时，它会自己应用 `ready-for-agent` triage label。

## Vertical slice，而不是 horizontal slice

整个 Skill 围绕一个区别。**Horizontal** slice 只交付 change 的一层：所有 schema，或所有 API；在每一层都完成前，什么都不能工作。**Vertical** slice，也就是 tracer bullet，则一次交付穿过 _每一层_ 的窄路径，所以完成瞬间就能 demo。

切分前，`to-issues` 会寻找 prefactoring：先 “make the change easy”，再 “make the easy change”，并把这些工作排在前面。然后它会就 breakdown 追问你（粒度、依赖、该合并还是拆分），在写任何 issue 前确认。它会先发布 blocker，这样每个 issue 的 “Blocked by” 字段能引用真实 ticket。

## 它放在哪里

`to-issues` 是 main build chain 中的一步：

```txt
grill-with-docs → to-prd → to-issues → implement → code-review
```

它位于 [to-prd](https://aihero.dev/skills-to-prd) 和 [implement](https://aihero.dev/skills-implement) 之间。前者把稳定 spec 和 user stories 交给它切分，后者构建每个可独立领取的 issue，并内部驱动 [tdd](https://aihero.dev/skills-tdd) test-first 写 tests，最后进入 [code-review](https://aihero.dev/skills-code-review)。拿不准哪个 Skill 或 flow 适合当前任务时，用 [ask-matt](https://aihero.dev/skills-ask-matt) 路由。
