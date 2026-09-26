# iLang (I Language) — Кроссплатформенный стандартный протокол коммуникации человек-ИИ

**🌐 Язык:** [English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Português](README.pt.md) | [Русский](README.ru.md) | [العربية](README.ar.md)

## Не учите iLang. Пусть его выучит ваш ИИ.

iLang — это протокол для ИИ, а не язык, который людям нужно заучивать. Вы по-прежнему своими словами говорите, чего хотите; ваш ИИ загружает iLang и работает по нему.

- **В чате:** скопируйте [последнюю версию среды iLang](https://runtime.ilang.app/ilang-latest.md) или нажмите «Copy latest iLang» на [ilang.ai](https://ilang.ai) и вставьте её в ChatGPT, Claude, Gemini, DeepSeek, Qwen или любой другой ассистент.
- **В коде:** `pip install ilang-protocol` или `npm install ilang-protocol`, затем `messages = ilang.wrap(messages)`. [Загрузчик](https://github.com/ilang-ai/ilang) получает официальную среду, проверяет её и добавляет к каждому запросу.
- **С MCP-клиентом:** подключите один раз `https://ilang.ai/mcp` (Claude Code: `claude mcp add --transport http ilang https://ilang.ai/mcp`), и ваш ИИ сам загрузит iLang.

Всё, что ниже, написано для ИИ, разработчиков, исследователей и тех, кто проверяет протокол.

---

Как HTTP стандартизировал веб-коммуникацию, а SQL — запросы к базам данных, **iLang стандартизирует общение человека с ИИ**. Один протокол, протестированный на ChatGPT, Claude, Gemini, DeepSeek, Kimi, Qwen и GLM, без привязки к вендору.

`::STATE{@PROTOCOL, version:5.0, status:public_preview, genesis:2026-03-04}`

**Сайт:** [ilang.ai](https://ilang.ai) · **Исследования:** [research.ilang.ai](https://research.ilang.ai) · **AI See:** [i.ilang.ai](https://i.ilang.ai)

## Что умеет iLang

| Возможность | Описание |
|------------|----------|
| **Сжатие** | Сокращение промптов на 5-67%. Меньше токенов |
| **Ответ на всё** | ИИ отвечает прямо и полно, без оговорок |
| **Защита приватности** | Сжатый текст отправляет меньше данных |
| **Кроссплатформенность** | Одна инструкция, протестированная на ChatGPT, Claude, Gemini, DeepSeek, Kimi, Qwen и GLM |
| **Цепочки команд** | `[VERB]=>[VERB]=>[OUT]` многоэтапные процессы в одной строке |

## Начните за 30 секунд

Скопируйте заголовок протокола с [ilang.ai](https://ilang.ai) и вставьте в любой чат с ИИ.

## Протестированные платформы

ChatGPT ✅ | Claude ✅ | Gemini ✅ | DeepSeek ✅ | Kimi ✅ | Qwen ✅ | GLM ✅

## Ссылки

- [Протокол и инструменты](https://ilang.ai) · [Спецификация](https://ilang.ai/spec/) · [Полный словарь](https://github.com/ilang-ai/ilang-dict) · [Исследования](https://research.ilang.ai) · [AI See](https://i.ilang.ai)

## Лицензия

MIT License. © 2026 iLang Research, iLang Inc., Canada.
