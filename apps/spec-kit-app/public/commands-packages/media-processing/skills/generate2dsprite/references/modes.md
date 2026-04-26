# 模式说明

当用户的说法可以对应多种合理资产方案时，查阅本文件。

## 资产类型

- `player`：可操控的大地图主角
- `npc`：一眼能读出职能的城镇/野外角色
- `creature`：怪物、野兽、灵体、Boss、召唤物
- `character`：侧视或非大地图人形单位，且不是明确的玩家或 NPC
- `spell`：可施放的魔法或技能序列
- `projectile`：可循环的飞行物，如法球、箭、火球、子弹、光束段
- `impact`：受击爆开、爆炸、接触特效
- `prop`：物品、武器、祭坛物件、可拾取物、可部署物
- `summon`：召唤单位或召唤登场用的资产
- `fx`：通用特效表图

## 动作

- `single`：单帧静图
- `idle`：循环的呼吸/站姿/气场
- `cast`：法术或技能的蓄力/释放
- `attack`：仅攻击动作
- `hurt`：受伤反应
- `combat`：攻击 + 受击同一张表
- `walk`：行走循环
- `run`：更快移动循环
- `hover`：浮空待机或移动循环
- `charge`：蓄力或冲刺预备
- `projectile`：可循环的飞行过程
- `impact`：接触瞬间爆开
- `explode`：更强的爆炸或破坏感
- `death`：战败/消散/倒地序列

## 组合包预设

- `single_asset`：单精灵或单表图
- `unit_bundle`
  - 默认：`idle` + `combat`
  - 可选：`walk`
- `spell_bundle`
  - 默认：`cast` + `projectile` + `impact`
- `combat_bundle`
  - 默认：`idle` + `attack` + `hurt`
- `line_bundle`
  - 默认：1～3 种形态
  - 每种形态只选真正需要的表图

## 表图预设

- `1x4`
  - 弹道
  - 简单循环特效
- `2x2`
  - 常规待机
  - 攻击 / 受击 / 受击爆开
  - 紧凑侧视行走
- `2x3`
  - 施法序列
  - 死亡序列
  - 稍丰富的战斗动作
- `3x3`
  - 大型生物待机
  - Boss 气场循环
  - 高完成度展示用待机
- `4x4`
  - 俯视四向主角行走表

## Agent 优先的映射提示

- 「做一个四向主角」→ `player` + `player_sheet`
- 「做一个治疗 NPC」→ `npc` + `single_asset`，`role=healer`
- 「治疗 NPC 要行走表」→ `npc` + `walk`
- 「做一个 Boss 待机」→ `creature` + `idle`；优先 `3x3`
- 「法师扔魔法球」→ `spell_bundle`
- 「火球弹道」→ `projectile` + `projectile`；优先 `1x4`
- 「受击爆炸」→ `impact` + `impact`；优先 `2x2`
- 「召唤登场」→ `summon` + `cast` 或 `impact`
- 「一整条火系武士怪物种族线」→ `line_bundle`；先规划 1～3 形态，再为每形态选表

## 旧版兼容

以下映射需继续可用：

- `player_sheet`：四向大地图行走
- `player_walk`：2×2 朝下行走
- `npc_walk`：2×2 朝下行走
- `combat`：2×2 攻击 + 受击
- `evolution`：旧版概念表

## 处理器默认

- 多帧表图除非刻意要尺度不一，否则用 `shared_scale=true`
- 贴地角色用 `align=bottom` 或 `feet`
- 浮空特效、弹道、分离 FX 用 `align=center`
- 原图里碎火星、边缘碎屑时用 `component_mode=largest`
- 分离特效本就是要的轮廓一部分时用 `component_mode=all`

## 输出形态

- 任意表图模式：透明整表 + 逐帧 PNG + GIF
- `player_sheet`：另加方向条带与四个方向的 GIF
- `single_asset`：清理后的透明 PNG
- 组合包：组合根目录下每个资产各一个输出文件夹
