# 生成指南

说明如何在第三阶段把一份完整的 Design DNA JSON 用到设计生成里。覆盖三个维度。

## 优先级顺序

当你根据 DNA JSON 和内容生成设计时，优先级建议如下：

1. **颜色和字体**：决定 80% 的视觉身份
2. **间距和版式**：决定结构节奏
3. **形状和层级**：决定表面处理方式
4. **设计风格字段**：决定气质、人格和构图方法
5. **视觉特效**：决定特殊渲染层
6. **动效和交互**：在静态结构和特效稳定后再补强

## 维度 1：`design_system` → 代码

### Tailwind CSS / Utility-First

```text
color.primary.hex        → --color-primary / bg-[hex]
typography.font_families → font-family config
spacing.scale            → spacing config values
shape.border_radius      → rounded-{sm|md|lg|full}
elevation.levels         → shadow-{sm|md|lg}
```

### 原生 CSS / CSS Variables

把设计 token 映射到 `:root`：

```css
:root {
  --color-primary: {color.primary.hex};
  --color-secondary: {color.secondary.hex};
  --color-accent: {color.accent.hex};
  --font-heading: {typography.font_families.heading};
  --font-body: {typography.font_families.body};
  --radius-sm: {shape.border_radius.small};
  --radius-md: {shape.border_radius.medium};
  --radius-lg: {shape.border_radius.large};
  --shadow-low: {elevation.levels.low};
  --shadow-med: {elevation.levels.medium};
  --shadow-high: {elevation.levels.high};
  --ease: {motion.easing};
  --duration-micro: {motion.duration_scale.micro};
  --duration-normal: {motion.duration_scale.normal};
  --duration-macro: {motion.duration_scale.macro};
}
```

### 组件决策

- `components.button_style` → 按钮样式和变体
- `components.card_style` → 卡片容器的视觉处理
- `components.navigation_pattern` → 导航组件类型
- `interaction_feel.hover_behavior` → `:hover` / `:focus` 状态设计
- `motion.easing` + `motion.duration_scale` → 过渡参数

## 维度 2：`design_style` → 主观设计决策

| DNA 字段 | 影响什么 |
| --- | --- |
| `aesthetic.mood` | 整体情绪，例如偏温暖、偏冷静、偏精密 |
| `visual_language.whitespace_usage` | 留白和内外边距的慷慨程度 |
| `visual_language.contrast_level` | 元素是更突出，还是更融合 |
| `composition.hierarchy_method` | 用什么方式建立重点 |
| `composition.balance_type` | 版面是对称，还是动态不对称 |
| `imagery.graphic_elements` | 是否加入装饰性 SVG、渐变、纹理、图形 |
| `brand_voice_in_ui.tone` | 文案语气 |
| `interaction_feel.microinteraction_density` | 悬停、点击、反馈的密度 |

## 维度 3：`visual_effects` → 特殊渲染

### 按性能等级选技术

| 等级 | 技术 | 适用场景 |
| --- | --- | --- |
| `lightweight` | CSS 动画、SVG SMIL、原生 JS | `overview.performance_tier = "lightweight"` |
| `medium` | Canvas 2D、GSAP、Lottie、anime.js | `overview.performance_tier = "medium"` |
| `heavy` | Three.js、自定义 GLSL、Pixi.js、WebGL | `overview.performance_tier = "heavy"` |

### 常见实现模式

#### 背景效果

```text
"none"               → 跳过
"gradient-animation" → 用 CSS @keyframes 驱动 linear-gradient 或 conic-gradient
"noise-field"        → 用 Canvas 2D 做 Perlin / simplex 噪声
"mesh-gradient"      → 用 SVG <mesh> 或 Canvas 插值
"video-bg"           → <video autoplay muted loop>，并提供 poster fallback
"generative-art"     → 用 Canvas 2D 或 WebGL 跑生成式算法
```

#### 粒子系统

当 `particle_systems.enabled: true` 时：

- `count < 100` 且交互简单：优先用原生 JS + Canvas 2D
- `count >= 100` 或交互复杂：考虑 Pixi.js 或 Three.js Points
- 将 `interaction`，如 `mouse-repel`、`mouse-attract`，映射到鼠标事件
- 使用 `requestAnimationFrame`
- 组件卸载时，记得销毁和清理

#### 3D 元素

当 `3d_elements.enabled: true` 时：

- 默认优先 Three.js，除非 DNA 明确指定其他方案
- 根据 `lighting`、`camera`、`materials` 配置场景
- 通过 `post_processing` 配置 EffectComposer
- 用 `ResizeObserver` 处理容器尺寸变化
- 如需 CDN，可用：`https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js`

#### Shader 效果

当 `shader_effects.enabled: true` 时：

- 按 `type` 创建 vertex / fragment shader
- 把 `uniforms` 映射为运行时参数，比如时间、分辨率、鼠标位置
- `noise-distortion` 之类的效果，噪声模型要和 `noise_type` 保持一致
- 用 `requestAnimationFrame` 持续更新 `u_time`

#### 滚动效果

- **Parallax**：用 `transform: translateY()`，位移随滚动偏移和图层速度变化
- **Scroll-triggered**：用 `IntersectionObserver` 和 `threshold` 数组
- **Scrub behavior**：如果是 `scrubbed`，动画进度和滚动进度绑定；如果是 `triggered`，进入视口后播放一次

#### 文字效果

```text
"split-letter-animate" → 把文本拆成 span，按字或按词错峰动画
"typewriter"           → 用 CSS steps() 或 JS 定时逐字显现
"glitch"               → 用多层 clip-path + 色偏动画
"gradient-fill"        → 用 background-clip: text + 动态渐变
"3d-extrude"           → 用 text-shadow 堆叠，或用 WebGL 文字几何体
```

#### 光标效果

当 `cursor_effects.enabled: true` 时：

- 隐藏系统光标：`cursor: none`
- 创建跟随 `pointermove` 的自定义光标
- `magnetic-buttons`：悬停接近时对按钮施加吸附位移
- `spotlight`：让径向渐变遮罩跟着光标移动
- `trail`：移动时生成逐渐消失的拖尾元素

#### 玻璃拟态 / 新拟态

```text
"glass"             → backdrop-filter: blur(...); 配合半透明背景
"neumorphic-light"  → 浅色背景上的双阴影
"neumorphic-dark"   → 深色背景上的反向双阴影
"frosted-layers"    → 多层模糊半透明叠加
```

#### Canvas 绘制

当 `canvas_drawings.enabled: true` 时：

- 初始化时让 canvas 与容器宽高保持一致
- 根据 `draw_method` 选择绘制方式
- 用 `requestAnimationFrame` 驱动动画
- 用 `ResizeObserver` 处理响应式

#### SVG 动画

当 `svg_animations.enabled: true` 时：

- `path-draw`：把 `stroke-dashoffset` 从路径总长动画到 0
- `morph-shapes`：在两个路径的 `d` 属性之间插值
- `stroke-animation`：动画化描边的 dasharray、宽度或颜色

### 回退策略

必须实现 `overview.fallback_strategy` 指定的回退方案：

```js
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isLowEnd = navigator.hardwareConcurrency <= 2;

if (prefersReduced || isLowEnd) {
  // 退化为静态 CSS 版本，或关闭 canvas / WebGL 效果
}
```

## 输出格式

如果用户没有指定框架，默认输出一个自包含的 HTML 文件，内联 CSS 和 JavaScript。输出里至少应包含：

1. 从 `design_system` 生成的 CSS 变量
2. 根据 `design_system.components` 和 `design_style` 推导出的组件样式
3. 按 `design_system.layout` 组织的页面结构
4. 注入用户提供的内容
5. 按 `visual_effects` 实现的特效
6. 如果 `design_system.motion.philosophy` 不是 `none`，则补上动画和过渡
7. 针对特效的回退策略

如果重效果需要外部库，可以通过 CDN 引入：

```html
<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js"}}</script>
<script src="https://cdn.jsdelivr.net/npm/gsap@latest/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lottie-web@latest/build/player/lottie.min.js"></script>
```

## 交付前检查

- [ ] 输出里的每个颜色都能追溯到 DNA 调色板
- [ ] 字体族和字级符合 DNA
- [ ] 间距节奏符合 DNA scale
- [ ] 圆角符合 DNA shape token
- [ ] 整体气质符合 `design_style.aesthetic.mood`
- [ ] 组件模式符合 DNA `components` 描述
- [ ] 对比度满足 WCAG AA 最低要求
- [ ] 视觉特效的类型、技术和参数符合 `visual_effects`
- [ ] 已实现低性能或低动态偏好的回退策略
- [ ] 尊重 `prefers-reduced-motion`
- [ ] `enabled: false` 的效果不会被误渲染
- [ ] Canvas / WebGL 会正确响应尺寸变化
- [ ] 动画循环使用 `requestAnimationFrame`，而不是 `setInterval`
