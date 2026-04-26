#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Batch embed cover, artist/album/title, and lyrics into MP3 / M4A / FLAC under this tree."""

from __future__ import annotations

import argparse
import html
import json
import os
import re
import sys
import time
import warnings
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from mutagen.id3 import APIC, TALB, TDRC, TIT2, TPE1, USLT
from mutagen.mp3 import MP3
from mutagen.mp4 import MP4, MP4Cover
from mutagen.flac import FLAC, Picture

warnings.filterwarnings(
    "ignore",
    message=r".*pkg_resources is deprecated.*",
    category=UserWarning,
)

try:
    import zhconv
except ImportError:
    zhconv = None  # type: ignore[misc, assignment]


def resolve_music_root(cli_root: str | None) -> Path:
    env = (os.environ.get("MUSIC_EMBED_ROOT") or "").strip()
    if env:
        return Path(env).expanduser().resolve()
    if cli_root:
        return Path(cli_root).expanduser().resolve()
    return Path(__file__).resolve().parent
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
NETEASE_REFERER = "https://music.163.com/"

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
COVER_NAMES = (
    "cover",
    "folder",
    "front",
    "album",
    "artwork",
    "唱片封面",
    "封面",
)


def fetch_json(url: str, timeout: float = 25.0, retries: int = 2) -> dict:
    last_err: BaseException | None = None
    for attempt in range(retries + 1):
        req = urllib.request.Request(
            url,
            headers={"User-Agent": UA, "Referer": NETEASE_REFERER},
        )
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return json.loads(resp.read().decode("utf-8", errors="replace"))
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as e:
            last_err = e
            time.sleep(0.35 * (attempt + 1))
    assert last_err is not None
    raise last_err


def fetch_bytes(url: str, timeout: float = 30.0) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read()


def parse_album_dir(folder_name: str) -> dict:
    m = re.match(r"^(\d{4})\.(.+?)\.(.+)$", folder_name)
    if m:
        return {"year": m.group(1), "artist": m.group(2), "album": m.group(3)}
    return {"year": None, "artist": None, "album": folder_name}


def normalize_text(s: str) -> str:
    s = html.unescape(s).lower()
    s = re.sub(r"\s+", "", s)
    s = re.sub(r"[\(\)（）\[\]【】「」『』'\".,，。!！?？\-—_]", "", s)
    return s


def strip_track_prefix(title: str) -> str:
    return re.sub(r"^\d+\.\s*", "", title).strip()


def parse_track(filename: str, folder_meta: dict) -> tuple[str, str]:
    base = html.unescape(re.sub(r"\.(mp3|m4a|flac)$", "", filename, flags=re.I))
    if " - " in base:
        left, title = base.split(" - ", 1)
        artist = left.strip()
        return artist, title.strip()
    m = re.match(r"^\d+\.\s*(.+)$", base)
    if m:
        artist = folder_meta.get("artist") or ""
        return artist, m.group(1).strip()
    return folder_meta.get("artist") or "", base


def find_local_cover(dirpath: Path) -> Path | None:
    # Prefer known filenames
    for name in COVER_NAMES:
        for ext in IMAGE_EXTS:
            p = dirpath / f"{name}{ext}"
            if p.is_file():
                return p
    candidates: list[Path] = []
    for p in dirpath.iterdir():
        if not p.is_file():
            continue
        if p.suffix.lower() not in IMAGE_EXTS:
            continue
        candidates.append(p)
    if not candidates:
        return None
    candidates.sort(key=lambda x: -x.stat().st_size)
    return candidates[0]


def mime_for_path(p: Path) -> str:
    ext = p.suffix.lower()
    if ext in (".jpg", ".jpeg"):
        return "image/jpeg"
    if ext == ".png":
        return "image/png"
    if ext == ".webp":
        return "image/webp"
    return "image/jpeg"


def lrc_to_plain(lrc: str) -> str:
    lines_out = []
    for line in lrc.splitlines():
        line = re.sub(r"\[[^\]]+\]", "", line).strip()
        if line:
            lines_out.append(line)
    return "\n".join(lines_out)


def netease_search_songs(query: str, limit: int = 20) -> list[dict]:
    q = urllib.parse.quote(query)
    url = f"https://music.163.com/api/search/get/web?s={q}&type=1&offset=0&limit={limit}"
    data = fetch_json(url)
    return data.get("result", {}).get("songs") or []


def merge_search_hits(*lists: list[dict]) -> list[dict]:
    by_id: dict[int, dict] = {}
    for lst in lists:
        for h in lst:
            by_id[int(h["id"])] = h
    return list(by_id.values())


def search_variants_for_netease(q: str) -> list[str]:
    """网易云对繁体歌名常无结果，补充简体检索。"""
    q = q.strip()
    if not q:
        return []
    out = [q]
    if zhconv is not None:
        sc = zhconv.convert(q, "zh-cn").strip()
        if sc and sc != q:
            out.append(sc)
    return out


def netease_song_detail(song_ids: list[int]) -> list[dict]:
    payload = json.dumps([{"id": sid} for sid in song_ids])
    c = urllib.parse.quote(payload)
    url = f"https://music.163.com/api/v3/song/detail?c={c}"
    data = fetch_json(url)
    return data.get("songs") or []


def netease_lyric_bundle(song_id: int) -> tuple[str | None, bool]:
    """Return (lrc_text, is_official). Official when Netease has no lyricUser (平台词)."""
    url = f"https://music.163.com/api/song/lyric?id={song_id}&lv=1&kv=1&tv=-1"
    for attempt in range(3):
        data = fetch_json(url, retries=1)
        lrc = (data.get("lrc") or {}).get("lyric")
        if lrc and str(lrc).strip():
            official = data.get("lyricUser") is None
            return str(lrc), official
        time.sleep(0.28 * (attempt + 1))
    return None, False


def local_title_implies_variant(title: str) -> bool:
    t = html.unescape(title).lower()
    needles = (
        "remix",
        "mix",
        "live",
        "mashup",
        "interlude",
        "混音",
        "演唱會",
        "演唱会",
        "现场",
        "巡演",
        "翻唱",
        "cover",
        "version",
        "karaoke",
    )
    return any(n in title for n in needles) or any(n in t for n in ("remix", "live", "mashup", "interlude"))


def score_netease_hit(h: dict, artist: str, title: str, album: str) -> int:
    na = normalize_text(artist)
    nt = normalize_text(strip_track_prefix(title))
    nalb = normalize_text(album) if album else ""
    allow_variant = local_title_implies_variant(title)

    an = (h.get("artists") or [{}])[0].get("name") or ""
    an_n = normalize_text(an)
    name = h.get("name") or ""
    name_n = normalize_text(name)
    alb = (h.get("album") or {}).get("name") or ""
    alb_n = normalize_text(alb)

    s = 0
    if na and (na in an_n or an_n in na):
        s += 55
    if nt and name_n == nt:
        s += 55
    elif nt and (nt in name_n or name_n in nt):
        s += 38
    if nalb and (nalb in alb_n or alb_n in nalb):
        s += 45
    elif nalb and (nalb[:6] in alb_n or alb_n[:6] in nalb) and len(nalb) >= 6:
        s += 18

    low = name.lower()
    variant_penalty = 0
    if not allow_variant:
        bad = (
            "live",
            "remix",
            "mashup",
            "翻唱",
            "cover",
            "巡演",
            "现场",
            "混音",
            "karaoke",
            "instrumental",
        )
        for b in bad:
            if b in low or b in name:
                variant_penalty += 22
        if re.search(r"\([^)]*版[^)]*\)", name) and "版" not in album:
            variant_penalty += 12
    s -= variant_penalty

    if "伴奏" in name or "instrumental" in low:
        s -= 40
    return s


def rank_netease_hits(hits: list[dict], artist: str, title: str, album: str) -> list[dict]:
    if not hits:
        return []
    scored = [(score_netease_hit(h, artist, title, album), h) for h in hits]
    scored.sort(key=lambda x: x[0], reverse=True)
    return [h for _, h in scored]


def netease_hit_is_variant_recording(hit_name: str) -> bool:
    """Live / remix / 伴奏等，与录音室版区分。"""
    name = hit_name or ""
    low = name.lower()
    keys = (
        "live",
        "remix",
        "mashup",
        "现场",
        "巡演",
        "演唱會",
        "演唱会",
        "混音",
        "伴奏",
        "encore",
        "karaoke",
        "instrumental",
    )
    for k in keys:
        if k in low or k in name:
            return True
    return False


def pick_netease_track_for_lyrics(
    ranked_hits: list[dict],
    local_title: str,
    max_try: int = 22,
) -> tuple[int | None, str | None, str]:
    """
    在排序结果中取词：尽量「平台官方词」(lyricUser 为空)。
    非混音本地文件：录音室官方 > Live/混音官方 > 录音室用户词 > Live 用户词。
    本地为混音等：只看是否官方，其次按排序。
    """
    if not ranked_hits:
        return None, None, "none"

    allow_variant = local_title_implies_variant(local_title)
    best: tuple[int, int, int, str, bool] | None = None  # tier, idx, sid, lrc, official

    for idx, h in enumerate(ranked_hits[:max_try]):
        sid = int(h["id"])
        lrc, official = netease_lyric_bundle(sid)
        time.sleep(0.18)
        if not lrc:
            continue
        variant = netease_hit_is_variant_recording(h.get("name") or "")
        if allow_variant:
            tier = 0 if official else 1
        else:
            if official and not variant:
                tier = 0
            elif official and variant:
                tier = 1
            elif not official and not variant:
                tier = 2
            else:
                tier = 3
        cand = (tier, idx, sid, lrc, official)
        if best is None or cand[0] < best[0] or (cand[0] == best[0] and cand[1] < best[1]):
            best = cand

    if best is None:
        return None, None, "none"
    _, _, sid, lrc, official = best
    return sid, lrc, "official" if official else "fan"


def itunes_album_art_url(artist: str, album: str) -> bytes | None:
    if not album:
        return None
    term = f"{artist} {album}".strip()
    q = urllib.parse.quote(term)
    for country in ("tw", "hk", "us", "cn"):
        url = f"https://itunes.apple.com/search?term={q}&entity=album&limit=1&country={country}"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=20) as resp:
                data = json.loads(resp.read().decode("utf-8", errors="replace"))
            results = data.get("results") or []
            if not results:
                continue
            art = results[0].get("artworkUrl100") or ""
            if not art:
                continue
            art = re.sub(r"/\d+x\d+bb\.", "/600x600bb.", art)
            return fetch_bytes(art)
        except Exception:
            continue
    return None


def ensure_id3(audio: MP3) -> None:
    if audio.tags is None:
        audio.add_tags()


def apply_tags(
    path: Path,
    artist: str,
    title: str,
    album: str,
    year: str | None,
    cover_data: bytes | None,
    cover_mime: str,
    lyrics: str | None,
) -> None:
    audio = MP3(path)
    ensure_id3(audio)
    tags = audio.tags
    assert tags is not None

    tags.delall("APIC")
    tags.delall("USLT")

    tags["TIT2"] = TIT2(encoding=3, text=title)
    tags["TPE1"] = TPE1(encoding=3, text=artist)
    if album:
        tags["TALB"] = TALB(encoding=3, text=album)
    if year:
        tags["TDRC"] = TDRC(encoding=3, text=year)

    if cover_data:
        tags.add(
            APIC(
                encoding=3,
                mime=cover_mime,
                type=3,
                desc="Cover",
                data=cover_data,
            )
        )

    if lyrics and lyrics.strip():
        tags.add(
            USLT(
                encoding=3,
                lang="zho",
                desc="",
                text=lyrics.strip(),
            )
        )

    audio.save(v2_version=3)


def apply_tags_m4a(
    path: Path,
    artist: str,
    title: str,
    album: str,
    year: str | None,
    cover_data: bytes | None,
    cover_mime: str,
    lyrics: str | None,
) -> None:
    audio = MP4(path)
    if audio.tags is None:
        audio.add_tags()
    tags = audio.tags
    assert tags is not None

    tags["\xa9nam"] = [title]
    if artist.strip():
        tags["\xa9ART"] = [artist]
    else:
        cur = tags.get("\xa9ART")
        if not (cur and isinstance(cur, list) and str(cur[0]).strip()):
            alt = tags.get("aART")
            if alt and isinstance(alt, list) and str(alt[0]).strip():
                tags["\xa9ART"] = [str(alt[0])]
    if album:
        tags["\xa9alb"] = [album]
    else:
        tags.pop("\xa9alb", None)
    if year:
        tags["\xa9day"] = [year]
    else:
        tags.pop("\xa9day", None)

    if lyrics and lyrics.strip():
        tags["\xa9lyr"] = [lyrics.strip()]
    else:
        tags.pop("\xa9lyr", None)

    if cover_data:
        if cover_mime in ("image/jpeg", "image/jpg"):
            fmt = MP4Cover.FORMAT_JPEG
        elif cover_mime == "image/png":
            fmt = MP4Cover.FORMAT_PNG
        else:
            fmt = MP4Cover.FORMAT_JPEG
        tags["covr"] = [MP4Cover(cover_data, imageformat=fmt)]
    else:
        tags.pop("covr", None)

    audio.save()


def apply_tags_flac(
    path: Path,
    artist: str,
    title: str,
    album: str,
    year: str | None,
    cover_data: bytes | None,
    cover_mime: str,
    lyrics: str | None,
) -> None:
    audio = FLAC(path)
    audio.clear_pictures()
    if cover_data:
        pic = Picture()
        pic.type = 3
        pic.mime = cover_mime
        pic.desc = "Cover"
        pic.width = 0
        pic.height = 0
        pic.depth = 24
        pic.colors = 0
        pic.data = cover_data
        audio.add_picture(pic)

    audio["TITLE"] = [title]
    if artist.strip():
        audio["ARTIST"] = [artist]
    if album:
        audio["ALBUM"] = [album]
    elif "ALBUM" in audio:
        del audio["ALBUM"]
    if year:
        audio["DATE"] = [year]
    elif "DATE" in audio:
        del audio["DATE"]

    if lyrics and lyrics.strip():
        audio["UNSYNCEDLYRICS"] = [lyrics.strip()]
    elif "UNSYNCEDLYRICS" in audio:
        del audio["UNSYNCEDLYRICS"]

    audio.save()


def process_file(audio_path: Path, cache: dict) -> str:
    folder = audio_path.parent.name
    folder_meta = parse_album_dir(folder)
    artist, title = parse_track(audio_path.name, folder_meta)
    album = folder_meta.get("album") or folder
    year = folder_meta.get("year")
    ckey = f"album_art:{folder}:{album}"

    cover_data: bytes | None = None
    cover_mime = "image/jpeg"

    local = find_local_cover(audio_path.parent)
    if local:
        cover_data = local.read_bytes()
        cover_mime = mime_for_path(local)
    elif ckey in cache:
        cover_data, cover_mime = cache[ckey]

    lyrics_text: str | None = None
    lyric_kind = "none"

    search_artist = re.sub(r"[\.、]", " ", artist).strip()
    track = strip_track_prefix(title)
    query_a = f"{search_artist} {track}".strip()
    query_b = f"{query_a} {album}".strip() if album and album != folder else query_a
    hit_lists: list[list[dict]] = []
    for q in search_variants_for_netease(query_a):
        hit_lists.append(netease_search_songs(q))
        time.sleep(0.18)
    if query_b != query_a:
        for q in search_variants_for_netease(query_b):
            hit_lists.append(netease_search_songs(q))
            time.sleep(0.18)
    hits = merge_search_hits(*hit_lists) if hit_lists else []
    ranked = rank_netease_hits(hits, artist, title, album)
    netease_id, lrc_raw, lyric_kind = pick_netease_track_for_lyrics(ranked, title)
    if not lrc_raw and ranked:
        time.sleep(0.55)
        netease_id, lrc_raw, lyric_kind = pick_netease_track_for_lyrics(ranked, title)
    cover_sid = netease_id
    if cover_sid is None and ranked:
        cover_sid = int(ranked[0]["id"])

    if lrc_raw:
        lyrics_text = lrc_to_plain(lrc_raw)

    if cover_sid:
        details = netease_song_detail([cover_sid])
        time.sleep(0.16)
        if details:
            pic = (details[0].get("al") or {}).get("picUrl")
            if not cover_data and pic:
                cover_data = fetch_bytes(pic)
                cover_mime = "image/jpeg"
                cache[f"album_art:{folder}:{album}"] = (cover_data, cover_mime)

    if not cover_data:
        ckey = f"album_art:{folder}:{album}"
        if ckey in cache and cache[ckey][0]:
            cover_data, cover_mime = cache[ckey]
        else:
            blob = itunes_album_art_url(artist or "蔡依林", album)
            if blob:
                cover_data = blob
                cover_mime = "image/jpeg"
            cache[ckey] = (cover_data, cover_mime)

    tag_title = strip_track_prefix(title) if re.match(r"^\d+\.\s*", title) else title

    ext = audio_path.suffix.lower()
    if ext == ".mp3":
        apply_tags(
            audio_path,
            artist=artist,
            title=tag_title,
            album=album,
            year=year,
            cover_data=cover_data,
            cover_mime=cover_mime,
            lyrics=lyrics_text,
        )
    elif ext == ".m4a":
        apply_tags_m4a(
            audio_path,
            artist=artist,
            title=tag_title,
            album=album,
            year=year,
            cover_data=cover_data,
            cover_mime=cover_mime,
            lyrics=lyrics_text,
        )
    elif ext == ".flac":
        apply_tags_flac(
            audio_path,
            artist=artist,
            title=tag_title,
            album=album,
            year=year,
            cover_data=cover_data,
            cover_mime=cover_mime,
            lyrics=lyrics_text,
        )
    else:
        raise ValueError(f"不支持的格式: {ext}")

    parts = []
    parts.append("ok")
    if local:
        parts.append("local_cover")
    elif cover_data:
        parts.append("remote_cover")
    else:
        parts.append("no_cover")
    if lyrics_text:
        parts.append("lyrics_official" if lyric_kind == "official" else "lyrics_fan")
    else:
        parts.append("no_lyrics")
    return " ".join(parts)


def iter_audio_files(root: Path) -> list[Path]:
    out: list[Path] = []
    for p in root.rglob("*"):
        if not p.is_file():
            continue
        if p.suffix.lower() in (".mp3", ".m4a", ".flac"):
            out.append(p)
    return sorted(out)


def run_once(root: Path) -> int:
    files = iter_audio_files(root)
    if not files:
        print("No MP3, M4A or FLAC files under", root, file=sys.stderr)
        return 1

    cache: dict = {}
    errors: list[tuple[Path, str]] = []
    for i, p in enumerate(files, 1):
        try:
            status = process_file(p, cache)
            print(f"[{i}/{len(files)}] {p.relative_to(root)} :: {status}")
            time.sleep(0.05)
        except Exception as e:
            errors.append((p, str(e)))
            print(f"[{i}/{len(files)}] FAIL {p.relative_to(root)} :: {e}", file=sys.stderr)

    if errors:
        print(f"\nFailed: {len(errors)}", file=sys.stderr)
        for p, msg in errors[:20]:
            print(f"  {p}: {msg}", file=sys.stderr)
        return 2
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description="递归写入 MP3（ID3）、M4A（MP4 原子）、FLAC（Vorbis 注释 + Picture）内嵌封面、文本信息与歌词（网易云 + iTunes 兜底）。",
    )
    parser.add_argument(
        "root",
        nargs="?",
        default=None,
        help="音乐库根目录；省略则使用 MUSIC_EMBED_ROOT 环境变量或脚本所在目录",
    )
    parser.add_argument(
        "--passes",
        type=int,
        default=1,
        metavar="N",
        help="连续完整扫描遍数（建议 2～4），用于抵消网易云等接口偶发空返回",
    )
    args = parser.parse_args()
    root = resolve_music_root(args.root)
    if args.passes < 1:
        print("--passes must be >= 1", file=sys.stderr)
        return 1

    last_code = 0
    for n in range(args.passes):
        if args.passes > 1:
            print(f"\n=== Pass {n + 1}/{args.passes} (root={root}) ===\n", file=sys.stderr)
        code = run_once(root)
        last_code = max(last_code, code)
        if args.passes > 1 and n + 1 < args.passes:
            time.sleep(2.0)
    return last_code


if __name__ == "__main__":
    raise SystemExit(main())
