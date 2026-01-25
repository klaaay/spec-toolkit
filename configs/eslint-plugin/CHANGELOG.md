# @klaaay/eslint-plugin

## 1.6.4

### Patch Changes

- 如果返回是`<></>`或者 null 也算 JSX

## 1.6.3

### Patch Changes

- 依赖 minor 版本更新

## 1.6.2

### Patch Changes

- 修复 `require-useEffect-before-return` 规则：在 if 返回 JSX 的时候也判定此时 useEffect 在 JSX 返回的上部

## 1.6.1

### Patch Changes

- `react-func/max-lines-per-function` 的 `max` 默认调整为 `50`
- `klay/max-params-with-fixable` 支持关闭自动修复

## 1.6.0

### Minor Changes

- 升级依赖版本

## 1.5.5

### Patch Changes

- replace-px-with-named-sizes 规则提示词错误修复

## 1.5.4

### Patch Changes

- 完善 replace-px-with-named-sizes 规则使其匹配 py-[16px]、p-y-[16px]和 p-y-16px 的识别

## 1.5.3

### Patch Changes

- ast 解析报错修复

## 1.5.2

### Patch Changes

- 内置 styleMappings 修复

## 1.5.1

### Patch Changes

- 优化规则 replace-px-with-named-sizes 可以自定义传入 styleMappings 和内置的 object 数值调整

## 1.5.0

### Minor Changes

- 添加新规则 replace-px-with-named-sizes: 在原子类中使用预设的间距规范而不是使用具体的绝对距离

## 1.4.1

### Patch Changes

- three-params-be-object 规则添加异常兜底

## 1.4.0

### Minor Changes

- 添加规则 three-params-be-object

## 1.3.0

### Minor Changes

- 添加函数最多参数个数的规则

## 1.2.2

### Patch Changes

- 规则 require-useEffect-before-return 的特殊情况容错添加

## 1.2.1

### Patch Changes

- 调整 hasJSX 判断的复位逻辑

## 1.2.0

### Minor Changes

- 添加规则 no-export-default: 限制 export default 的使用

## 1.1.1

### Patch Changes

- 修复 require-useEffect-before-return 只支持单个 useEffect 的问题

## 1.1.0

### Minor Changes

- 添加规则 require-useEffect-before-return: useEffect 建议紧接着 JSX return

## 1.0.4

### Patch Changes

- uppercase-const: 获取 type 添加 optional chain

## 1.0.3

### Patch Changes

- uppercase-const: 去除不完善的自动修复逻辑

## 1.0.2

## 1.0.0

### Major Changes

- 添加 klay 的 eslint 插件，支持规则 uppercase-const：建议使用大写字母命名约定来命名具有数字或字符串值的常量
