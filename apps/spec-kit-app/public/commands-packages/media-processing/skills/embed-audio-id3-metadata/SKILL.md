---
name: embed-audio-id3-metadata
description: >-
  递归处理音乐库中的 MP3：内嵌封面（文件夹优先，其次网易云专辑图、iTunes 兜底）、ID3
  艺人/专辑/曲名/年份、以及歌词（优先网易云「平台词」lyricUser 为空）。含繁简双搜、接口重试与
  --passes 多遍扫描。适用于批量整理 MP3 元数据、补封面与歌词、或用户提到内嵌标签、ID3、USLT、
  专辑图、网易云歌词匹配等场景。当前脚本仅支持 MP3；m4a/FLAC 需另用 mutagen 其它模块扩展。
---

# MP3 内嵌元数据（封面 + ID3 + 歌词）

用本技能目录下的 Python 脚本，在指定根目录**递归**扫描所有 `.mp3`，写入：

- **封面** `APIC`：同目录常见封面文件名优先，否则按匹配到的网易云曲目取专辑图，再不行按艺人+专辑搜 iTunes 专辑封面。
- **文本标签** `TIT2` / `TPE1` / `TALB` / `TDRC`：从父文件夹名解析 `YYYY.艺人.专辑`（若匹配），曲名从文件名解析（`艺人 - 歌名.mp3` 或 `01. 歌名.mp3`），并处理 `&#39;` 等 HTML 实体。
- **歌词** `USLT`：网易云 LRC 转纯文本；**优先平台词**（响应中 `lyricUser` 为 `null`）。在多个候选曲目间按「录音室官方 > Live/混音官方 > 录音室用户词 > Live 用户词」分层（本地文件名已标明 remix/live 时不强制录音室优先）。

## 依赖

```bash
pip install mutagen zhconv
```

- `zhconv`：检索时追加**简体**查询，减少繁体歌名在网易云「搜不到」的情况。
- 需能访问公网（网易云、iTunes、图片 CDN）。

## 执行脚本

脚本路径：[scripts/embed_mp3_metadata.py](scripts/embed_mp3_metadata.py)

```bash
python3 scripts/embed_mp3_metadata.py <音乐库根目录> [--passes N]
```

- **`<音乐库根目录>`**：必填（或由环境变量 `MUSIC_EMBED_ROOT` 指定；若两者皆无则默认为脚本所在目录）。
- **`--passes N`**：连续完整扫描 **N** 遍，**建议 2～4**。网易云等在请求密集时会偶发返回空歌词/空 JSON，单遍可能残留 `no_lyrics`；多遍之间脚本会暂停约 2 秒以降低限流概率。

示例：

```bash
python3 scripts/embed_mp3_metadata.py "/path/to/music" --passes 3
```

日志每行形如：`相对路径 :: ok remote_cover lyrics_official`

- `lyrics_official`：平台词（无 `lyricUser`）
- `lyrics_fan`：仅匹配到用户上传词时的退路
- `no_lyrics`：该遍仍无可用词（可增大 `--passes` 或改日再跑）

## 多遍扫描与验收（沉淀约定）

1. **默认不要只跑一遍**：对上百首规模，至少 `--passes 2`；若日志末尾仍有多条 `no_lyrics`，再跑第 3、第 4 遍。
2. **脚本内部已有**：搜索/歌词 HTTP 重试、单文件内第二轮歌词匹配、曲目间 sleep、遍与遍之间 pause。
3. **验收**：将完整日志重定向到文件后统计：  
   `grep -c no_lyrics log.txt`  
   目标为 **0** 或接受「该平台无词」的少量残留。

详见 [references/runs-and-verification.md](references/runs-and-verification.md)。

## 代理与其他格式

- 未内置 HTTP 代理；若环境需要，由运行环境注入（如 `HTTPS_PROXY`），或自行改 `urllib` 行为。
- **m4a / FLAC**：本脚本未实现；扩展时需使用 `mutagen.mp4` / `mutagen.flac` 分别写入封面与歌词，可复用同一套网易云匹配逻辑。

## 合规与版权

元数据与歌词来自第三方接口与用户本地文件。批量使用前请确认符合当地法律与服务条款；脚本仅作本地标签整理工具。
