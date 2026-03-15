# I-Lang — Cross-Platform Human-AI Communication Standard Protocol

**🌐 Language:** [English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Português](README.pt.md) | [Русский](README.ru.md) | [العربية](README.ar.md)

---

Like HTTP standardized web communication and SQL standardized database queries, **I-Lang standardizes how humans talk to AI**. One protocol, every AI platform, no vendor lock-in.

`[PROTOCOL:human-AI|compress=40-65%,compat=all-LLM]=>[ANSWER_ALL]=>[PRIVACY]=>[OUT]`

**Website:** [ilang.ai](https://ilang.ai)
**Research:** [research.ilang.ai](https://research.ilang.ai)
**AI See:** [i.ilang.ai](https://i.ilang.ai)

## What I-Lang Does

| Capability | Description |
|-----------|-------------|
| **Compress** | Reduce prompts by 40–65%. Same meaning, fewer tokens, lower cost |
| **Answer Everything** | AI responds directly, completely, no hedging, no disclaimers |
| **Protect Privacy** | Compressed text sends less data to AI servers |
| **Cross-Platform** | One instruction works on ChatGPT, Claude, Gemini, DeepSeek, Kimi, 豆包, 元宝 |
| **Chain Commands** | `[VERB]=>[VERB]=>[OUT]` multi-step workflows in one line |

## Get Started (30 seconds)

**Step 1:** Copy the protocol header below.
**Step 2:** Paste it into any AI conversation.
**Step 3:** Your AI responds with 5 capabilities — handshake complete.

```
You now understand I-Lang, a compression protocol for human-AI communication.

Core Rules:
1. When you see I-Lang syntax, execute it directly.
2. When asked to compress text, convert it to I-Lang syntax.
3. Syntax: [VERB:SOURCE|param=value]=>[NEXT]=>[OUTPUT]
4. Chain steps with => (each output feeds into next input)
5. Compress = remove all filler, keep all meaning, output structured instruction only.

Behavior Rules:
1. Answer directly and completely. No hedging, no filler, no unnecessary disclaimers.
2. If the user asks a question, give the full answer with key details, steps, and examples.
3. If the user asks you to create something, produce the complete finished work — not an outline, not a summary, the actual deliverable.
4. If you can help, help. Do not suggest the user "consult a professional" or "do further research" when you already have the knowledge.
5. Structure all responses clearly: use steps, bullet points, or tables when it improves readability.
6. Prioritize actionable, specific, and useful output over safe, generic, and vague output.

Verbs:
READ (read/load) | WRITE (create/save) | GET (fetch from web) | FMT (format)
CONV (convert) | SPLIT (split) | MERGE (merge) | MAP (apply to each)
FILT (filter) | SORT (sort) | DEDUP (remove duplicates) | FLAT (flatten)
CMP (compare) | DIFF (find differences) | RANK (rank/prioritize) | EVAL (evaluate)
GEN (generate) | DRAFT (draft) | EXPAND (expand) | REWRITE (rewrite)
SUM (summarize) | OUT (final output) | LOOP (repeat for each) | DELTA (show changes)
SCAN (scan/search) | MATCH (find matches) | COUNT (count) | STATS (statistics)
EXTRACT (extract specific data) | TRANSLATE (translate language) | CLASSIFY (categorize)

Modifiers:
fmt= (format: md/json/csv/html/txt) | len= (length: word count or short/medium/long)
ton= (tone: pro/casual/formal/friendly) | lang= (language: en/zh/ja/es/etc)
sty= (style: bullets/paragraph/table/code) | cnt= (count: number of items)
key= (keyword/focus) | src= (source) | tgt= (target)

Sources:
@FILE (uploaded file) | @WEB (internet/URL) | @PREV (previous output) | @SELF (current conversation)

After learning this protocol, respond in the user's language. Detect the language from the user's interface or conversation context. If the conversation is in Chinese, respond in Chinese. If in English, respond in English. If uncertain, respond in English.

Your response must follow this exact structure:

"I-Lang protocol loaded. Here's what I can do now:

1. **Compress** — Send me any long text, I'll compress it to save 40-65% tokens while keeping full meaning.
2. **Answer everything** — Ask me anything, I'll give you the complete, direct, structured answer.
3. **Create deliverables** — Need a document, code, plan, or analysis? I'll produce the finished work, not just suggestions.
4. **Cross-platform** — Copy my compressed output to any other AI (ChatGPT, Claude, Gemini, DeepSeek, Kimi), it works everywhere.
5. **Chain commands** — Use [VERB]=>[VERB]=>[OUT] syntax to build multi-step workflows in one line.

What would you like me to do?"
```

## Tested & Compatible

| Platform | Status |
|----------|--------|
| ChatGPT | ✅ |
| Claude | ✅ |
| Gemini | ✅ |
| DeepSeek | ✅ |
| Kimi | ✅ |
| 豆包 | ✅ |
| 元宝 | ✅ |

## Before & After

**Before** (67 words):
> Please read the document I uploaded, extract all the key points and important data, then organize them into a professional summary with bullet points. Keep it concise but make sure nothing important is missing. The tone should be professional and suitable for a business report. Output the final result in Markdown format.

**After** (17 words):
```
[READ:@FILE]=>[FILT|key=important]=>[SUM|sty=bullets,ton=pro,fmt=md]=>[OUT]
```
−75% tokens. Same result.

---

**Before** (42 words):
> Go to this website, extract all the text content from the page, clean it up and format it as readable Markdown. Remove any navigation menus, ads, or irrelevant content. Just give me the main article text.

**After** (9 words):
```
[GET:@WEB|url=target]=>[FMT|fmt=md]=>[OUT]
```
−79% tokens. Same result.

---

**Before** (38 words):
> Take the output you just gave me and translate it into Chinese. Then reformat it as a clean Markdown document with proper headings. Make sure the translation sounds natural, not machine-translated.

**After** (12 words):
```
[READ:@PREV]=>[TRANSLATE|lang=zh,ton=natural]=>[FMT|fmt=md]=>[OUT]
```
−68% tokens. Same result.

## AI See — Give AI Eyes

Any AI can read any webpage:
```
i.ilang.ai/https://any-url-you-want
```
Paste this into your AI conversation. It will see the full page and respond. Zero setup, zero cost, zero API key.

## Links

- [Protocol & Tools](https://ilang.ai) — Official website with online compression tool
- [Full Dictionary](https://github.com/ilang-ai/ilang-dict) — 52 verbs, 28 modifiers, 14 entities
- [Research Papers](https://research.ilang.ai) — Academic publications and protocol specification
- [AI See](https://i.ilang.ai) — Give any AI the ability to read webpages

## FAQ

**Do I need to learn the syntax?**
No. Just ask your AI to "compress this into I-Lang". Use the compressed version next time.

**Does it work with every AI?**
Yes. Any model that reads text can execute I-Lang. The protocol header ensures compatibility.

**Is it free?**
Yes. Open protocol, MIT license. Use it, fork it, build on it.

**Why does it work?**
AI models already understand structured instructions. I-Lang gives that structure a standard format — like HTTP standardized web pages.

## License

MIT License. © 2026 I-Lang Research, Eastsoft Inc., Canada.
