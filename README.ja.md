# iLang (I Language) — クロスプラットフォーム人間-AI通信標準プロトコル

**🌐 言語:** [English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Português](README.pt.md) | [Русский](README.ru.md) | [العربية](README.ar.md)

## iLang を学ぶ必要はありません。学ぶのはあなたの AI です。

iLang は AI のためのプロトコルで、人が覚える言語ではありません。あなたはいつもどおり自分の言葉で望みを伝え、AI が iLang を読み込んで、それに従って動きます。

- **チャットで使う：** [最新の iLang ランタイム](https://runtime.ilang.app/ilang-latest.md)をコピーするか、[ilang.ai](https://ilang.ai) の「Copy latest iLang」を押して、ChatGPT、Claude、Gemini、DeepSeek、Qwen などに貼り付けます。
- **コードで使う：** `pip install ilang-protocol` または `npm install ilang-protocol` のあと、 `messages = ilang.wrap(messages)`。[ローダー](https://github.com/ilang-ai/ilang)が公式の最新版を取得・検証し、毎回のリクエストに加えます。
- **MCP クライアントで使う：** `https://ilang.ai/mcp` を一度つなげば（Claude Code：`claude mcp add --transport http ilang https://ilang.ai/mcp`）、AI が自分で iLang を読み込みます。

以下は、AI、開発者、研究者、そしてプロトコルを監査する人のための内容です。

---

HTTPがWeb通信を標準化し、SQLがデータベースクエリを標準化したように、**iLangは人間とAIの対話を標準化します**。1つのオープンプロトコルで、ChatGPT、Claude、Gemini、DeepSeek、Kimi、Qwen、GLMでテスト済みです。

`::STATE{@PROTOCOL, version:5.0, status:public_preview, genesis:2026-03-04}`

**公式サイト:** [ilang.ai](https://ilang.ai) · **研究:** [research.ilang.ai](https://research.ilang.ai) · **AI See:** [i.ilang.ai](https://i.ilang.ai)

## iLangでできること

| 機能 | 説明 |
|------|------|
| **圧縮** | プロンプトを 5% から 67% 削減。トークンとコストを削減 |
| **すべてに回答** | AIが直接的に、完全に、免責事項なしで回答 |
| **プライバシー保護** | 圧縮テキストはAIサーバーへの送信データを減少 |
| **クロスプラットフォーム** | 1つの命令をChatGPT、Claude、Gemini、DeepSeek、Kimi、Qwen、GLMでテスト済み |
| **チェーンコマンド** | `[VERB]=>[VERB]=>[OUT]` 1行でマルチステップワークフロー |

## 30秒で開始

[ilang.ai](https://ilang.ai) からプロトコルヘッダーをコピーし、任意のAI会話に貼り付けてください。AIが5つの機能リストで応答すればハンドシェイク完了です。

## テスト済み対応プラットフォーム

ChatGPT ✅ | Claude ✅ | Gemini ✅ | DeepSeek ✅ | Kimi ✅ | Qwen ✅ | GLM ✅

## リンク

- [プロトコル＆ツール](https://ilang.ai) · [仕様書](https://ilang.ai/spec/) · [完全辞書](https://github.com/ilang-ai/ilang-dict) · [研究論文](https://research.ilang.ai) · [AI See](https://i.ilang.ai)

## ライセンス

MIT License. © 2026 iLang Research, iLang Inc., Canada.
