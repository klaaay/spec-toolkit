---
name: frontend-figma-bootstrap
description: 扫描仓库并对缺口做最小追问，建立或更新 Figma 落地约束 `.specify/memory/fe-figma-gen.md`。适用于首次接手项目的设计稿落地工作，或共享组件与 token 体系发生明显变化的场景。
---

# 建立 Figma 落地约束

通过扫描仓库中的前端结构、Design Token、共享布局和组件目录，建立一份专门服务于 Figma 落地的约束文档。这个技能吸收了旧的 `fe-figma-gen.scan` 和 `fe-figma-gen.wizard`：先自动发现，再只补必要问题。

## 目标产物

- `.specify/memory/fe-figma-gen.md`

## 依赖关系

- 若 `.specify/memory/fe-rule.md` 存在，应优先读取并复用其中的工程规则
- 若前端宪法缺失，但仓库明显有前端代码，建议先使用 `frontend-rules-bootstrap`

## 工作流

1. 先读取现有的 `.specify/memory/fe-figma-gen.md`。
   判断是继续增量更新，还是因为项目结构变化而需要整体刷新。

2. 自动扫描仓库中与 Figma 落地直接相关的信号。
   重点关注共享组件目录、共享布局目录、页面入口、样式体系、Design Token 文件、图标资源目录、别名配置、命名习惯。

3. 对齐已有前端宪法。
   如果 `.specify/memory/fe-rule.md` 已经定义了框架、路由、样式体系或目录约束，这些内容不要重复发明。

4. 识别 Figma 落地需要的关键约束：
   - 共享布局和共享组件的落点
   - 当前项目页面、模块和局部组件的落点
   - 新建组件和布局的命名规则
   - 样式体系和 Token 来源
   - Figma 标注与代码目录的映射关系
   - 禁止事项，例如禁止新增依赖、禁止绕过 Design Token、必须保留 SSR

5. 证据不足时，再向用户追问最少的问题。
   只问自动扫描无法推断、但会影响后续实施的约束。

6. 输出到 `.specify/memory/fe-figma-gen.md`。
   文档要偏向“落地规则”，而不是偏向“设计稿解读”。

## 关键原则

- 先用仓库证据，再问用户
- 尽量复用前端宪法里的结论，不要制造双重规范
- 未知项显式写成 `未知：[原因]`
- 规则必须能直接指导 `frontend-figma-implementation`
