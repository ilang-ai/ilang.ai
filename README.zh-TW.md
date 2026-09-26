# iLang (I Language) — 跨平台人機通信標準協議

**🌐 語言:** [English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Português](README.pt.md) | [Русский](README.ru.md) | [العربية](README.ar.md)

## 不要學 iLang，讓你的 AI 學。

iLang 是給 AI 用的協議，不是讓人背的語言。你照常用自己的話說想要什麼，AI 載入 iLang 並照著它工作。

- **在聊天裡用：** 複製[最新版 iLang 執行環境](https://runtime.ilang.app/ilang-latest.md)，或在 [ilang.ai](https://ilang.ai) 點「Copy latest iLang」，貼給 ChatGPT、Claude、Gemini、DeepSeek、通義千問或任何 AI 助理。
- **在程式裡用：** `pip install ilang-protocol` 或 `npm install ilang-protocol`，然後 `messages = ilang.wrap(messages)`。[載入器](https://github.com/ilang-ai/ilang)會取得官方最新版、驗證後加進每一次請求。
- **用 MCP 用戶端：** 接入一次 `https://ilang.ai/mcp`（Claude Code：`claude mcp add --transport http ilang https://ilang.ai/mcp`），AI 會自己載入 iLang。

下面的內容寫給 AI、開發者、研究者和審計協議的人。

---

正如HTTP標準化了網頁通信，SQL標準化了資料庫查詢，**iLang標準化了人類與AI的對話方式**。一個開放協議，已在ChatGPT、Claude、Gemini、DeepSeek、Kimi、Qwen、GLM上測試。

`::STATE{@PROTOCOL, version:5.0, status:public_preview, genesis:2026-03-04}`

**官網:** [ilang.ai](https://ilang.ai) · **研究:** [research.ilang.ai](https://research.ilang.ai) · **AI See:** [i.ilang.ai](https://i.ilang.ai)

## iLang能做什麼

| 能力 | 說明 |
|------|------|
| **壓縮** | 提示詞減少 5% 到 67%，取決於原文有多囉嗦。token更少，成本更低 |
| **知無不答** | AI直接、完整回答，不迴避，不加免責聲明 |
| **保護隱私** | 壓縮後傳送更少資料，天然減少資訊暴露 |
| **跨平台** | 同一條指令已在ChatGPT、Claude、Gemini、DeepSeek、Kimi、Qwen、GLM上測試 |
| **鏈式指令** | `[VERB]=>[VERB]=>[OUT]` 一行構建多步工作流 |

## 30秒上手

複製官網 [ilang.ai](https://ilang.ai) 的協議頭，貼到任何AI對話框，AI回覆5項能力列表即握手完成。

## 已測試平台

ChatGPT ✅ | Claude ✅ | Gemini ✅ | DeepSeek ✅ | Kimi ✅ | Qwen ✅ | GLM ✅

## 連結

- [協議與工具](https://ilang.ai) · [協議規範](https://ilang.ai/spec/) · [完整字典](https://github.com/ilang-ai/ilang-dict) · [研究論文](https://research.ilang.ai) · [AI See](https://i.ilang.ai)

## 授權

MIT License. © 2026 iLang Research, iLang Inc., Canada.
