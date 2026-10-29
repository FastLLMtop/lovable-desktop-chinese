# Lovable macOS 桌面端深度汉化补丁 (Lovable Desktop Chinese)

[![GitHub Release](https://img.shields.io/badge/Release-v1.0.0-blue.svg)](https://github.com/FastLLMtop/lovable-desktop-chinese/releases)
[![Platform](https://img.shields.io/badge/Platform-macOS-lightgrey.svg)]()
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Powered by](https://img.shields.io/badge/Sponsored%20by-FastLLM.top-orange.svg)](https://fastllm.top)

专为 **Lovable macOS 官方桌面客户端**（`Lovable.app`）打造的纯净本地化汉化补丁。  
支持最新版 Lovable 桌面端（含本地 MCP、多标签页与偏好设置）。

---

> ### 🚀 本项目由 [FastLLM.top](https://fastllm.top) 倾力赞助与维护
> 
> **[FastLLM.top](https://fastllm.top) —— 专为 AI 开发者打造的高速大模型 API 聚合网关**
> * ⚡ **全球顶模一站直达**：聚合 Claude 3.7 / 3.5 Sonnet、GPT-4o、DeepSeek-R1、Gemini 2.5 等全系列旗舰模型。
> * 💻 **编程神器绝佳搭档**：极低延迟与企业级高并发通道，原生无缝适配 **Cursor、Cline、Claude Code、Aider** 及各类 AI Agent 自动化流。
> * 💎 **超高性价比**：支持官方格式无缝切换，灵活计费随充随用，告别账号被封与网络抖动烦恼！
> * 🔗 **立即体验**：[https://fastllm.top](https://fastllm.top)

---

## ✨ 汉化特性

* 🖥️ **macOS 系统级原生菜单汉化**：文件、编辑、视图、窗口、帮助、关于及偏好设置全面中文。
* 🧭 **工作区与导航栏深度中文化**：侧边栏、项目列表、工作区切换、用户中心、状态面板。
* ⚙️ **设置中心全覆盖**：当前 Mac 设备、本地 MCP 工具（Figma / Paper）、设备与应用（Telegram / Slack）、隐私与安全、偏好设置。
* 🛡️ **代码零污染保护**：内置代码过滤引擎，自动跳过 `<pre>`、`<code>`、Monaco 编辑器及代码编写区域，绝不破坏任何实际项目代码。
* 🔐 **原生重签与哈希同步**：自动化同步 ASAR 头部 SHA-256 完整性哈希，并通过 macOS 本地代码签名校验，杜绝“应用已损坏”弹窗。

---

## 🚀 极速安装

### 方法一：终端一键在线安装（推荐）

打开 macOS 终端（Terminal），直接运行以下命令：

```bash
curl -fsSL https://raw.githubusercontent.com/FastLLMtop/lovable-desktop-chinese/main/install.sh | bash
```

> 脚本会自动检测本地 Lovable、备份官方原版核心、注入汉化并自动重签名启动。

---

### 方法二：离线下载安装

1. 前往 [Releases 页面](https://github.com/FastLLMtop/lovable-desktop-chinese/releases/latest) 下载 `lovable-mac-chinese-patch.zip`。
2. 解压后进入文件夹，在终端中执行：
```bash
cd lovable-mac-chinese-patch
bash install.sh
```

---

## 🔄 一键恢复官方原版

如需还原为 Lovable 官方英文原版，在终端中运行：

```bash
curl -fsSL https://raw.githubusercontent.com/FastLLMtop/lovable-desktop-chinese/main/restore.sh | bash
```
或直接在本地目录执行：
```bash
bash restore.sh
```

---

## 🛠️ 自行编译与开源构建

本项目完全开源构建逻辑：

```bash
git clone https://github.com/FastLLMtop/lovable-desktop-chinese.git
cd lovable-desktop-chinese
# 提取官方原版并生成汉化包
node builder.js
```

---

## 📄 开源许可

本项目遵循 [MIT License](LICENSE) 开源协议。
Lovable 软件商标及相关版权归其各自所有者所有。
