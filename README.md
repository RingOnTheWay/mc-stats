<div align="center">

# MC Stats - Minecraft 服务器数据统计

**基于 Flask + Chart.js 的 Minecraft 服务器数据统计面板**

[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.9+-blue?style=flat-square)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-lightgray?style=flat-square)](https://flask.palletsprojects.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.0+-orange?style=flat-square)](https://www.chartjs.org/)
[![Demo](https://img.shields.io/badge/Demo-Online-blue?style=flat-square)](https://ringontheway.github.io/mc-stats/)

<img src="assets/icon.png" alt="MC Stats" align="center" height="96" />

**中文 | [English](README-EN.md)**

⭐ 如果您喜欢这个项目，请在 GitHub 上给它一个 Star — 感谢支持！

[功能模块](#功能模块) • [快速开始](#快速开始) • [API 接口](#api-接口) • [技术栈](#技术栈) • [项目结构](#项目结构)

</div>

***

## 概述

MC Stats 是一个基于 Flask + Chart.js 的 Minecraft 服务器数据统计面板，支持本地数据扫描导入和静态页面部署两种模式。涵盖地图大小趋势、玩家统计、战斗统计、物品合成、物品拾取/丢弃/使用、活动统计等全方位数据可视化。

## 功能模块

### 仪表盘
- 📈 地图大小趋势图（主世界 / 下界 / 末地折线图）
- 👥 玩家统计图表（游戏时长、死亡次数、击杀怪物数）
- 🔍 多玩家筛选与对比，支持多选/取消，空选时自动显示全部

### 战斗统计
- ⚔️ 怪物击杀排行（按玩家筛选）
- 🛡️ 被怪物击杀排行
- 🏆 Top 10 怪物统计表（含怪物中文译名）

### 物品合成
- 🔨 物品合成统计（crafted/used 两类）
- 📊 按日期趋势的条形图 + Top 10 物品排行
- 👤 支持多玩家筛选对比

### 物品统计
- 📦 物品拾取/丢弃/使用统计（picked_up / dropped / used）
- 📈 按日期趋势图表 + Top 10 排行
- 👤 支持多玩家筛选对比

### 活动统计
- 🏃‍♂️ 11 类活动数据：跑步、走路、飞行、攀爬、游泳、骑马、乘船、鞘翅飞行、跳跃、跌落、击杀玩家
- 📊 按日期趋势的条形图，支持下钻到单项活动查看
- 👤 支持多玩家筛选对比

### 数据扫描（本地模式）
- 📂 单文件夹扫描：选择服务器备份文件夹 + 自定义日期
- 📁 批量导入：选择父文件夹，自动识别子文件夹中的日期并批量导入

### 数据管理（本地模式）
- 🗑️ 删除单日数据：Material You 风格下拉框选择日期
- 🧹 批量删除：Chips 风格多选组件，支持全选和逐个移除

## 快速开始

### 1. 初始化 UV 虚拟环境

```bash
uv init
uv add flask flask-cors
```

### 2. 启动本地服务器

```bash
uv run python mc_stats_server.py
```

访问 `http://localhost:5000` 即可使用全部功能（含数据扫描和数据管理）。

### 3. 导出数据并推送到 GitHub

```bash
uv run python scripts/export_data.py
git add data.json
git commit -m "更新数据"
git push origin main
```

### 4. 部署为静态页面（GitHub Pages）

在 GitHub 仓库 **Settings → Pages** 中启用 GitHub Pages（选择 main 分支）。

> 静态模式下，「数据扫描」和「数据管理」标签会自动隐藏，数据标签页（仪表盘 / 战斗 / 合成 / 物品 / 活动）均可正常使用。

## API 接口（本地模式）

| 方法 | 路径 | 说明 |
|:-----|:-----|:-----|
| GET | `/api/map_sizes` | 获取地图大小数据 |
| GET | `/api/player_stats?type=` | 获取玩家统计（详见下方 type 列表） |
| GET | `/api/battle_stats?category=` | 获取战斗统计（killed / killed_by） |
| GET | `/api/battle_stats/summary?category=` | 获取战斗统计汇总（Top 排行） |
| GET | `/api/craft_stats?category=` | 获取物品合成统计（crafted / used） |
| GET | `/api/item_stats?category=` | 获取物品统计（picked_up / dropped / used） |
| DELETE | `/api/delete_date` | 删除指定日期的所有数据 |
| DELETE | `/api/batch_delete` | 批量删除多个日期的数据 |
| GET | `/api/dates` | 获取所有已记录日期列表 |

**player_stats 支持的 type 参数：** `play_time`, `deaths`, `mob_kills`, `player_kills`, `jumps`, `distance_walked`, `sprint_one_cm`, `walk_one_cm`, `fly_one_cm`, `climb_one_cm`, `swim_one_cm`, `horse_one_cm`, `boat_one_cm`, `aviate_one_cm`, `fall_one_cm`

## 数据导出脚本

```bash
uv run python scripts/export_data.py
```

从 `mc_stats.db` 读取数据并导出为 `data.json`，包含以下部分：

- `map_sizes` — 地图尺寸（主世界 / 下界 / 末地，单位 MB）
- `player_stats` — 玩家全面统计（按 stat_type 组织，含时间/击杀/活动距离等 15 类）
- `battle_stats` — 战斗统计（怪物击杀 / 被怪物击杀）
- `craft_stats` — 物品合成/使用统计
- `item_stats` — 物品拾取/丢弃/使用统计

## 技术栈

| 组件 | 技术 |
|:-----|:----:|
| 前端 | 原生 HTML/CSS/JS + Chart.js 4 |
| 图标 | Google Material Icons |
| UI 风格 | Material You Design |
| 后端 | Python Flask + SQLite |
| 包管理 | uv (Python) |
| 部署 | Flask 本地服务器 + GitHub Pages |

## 项目结构

```
stat/
├── index.html              # 前端页面（Material You Design，所有功能于单一 HTML）
├── chart.js                # Chart.js 图表库
├── data.json               # 导出的静态统计数据（用于 GitHub Pages）
├── mc_stats.db             # SQLite 数据库（本地模式自动生成）
├── mc_stats_server.py      # Flask 后端服务
├── pyproject.toml          # UV 项目配置
├── uv.lock                 # UV 依赖锁定文件
├── .gitignore              # Git 忽略规则
├── scripts/
│   └── export_data.py      # 数据库 → JSON 数据导出脚本
├── README.md               # 项目说明（中文）
└── README-EN.md            # 项目说明（英文）
```

## 开发说明

- 前端自动检测运行模式：访问 `localhost:5000` 为本地服务器模式，否则为静态页面模式
- 本地模式自动从 API 加载数据，静态模式从 `data.json` 加载

## 特别鸣谢

- [Chart.js](https://www.chartjs.org/) - 强大的开源图表库，为本项目提供数据可视化支持

## 许可证

本项目采用 [MIT](https://opensource.org/licenses/MIT) 许可证。