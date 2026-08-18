Title: Live Content

Description: Fetched live

Source: https://raw.githubusercontent.com/emreturkmencom/antigravity-telegram-suite/main/README.md

---

<div align="center">

# 🤖 Antigravity Telegram Suite

**Works with both [Antigravity Standalone App](https://antigravity.google/)\* and [Antigravity IDE](https://antigravity.google/).**

🌍 Languages: [English](README.md) | [中文](README.zh.md) | [한국어](README.ko.md) | [Türkçe](README.tr.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Français](README.fr.md)

Control your Antigravity AI agent remotely via Telegram.
Send messages, switch AI models, manage workspaces, take screenshots, and run multi-agent workflows — all from your phone.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green.svg)](https://nodejs.org)
[![Platform](https://img.shields.io/badge/Platform-Linux%20%7C%20macOS%20%7C%20Windows-lightgrey.svg)]()
[![Version](https://img.shields.io/badge/Version-3.4.0-orange.svg)]()

\* *Some features may have limitations on the Standalone App. See [Known Issues](#-known-issues).*

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 💬 **Headless Chat** | Send messages directly to the AI agent via Telegram |
| 📎 **File & Image Upload** | Forward files/images to the agent with captions |
| 📸 **IDE Screenshots** | Capture and receive screenshots remotely |
| 🤖 **Model Switching** | Change AI models (Gemini, Claude, GPT) with inline buttons |
| 📂 **File Explorer** | Browse, navigate, and download project files |
| 🔄 **Workspace Management** | Switch between projects without touching the keyboard |
| 🪟 **Multi-Window Support** | Route commands to a specific IDE window when multiple are open |
| 👥 **Multi-User** | Share bot control with your team via comma-separated Chat IDs |
| 💬 **Thread Management** | List, switch, and manage chat threads (agent conversations) |
| ⚡ **Auto-Accept** | Automatically click Run, Accept, Allow, Continue buttons via a DOM MutationObserver |
| 🚀 **Turbo Mode** | Multi-agent orchestration: Claude plans → Gemini codes → Claude reviews → Gemini fixes |
| 🎯 **Goal Mode** | Autonomous long-running tasks — agent works until the goal is fully achieved |
| 📋 **Plan Mode** | Generate implementation plans before coding |
| 🔔 **Proactive Notifications** | TaskWatcher detects unsolicited agent messages (timers, sub-agents) and forwards to Telegram |
| 🤔 **Message Reactions** | Shows 🤔 while processing, clears when done |
| 🔄 **Auto-Update** | Check for updates and self-update with one command |
| 🌐 **Multi-Language** | 7 languages supported: English, Chinese, Korean, Turkish, German, Spanish, French |
| ⌨️ **Typing Indicator** | Shows "typing..." in Telegram while the agent is working |
| 🖥️ **Cross-Platform** | Works on Linux, macOS (Intel & Apple Silicon), and Windows |
| 🔀 **Dual App Support** | Seamlessly switch between Antigravity IDE and Standalone Agent App |

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [Antigravity IDE](https://antigravity.google/) and/or [Antigravity Standalone App](https://antigravity.google/) installed
- A Telegram bot token (get one from [@BotFather](https://t.me/BotFather))

### 1. Clone & Install

```bash
git clone https://github.com/emreturkmencom/antigravity-telegram-suite.git
cd antigravity-telegram-suite
npm install
```

### 2. Configure

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Telegram
BOT_TOKEN=your_telegram_bot_token
ALLOWED_CHAT_ID=your_chat_id,another_chat_id_optional

# CDP Debugging Ports (must match the --remote-debugging-port used when launching)
AGENT_CDP_PORT=9333    # Port for the Standalone Antigravity App
IDE_CDP_PORT=9334      # Port for the Antigravity IDE

# Default AI model to select on new chat
DEFAULT_MODEL=Gemini 3.1 Pro (High)

# Language: en | zh | ko | tr | de | es | fr
LANGUAGE=en

# Preferred app target: 'agent' (Standalone) or 'ide' (IDE)
ANTIGRAVITY_PREFERRED_APP=ide

# Enable auto-accept by default
AUTOACCEPT_DEFAULT=true
```

> 💡 Send `/start` to your bot to get your Chat ID.

### 3. Launch the App with CDP

The bot communicates with Antigravity via Chrome DevTools Protocol (CDP). You must launch the app with a debugging port.

**If running both apps side-by-side, use different ports:**

```bash
# --- Standalone Antigravity App ---
# Linux
antigravity --remote-debugging-port=9333

# macOS
open -a Antigravity --args --remote-debugging-port=9333

# Windows
Antigravity.exe --remote-debugging-port=9333
```

```bash
# --- Antigravity IDE ---
# Linux
antigravity-ide --remote-debugging-port=9334

# macOS
open -a "Antigravity IDE" --args --remote-debugging-port=9334

# Windows
"Antigravity IDE.exe" --remote-debugging-port=9334
```

> ⚠️ The port numbers must match `AGENT_CDP_PORT` and `IDE_CDP_PORT` in your `.env` file.

### 4. Start the Bot

```bash
npm start
```

For 24/7 operation with PM2:

```bash
npm install -g pm2
pm2 start src/index.js --name antigravity-bot
pm2 save
pm2 startup
```

### Automated Setup (Optional)

```bash
# Linux & macOS
bash scripts/install.sh

# Windows (PowerShell)
powershell -ExecutionPolicy Bypass -File scripts\install.ps1
```

---

## 📱 Commands

### Core Commands

| Command | Description |
|---|---|
| *(any text)* | Send directly to the AI agent |
| `/latest` | Get the latest agent response as text |
| `/screenshot` | Take a screenshot of the active agent window |
| `/status` | Show system status (IDE, CDP connection, Bot) |
| `/stop` | Stop the currently running agent |
| `/new` | Open a new chat session |

### AI Model & Agent

| Command | Description |
|---|---|
| `/model` | Switch AI model (Gemini, Claude, etc.) |
| `/turbo` | Toggle **Turbo Mode** — multi-agent orchestration (see below) |
| `/goal <task>` | Start **Goal Mode** — agent works autonomously until done |
| `/plan <task>` | Generate an **implementation plan** before coding |
| `/schedule_task <task>` | Schedule a recurring or one-time task in the IDE |
| `/agent

