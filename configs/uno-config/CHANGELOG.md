# @klaaay/uno-config

## 2.4.0

### Minor Changes

- 升级 unocss 的版本依赖

## 2.3.1

### Patch Changes

- 添加 gap 的距离前缀 g-xs 和 gap-xs 等效

## 2.3.0

### Minor Changes

- 调整 esm 的打包

## 2.2.2

### Patch Changes

- 内部导出的 getKlayBaseConfig 的方法使用 klayUnoConfigPreset

## 2.2.1

### Patch Changes

- 修复 checkpoints 的配置

## 2.2.0

### Minor Changes

- 新增用于 uno.config.ts 配置的 getKlayBaseConfig 方法

## 2.1.3

### Patch Changes

- 类型定义调整

## 2.1.2

### Patch Changes

- 调整部分内置规则适配在不引入 uno-config 样式时候的 antd5 的 css 变量

## 2.1.1

### Patch Changes

- 修复部分变量命名

## 2.1.0

### Minor Changes

- 色值匹配 antd5 的 token 命名规范

## 2.0.0

### Major Changes

- 基于 antd5 的 token 规范

## 1.4.1

### Patch Changes

- 修正 commonTheme 的传入 ts 定义

## 1.4.0

### Minor Changes

- 内部代码组织形式调整
- theme 支持传入自定义主题色配置和自定义媒体查询断点配置
- 导出内部的 createUnoCssRules 方法便于项目的自定义原子 css 扩展

## 1.3.2

### Patch Changes

- 书写错误修复

## 1.3.1

### Patch Changes

- 导出自定义的 rules,thems 和 shortcuts,兼容自己加 uno.config.ts 的方案

## 1.3.0

### Minor Changes

- 合并 antd 的独立书写到 common

## 1.2.1

### Patch Changes

- 修复 css 变量语法

## 1.2.0

### Minor Changes

- 采用自定义 Presets 方式维护自定义逻辑

## 1.1.1

### Patch Changes

- 修复 rules 导出方法的非空定义

## 1.1.0

### Minor Changes

- 添加 antd 的自定义 rules

## 1.0.0

- 添加通用的自定义 unocss 配置方法
- 添加常用的 variable.css 变量
