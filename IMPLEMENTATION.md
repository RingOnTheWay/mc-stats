# 系统文件夹选择器实现说明

## 实现概述

已成功实现通过系统原生对话框选择服务器文件夹路径的功能。

## 技术方案

### 后端实现 (mc_stats_server.py)

1. **新增依赖**：
   - `tkinter` - Python 内置 GUI 库
   - `tkinter.filedialog` - 文件/文件夹选择对话框

2. **新增 API 接口**：
   - `GET /api/select_folder` - 打开系统文件夹选择对话框
   - 返回格式：`{"success": true, "path": "选择的路径"}`

3. **实现细节**：
   - 创建隐藏的 Tkinter 窗口（`root.withdraw()`）
   - 设置窗口置顶（`root.attributes('-topmost', True)`）
   - 调用 `filedialog.askdirectory()` 打开原生对话框
   - 用户选择后返回完整路径

### 前端实现 (index.html)

1. **selectFolder() 函数更新**：
   - 调用后端 `/api/select_folder` API
   - 成功时更新显示的路径和隐藏字段值
   - 失败时回退到手动输入模态框

2. **用户体验**：
   - 点击文件夹图标 → 打开系统对话框
   - 选择文件夹 → 自动填充路径
   - 取消或失败 → 显示手动输入框

## 使用方法

1. 启动服务器：
   ```bash
   python mc_stats_server.py
   ```

2. 打开浏览器访问：`http://localhost:5000`

3. 在"数据扫描"标签页点击文件夹图标

4. 在弹出的系统对话框中选择 Minecraft 服务器文件夹

## 优势

- ✅ 使用系统原生对话框，用户体验好
- ✅ 自动获取完整的文件系统路径
- ✅ 支持浏览和导航文件系统
- ✅ 失败时自动回退到手动输入
- ✅ 跨平台支持（Windows/Linux/macOS）

## 测试结果

- ✅ 服务器成功启动
- ✅ API 接口正常响应
- ✅ 文件夹选择对话框正常弹出
- ✅ 路径正确返回和显示

## 注意事项

- `tkinter` 是 Python 标准库，无需额外安装
- 在无图形界面的服务器环境中可能无法使用，会自动回退到手动输入
- Windows 路径会自动转换为正斜杠格式（`D:/path/to/folder`）
