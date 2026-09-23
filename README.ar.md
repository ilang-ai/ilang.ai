# iLang (I Language) — بروتوكول قياسي متعدد المنصات للتواصل بين الإنسان والذكاء الاصطناعي

**🌐 اللغة:** [English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Português](README.pt.md) | [Русский](README.ru.md) | [العربية](README.ar.md)

## لا تتعلّم iLang، دع ذكاءك الاصطناعي يتعلّمه.

iLang بروتوكول للذكاء الاصطناعي، وليس لغة يحفظها البشر. تواصل قول ما تريده بكلماتك، ويحمّل ذكاؤك الاصطناعي iLang ويعمل وفقه.

- **في المحادثة:** انسخ [أحدث نسخة من بيئة iLang](https://raw.githubusercontent.com/ilang-ai/ilang-spec/main/runtime/ilang-latest.md)، أو اضغط «Copy latest iLang» في [ilang.ai](https://ilang.ai)، والصقها في ChatGPT أو Claude أو Gemini أو DeepSeek أو Qwen أو أي مساعد آخر.
- **في الكود:** `pip install ilang-protocol` أو `npm install ilang-protocol`، ثم `messages = ilang.wrap(messages)`. يجلب [المحمّل](https://github.com/ilang-ai/ilang) البيئة الرسمية ويتحقق منها ويضيفها إلى كل طلب.
- **مع عميل MCP:** اربط `https://ilang.ai/mcp` مرة واحدة (Claude Code: `claude mcp add --transport http ilang https://ilang.ai/mcp`)، وسيحمّل ذكاؤك الاصطناعي iLang بنفسه.

ما يلي موجّه إلى الذكاء الاصطناعي والمطوّرين والباحثين ومن يدقّقون البروتوكول.

---

كما وحّد HTTP التواصل عبر الويب ووحّد SQL استعلامات قواعد البيانات، **يوحّد iLang طريقة تحدث البشر مع الذكاء الاصطناعي**. بروتوكول واحد، تم اختباره على ChatGPT وClaude وGemini وDeepSeek وKimi وQwen وGLM، بدون تبعية لمورّد.

`::STATE{@PROTOCOL, version:5.0, status:public_preview, genesis:2026-03-04}`

**الموقع:** [ilang.ai](https://ilang.ai) · **الأبحاث:** [research.ilang.ai](https://research.ilang.ai) · **AI See:** [i.ilang.ai](https://i.ilang.ai)

## ما يمكن لـ iLang فعله

| القدرة | الوصف |
|--------|-------|
| **الضغط** | تقليل المطالبات بنسبة 5% إلى 67%. رموز أقل |
| **الإجابة على كل شيء** | الذكاء الاصطناعي يجيب مباشرة وبشكل كامل |
| **حماية الخصوصية** | النص المضغوط يرسل بيانات أقل |
| **عبر المنصات** | أمر واحد تم اختباره على ChatGPT وClaude وGemini وDeepSeek وKimi وQwen وGLM |
| **أوامر متسلسلة** | `[VERB]=>[VERB]=>[OUT]` سير عمل متعدد الخطوات في سطر واحد |

## ابدأ في 30 ثانية

انسخ رأس البروتوكول من [ilang.ai](https://ilang.ai) والصقه في أي محادثة مع الذكاء الاصطناعي.

## المنصات المختبرة

ChatGPT ✅ | Claude ✅ | Gemini ✅ | DeepSeek ✅ | Kimi ✅ | Qwen ✅ | GLM ✅

## الروابط

- [البروتوكول والأدوات](https://ilang.ai) · [المواصفات](https://ilang.ai/spec/) · [القاموس الكامل](https://github.com/ilang-ai/ilang-dict) · [الأبحاث](https://research.ilang.ai) · [AI See](https://i.ilang.ai)

## الترخيص

MIT License. © 2026 iLang Research, iLang Inc., Canada.
