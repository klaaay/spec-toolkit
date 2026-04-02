# Design DNA Schema

Design DNA 是一份三维设计画像：

- **design_system**：可量化的设计 token
- **design_style**：偏感知和判断的设计气质
- **visual_effects**：超出普通 CSS 的特殊渲染和视觉行为

最终输出的 JSON 必须包含下面列出的全部字段。

## 顶层结构

### `meta`

- `name`
- `description`
- `source_references`
- `created_at`

### `design_system`

结构化、可度量的一层。

#### `design_system.color`

- `palette_type`
- `primary.hex`
- `primary.role`
- `secondary.hex`
- `secondary.role`
- `accent.hex`
- `accent.role`
- `neutral.scale`
- `neutral.usage`
- `semantic.success`
- `semantic.warning`
- `semantic.error`
- `semantic.info`
- `surface.background`
- `surface.card`
- `surface.elevated`
- `contrast_strategy`

#### `design_system.typography`

- `type_scale.display.size`
- `type_scale.display.weight`
- `type_scale.display.line_height`
- `type_scale.display.tracking`
- `type_scale.heading_1.size`
- `type_scale.heading_1.weight`
- `type_scale.heading_1.line_height`
- `type_scale.heading_1.tracking`
- `type_scale.heading_2.size`
- `type_scale.heading_2.weight`
- `type_scale.heading_2.line_height`
- `type_scale.heading_2.tracking`
- `type_scale.heading_3.size`
- `type_scale.heading_3.weight`
- `type_scale.heading_3.line_height`
- `type_scale.heading_3.tracking`
- `type_scale.body.size`
- `type_scale.body.weight`
- `type_scale.body.line_height`
- `type_scale.body.tracking`
- `type_scale.body_small.size`
- `type_scale.body_small.weight`
- `type_scale.body_small.line_height`
- `type_scale.body_small.tracking`
- `type_scale.caption.size`
- `type_scale.caption.weight`
- `type_scale.caption.line_height`
- `type_scale.caption.tracking`
- `type_scale.overline.size`
- `type_scale.overline.weight`
- `type_scale.overline.line_height`
- `type_scale.overline.tracking`
- `font_families.heading`
- `font_families.body`
- `font_families.mono`
- `font_style_notes`

#### `design_system.spacing`

- `base_unit`
- `scale`
- `content_density`
- `section_rhythm`

#### `design_system.layout`

- `grid_system`
- `max_content_width`
- `columns`
- `gutter`
- `breakpoints`
- `alignment_tendency`

#### `design_system.shape`

- `border_radius.small`
- `border_radius.medium`
- `border_radius.large`
- `border_radius.pill`
- `border_usage`
- `divider_style`

#### `design_system.elevation`

- `shadow_style`
- `levels.low`
- `levels.medium`
- `levels.high`
- `depth_cues`

#### `design_system.iconography`

- `style`
- `stroke_weight`
- `size_scale`
- `preferred_set`

#### `design_system.motion`

- `easing`
- `duration_scale.micro`
- `duration_scale.normal`
- `duration_scale.macro`
- `entrance_pattern`
- `exit_pattern`
- `philosophy`

#### `design_system.components`

- `button_style`
- `input_style`
- `card_style`
- `navigation_pattern`
- `modal_style`
- `list_style`
- `component_notes`

### `design_style`

偏感知、偏判断的一层。

#### `design_style.aesthetic`

- `mood`
- `visual_metaphor`
- `era_influence`
- `genre`
- `personality_traits`
- `adjectives`

#### `design_style.visual_language`

- `complexity`
- `ornamentation`
- `whitespace_usage`
- `visual_weight_distribution`
- `focal_strategy`
- `contrast_level`
- `texture_usage`

#### `design_style.composition`

- `hierarchy_method`
- `balance_type`
- `flow_direction`
- `grouping_strategy`
- `negative_space_role`

#### `design_style.imagery`

- `photo_treatment`
- `illustration_style`
- `graphic_elements`
- `pattern_usage`
- `image_shape`

#### `design_style.interaction_feel`

- `feedback_style`
- `hover_behavior`
- `transition_personality`
- `loading_style`
- `microinteraction_density`

#### `design_style.brand_voice_in_ui`

- `tone`
- `formality`
- `cta_style`
- `empty_state_approach`
- `error_tone`

### `visual_effects`

特殊渲染和高级视觉行为的一层。

#### `visual_effects.overview`

- `effect_intensity`
- `performance_tier`
- `fallback_strategy`
- `primary_technology`

#### `visual_effects.background_effects`

- `type`
- `description`
- `technology`
- `params.color_palette`
- `params.speed`
- `params.density`
- `params.opacity`
- `params.blend_mode`

#### `visual_effects.particle_systems`

- `enabled`
- `type`
- `description`
- `technology`
- `params.count`
- `params.shape`
- `params.size_range`
- `params.movement_pattern`
- `params.color_behavior`
- `params.interaction`
- `params.spawn_area`

#### `visual_effects.3d_elements`

- `enabled`
- `type`
- `description`
- `technology`
- `params.renderer`
- `params.lighting`
- `params.camera`
- `params.materials`
- `params.geometry`
- `params.post_processing`
- `params.interaction_model`

#### `visual_effects.shader_effects`

- `enabled`
- `type`
- `description`
- `technology`
- `params.uniforms`
- `params.vertex_manipulation`
- `params.fragment_output`
- `params.noise_type`
- `params.distortion`

#### `visual_effects.scroll_effects.parallax`

- `enabled`
- `layers`
- `depth_range`
- `speed_curve`

#### `visual_effects.scroll_effects.scroll_triggered_animations`

- `enabled`
- `trigger_points`
- `animation_type`
- `scrub_behavior`

#### `visual_effects.scroll_effects.scroll_morphing`

- `enabled`
- `description`

#### `visual_effects.text_effects`

- `type`
- `description`
- `technology`
- `params.split_strategy`
- `params.animation_per_unit`
- `params.stagger`
- `params.effect_style`

#### `visual_effects.cursor_effects`

- `enabled`
- `type`
- `description`
- `params.shape`
- `params.size`
- `params.blend_mode`
- `params.trail`
- `params.interaction_zone`

#### `visual_effects.image_effects`

- `type`
- `description`
- `technology`
- `params.filter_pipeline`
- `params.hover_transform`
- `params.reveal_animation`
- `params.distortion_type`

#### `visual_effects.glassmorphism_neumorphism`

- `enabled`
- `style`
- `params.blur_radius`
- `params.transparency`
- `params.border_treatment`
- `params.shadow_type`
- `params.light_source_angle`

#### `visual_effects.canvas_drawings`

- `enabled`
- `type`
- `description`
- `technology`
- `params.draw_method`
- `params.animation_loop`
- `params.color_scheme`
- `params.responsiveness`
- `params.interaction`

#### `visual_effects.svg_animations`

- `enabled`
- `type`
- `description`
- `params.animation_method`
- `params.path_morphing`
- `params.stroke_animation`
- `params.filter_effects`

#### `visual_effects.composite_notes`

- 用自由文本补充多层效果的叠加关系、实现不确定点、性能取舍，或只能从截图观察到的现象

## 字段说明

### `design_system`：结构化 / 可量化维度

这一层强调具体值和 token。能看清的地方尽量提取精确值；看不清时，基于视觉观察做合理估算。

- **`color.palette_type`**：如 `monochromatic`、`complementary`、`analogous`、`triadic`、`split-complementary`
- **`color.contrast_strategy`**：文本和背景如何建立对比，例如 `high contrast`、`subtle layers`、`dark-on-light dominant`
- **`typography.font_style_notes`**：例如“几何无衬线里带一点 humanist 气质”
- **`spacing.content_density`**：`compact`、`comfortable`、`spacious`
- **`spacing.section_rhythm`**：区块之间的纵向节奏如何变化
- **`layout.alignment_tendency`**：`strict grid`、`centered`、`asymmetric`、`mixed`
- **`shape.border_usage`**：`none`、`subtle 1px`、`bold borders`、`only on inputs`
- **`elevation.shadow_style`**：`none`、`soft diffused`、`hard drop`、`layered`
- **`elevation.depth_cues`**：通过什么制造深度，比如阴影、叠层、模糊、色彩强度
- **`motion.philosophy`**：`minimal functional`、`playful bouncy`、`cinematic`、`none`
- **`components`**：描述观察到的组件模式，例如“粗边框 ghost button、带内阴影的圆角输入框”

### `design_style`：定性 / 感知维度

这一层允许主观判断，但表达要具体。

- **`aesthetic.mood`**：3 到 5 个情绪词，例如 `["calm", "professional", "warm"]`
- **`aesthetic.genre`**：如 `corporate SaaS`、`indie creative`、`luxury editorial`、`neo-brutalist`
- **`aesthetic.personality_traits`**：把设计当成一个人时的性格，例如 `["confident", "approachable", "meticulous"]`
- **`visual_language.complexity`**：`minimal`、`moderate`、`rich`、`maximal`
- **`visual_language.ornamentation`**：`none`、`subtle accents`、`decorative`、`heavily ornamented`
- **`visual_language.focal_strategy`**：`single hero element`、`distributed interest`、`progressive reveal`
- **`composition.hierarchy_method`**：`scale contrast`、`color weight`、`spatial isolation`、`typographic hierarchy`
- **`composition.balance_type`**：`symmetric`、`asymmetric`、`radial`、`mosaic`
- **`interaction_feel.transition_personality`**：`snappy`、`smooth glide`、`bouncy elastic`、`fade-subtle`
- **`brand_voice_in_ui.cta_style`**：`direct imperative`、`friendly invitation`、`urgent scarcity`、`subtle suggestion`

### `visual_effects`：特殊渲染 / 高级视觉维度

这一层用于描述超出普通 CSS 的效果。很多效果需要 Canvas、WebGL、SVG 动画、Shader 或 JavaScript 动画库。若无法从静态截图判断底层实现，就描述可见现象。

- **`overview.effect_intensity`**：`none`、`subtle-accent`、`moderate`、`heavy-immersive`
- **`overview.performance_tier`**：`lightweight`、`medium`、`heavy`
- **`overview.fallback_strategy`**：低性能设备上的退化方式，例如 `disable effects`、`reduce to CSS`、`static snapshot`
- **`overview.primary_technology`**：`CSS only`、`Canvas 2D`、`WebGL/Three.js`、`GSAP`、`Lottie`、`SVG SMIL`、`Pixi.js`
- **`background_effects.type`**：`gradient-animation`、`noise-field`、`mesh-gradient`、`video-bg`、`generative-art`、`none`
- **`particle_systems.type`**：`floating-dots`、`confetti`、`snow`、`fireflies`、`connected-nodes`、`custom`
- **`particle_systems.params.interaction`**：`mouse-repel`、`mouse-attract`、`click-burst`、`none`
- **`3d_elements.type`**：`hero-model`、`product-viewer`、`scene-bg`、`text-extrusion`、`abstract-geometry`
- **`3d_elements.params.post_processing`**：例如 `["bloom", "FXAA", "depth-of-field", "chromatic-aberration"]`
- **`shader_effects.type`**：`noise-distortion`、`wave`、`morph`、`color-shift`、`custom-GLSL`
- **`shader_effects.params.noise_type`**：`perlin`、`simplex`、`worley`、`fbm`
- **`scroll_effects.parallax.layers`**：景深层数，例如 `3`
- **`scroll_effects.scroll_triggered_animations.animation_type`**：`fade-up`、`scale-in`、`clip-reveal`、`counter`、`draw-SVG`
- **`text_effects.type`**：`split-letter-animate`、`typewriter`、`glitch`、`gradient-fill`、`3d-extrude`、`none`
- **`text_effects.params.split_strategy`**：`by-char`、`by-word`、`by-line`
- **`cursor_effects.type`**：`custom-cursor`、`magnetic-buttons`、`spotlight`、`trail`、`none`
- **`image_effects.type`**：`hover-distortion`、`reveal-clip`、`parallax-tilt`、`rgb-shift`、`none`
- **`image_effects.params.distortion_type`**：`barrel`、`wave`、`liquid`、`glitch`
- **`glassmorphism_neumorphism.style`**：`glass`、`neumorphic-light`、`neumorphic-dark`、`frosted-layers`、`none`
- **`canvas_drawings.type`**：`generative-lines`、`interactive-blobs`、`data-visualization`、`pattern-fill`、`none`
- **`svg_animations.type`**：`path-draw`、`morph-shapes`、`logo-reveal`、`decorative-loop`、`none`
- **`composite_notes`**：自由描述多种效果如何叠加、性能取舍，以及结构化字段难以表达的观察结果
