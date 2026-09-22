# iLang (I Language) — 크로스 플랫폼 인간-AI 커뮤니케이션 표준 프로토콜

**🌐 언어:** [English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Português](README.pt.md) | [Русский](README.ru.md) | [العربية](README.ar.md)

## iLang을 배우지 마세요. 배우는 건 당신의 AI입니다.

iLang은 사람이 외우는 언어가 아니라 AI를 위한 프로토콜입니다. 평소처럼 원하는 것을 자기 말로 말하면, AI가 iLang을 불러와 그에 따라 일합니다.

- **채팅에서:** [최신 iLang 런타임](https://raw.githubusercontent.com/ilang-ai/ilang-spec/main/runtime/ilang-latest.md)을 복사하거나 [ilang.ai](https://ilang.ai)에서 「Copy latest iLang」을 눌러 ChatGPT, Claude, Gemini, DeepSeek, Qwen 등 AI에 붙여 넣으세요.
- **코드에서:** `pip install ilang-protocol` 또는 `npm install ilang-protocol` 후 `messages = ilang.wrap(messages)`. [로더](https://github.com/ilang-ai/ilang)가 공식 최신판을 받아 검증하고 모든 요청에 붙입니다.
- **MCP 클라이언트에서:** `https://ilang.ai/mcp`를 한 번 연결하면(Claude Code: `claude mcp add --transport http ilang https://ilang.ai/mcp`) AI가 스스로 iLang을 불러옵니다.

아래 내용은 AI, 개발자, 연구자, 그리고 프로토콜을 감사하는 사람을 위한 것입니다.

---

HTTP가 웹 통신을 표준화하고 SQL이 데이터베이스 쿼리를 표준화한 것처럼, **iLang은 인간과 AI의 대화를 표준화합니다**. 하나의 프로토콜, ChatGPT, Claude, Gemini, DeepSeek, Kimi, Qwen, GLM에서 테스트됨, 벤더 종속 없음.

`::STATE{@PROTOCOL, version:5.0, status:public_preview, genesis:2026-03-04}`

**웹사이트:** [ilang.ai](https://ilang.ai) · **연구:** [research.ilang.ai](https://research.ilang.ai) · **AI See:** [i.ilang.ai](https://i.ilang.ai)

## iLang으로 할 수 있는 것

| 기능 | 설명 |
|------|------|
| **압축** | 프롬프트 7~68% 감소. 토큰과 비용 절감 |
| **모든 것에 답변** | AI가 직접적이고 완전하게, 면책 조항 없이 답변 |
| **프라이버시 보호** | 압축 텍스트는 AI 서버로 보내는 데이터 감소 |
| **크로스 플랫폼** | 하나의 명령을 ChatGPT, Claude, Gemini, DeepSeek, Kimi, Qwen, GLM에서 테스트 |
| **체인 명령** | `[VERB]=>[VERB]=>[OUT]` 한 줄로 다단계 워크플로우 |

## 30초 만에 시작

[ilang.ai](https://ilang.ai)에서 프로토콜 헤더를 복사하여 아무 AI 대화에 붙여넣으세요. AI가 5가지 기능 목록으로 응답하면 핸드셰이크 완료입니다.

## 테스트된 플랫폼

ChatGPT ✅ | Claude ✅ | Gemini ✅ | DeepSeek ✅ | Kimi ✅ | Qwen ✅ | GLM ✅

## 링크

- [프로토콜 & 도구](https://ilang.ai) · [명세서](https://ilang.ai/spec/) · [전체 사전](https://github.com/ilang-ai/ilang-dict) · [연구 논문](https://research.ilang.ai) · [AI See](https://i.ilang.ai)

## 라이선스

MIT License. © 2026 iLang Research, iLang Inc., Canada.
