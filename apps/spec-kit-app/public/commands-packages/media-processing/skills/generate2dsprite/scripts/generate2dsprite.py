#!/usr/bin/env python3
"""构建精灵生图 prompt，并在本地后处理已生成的精灵表图。"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import random
import re
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image


ART_STYLE = (
    "原创数码怪兽生物，数码宝贝/宝可梦风格的像素画，"
    "粗描边、动感、适合战斗。不要可爱风，不要圆滚滚。"
    "身体为实色块填充。背景须为 100% 纯色平涂品红（#FF00FF），无渐变。"
    "画面中任何地方都不要出现文字、标签、单词或字母。"
)

CHAR_STYLE = (
    "16-bit RPG 大地图的俯视 2D 像素风。略俯视的 3/4 视角，能看到头顶、肩线与全身。"
    "块面清晰、深色描边、颜色饱和。角色约占格子的 60%，四周留边供引擎渲染。"
    "背景须为 100% 纯色平涂品红（#FF00FF），无渐变，角色下方不要投影。"
    "不要文字、标签、UI 或对话气泡。"
)

GRID_RULES = (
    "硬性规则："
    "1. 恰好 4 个等大象限（2×2）。"
    "2. 象限之间无边框、无线条、无框线。"
    "3. 不要文字或标签。"
    "4. 每个象限中角色至少占 80%，且四个象限尺寸一致。"
    "5. 象限之间仅以品红背景相连。"
)

GRID_RULES_4X4 = (
    "硬性规则："
    "1. 恰好 16 个等大格子，排成 4×4（4 行 4 列，每格宽高相同）。"
    "2. 格子之间无边框、无线条、无框线。"
    "3. 不要文字、标签、数字或箭头。"
    "4. 一致性至关重要：每个格子里的角色高度与宽度必须完全一致（同一边界框、同一像素尺度）。"
    "不要在格子之间放大缩小，也不要某些格子裁得更紧。从头到脚的可见高度在 16 格中须一致。"
    "5. 角色在格内水平垂直居中，约占格子的 60%，四边留等量品红边距。"
    "6. 格子之间仅以纯色品红（#FF00FF）背景相连。"
)

NPC_ROLES = {
    "starter": "经验丰富的导师，发放初始怪物，睿智而亲切",
    "shop": "商人或店主，围裙或工具腰带，柜台小道具",
    "healer": "治疗者或医护，柔和制服，治疗器具，姿态沉稳",
    "summoner": "神秘召唤者，召唤怪物，奥术或博弈气质",
    "sage": "年迈智者，长袍或大衣，手杖或水晶",
    "trainer": "劲敌训练家，自信有运动感，略带得意",
    "gym_leader": "道馆馆主或首领级训练家，服装鲜明，地区最强之一",
    "villager": "普通镇民，衣着朴素，肢体语言友善",
    "guard": "城市卫兵，制服或护甲，警觉站姿",
}

GENERIC_ASSET_MODES = [
    "single",
    "idle",
    "cast",
    "attack",
    "hurt",
    "combat",
    "walk",
    "run",
    "hover",
    "charge",
    "projectile",
    "impact",
    "explode",
    "death",
    "fx",
    "sheet",
]

TARGET_MODES = {
    "creature": ["single", "evolution", "idle", "combat", "walk", "actions"],
    "player": ["player", "player_walk", "player_sheet", "player_actions"],
    "npc": ["npc", "npc_walk"],
    "asset": GENERIC_ASSET_MODES,
}

GRID_SHAPES = {
    "evolution": (2, 2),
    "idle": (2, 2),
    "cast": (2, 3),
    "attack": (2, 2),
    "hurt": (2, 2),
    "combat": (2, 2),
    "actions": (2, 2),
    "walk": (2, 2),
    "run": (2, 2),
    "hover": (2, 2),
    "charge": (2, 2),
    "projectile": (1, 4),
    "impact": (2, 2),
    "explode": (2, 2),
    "death": (2, 3),
    "fx": (2, 2),
    "player_walk": (2, 2),
    "player_actions": (2, 2),
    "npc_walk": (2, 2),
    "player_sheet": (4, 4),
}

FRAME_LABELS = {
    "evolution": ["stage-1", "stage-2", "stage-3", "stage-4"],
    "idle": ["idle-1", "idle-2", "idle-3", "idle-4"],
    "cast": ["cast-1", "cast-2", "cast-3", "cast-4", "cast-5", "cast-6"],
    "attack": ["attack-1", "attack-2", "attack-3", "attack-4"],
    "hurt": ["hurt-1", "hurt-2", "hurt-3", "hurt-4"],
    "combat": ["attack-1", "attack-2", "hurt-1", "hurt-2"],
    "actions": ["idle-1", "idle-2", "attack", "hurt"],
    "walk": ["walk-1", "walk-2", "walk-3", "walk-4"],
    "run": ["run-1", "run-2", "run-3", "run-4"],
    "hover": ["hover-1", "hover-2", "hover-3", "hover-4"],
    "charge": ["charge-1", "charge-2", "charge-3", "charge-4"],
    "projectile": ["projectile-1", "projectile-2", "projectile-3", "projectile-4"],
    "impact": ["impact-1", "impact-2", "impact-3", "impact-4"],
    "explode": ["explode-1", "explode-2", "explode-3", "explode-4"],
    "death": ["death-1", "death-2", "death-3", "death-4", "death-5", "death-6"],
    "fx": ["fx-1", "fx-2", "fx-3", "fx-4"],
    "player_walk": ["walk-down-1", "walk-down-2", "walk-down-3", "walk-down-4"],
    "player_actions": ["idle", "walk", "attack", "hurt"],
    "npc_walk": ["walk-down-1", "walk-down-2", "walk-down-3", "walk-down-4"],
    "player_sheet": [
        "down-1",
        "down-2",
        "down-3",
        "down-4",
        "left-1",
        "left-2",
        "left-3",
        "left-4",
        "right-1",
        "right-2",
        "right-3",
        "right-4",
        "up-1",
        "up-2",
        "up-3",
        "up-4",
    ],
}

PROCESS_TARGETS = sorted(TARGET_MODES)

ARCHETYPES = {
    "beast": {"name": "猛兽进化", "path": "原始猛兽 → 顶级掠食者 → 神话巨兽"},
    "mecha": {"name": "机甲进化", "path": "有机体 → 赛博格 → 全机甲 → 机甲神格"},
    "elemental": {"name": "元素进化", "path": "实体生物 → 元素浸染 → 纯能量体"},
    "void": {"name": "虚空进化", "path": "暗影生物 → 扭曲恐怖 → 抽象宇宙存在"},
    "crystal": {"name": "晶簇进化", "path": "岩质生物 → 结晶体 → 几何神格"},
    "angelic": {"name": "圣翼进化", "path": "凡兽 → 圣战使者 → 神圣炽天使"},
    "parasite": {"name": "寄生进化", "path": "小型共生体 → 融合奇美拉 → 克系畸变"},
    "myth": {"name": "神话进化", "path": "凡兽 → 神话异兽 → 远古神祇"},
}

MORPH_AXES = {
    "posture": ["四足兽形", "双足人形", "漂浮", "抽象或无固定形体"],
    "material": ["血肉有机", "装甲板甲", "能量灌注", "纯光或纯能量"],
    "anatomy": ["紧凑四肢", "延展四肢带尾", "额外肢或翼", "气场取代部分躯体"],
}

SILHOUETTES = ["尖锐棱角", "厚重压迫", "修长蛇形", "异质几何"]
SURFACES = ["光滑有机", "装甲板片", "晶面折射", "能量脉络"]
VIBES = ["优雅迅捷", "粗暴沉重", "神秘幽暗", "圣洁威严"]


def stable_seed(target: str, mode: str, prompt: str, role: str) -> int:
    raw = f"{target}|{mode}|{prompt}|{role}".encode("utf-8")
    return int(hashlib.sha256(raw).hexdigest()[:8], 16)


def is_known_target_mode(target: str, mode: str) -> bool:
    return target in TARGET_MODES and mode in TARGET_MODES[target]


def ensure_valid_target_mode(target: str, mode: str) -> None:
    if target not in TARGET_MODES:
        raise ValueError(f"未知 target「{target}」。可用：{', '.join(sorted(TARGET_MODES))}")
    if mode not in TARGET_MODES[target]:
        allowed = ", ".join(TARGET_MODES[target])
        raise ValueError(f"target「{target}」下 mode「{mode}」无效。可用：{allowed}")


def build_evolution_descs(subject: str, rng: random.Random) -> dict[str, str]:
    arch_key = rng.choice(list(ARCHETYPES.keys()))
    arch = ARCHETYPES[arch_key]
    silhouette = rng.choice(SILHOUETTES)
    surface = rng.choice(SURFACES)
    vibe = rng.choice(VIBES)
    postures = MORPH_AXES["posture"]
    materials = MORPH_AXES["material"]
    anatomies = MORPH_AXES["anatomy"]

    design_rules = (
        f"进化原型：{arch['name']}（路线：{arch['path']}）。"
        f"设计关键词：{silhouette}剪影、{surface}表面、{vibe}气质。"
        "每一阶剪影、质感、姿态须明显不同，避免重复同一肢体结构或比例。"
    )

    return {
        "1-base": (
            f"第一阶段：基础形态。{subject}最清晰、最完整的第一形态。"
            f"姿态：{postures[0]}。材质：{materials[0]}。结构：{anatomies[0]}。"
            f"身份鲜明、剪影可读。{design_rules}"
        ),
        "2-risen": (
            f"第二阶段：成长形态。{subject}更具威胁的进阶版。"
            f"姿态：{postures[1]}，须与第一阶段明显不同。"
            f"材质：{materials[1]}。结构：{anatomies[1]}。"
            f"是重新设计，而非单纯放大。偏战斗专精。{design_rules}"
        ),
        "3-elite": (
            f"第三阶段：精英战形。{subject}的精英战斗形态。"
            f"姿态：{postures[2]}。材质：{materials[2]}。结构：{anatomies[2]}。"
            f"战场存在感强，设计进一步升级。{design_rules}"
        ),
        "4-mythic": (
            f"第四阶段：神话升华形态。{subject}的终局进化。"
            f"姿态：{postures[3]}。材质：{materials[3]}。结构：{anatomies[3]}。"
            f"抽象、宇宙感、近乎神格。{design_rules}"
        ),
    }


def build_prompt(target: str, mode: str, prompt: str, role: str | None = None, seed: int | None = None) -> tuple[str, int]:
    ensure_valid_target_mode(target, mode)
    role = role or ""
    if seed is None:
        seed = stable_seed(target, mode, prompt, role)
    rng = random.Random(seed)

    if target == "creature":
        if mode == "single":
            result = f"单张像素风生物精灵，居中，面朝右侧。{prompt}。{ART_STYLE}"
        elif mode == "evolution":
            descs = build_evolution_descs(prompt, rng)
            result = (
                f"一张 2×2 像素图，展示 {prompt} 的四个进化阶段。"
                f"左上象限：{descs['1-base']} "
                f"右上象限：{descs['2-risen']} "
                f"左下象限：{descs['3-elite']} "
                f"右下象限：{descs['4-mythic']} "
                f"四格使用同一套配色。{ART_STYLE} {GRID_RULES}"
            )
        elif mode == "idle":
            result = (
                f"同一只 {prompt} 的 2×2 像素风待机动画表。"
                "左上：中性待机，冷静但警觉。"
                "右上：轻微呼吸或火焰脉动，朝向不变。"
                "左下：重心或气场微调，仍能无缝循环。"
                "右下：回到第 1 帧前最强的待机强调。"
                f"同一生物、同一尺寸、同一朝向、四格同一调色板。{ART_STYLE} {GRID_RULES}"
            )
        elif mode == "combat":
            result = (
                f"同一只 {prompt} 的 2×2 像素风战斗表。"
                "左上：攻击蓄力，聚力。"
                "右上：攻击出手或释放，冲击感强。"
                "左下：受击瞬间反应。"
                "右下：受击后恢复站姿。"
                f"同一生物、同一尺寸、同一朝向、四格同一调色板。{ART_STYLE} {GRID_RULES}"
            )
        elif mode == "actions":
            result = (
                f"同一只 {prompt} 的 2×2 像素风四姿势表。"
                "左上：站立放松。"
                "右上：同姿势，张口，抬起一肢。"
                "左下：向右突进，猛烈攻击。"
                "右下：后仰闭眼，正在受伤。"
                f"同一角色、同一尺寸、面朝右侧。{ART_STYLE} {GRID_RULES}"
            )
        else:
            result = (
                f"同一只 {prompt} 的 2×2 像素风行走循环表。"
                "左上：向右走，右前肢在前。"
                "右上：向右走，四肢收于身下，步态中间帧。"
                "左下：向右走，左前肢在前。"
                "右下：向右走，四肢伸展，过渡姿势。"
                f"同一角色、同一尺寸、面朝右侧，仅腿部位置变化。{ART_STYLE} {GRID_RULES}"
            )
    elif target == "player":
        if mode == "player":
            result = (
                "俯视 RPG 主角单帧精灵。"
                f"角色：{prompt}。年轻冒险主角，英雄剪影清晰，服装主题鲜明。"
                "正面朝向镜头，待机站立，位于画幅中央，四周留大量品红边距。"
                f"{CHAR_STYLE}"
            )
        elif mode == "player_walk":
            result = (
                "俯视 RPG 主角行走循环的 2×2 像素表，所有帧均朝下（朝向镜头）。"
                f"角色：{prompt}。"
                "左上：中性站立，双脚并拢。"
                "右上：左脚向前迈步，右脚支撑。"
                "左下：再次中性站立，双脚并拢。"
                "右下：右脚向前迈步，左脚支撑。"
                "同一角色、同一服装、每格同一调色板。"
                f"仅手臂与腿摆动，头、躯干、装备保持不变。{CHAR_STYLE} {GRID_RULES}"
            )
        elif mode == "player_sheet":
            result = (
                "俯视 RPG 主角完整四向行走的 4×4 像素表。"
                f"角色：{prompt}。年轻冒险主角。"
                "表图布局（行=朝向，列=行走帧）："
                "第 1 行（最上）：朝下（朝向镜头，正脸完整可见）。"
                "第 2 行：朝左（左侧脸或侧视）。"
                "第 3 行：朝右（右侧脸或侧视，可与第 2 行镜像对应）。"
                "第 4 行（最下）：朝上（背对镜头，可见后脑）。"
                "第 1 列：中性站姿，双脚并拢。"
                "第 2 列：左脚向前。"
                "第 3 列：再次中性站姿，双脚并拢。"
                "第 4 列：右脚向前。"
                "每一格尺寸完全一致：头脚高度一致、肩宽一致、屏幕像素尺度一致。"
                "禁止缩放或裁切不一，仅姿势与朝向变化。"
                "16 格内同一角色身份、同一服装、同一调色板。"
                "头与躯干朝向须清楚表达每一行对应的面向。"
                f"{CHAR_STYLE} {GRID_RULES_4X4}"
            )
        else:
            result = (
                "俯视 RPG 主角四种状态的 2×2 像素表，全部朝下（朝向镜头）。"
                f"角色：{prompt}。"
                "左上：待机，中性站立，放松。"
                "右上：行走，迈步中间帧，一脚在前。"
                "左下：攻击，抬臂或武器或拳向前猛击。"
                "右下：受击，略被击退，痛苦表情。"
                f"同一角色身份、同一服装、每格同一尺寸。{CHAR_STYLE} {GRID_RULES}"
            )
    elif target == "npc":
        if role not in NPC_ROLES:
            allowed = ", ".join(sorted(NPC_ROLES))
            raise ValueError(f"target=npc 时必须提供 NPC role。可用：{allowed}")
        role_desc = NPC_ROLES[role]
        if mode == "npc":
            result = (
                "俯视 RPG 的 NPC 单帧精灵。"
                f"职能：{role_desc}。"
                f"外观细节：{prompt}。"
                "正面朝向镜头，待机站立。"
                "外观须让人一眼读出职能。"
                f"剪影与配色区分度高，避免与其他 NPC 混淆。{CHAR_STYLE}"
            )
        else:
            result = (
                "俯视 RPG NPC 行走循环的 2×2 像素表，所有帧朝下（朝向镜头）。"
                f"职能：{role_desc}。"
                f"外观细节：{prompt}。"
                "左上：中性站立，双脚并拢。"
                "右上：左脚向前。"
                "左下：再次中性站立。"
                "右下：右脚向前。"
                f"同一 NPC、同一服装、每格同一调色板。{CHAR_STYLE} {GRID_RULES}"
            )
    else:
        if mode == "single":
            result = (
                f"单张像素风资产精灵。主题：{prompt}。"
                "居中放置，四周留清晰品红边距。"
                "剪影可读、轮廓适合游戏，可通过品红色键导出透明底。"
                f"{ART_STYLE}"
            )
        else:
            rows, cols = GRID_SHAPES.get(mode, (2, 2))
            result = (
                f"同一件 {prompt} 的 {rows}×{cols} 像素风动画表。"
                "每一格同一资产身份，同一边界框与像素尺度，任何部分不得越格。"
                "动画须适合 2D 游戏精灵阅读，不要做成插画横幅。"
                f"{ART_STYLE}"
            )
    return result, seed


def remove_bg_magenta(img: Image.Image, threshold: int = 100, edge_threshold: int = 150) -> Image.Image:
    pixels = img.load()
    width, height = img.size

    def dist(r: int, g: int, b: int) -> float:
        return math.sqrt((r - 255) ** 2 + g**2 + (b - 255) ** 2)

    for x in range(width):
        for y in range(height):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            if dist(r, g, b) < threshold:
                pixels[x, y] = (0, 0, 0, 0)

    visited: set[tuple[int, int]] = set()
    queue: deque[tuple[int, int]] = deque()
    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if (x, y) in visited or x < 0 or x >= width or y < 0 or y >= height:
            continue
        visited.add((x, y))
        r, g, b, a = pixels[x, y]
        if a == 0:
            for dx in (-1, 0, 1):
                for dy in (-1, 0, 1):
                    if dx == 0 and dy == 0:
                        continue
                    if (x + dx, y + dy) not in visited:
                        queue.append((x + dx, y + dy))
        elif dist(r, g, b) < edge_threshold:
            pixels[x, y] = (0, 0, 0, 0)
            for dx in (-1, 0, 1):
                for dy in (-1, 0, 1):
                    if dx == 0 and dy == 0:
                        continue
                    if (x + dx, y + dy) not in visited:
                        queue.append((x + dx, y + dy))
    return img


def trim_border(img: Image.Image, px: int = 4) -> Image.Image:
    width, height = img.size
    if width > px * 2 and height > px * 2:
        return img.crop((px, px, width - px, height - px))
    return img


def clean_edges(img: Image.Image, depth: int = 3) -> Image.Image:
    pixels = img.load()
    width, height = img.size
    for d in range(depth):
        for x in range(width):
            for y in (d, height - 1 - d):
                if y < 0 or y >= height:
                    continue
                r, g, b, a = pixels[x, y]
                if a == 0:
                    continue
                if (r < 40 and g < 40 and b < 40) or math.sqrt((r - 255) ** 2 + g**2 + (b - 255) ** 2) < 150:
                    pixels[x, y] = (0, 0, 0, 0)
        for y in range(height):
            for x in (d, width - 1 - d):
                if x < 0 or x >= width:
                    continue
                r, g, b, a = pixels[x, y]
                if a == 0:
                    continue
                if (r < 40 and g < 40 and b < 40) or math.sqrt((r - 255) ** 2 + g**2 + (b - 255) ** 2) < 150:
                    pixels[x, y] = (0, 0, 0, 0)
    return img


def connected_components(img: Image.Image, min_area: int = 1) -> list[dict[str, object]]:
    alpha = img.getchannel("A")
    pixels = alpha.load()
    width, height = img.size
    visited = [[False] * width for _ in range(height)]
    components: list[dict[str, object]] = []

    for y in range(height):
        for x in range(width):
            if pixels[x, y] == 0 or visited[y][x]:
                continue
            queue: deque[tuple[int, int]] = deque([(x, y)])
            visited[y][x] = True
            area = 0
            min_x = max_x = x
            min_y = max_y = y
            touches_edge = x == 0 or y == 0 or x == width - 1 or y == height - 1

            while queue:
                cx, cy = queue.popleft()
                area += 1
                min_x = min(min_x, cx)
                min_y = min(min_y, cy)
                max_x = max(max_x, cx)
                max_y = max(max_y, cy)
                if cx == 0 or cy == 0 or cx == width - 1 or cy == height - 1:
                    touches_edge = True
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = cx + dx, cy + dy
                    if 0 <= nx < width and 0 <= ny < height and pixels[nx, ny] > 0 and not visited[ny][nx]:
                        visited[ny][nx] = True
                        queue.append((nx, ny))

            if area >= min_area:
                components.append(
                    {
                        "area": area,
                        "bbox": (min_x, min_y, max_x + 1, max_y + 1),
                        "touches_edge": touches_edge,
                    }
                )

    components.sort(key=lambda item: int(item["area"]), reverse=True)
    return components


def pad_bbox(bbox: tuple[int, int, int, int], padding: int, width: int, height: int) -> tuple[int, int, int, int]:
    x0, y0, x1, y1 = bbox
    return (
        max(0, x0 - padding),
        max(0, y0 - padding),
        min(width, x1 + padding),
        min(height, y1 + padding),
    )


def bbox_touches_edge(
    bbox: tuple[int, int, int, int] | None, width: int, height: int, margin: int = 0
) -> bool:
    if not bbox:
        return False
    x0, y0, x1, y1 = bbox
    return x0 <= margin or y0 <= margin or x1 >= width - margin or y1 >= height - margin


def center_single_sprite(img: Image.Image, size: int, threshold: int, edge_threshold: int) -> Image.Image:
    cleaned = remove_bg_magenta(img.convert("RGBA"), threshold, edge_threshold)
    bbox = cleaned.getbbox()
    if bbox:
        cleaned = cleaned.crop(bbox)
    width, height = cleaned.size
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    if width > 0 and height > 0:
        scale = min(size / width, size / height) * 0.9
        new_width = max(1, int(width * scale))
        new_height = max(1, int(height * scale))
        cleaned = cleaned.resize((new_width, new_height), Image.Resampling.LANCZOS)
        canvas.paste(cleaned, ((size - new_width) // 2, (size - new_height) // 2))
    return canvas


def split_grid(
    img: Image.Image,
    rows: int,
    cols: int,
    cell_size: int,
    threshold: int,
    edge_threshold: int,
    fit_scale: float = 0.85,
    trim_border_px: int = 4,
    edge_clean_depth: int = 3,
    align: str = "center",
    shared_scale: bool = False,
    component_mode: str = "all",
    component_padding: int = 0,
    min_component_area: int = 1,
    edge_touch_margin: int = 0,
) -> tuple[list[Image.Image], list[dict[str, object]]]:
    cleaned = remove_bg_magenta(img.convert("RGBA"), threshold, edge_threshold)
    width, height = cleaned.size
    cell_width, cell_height = width // cols, height // rows
    cropped_frames: list[Image.Image] = []
    frame_info: list[dict[str, object]] = []
    for row in range(rows):
        for col in range(cols):
            box = (col * cell_width, row * cell_height, (col + 1) * cell_width, (row + 1) * cell_height)
            frame = cleaned.crop(box)
            if trim_border_px > 0:
                frame = trim_border(frame, px=trim_border_px)
            if edge_clean_depth > 0:
                frame = clean_edges(frame, depth=edge_clean_depth)
            components = connected_components(frame, min_area=min_component_area)
            bbox = None
            selected_component = None
            if component_mode == "largest" and components:
                selected_component = components[0]
                bbox = pad_bbox(tuple(selected_component["bbox"]), component_padding, frame.width, frame.height)
            else:
                bbox = frame.getbbox()
            if bbox:
                frame = frame.crop(bbox)
            cropped_frames.append(frame)
            frame_info.append(
                {
                    "grid": [row, col],
                    "source_box": list(box),
                    "component_mode": component_mode,
                    "component_count": len(components),
                    "selected_component_area": int(selected_component["area"]) if selected_component else None,
                    "selected_component_bbox": list(selected_component["bbox"]) if selected_component else None,
                    "crop_bbox": list(bbox) if bbox else None,
                    "edge_touch": bbox_touches_edge(bbox, cell_width, cell_height, edge_touch_margin),
                }
            )

    common_scale = None
    if shared_scale:
        max_width = max((frame.size[0] for frame in cropped_frames), default=0)
        max_height = max((frame.size[1] for frame in cropped_frames), default=0)
        if max_width > 0 and max_height > 0:
            common_scale = min(cell_size / max_width, cell_size / max_height) * fit_scale

    frames: list[Image.Image] = []
    for index, frame in enumerate(cropped_frames):
        frame_width, frame_height = frame.size
        canvas = Image.new("RGBA", (cell_size, cell_size), (0, 0, 0, 0))
        if frame_width > 0 and frame_height > 0:
            scale = common_scale or (min(cell_size / frame_width, cell_size / frame_height) * fit_scale)
            new_width = max(1, int(frame_width * scale))
            new_height = max(1, int(frame_height * scale))
            frame = frame.resize((new_width, new_height), Image.Resampling.LANCZOS)
            paste_x = (cell_size - new_width) // 2
            if align in {"bottom", "feet"}:
                pad = max(0, int(cell_size * (1 - fit_scale) * 0.5))
                paste_y = cell_size - new_height - pad
            else:
                paste_y = (cell_size - new_height) // 2
            canvas.paste(frame, (paste_x, paste_y))
            frame_info[index]["output_size"] = [new_width, new_height]
            frame_info[index]["paste_position"] = [paste_x, paste_y]
        else:
            frame_info[index]["output_size"] = [0, 0]
            frame_info[index]["paste_position"] = [0, 0]
        frames.append(canvas)
    return frames, frame_info


def compose_sheet(frames: list[Image.Image], rows: int, cols: int, cell_size: int) -> Image.Image:
    canvas = Image.new("RGBA", (cols * cell_size, rows * cell_size), (0, 0, 0, 0))
    for index, frame in enumerate(frames):
        row, col = divmod(index, cols)
        canvas.paste(frame, (col * cell_size, row * cell_size), frame)
    return canvas


def save_transparent_gif(frames: list[Image.Image], out_path: Path, duration: int) -> None:
    if not frames:
        raise ValueError("没有可编码的帧。")

    key = (255, 0, 254)
    width, height = frames[0].size
    stacked = Image.new("RGB", (width, height * len(frames)), key)

    for index, frame in enumerate(frames):
        r, g, b, a = frame.split()
        hard_mask = a.point(lambda value: 255 if value >= 128 else 0)
        rgb = Image.merge("RGB", (r, g, b))
        stacked.paste(rgb, (0, index * height), hard_mask)

    paletted = stacked.convert("P", palette=Image.Palette.ADAPTIVE, colors=256, dither=Image.Dither.NONE)
    palette = list(paletted.getpalette() or [])
    while len(palette) < 256 * 3:
        palette.append(0)

    key_index = None
    for index in range(256):
        if palette[index * 3 : index * 3 + 3] == list(key):
            key_index = index
            break
    if key_index is None:
        best_distance = None
        best_index = 0
        for index in range(256):
            r, g, b = palette[index * 3], palette[index * 3 + 1], palette[index * 3 + 2]
            distance = (r - key[0]) ** 2 + (g - key[1]) ** 2 + (b - key[2]) ** 2
            if best_distance is None or distance < best_distance:
                best_distance = distance
                best_index = index
        key_index = best_index

    if key_index != 0:
        lut = np.arange(256, dtype=np.uint8)
        lut[0], lut[key_index] = key_index, 0
        arr = np.array(paletted)
        arr = lut[arr]
        paletted = Image.fromarray(arr, mode="P")
        for channel in range(3):
            zero_idx = channel
            key_idx = key_index * 3 + channel
            palette[zero_idx], palette[key_idx] = palette[key_idx], palette[zero_idx]
        paletted.putpalette(palette)

    out_frames = [
        paletted.crop((0, index * height, width, (index + 1) * height))
        for index in range(len(frames))
    ]
    out_frames[0].save(
        out_path,
        format="GIF",
        save_all=True,
        append_images=out_frames[1:],
        duration=duration,
        loop=0,
        disposal=2,
        transparency=0,
        background=0,
    )


def sanitize_slug(text: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", text.strip().lower()).strip("-")
    return slug or "sprite"


def cmd_list_options() -> None:
    print(
        json.dumps(
            {
                "targets": TARGET_MODES,
                "npc_roles": NPC_ROLES,
                "grid_shapes": GRID_SHAPES,
                "frame_labels": FRAME_LABELS,
                "processor": {
                    "component_mode": ["all", "largest"],
                    "align": ["center", "bottom", "feet"],
                },
            },
            indent=2,
        )
    )


def cmd_build_prompt(args: argparse.Namespace) -> None:
    prompt_text, seed = build_prompt(args.target, args.mode, args.prompt, args.role, args.seed)
    payload = {
        "target": args.target,
        "mode": args.mode,
        "prompt": args.prompt,
        "role": args.role or "",
        "seed": seed,
        "generated_prompt": prompt_text,
    }
    if args.write:
        args.write.parent.mkdir(parents=True, exist_ok=True)
        args.write.write_text(prompt_text, encoding="utf-8")
    if args.write_json:
        args.write_json.parent.mkdir(parents=True, exist_ok=True)
        args.write_json.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(prompt_text)


def cmd_process(args: argparse.Namespace) -> None:
    if args.target not in PROCESS_TARGETS:
        raise ValueError(f"未知 process target「{args.target}」。可用：{', '.join(PROCESS_TARGETS)}")
    out_dir = args.output_dir
    out_dir.mkdir(parents=True, exist_ok=True)

    raw = Image.open(args.input).convert("RGBA")
    metadata = {
        "target": args.target,
        "mode": args.mode,
        "prompt": args.prompt or "",
        "role": args.role or "",
        "input": str(args.input),
        "threshold": args.threshold,
        "edge_threshold": args.edge_threshold,
        "duration": args.duration,
    }

    has_custom_grid = args.rows is not None or args.cols is not None
    if has_custom_grid and (args.rows is None or args.cols is None):
        raise ValueError("自定义网格必须同时提供 --rows 与 --cols。")

    if has_custom_grid or args.mode in GRID_SHAPES:
        if has_custom_grid:
            rows, cols = args.rows, args.cols
        else:
            rows, cols = GRID_SHAPES[args.mode]
        cell_size = args.cell_size or (96 if (rows, cols) == (4, 4) else 128)
        raw.save(out_dir / "raw-sheet.png")
        cleaned = remove_bg_magenta(raw.copy(), args.threshold, args.edge_threshold)
        cleaned.save(out_dir / "raw-sheet-clean.png")

        frames, frame_qc = split_grid(
            raw,
            rows,
            cols,
            cell_size,
            args.threshold,
            args.edge_threshold,
            fit_scale=args.fit_scale,
            trim_border_px=args.trim_border,
            edge_clean_depth=args.edge_clean_depth,
            align=args.align,
            shared_scale=args.shared_scale,
            component_mode=args.component_mode,
            component_padding=args.component_padding,
            min_component_area=args.min_component_area,
            edge_touch_margin=args.edge_touch_margin,
        )
        if has_custom_grid:
            prefix = args.label_prefix or args.mode
            labels = [f"{prefix}-{index + 1}" for index in range(rows * cols)]
        else:
            labels = FRAME_LABELS[args.mode]
        for label, frame in zip(labels, frames):
            frame.save(out_dir / f"{label}.png")

        compose_sheet(frames, rows, cols, cell_size).save(out_dir / "sheet-transparent.png")

        if args.mode == "player_sheet" and not has_custom_grid and (rows, cols) == (4, 4):
            directions = ["down", "left", "right", "up"]
            for row_index, direction in enumerate(directions):
                row_frames = frames[row_index * cols : (row_index + 1) * cols]
                compose_sheet(row_frames, 1, cols, cell_size).save(out_dir / f"{direction}-strip.png")
                save_transparent_gif(row_frames, out_dir / f"{direction}.gif", args.duration)
            metadata["directions"] = directions
        else:
            save_transparent_gif(frames, out_dir / "animation.gif", args.duration)

        metadata["rows"] = rows
        metadata["cols"] = cols
        metadata["cell_size"] = cell_size
        metadata["fit_scale"] = args.fit_scale
        metadata["trim_border"] = args.trim_border
        metadata["edge_clean_depth"] = args.edge_clean_depth
        metadata["align"] = args.align
        metadata["shared_scale"] = args.shared_scale
        metadata["component_mode"] = args.component_mode
        metadata["component_padding"] = args.component_padding
        metadata["min_component_area"] = args.min_component_area
        metadata["edge_touch_margin"] = args.edge_touch_margin
        metadata["frame_labels"] = labels
        metadata["frames"] = frame_qc
        metadata["edge_touch_frames"] = [
            info["grid"] for info in frame_qc if bool(info.get("edge_touch"))
        ]
        if args.reject_edge_touch and metadata["edge_touch_frames"]:
            raise ValueError(f"有帧贴到格边：{metadata['edge_touch_frames']}")
    else:
        raw.save(out_dir / "raw.png")
        centered = center_single_sprite(raw, args.single_size, args.threshold, args.edge_threshold)
        centered.save(out_dir / "clean.png")
        metadata["single_size"] = args.single_size

    if args.prompt_file and args.prompt_file.exists():
        prompt_text = args.prompt_file.read_text(encoding="utf-8")
        (out_dir / "prompt-used.txt").write_text(prompt_text, encoding="utf-8")
    elif args.prompt:
        (out_dir / "prompt-used.txt").write_text(args.prompt, encoding="utf-8")

    (out_dir / "pipeline-meta.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    print(str(out_dir.resolve()))


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)

    subparsers.add_parser("list-options", help="打印支持的 target、mode 与 NPC role。")

    build_prompt_parser = subparsers.add_parser("build-prompt", help="构建用于生图的 prompt。")
    build_prompt_parser.add_argument("--target", required=True, choices=sorted(TARGET_MODES))
    build_prompt_parser.add_argument("--mode", required=True)
    build_prompt_parser.add_argument("--prompt", required=True)
    build_prompt_parser.add_argument("--role")
    build_prompt_parser.add_argument("--seed", type=int)
    build_prompt_parser.add_argument("--write", type=Path)
    build_prompt_parser.add_argument("--write-json", type=Path)

    process_parser = subparsers.add_parser("process", help="对已生成的精灵图做后处理。")
    process_parser.add_argument("--input", required=True, type=Path)
    process_parser.add_argument("--target", required=True, choices=PROCESS_TARGETS)
    process_parser.add_argument("--mode", required=True)
    process_parser.add_argument("--output-dir", required=True, type=Path)
    process_parser.add_argument("--role")
    process_parser.add_argument("--prompt")
    process_parser.add_argument("--prompt-file", type=Path)
    process_parser.add_argument("--threshold", type=int, default=100)
    process_parser.add_argument("--edge-threshold", type=int, default=150)
    process_parser.add_argument("--cell-size", type=int)
    process_parser.add_argument("--rows", type=int)
    process_parser.add_argument("--cols", type=int)
    process_parser.add_argument("--label-prefix")
    process_parser.add_argument("--fit-scale", type=float, default=0.85)
    process_parser.add_argument("--trim-border", type=int, default=4)
    process_parser.add_argument("--edge-clean-depth", type=int, default=3)
    process_parser.add_argument("--align", choices=["center", "bottom", "feet"], default="center")
    process_parser.add_argument("--shared-scale", action="store_true")
    process_parser.add_argument("--component-mode", choices=["all", "largest"], default="all")
    process_parser.add_argument("--component-padding", type=int, default=0)
    process_parser.add_argument("--min-component-area", type=int, default=1)
    process_parser.add_argument("--edge-touch-margin", type=int, default=0)
    process_parser.add_argument("--reject-edge-touch", action="store_true")
    process_parser.add_argument("--single-size", type=int, default=256)
    process_parser.add_argument("--duration", type=int, default=200)

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    if args.command == "list-options":
        cmd_list_options()
    elif args.command == "build-prompt":
        cmd_build_prompt(args)
    else:
        cmd_process(args)


if __name__ == "__main__":
    main()
