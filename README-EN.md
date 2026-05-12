<div align="center">

# MC Stats - Minecraft Server Data Statistics

**A Minecraft server data statistics panel based on Flask + Chart.js**

[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.9+-blue?style=flat-square)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-lightgray?style=flat-square)](https://flask.palletsprojects.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.0+-orange?style=flat-square)](https://www.chartjs.org/)
[![Demo](https://img.shields.io/badge/Demo-Online-blue?style=flat-square)](https://ringontheway.github.io/mc-stats/)

<img src="assets/icon.png" alt="MC Stats" align="center" height="96" />

**[简体中文](README.md) | English**

⭐ If you like this project, please give it a Star on GitHub — Thank you!

[Features](#features) • [Quick Start](#quick-start) • [API Endpoints](#api-endpoints) • [Tech Stack](#tech-stack) • [Project Structure](#project-structure)

</div>

***

## Overview

MC Stats is a Minecraft server data statistics panel based on Flask + Chart.js, supporting two modes: local data scanning import and static page deployment. It covers comprehensive data visualization including map size trends, player statistics, battle statistics, item crafting, item pickups/drops/usage, and player activity statistics.

## Features

### Dashboard
- 📈 Map size trends (Overworld / Nether / End line charts)
- 👥 Player statistics (play time, deaths, mob kills)
- 🔍 Multi-player filtering and comparison, auto-show-all when none selected

### Battle Statistics
- ⚔️ Mob kill ranking (filtered by player)
- 🛡️ Killed by mob ranking
- 🏆 Top 10 mob statistics (with Chinese translations)

### Item Crafting
- 🔨 Crafting statistics (crafted / used categories)
- 📊 Date trend bar chart + Top 10 items ranking
- 👤 Multi-player filtering support

### Item Statistics
- 📦 Item pickups / drops / usage (picked_up / dropped / used)
- 📈 Date trend chart + Top 10 ranking
- 👤 Multi-player filtering support

### Activity Statistics
- 🏃‍♂️ 11 activity types: sprint, walk, fly, climb, swim, horse, boat, aviate, jump, fall, player kills
- 📊 Date trend bar chart with drill-down to individual activities
- 👤 Multi-player filtering support

### Data Scanning (Local Mode)
- 📂 Single folder scan: select server backup folder + custom date
- 📁 Batch import: select parent folder, auto-detect dates in subfolders

### Data Management (Local Mode)
- 🗑️ Delete single day data: Material You style dropdown date selection
- 🧹 Batch delete: Chips style multi-select component with select all/remove individual

## Quick Start

### 1. Initialize UV Virtual Environment

```bash
uv init
uv add flask flask-cors
```

### 2. Start Local Server

```bash
uv run python mc_stats_server.py
```

Access `http://localhost:5000` to use all features (including data scanning and management).

### 3. Export Data and Push to GitHub

```bash
uv run python scripts/export_data.py
git add data.json
git commit -m "Update data"
git push origin main
```

### 4. Deploy as Static Page (GitHub Pages)

Enable GitHub Pages in your repository's **Settings → Pages** (select main branch).

> In static mode, "Data Scanning" and "Data Management" tabs are automatically hidden. All data tabs (Dashboard / Battle / Craft / Items / Activity) work normally.

## API Endpoints (Local Mode)

| Method | Path | Description |
|:-------|:-----|:------------|
| GET | `/api/map_sizes` | Get map size data |
| GET | `/api/player_stats?type=` | Get player stats (see type list below) |
| GET | `/api/battle_stats?category=` | Get battle stats (killed / killed_by) |
| GET | `/api/battle_stats/summary?category=` | Get battle stats summary (Top ranking) |
| GET | `/api/craft_stats?category=` | Get crafting stats (crafted / used) |
| GET | `/api/item_stats?category=` | Get item stats (picked_up / dropped / used) |
| DELETE | `/api/delete_date` | Delete all data for specified date |
| DELETE | `/api/batch_delete` | Batch delete data for multiple dates |
| GET | `/api/dates` | Get all recorded dates |

**player_stats supported type values:** `play_time`, `deaths`, `mob_kills`, `player_kills`, `jumps`, `distance_walked`, `sprint_one_cm`, `walk_one_cm`, `fly_one_cm`, `climb_one_cm`, `swim_one_cm`, `horse_one_cm`, `boat_one_cm`, `aviate_one_cm`, `fall_one_cm`

## Data Export Script

```bash
uv run python scripts/export_data.py
```

Reads from `mc_stats.db` and exports to `data.json`, containing the following parts:

- `map_sizes` — Map sizes (Overworld / Nether / End, unit: MB)
- `player_stats` — Comprehensive player statistics (organized by stat_type, covering 15 categories including time/kills/activity distance)
- `battle_stats` — Battle statistics (mob kills / killed by mobs)
- `craft_stats` — Item crafting/usage statistics
- `item_stats` — Item pickups/drops/usage statistics

## Tech Stack

| Component | Technology |
|:----------|:----------:|
| Frontend | Native HTML/CSS/JS + Chart.js 4 |
| Icons | Google Material Icons |
| UI Style | Material You Design |
| Backend | Python Flask + SQLite |
| Package Manager | uv (Python) |
| Deployment | Flask local server + GitHub Pages |

## Project Structure

```
stat/
├── index.html              # Frontend page (Material You Design, all-in-one HTML)
├── chart.js                # Chart.js library
├── data.json               # Exported static statistics (for GitHub Pages)
├── mc_stats.db             # SQLite database (auto-generated in local mode)
├── mc_stats_server.py      # Flask backend server
├── pyproject.toml          # UV project configuration
├── uv.lock                 # UV dependency lock file
├── .gitignore              # Git ignore rules
├── scripts/
│   └── export_data.py      # Database → JSON export script
├── README.md               # Documentation (Chinese)
└── README-EN.md            # Documentation (English)
```

## Development Notes

- Frontend automatically detects running mode: `localhost:5000` for local server mode, otherwise static page mode
- Local mode loads data from API automatically, static mode loads from `data.json`
- Navigation is disabled during data loading to prevent async race conditions
- Server scans Minecraft stats from `stats/` directory, auto-parsing `minecraft:custom`, `minecraft:killed`, `minecraft:crafted`, `minecraft:used`, `minecraft:picked_up`, `minecraft:dropped` statistic types
- Item Chinese translation map (itemNameMap) is built into `index.html`, covering 930+ Minecraft items/entities with official Chinese names
- Local development files like `mc_stats_server.py`, `mc_stats.db` are excluded in `.gitignore`

## Acknowledgments

- [Chart.js](https://www.chartjs.org/) - Powerful open-source chart library providing data visualization support

## License

This project is licensed under the [MIT](https://opensource.org/licenses/MIT) license.