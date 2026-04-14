---
name: media-processing-tinypng
description: 使用 TinyPNG API 压缩 png、jpg、jpeg、webp 图片，自动在 Git 根目录的 .specify/configs.json 中读取或保存 tinyPNGApiKey，并用压缩结果覆盖原图。
---

# 使用 TinyPNG 压缩图片

通过 TinyPNG API 压缩常见位图资源，并把 API Key 统一收敛到 Git 根目录下的 `.specify/configs.json`。这个技能只负责图片压缩，不负责上传、分发或决定业务目录结构，适合作为更大素材处理流程里的一个独立步骤。

## 适用场景

- 需要压缩 `.png`、`.jpg`、`.jpeg`、`.webp` 图片
- 需要在发布前先减小图片体积
- 需要把 TinyPNG API Key 持久化到仓库级配置
- 需要跨项目复用同一套图片压缩流程

## 使用规则

### 1. 先确认输入文件

- 确认本地图片路径
- 确认文件真实存在
- 确认格式属于 `.png`、`.jpg`、`.jpeg`、`.webp`

如果用户没有给路径，先询问，不要猜。

### 2. 明确 API Key 来源

脚本按下面顺序读取 TinyPNG API Key：

- 命令行第二个参数
- Git 根目录下 `.specify/configs.json` 里的 `tinyPNGApiKey`

如果用户本次传了新的 API Key，脚本会把它写回 `.specify/configs.json`，供后续复用。

### 3. 执行压缩脚本

压缩脚本位于当前技能目录的 [scripts/compress-image.js](scripts/compress-image.js)。

执行方式：

```bash
node scripts/compress-image.js <图片文件路径> [api-key]
```

脚本行为：

- 自动查找 Git 根目录
- 读写 Git 根目录下的 `.specify/configs.json`
- 从 `tinyPNGApiKey` 读取或保存 API Key
- 调用 TinyPNG 压缩图片
- 下载压缩结果并覆盖原图

### 4. 处理结果

成功时至少返回：

- 图片路径
- 原始大小
- 压缩后大小
- 压缩率

失败时优先按下面顺序排查：

- 文件是否存在
- 文件类型是否受支持
- TinyPNG API Key 是否已提供或已配置
- 网络是否可达
- TinyPNG API 返回了什么错误

## 通用约束

- 这个技能会覆盖原图，不保留备份
- 如果需要保留原图，先手动复制一份
- 不要把上传流程和压缩流程混在一起
- 需要批量处理时，也应先确认每张图是否允许被原地覆盖
