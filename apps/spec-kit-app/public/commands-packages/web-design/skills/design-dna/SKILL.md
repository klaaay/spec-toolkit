---
name: design-dna
description: >-
  提取、定义并应用跨三个维度的 design DNA：设计系统（tokens）、设计风格（定性感受），以及视觉特效（Canvas、WebGL、3D、粒子、着色器、滚动特效等）。当出现以下情况时使用这个技能：（1）用户想查看完整的三维设计结构 / schema；（2）用户提供图片、截图或参考设计链接，希望把它们分析成覆盖三个维度的结构化 JSON 画像；（3）用户已经有 Design DNA JSON 和内容，希望基于它生成设计；（4）或以上阶段的任意组合。可由这些表述触发：“design DNA”“提取设计风格”“分析设计”“从参考里提取 design tokens”“基于 JSON 生成设计”“从截图提取设计系统”“设计画像”“style guide JSON”“视觉特效分析”“带特效的设计”“3D 设计分析”。
---

# Design DNA

一套三阶段工作流，用于在三个维度上提取、结构化并应用设计身份：

1. **Design System** — 可量化的 tokens（颜色、字体、间距、版式、形状、层级、动效、组件）
2. **Design Style** — 定性感知（情绪、视觉语言、构图、图像风格、交互气质、品牌语气）
3. **Visual Effects** — 特殊渲染（Canvas、WebGL、3D、粒子、着色器、滚动特效、光标特效、SVG 动画、玻璃拟态等）

## 阶段

### Phase 1: Structure — 输出 Schema

当用户询问结构维度或 schema 时：

1. 阅读 [references/schema.md](references/schema.md)
2. 输出完整 schema，并附上字段说明
3. 解释三个维度及其职责：
   - **design_system**：你能量化的部分 —— 精确的 hex 色值、像素尺寸、rem 级差
   - **design_style**：你能感受到的部分 —— 情绪、人格、构图策略
   - **visual_effects**：你能看见、但无法仅用 CSS 完整表达的部分 —— WebGL 场景、粒子系统、着色器扭曲、滚动驱动动画
4. 询问用户是否要定制或扩展某些维度

### Phase 2: Analyze — 从参考中提取 DNA

当用户提供图片、截图或链接来表达目标设计风格时：

1. 阅读 [references/schema.md](references/schema.md)，获取完整字段列表
2. 针对每份参考：
   - 如果是图片 / 截图：直接分析视觉属性
   - 如果是 URL：抓取并分析页面视觉设计
3. 按 schema 中的每个字段，从参考中提取或推断对应值
4. 若多份参考之间存在冲突，指出主导模式，并补充变体
5. 输出一份完整的 Design DNA JSON —— 每个字段都要填满，不能留空字符串
6. 输出后追加一句：`要在生成之前先调整其中某些值吗？`

**按维度分析的方法：**

#### 维度 1：design_system
- **color**：通过视觉采样提取主色板。primary 以面积主导为准，secondary 看辅助角色，accent 看 CTA 的使用方式。neutral 则从最浅背景到最深正文建立中性色阶。
- **typography**：根据视觉特征识别字体家族（几何、humanist、serif 类别等）。根据标题 / 正文的相对关系估算字号级差。
- **spacing**：通过元素之间的距离判断内容密度；通过不同区块之间的间隔一致性判断节奏。
- **layout**：根据内容对齐方式判断栅格；记录最大宽度、列数、是否存在非对称布局。
- **shape**：通过圆角与元素高度的比例估算 border-radius；记录边框与分割线是否存在。
- **elevation**：归类阴影的柔和度、扩散范围，以及整体叠层方式。
- **motion**：如果能观察到动态（视频 / 可交互页面），记录缓动曲线和时长风格。

#### 维度 2：design_style
- 综合提炼整体观感 —— 情绪、人格、构图策略
- 与常见风格原型比较（SaaS、编辑感、粗野主义等）
- 记录装饰程度与留白哲学

#### 维度 3：visual_effects
- **从代码看**：扫描 `<canvas>`、WebGL context、Three.js / Pixi.js 引入、GSAP / Lottie 使用、自定义 shader、IntersectionObserver 滚动触发、SVG `<animate>` 元素
- **从截图看**：描述那些超出标准 CSS 的可见效果 —— 发光粒子、3D 物体、噪点纹理、动态渐变、视差景深、光标拖尾、文字扭曲、玻璃拟态表面等。若无法确认实现方式，把它们写进 `composite_notes`
- **从视频 / 交互动图看**：记录滚动行为、悬停扭曲、过渡编排、加载序列
- 对参考里没有出现的效果类别，设置 `enabled: false`
- 根据观察结果评估 `overview.effect_intensity` 和 `overview.performance_tier`

### Phase 3: Generate — 将 DNA 应用到内容中

当用户提供 DNA JSON + 内容，并希望据此生成设计时：

1. 阅读 [references/generation-guide.md](references/generation-guide.md)
2. 解析 DNA JSON，并提取三个维度中的全部 token
3. 根据 `design_system` 的值构建 CSS 自定义属性
4. 使用 `design_style` 中的定性字段来指导主观设计决策
5. 如果设计需要素材或源文件，优先从原始来源获取。若用户给的是 URL，应尽可能从该 URL 取真实素材，而不是自己重绘、近似或替代。
6. 按需使用合适技术实现 `visual_effects`：
   - 轻量效果 → CSS 动画、SVG、原生 JS
   - 中等效果 → Canvas 2D、GSAP、Lottie
   - 重效果 → Three.js、自定义 GLSL shaders、Pixi.js
7. 输出设计结果（默认：自包含的 HTML，内联 CSS / JS）
8. 按生成指南完成质量检查

**如果用户只提供内容，没有 DNA JSON**，先询问用户是要：
- 先分析一个参考（转到 Phase 2）
- 还是直接用文字描述风格（先从描述中提取 DNA，再生成）

## 阶段组合

用户可能触发任意组合：
- **仅 Phase 1**：`“给我看看设计结构 / schema”`
- **仅 Phase 2**：`“分析这个设计”`（附图片或链接）
- **Phase 2 → 3**：`“分析这个设计，并按同样风格给我做一个 landing page”`
- **Phase 1 → 2 → 3**：完整工作流
- **仅 Phase 3**：用户已经有 DNA JSON

根据上下文识别当前需要的阶段组合，并按需执行。
