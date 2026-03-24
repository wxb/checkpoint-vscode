# Changelog

All notable changes to the "checkpoint" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-24

### Added
- ✨ 初始版本发布
- 🎯 支持通过快捷键 `Ctrl+Alt+P` (Mac: `Cmd+Ctrl+P`) 快速添加检查点
- 📋 支持右键菜单添加检查点
- 🌿 自动识别 Git 分支并按分支组织检查点
- 👤 自动记录标记人（基于 Git 配置）
- 🎨 彩色标签显示：CHKPT（红底白字）、提示信息（灰色）、分支名（蓝色）、作者（金色）
- 📁 检查点数据存储在 `checkpoint.json` 文件中，支持 Git 共享
- 🔄 支持实时同步 `checkpoint.json` 变化
- 🔍 支持查看所有检查点并快速跳转
- ❌ 支持移除检查点

### Features
- 多色分段显示检查点信息，直观醒目
- 相对路径存储，支持团队协作
- 文件系统监听，实时更新显示
- 悬停提示显示完整检查点信息

### Technical
- 基于 VS Code Extension API 开发
- TypeScript 类型安全
- 模块化架构设计
