---
name: generate2dsprite
description: "生成并后处理通用 2D 像素风素材与动画表：生物、角色、NPC、法术、弹道、受击、场景小件、召唤物等，并导出带透明底的 GIF。适用于：希望 Codex 从自然语言需求中推断资产方案、用内置 image_gen 生成纯色品红底的原始表图，并仅在本地做色键去背、切帧、对齐、质检与透明导出的场景。"
---

# Generate2dsprite（2D 精灵生成）

本技能用于**自成一体的 2D 精灵或动画素材**。

若用户要的是整套可玩内容包、地图、剧情、幻灯片或打包组装，请改用 `generate2dgamepack`。

## 参数

从用户描述中推断以下字段：

- `asset_type`：`player` | `npc` | `creature` | `character` | `spell` | `projectile` | `impact` | `prop` | `summon` | `fx`
- `action`：`single` | `idle` | `cast` | `attack` | `hurt` | `combat` | `walk` | `run` | `hover` | `charge` | `projectile` | `impact` | `explode` | `death`
- `view`：`topdown` | `side` | `3/4`
- `sheet`：`auto` | `1x4` | `2x2` | `2x3` | `3x3` | `4x4`
- `frames`：`auto` 或明确帧数
- `bundle`：`single_asset` | `unit_bundle` | `spell_bundle` | `combat_bundle` | `line_bundle`
- `effect_policy`：`all` | `largest`
- `anchor`：`center` | `bottom` | `feet`
- `margin`：`tight` | `normal` | `safe`
- `prompt`：用户的主题或视觉方向
- `role`：仅当资产明显是某种 NPC 职能时填写
- `name`：可选的输出文件名 slug

需求表述含糊时，请阅读 [references/modes.md](references/modes.md)。

## Agent 规则

- **自行决定资产方案**，不要在用户已经暗示了表尺寸、帧数或包结构时，仍强迫对方逐条拼出来。
- **美术 prompt 自己写**，不要默认去跑「拼 prompt 的脚本」。
- **每一张原始图都用内置 `image_gen` 生成。**
- **脚本只做确定性后处理**：品红清理、拆帧、连通域过滤、缩放、对齐、QC 元数据、透明表图导出、GIF 导出。
- 把脚本参数当作由 agent 选用的**执行原语**，而不是写死给用户看的流程。
- 若生成的表图贴格线、尺度漂移，或弹道/受击循环被打断，要么换一批后处理参数重跑，要么重新生成原始表图。
- 除非用户明确要求其他流程，否则**始终保留纯色 `#FF00FF` 背景**这条规则。

## 工作流

### 1. 推断资产方案

选**够用且最小**的输出。

示例：

- 可操控主角、四向行走 → `player` + `player_sheet`
- 大地图上的治疗系 NPC → `npc` + `single_asset` 或 `unit_bundle`
- 大型 Boss 待机动画循环 → `creature` + `idle` + `3x3`
- 法师投掷魔法球 → `spell_bundle`
  - 施法者施法表
  - 弹道循环
  - 受击爆开
- 一整条怪物进化/形态线 → `line_bundle`
  - 规划 1～3 种形态
  - 每种形态只做需求里真正需要的表图

### 2. 手写 prompt

遵循 [references/prompt-rules.md](references/prompt-rules.md)。

务必写死的部分包括：

- 纯色 `#FF00FF` 背景
- 精确的表图网格形状
- 各帧之间同一角色/资产身份一致
- 各帧边界框与像素尺度一致
- **容纳约束**：主体不得越过格线

### 3. 生成原始图

使用内置 `image_gen`。

生成完成后：

- 在 `$CODEX_HOME/generated_images/...` 下找到原始 PNG
- 复制或引用到当前工作输出目录
- **不要挪动**原始生成文件在生成目录里的位置

### 4. 本地后处理

对原始图运行 `scripts/generate2dsprite.py process`。

后处理器刻意保持**低层**：由 agent 选择：

- `rows` / `cols`
- `fit_scale`
- `align`
- `shared_scale`
- `component_mode`
- `component_padding`
- `edge_touch` 拒绝策略

用它收集 **QC 元数据**，而不是替你拍板美术好坏。

### 5. 质检结果

检查：

- 是否有帧贴到格边
- 是否有帧被缩放得与预期不符
- 分离出去的特效是否变成噪点
- 整张表是否仍像**同一套连贯动画**

若不过关，调整后处理参数重跑，或重做原始表图。

### 6. 交付合适的包结构

单张表图时，预期包含：

- `raw-sheet.png`
- `raw-sheet-clean.png`
- `sheet-transparent.png`
- 逐帧 PNG
- `animation.gif`
- `prompt-used.txt`
- `pipeline-meta.json`

`player_sheet` 时，预期还包含：

- 透明 4×4 表图
- 16 张逐帧 PNG
- 各方向条带
- 4 个方向的 GIF

`spell_bundle` 或 `unit_bundle` 时，组合里**每个资产单独一个文件夹**。

## 默认偏好

- `idle`
  - 中小型角色 → `2x2`
  - 大型生物或 Boss → `3x3`
- `cast` → 优先 `2x3`
- `projectile` → 优先 `1x4`
- `impact` / `explode` → 优先 `2x2`
- `walk`
  - 俯视角色 → 四向行走用 `4x4`
  - 侧视资产 → `2x2`
- 凡多帧且帧间一致性重要，默认开 `shared_scale`
- 分离的火星、边缘碎屑导致主体不稳时，用 `largest` 连通域模式

## 资源

- `references/modes.md`：资产类型、动作、组合包与表图选型
- `references/prompt-rules.md`：手写 prompt 的句式与 containment 规则
- `scripts/generate2dsprite.py`：去背、拆帧、对齐、QC、GIF 导出的后处理原语
