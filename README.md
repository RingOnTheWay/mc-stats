# MC Stats - Minecraft 服务器数据统计

静态页面版本，用于 GitHub Pages 托管。

## 快速开始

访问部署的网站即可查看仪表盘：
https://你的用户名.github.io/mc-stats/

## 本地开发

### 1. 安装依赖

```bash
pip install flask flask-cors
```

### 2. 启动本地服务器

```bash
python mc_stats_server.py
# 访问 http://localhost:5000
```

### 3. 导入数据后导出

```bash
# 使用 Web 界面扫描数据后
python scripts/export_data.py

# 推送到 GitHub
git add .
git commit -m "更新数据"
git push origin main
```

## 文件说明

| 文件 | 说明 |
|------|------|
| `index.html` | 静态页面（仪表盘） |
| `chart.js` | Chart.js 图表库 |
| `data.json` | 导出的统计数据 |
| `scripts/export_data.py` | 数据导出脚本 |

## 部署到 GitHub Pages

1. 将修改后的文件推送到 GitHub 仓库
2. 进入仓库 **Settings** → **Pages**
3. Source 选择 "Deploy from a branch"，选择 **main** 分支
4. 等待几分钟后访问你的 GitHub Pages URL

## 功能

- 📊 地图大小趋势（主世界、下界、末地）
- 👥 玩家统计（游戏时长、死亡次数、击杀数）
- 🔍 玩家筛选

## 静态版本说明

此版本为静态页面，移除了数据导入功能。
如需导入数据，请在本地运行 Flask 版本，完成后执行：

```bash
python scripts/export_data.py
git add data.json && git push
```