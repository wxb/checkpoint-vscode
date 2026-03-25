# CheckpointX - VSCode 检查点插件

[![Version](https://img.shields.io/badge/version-4.0.0-blue.svg)](https://github.com/wxb/checkpoint-vscode)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![VS Code](https://img.shields.io/badge/VS%20Code-Extension-blue.svg)](https://code.visualstudio.com/)
[![Built with Trae](https://img.shields.io/badge/Built%20with-Trae-FF6B6B.svg)](https://trae.ai)

CheckpointX 是一个 VSCode 插件，用于在代码开发中实时记录需要上线前检查的事项。这些检查点以分支作为分类进行整理，并记录到项目的 `checkpoint.json` 文件中，方便在 CD 流水线中展示和追踪。

> 💡 **Vibe Coding**: 本插件借助 [Trae](https://trae.ai) 以 Vibe Coding 的模式开发完成，展示了 AI 辅助编程的高效与便捷。

## 功能特性

- 🎯 **快速标记**: 通过快捷键、右键菜单或命令面板快速添加检查点
- 🌿 **分支分类**: 自动识别 Git 分支，按分支组织检查点
- 👤 **标记人追踪**: 自动记录检查点创建者（基于 Git 配置）
- 🎨 **视觉提示**: 彩色标签显示在代码上方，直观醒目
- 📁 **团队协作**: 检查点数据存储在项目文件中，支持 Git 共享
- 🔄 **实时同步**: 自动检测 `checkpoint.json` 变化并更新显示
- 🌲 **独立侧边栏**: 在左侧活动栏新增 CheckpointX 独立面板，展示检查点树形结构
- 🔍 **快速跳转**: 点击树形视图中的检查点直接跳转到代码位置
- 🗑️ **批量管理**: 支持清空所有检查点
- 📝 **智能输入**: 输入框支持验证和覆盖确认，避免误操作
- 🚫 **重复检测**: 同一位置添加检查点时提示覆盖或取消
- ⚡ **性能优化**: 文件监听和刷新机制确保流畅体验

## 安装

### 从 VS Code 市场安装

1. 打开 VS Code
2. 点击左侧活动栏的扩展图标（或按 `Ctrl+Shift+X`）
3. 搜索 "CheckpointX"
4. 点击安装

### 本地安装（.vsix 文件）

```bash
# 下载 .vsix 文件后，在 VS Code 中执行
# Ctrl+Shift+P → 输入 "Install from VSIX" → 选择下载的文件
```

### 从源码安装

```bash
# 克隆仓库
git clone https://github.com/wxb/checkpoint-vscode.git
cd checkpoint-vscode

# 安装依赖
npm install

# 编译
npm run compile

# 按 F5 启动调试模式
```

## 使用方法

### 添加检查点

- **快捷键**: `Ctrl+Alt+P` (Mac: `Cmd+Ctrl+P`)
- **右键菜单**: 在编辑器中右键选择 "CheckpointX: 添加检查点"
- **命令面板**: `Ctrl+Shift+P` → 输入 "CheckpointX: 添加检查点"
- **侧边栏**: 点击 CheckpointX 面板标题栏的 ➕ 添加按钮

> 💡 **提示**: 如果当前位置已存在检查点，系统会提示是否覆盖。

### 查看所有检查点

- **活动栏**: 点击左侧活动栏的 CheckpointX 图标 🚩 打开独立面板
- **命令面板**: `Ctrl+Shift+P` → 输入 "CheckpointX: 查看所有检查点"
- 点击检查点可直接跳转到对应的代码位置

### 侧边栏操作

- **刷新**: 点击面板标题栏的 🔄 刷新按钮同步最新数据
- **添加**: 点击面板标题栏的 ➕ 添加按钮快速创建检查点
- **清空**: 点击面板标题栏的 🗑️ 清空按钮删除所有检查点
- **删除单个**: 右键点击检查点选择删除，或点击检查点右侧的删除图标
- **展开/折叠**: 点击分支名称可展开或折叠该分支下的检查点

### 跳转到检查点

- 在侧边栏中点击任意检查点，自动打开对应文件并定位到代码行
- 使用命令面板执行 "CheckpointX: 跳转到检查点"

### 移除检查点

- 鼠标悬停在代码中的检查点上，点击提示中的 "移除检查点" 链接
- 在 CheckpointX 侧边栏中右键点击检查点选择删除
- 使用命令面板执行 "CheckpointX: 移除检查点"

### 清空所有检查点

- 在侧边栏标题栏点击 🗑️ 清空按钮
- 使用命令面板执行 "CheckpointX: 清空所有检查点"
- ⚠️ **注意**: 此操作不可恢复，请谨慎使用

## 显示样式

检查点会在标记行的上方显示为虚行，格式如下：

```
    🎯 上线前检查价格计算逻辑是否正确 <feature/order-module> @wangxb
```

## 数据存储

检查点数据存储在项目根目录的 `checkpoint.json` 文件中：

```json
{
  "checkpoints": [
    {
      "id": "src/utils/helper.js:5:1712345690000",
      "filePath": "src/utils/helper.js",
      "line": 5,
      "message": "确认工具函数返回值类型",
      "branch": "main",
      "author": "wangxb",
      "createdAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

所有路径均使用相对路径，方便团队协作和版本控制。

## 配置选项

在 VSCode 设置中搜索 "CheckpointX" 可配置：

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `checkpointX.filename` | `checkpoint.json` | 检查点数据存储文件名 |
| `checkpointX.showInExplorer` | `true` | 在资源管理器中显示 CheckpointX 侧边栏 |

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+Alt+P` / `Cmd+Ctrl+P` | 添加检查点 |

## 命令列表

| 命令 | 命令 ID | 说明 |
|------|---------|------|
| CheckpointX: 添加检查点 | `checkpointX.addCheckpoint` | 在当前光标位置添加检查点 |
| CheckpointX: 移除检查点 | `checkpointX.removeCheckpoint` | 移除当前位置的检查点 |
| CheckpointX: 查看所有检查点 | `checkpointX.viewCheckpoints` | 打开侧边栏查看所有检查点 |
| CheckpointX: 跳转到检查点 | `checkpointX.jumpToCheckpoint` | 跳转到指定检查点位置 |
| CheckpointX: 刷新 | `checkpointX.refreshTree` | 刷新检查点列表 |
| CheckpointX: 清空所有检查点 | `checkpointX.clearAll` | 删除所有检查点 |

## 系统要求

- VS Code 版本 >= 1.74.0
- Git 已安装并配置

## 开发

```bash
# 安装依赖
npm install

# 编译
npm run compile

# 监视模式
npm run watch

# 打包
npm install -g @vscode/vsce
vsce package
```

## 更新日志

详见 [CHANGELOG.md](CHANGELOG.md)

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

[MIT](LICENSE) © 2026 Checkpoint Contributors
