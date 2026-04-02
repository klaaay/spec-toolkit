# PinchTab 安全与信任说明

**一句话**：PinchTab 是运行在本地、边界清晰的浏览器控制工具。不会回传数据、不会窃取凭据、不会外泄页面内容。源码公开；发行包在 GitHub 上构建并附带校验和。

## PinchTab 会做什么

- 在本地启动由你控制的 Chrome 进程
- 通过 HTTP 提供导航、点击、输入和页面检查能力
- 抽取页面的无障碍树（供 AI Agent 使用）
- 支持截图、导出 PDF 与执行 JavaScript

像 JS 执行、本地上传文件、直接写磁盘这类高风险能力，应视为**当前任务下明确授权**的操作，而不是默认工作流。

**以上全部在本地完成。** 没有遥测，除你主动访问的网站外，不会对外发起「产品侧」网络请求。

## PinchTab 不会做什么

- 不会读取 Chrome 已保存的密码/凭据（受 Chrome 沙箱等机制约束）
- 不会把数据偷偷传到远程服务器
- 不会注入广告、恶意代码或挖矿脚本
- 不会跟踪浏览行为或发送分析数据
- 不会修改系统文件；状态默认只落在 `~/.pinchtab` 等自有目录内

## 构建与校验

每个发行版都会在二进制旁提供 **校验和**：

```bash
# 下载后校验：
sha256sum -c checksums.txt
```

二进制由 GitHub Actions 根据打标签的提交自动构建（构建过程可在 https://github.com/pinchtab/pinchtab/actions 查看）。

## 开源信息

- **源码**：https://github.com/pinchtab/pinchtab（MIT）
- **发行版**：https://github.com/pinchtab/pinchtab/releases
- **当前示例版本**：v0.8.4（2026 年 3 月）

若仍有顾虑，可以直接审计源码——体积约 12MB，几乎无外部依赖，主体为标准库 Go 代码。

## VirusTotal 误报说明

PinchTab 在 VirusTotal 上可能被启发式引擎标红，常见原因包括：

- 会启动 Chrome（子进程执行——杀软启发式常标记）
- 会执行 JavaScript（类似 eval 的能力）
- 会提供 HTTP 服务（网络活动）

这些都是**产品设计内的能力**，不是安全缺陷。普通浏览器同样会做这三件事。

**开发工具被误报很常见。** VT 上对基于 chromedp 的工具（子进程 + HTTP 服务）出现误报是已知情况。运行前请始终对照 GitHub Releases 上的 SHA256 校验和核实。

若希望多一层保障，可使用 npm 包（`npm install -g pinchtab`）或官方 Docker 镜像，它们通常还会经过额外校验流程。

## 沙箱与隔离

PinchTab 会单独起一个 Chrome 进程，并具备：

- 独立的用户数据目录（默认 `~/.pinchtab`）
- 除非你主动打开 `file://` 等地址，否则不会随意访问用户主目录下的其他文件
- Chrome 常规安全模型（站点隔离、CSP 等）

若需指定浏览器状态存放位置，可通过 `profiles.baseDir`、`profiles.defaultProfile` 或环境变量 `PINCHTAB_CONFIG` 等进行配置。

## 安全公告简史

| CVE | 严重程度 | 影响版本 | 修复版本 | 涉及端点 |
| --- | --- | --- | --- | --- |
| [CVE-2026-30834](https://github.com/advisories/GHSA-rw8p-c6hf-q3pg) | 高（7.5） | < 0.7.7 | 0.7.7 | `/download` |

**类型**：服务端请求伪造（SSRF）——恶意构造的下载 URL 可能用于读取内网文件或探测内网。

**修复 PR**：[#135](https://github.com/pinchtab/pinchtab/pull/135)（SafePath 校验）、[#288](https://github.com/pinchtab/pinchtab/pull/288)（更严格的 URL 校验）。

**建议最低版本**：0.8.3 及以上（包含完整的 SSRF 加固）。

## 还有疑问？

- 源码：https://github.com/pinchtab/pinchtab
- Issue / 安全报告：https://github.com/pinchtab/pinchtab/issues
- 文档站点：https://pinchtab.com
