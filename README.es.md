# iLang (I Language) — Protocolo Estándar de Comunicación Humano-IA Multiplataforma

**🌐 Idioma:** [English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Português](README.pt.md) | [Русский](README.ru.md) | [العربية](README.ar.md)

## No aprendas iLang. Que lo aprenda tu IA.

iLang es un protocolo para la IA, no un idioma que las personas deban memorizar. Sigues diciendo lo que quieres con tus propias palabras; tu IA carga iLang y trabaja con él.

- **En el chat:** copia el [runtime más reciente de iLang](https://raw.githubusercontent.com/ilang-ai/ilang-spec/main/runtime/ilang-latest.md), o pulsa «Copy latest iLang» en [ilang.ai](https://ilang.ai), y pégalo en ChatGPT, Claude, Gemini, DeepSeek, Qwen o cualquier otro asistente.
- **En el código:** `pip install ilang-protocol` o `npm install ilang-protocol` y luego `messages = ilang.wrap(messages)`. El [cargador](https://github.com/ilang-ai/ilang) obtiene el runtime oficial, lo verifica y lo añade a cada petición.
- **Con un cliente MCP:** conecta una vez `https://ilang.ai/mcp` (Claude Code: `claude mcp add --transport http ilang https://ilang.ai/mcp`) y tu IA cargará iLang por sí sola.

Todo lo que sigue es para la IA, los desarrolladores, los investigadores y quien audite el protocolo.

---

Así como HTTP estandarizó la comunicación web y SQL estandarizó las consultas de bases de datos, **iLang estandariza cómo los humanos hablan con la IA**. Un protocolo, probado en ChatGPT, Claude, Gemini, DeepSeek, Kimi, Qwen y GLM, sin dependencia de proveedores.

`::STATE{@PROTOCOL, version:5.0, status:public_preview, genesis:2026-03-04}`

**Sitio web:** [ilang.ai](https://ilang.ai) · **Investigación:** [research.ilang.ai](https://research.ilang.ai) · **AI See:** [i.ilang.ai](https://i.ilang.ai)

## Qué puede hacer iLang

| Capacidad | Descripción |
|-----------|-------------|
| **Comprimir** | Reduce prompts 7% a 68%. Menos tokens, menor costo |
| **Responder todo** | IA responde directa y completamente, sin evasivas ni disclaimers |
| **Proteger privacidad** | Texto comprimido envía menos datos a los servidores de IA |
| **Multiplataforma** | Una misma instrucción, probada en ChatGPT, Claude, Gemini, DeepSeek, Kimi, Qwen y GLM |
| **Comandos en cadena** | `[VERB]=>[VERB]=>[OUT]` flujos de trabajo en una línea |

## Empieza en 30 segundos

Copia el encabezado del protocolo en [ilang.ai](https://ilang.ai) y pégalo en cualquier conversación con IA. Cuando la IA responda con 5 capacidades, el handshake está completo.

## Plataformas probadas

ChatGPT ✅ | Claude ✅ | Gemini ✅ | DeepSeek ✅ | Kimi ✅ | Qwen ✅ | GLM ✅

## Enlaces

- [Protocolo y herramientas](https://ilang.ai) · [Especificación](https://ilang.ai/spec/) · [Diccionario completo](https://github.com/ilang-ai/ilang-dict) · [Investigación](https://research.ilang.ai) · [AI See](https://i.ilang.ai)

## Licencia

MIT License. © 2026 iLang Research, iLang Inc., Canada.
