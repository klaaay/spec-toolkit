# @klaaay/eslint-config

## 2.8.5

### Patch Changes

- Updated dependencies
  - @klaaay/eslint-plugin@1.6.4

## 2.8.4

### Patch Changes

- 依赖 minor 版本更新
- Updated dependencies
  - @klaaay/eslint-plugin@1.6.3

## 2.8.3

### Patch Changes

- 调整 no-restricted-imports 的报错等级为 warn

## 2.8.1

### Patch Changes

- 依赖升级

## 2.8.0

### Patch Changes

- Updated dependencies
  - @klaaay/eslint-plugin@1.6.2

## 2.8.0

### Minor Changes

- 相关依赖更新
  - eslint-plugin-react-hooks 升级到 5.x 支持 eslint9
  - eslint-plugin-unused-imports 升级到 4.1.x 支持 eslint9

## 2.7.0

### Minor Changes

- 添加 [eslint-plugin-react-web-api](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-web-api) 的集成

## 2.6.1

### Patch Changes

- `react-func/max-lines-per-function` 的 `max` 默认调整为 `50`
- `klay/max-params-with-fixable` 支持关闭自动修复
- Updated dependencies
  - @klaaay/eslint-plugin@1.6.1

## 2.6.0

### Minor Changes

- 添加 [eslint-plugin-command](https://eslint-plugin-command.antfu.me/) 的集成

## 2.5.0

### Minor Changes

- 升级依赖版本

### Patch Changes

- Updated dependencies
  - @klaaay/eslint-plugin@1.6.0

## 2.4.7

### Patch Changes

- eslint-plugin-react-hooks 添加 fixupPluginRules 工具包修复方法

## 2.4.6

### Patch Changes

- 支持传入自定义 settings 配置

## 2.4.5

### Patch Changes

- replace-px-with-named-sizes 规则提示词错误修复
- Updated dependencies
  - @klaaay/eslint-plugin@1.5.5

## 2.4.4

### Patch Changes

- Updated dependencies
  - @klaaay/eslint-plugin@1.5.4

## 2.4.3

### Patch Changes

- ast 解析报错修复
- Updated dependencies
  - @klaaay/eslint-plugin@1.5.3

## 2.4.2

### Patch Changes

- 内置 styleMappings 修复
- Updated dependencies
  - @klaaay/eslint-plugin@1.5.2

## 2.4.1

### Patch Changes

- 优化规则 replace-px-with-named-sizes 可以自定义传入 styleMappings 和内置的 object 数值调整
- Updated dependencies
  - @klaaay/eslint-plugin@1.5.1

## 2.4.0

### Minor Changes

- 添加新规则 replace-px-with-named-sizes: 在原子类中使用预设的间距规范而不是使用具体的绝对距离

### Patch Changes

- Updated dependencies
  - @klaaay/eslint-plugin@1.5.0

## 2.3.0

### Minor Changes

- 升级 eslint 到 9 & ts 解析器到 7

## 2.2.1

### Patch Changes

- three-params-be-object 规则添加异常兜底
- Updated dependencies
  - @klaaay/eslint-plugin@1.4.1

## 2.2.0

### Minor Changes

- 添加规则 three-params-be-object

### Patch Changes

- Updated dependencies
  - @klaaay/eslint-plugin@1.4.0

## 2.1.1

### Patch Changes

- React 分组也接受自定义传入 plugins 和 rules

## 2.1.0

### Minor Changes

- 支持自定义 plugin 和 rules 和导出调整

## 2.0.1

### Patch Changes

- ts 定义命名调整
- 开启 jsx-a11y/anchor-is-valid 为 warn

## 2.0.0

### Major Changes

- 调整为 eslint flat 的实现

## 1.3.0

### Minor Changes

- 添加函数最多参数个数的规则

### Patch Changes

- Updated dependencies
  - @klaaay/eslint-plugin@1.3.0

## 1.2.2

### Patch Changes

- 规则 require-useEffect-before-return 的特殊情况容错添加
- Updated dependencies
  - @klaaay/eslint-plugin@1.2.2

## 1.2.1

### Patch Changes

- 调整 hasJSX 判断的复位逻辑
- Updated dependencies
  - @klaaay/eslint-plugin@1.2.1

## 1.2.0

### Minor Changes

- 添加规则 no-export-default: 限制 export default 的使用

- Updated dependencies
  - @klaaay/eslint-plugin@1.2.0

## 1.1.1

### Patch Changes

- 修复 require-useEffect-before-return 只支持单个 useEffect 的问题
- Updated dependencies
  - @klaaay/eslint-plugin@1.1.1

## 1.1.0

### Minor Changes

- 添加规则 require-useEffect-before-return: useEffect 建议紧接着 JSX return

- Updated dependencies
  - @klaaay/eslint-plugin@1.1.0

## 1.0.0

### Major Changes

- 添加 klay 自定义 eslint 规则集
