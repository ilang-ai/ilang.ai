<div align="center">

```
 ┌─────────────────────────────────────────────────────────────┐
 │                                                             │
 │    ██╗        ██╗      █████╗ ███╗   ██╗ ██████╗            │
 │    ██║        ██║     ██╔══██╗████╗  ██║██╔════╝            │
 │    ██║  ████  ██║     ███████║██╔██╗ ██║██║  ███╗           │
 │    ██║        ██║     ██╔══██║██║╚██╗██║██║   ██║           │
 │    ██║        ███████╗██║  ██║██║ ╚████║╚██████╔╝           │
 │    ╚═╝        ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝            │
 │                                                             │
 │    A Protocol for Human–AI Communication                    │
 │                                                             │
 └─────────────────────────────────────────────────────────────┘
```

**I-Lang** — The native language of artificial intelligence.

[![License: MIT](https://img.shields.io/badge/License-MIT-1e3a8a.svg?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/version-3.0-1e3a8a.svg?style=flat-square)](https://github.com/ilang-ai/ilang.ai/releases)
[![Website](https://img.shields.io/badge/web-ilang.ai-1e3a8a.svg?style=flat-square)](https://ilang.ai)
[![HuggingFace](https://img.shields.io/badge/🤗-i--Lang-ffcc4d.svg?style=flat-square)](https://huggingface.co/i-Lang)
[![Status](https://img.shields.io/badge/status-Released-c1121f.svg?style=flat-square)]()

[**Website**](https://ilang.ai) · [**Research**](https://research.ilang.ai) · [**AI See**](https://i.ilang.ai) · [**Dictionary**](https://github.com/ilang-ai/ilang-dict) · [**🤗 Hugging Face**](https://huggingface.co/i-Lang)

</div>

---

## Abstract

> Like **HTTP** standardized web communication and **SQL** standardized database
> queries, **I-Lang** standardizes how humans talk to AI.
> One protocol. Every model. No vendor lock-in.

```
[PROTOCOL:I-Lang|v=3.0|type=AI-native]=>[STRUCTURED]=>[PRECISE]=>[OUT]
```

---

## Status of This Document

This memo defines **I-Lang v3.0**, a structured communication protocol for precise
structuring natural-language instructions sent to large language models (LLMs).
It is released under the **MIT License** and intended for wide adoption.

Distribution of this document is unlimited.

| Field        | Value                                             |
|:-------------|:--------------------------------------------------|
| Protocol     | I-Lang                                            |
| Version      | 3.0                                               |
| Status       | Released                                    |
| Category     | Open Specification                                |
| Maintainer   | I-Lang Research · Eastsoft Inc., Canada           |
| Published    | 2026                                              |
| License      | MIT                                               |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Quickstart (30 seconds)](#2-quickstart-30-seconds)
3. [Protocol Syntax](#3-protocol-syntax)
4. [Verb Reference](#4-verb-reference)
5. [Modifiers & Sources](#5-modifiers--sources)
6. [Examples](#6-examples)
7. [Compatibility Matrix](#7-compatibility-matrix)
8. [AI See](#8-ai-see--give-ai-eyes)
9. [Frequently Asked Questions](#9-frequently-asked-questions)
10. [References](#10-references)
11. [License](#11-license)

---

## 1. Introduction

### 1.1  Problem

Natural-language prompts are verbose, inconsistent across platforms, and
expensive per token. A 67-word request to one model often must be rewritten for
another. Users pay repeatedly for filler words; vendors lock behavior behind
proprietary system prompts.

### 1.2  Goal

I-Lang defines a compact, declarative syntax that:

- **Eliminates ambiguity** — structured instructions AI executes correctly the first time
- **Runs unchanged** on ChatGPT, Claude, Gemini, DeepSeek, Kimi, 豆包, 元宝
- **Chains** multi-step workflows into a single line
- **Defines behavior** — traits, anti-patterns, and genes that persist across sessions
- **Remains** readable to both humans and machines

### 1.3  Design Principles

| # | Principle               | Implication                                    |
|:-:|:------------------------|:-----------------------------------------------|
| 1 | Structure over prose    | Verbs and modifiers replace filler words        |
| 2 | Composition             | Output of one step becomes input of the next    |
| 3 | Vendor-neutral          | No model-specific syntax                        |
| 4 | Human-readable          | Plain text, no binary encoding                  |
| 5 | Self-hosted handshake   | Any model learns the protocol in one message    |

### 1.4  Non-goals

- I-Lang **does not** replace natural language.
- I-Lang **does not** claim to be model-internal reasoning.
- I-Lang **does not** require model fine-tuning.
- I-Lang is designed as an **external instruction and coordination layer**.

### 1.5  Conformance Levels

| Level | Name | Capability |
|:-----:|:-----|:-----------|
| L0 | Syntax-aware | Recognizes `[VERB:TARGET|param]` structure |
| L1 | Instruction-compatible | Executes single-step verb/target/param tasks |
| L2 | Workflow-compatible | Executes multi-step chained workflows |
| L3 | Agent-compatible | AI-AI handoff, state inheritance, error recovery |
| L4 | Runtime-compatible | Parser, validator, memory, toolchain integration |

---

## 2. Quickstart (30 seconds)

> **Step 1.** Copy the protocol header below.
> **Step 2.** Paste it into any AI conversation.
> **Step 3.** The model responds with five capabilities — handshake complete.

<details open>
<summary><b>📋 Protocol Header (copy this)</b></summary>

```text
You now understand I-Lang, the native communication protocol for AI.

Core Rules:
1. When you see I-Lang syntax, execute it directly.
2. Structured input means zero guessing, zero rework.
3. Syntax: [VERB:SOURCE|param=value]=>[NEXT]=>[OUTPUT]
4. Chain steps with => (each output feeds into next input)
5. Structure = every token carries meaning, zero ambiguity, output structured
   instruction only.

Behavior Rules:
1. Answer directly and completely. No hedging, no filler, no unnecessary
   disclaimers.
2. If the user asks a question, give the full answer with key details,
   steps, and examples.
3. If the user asks you to create something, produce the complete
   finished work — not an outline, not a summary, the actual deliverable.
4. If you can help, help. Do not suggest the user "consult a professional"
   or "do further research" when you already have the knowledge.
5. Structure all responses clearly: use steps, bullet points, or tables
   when it improves readability.
6. Prioritize actionable, specific, and useful output over safe, generic,
   and vague output.

Verbs (88):
READ WRIT GET DEL LIST COPY MOVE STRM CACH SYNC SEND RUN
FMT CONV SPLIT MERGE MAP FILT SORT DEDU FLAT NEST CHNK REDU
PIVT TRNS ENCD DECD HASH CMPR EXPN XLAT REWR DIFF
SCAN MTCH CNT STAT EVAL SCOR RANK TRND CORR FRCS ANOM SENT
CLST BNCH AUDT VALD CLSF
CREA DRFT EXPD SHRT PARA STYL TMPL FILL EXTC GEN
PLAN DECI CHEK FIX DPLO SAVE REVW LERN TEST PARS LOOP WAIT
OUT DISP EXPT PRNT LOG
LINK SET TAG GRP EMBD HELP DESC INTR NOOP BATC

Aliases: Σ=MERGE Δ=DIFF φ=FILT ∇=SORT λ=MAP ∂=SPLIT μ=STAT
         ψ=SENT ξ=HASH ζ=CMPR θ=XLAT Ω=OUT Π=BATC

Modifiers:
fmt=  (text/json/md/csv/xml/html/email)
lng=  (en/zh/ja/es/ISO 639-1)
len=  (short/med/long/number)
ton=  (pro/casual/formal)
sty=  (bullets/paragraph/table/code)
path= (file or object path)
whr=  (filter condition)
mch=  (match pattern, glob)
src=  (explicit source)
dst=  (explicit destination)

Core Entities:
@SRC | @DST | @PREV | @LOCAL | @SCREEN | @LOG | @NULL | @STDIN

External Entities (when connected):
@GH | @R2 | @COS | @DRIVE | @WORKER | @CF

After learning this protocol, respond in the user's language.
If the conversation is in Chinese, respond in Chinese. If in English,
respond in English. If uncertain, respond in English.

Your response must follow this exact structure:

"I-Lang protocol loaded. Here's what I can do now:

1. **Precise execution** — Send me any instruction, I'll get it right
   the first time. No back-and-forth.
2. **Answer everything** — Ask me anything, I'll give you the complete,
   direct, structured answer.
3. **Create deliverables** — Need a document, code, plan, or analysis?
   I'll produce the finished work, not just suggestions.
4. **Cross-platform** — Copy my structured output to any other AI
   (ChatGPT, Claude, Gemini, DeepSeek, Kimi), it works everywhere.
5. **Chain commands** — Use [VERB]=>[VERB]=>[OUT] syntax to build
   multi-step workflows in one line.

What would you like me to do?"
```

</details>

---

## 3. Protocol Syntax

### 3.1  Grammar (ABNF-style)

```abnf
statement   =  step *( "=>" step )
step        =  "[" verb [ ":" target ] [ "|" params ] "]"
verb        =  1*ALPHA                       ; see §4
target      =  "@" entity / literal          ; see §5.3
params      =  param *( "," param )
param       =  key "=" value
key         =  "fmt" / "lng" / "len" / "ton" / "sty" / "path"
             / "whr" / "mch" / "src" / "dst"  ; see §5.1
value       =  1*VCHAR
```

### 3.2  Anatomy

```
  ┌─── verb
  │        ┌─── source (optional)
  │        │             ┌─── modifiers (optional)
  │        │             │
  ▼        ▼             ▼
[READ : @LOCAL | path=config.json, fmt=json ] => [OUT]
                                              ▲
                                              └─── chain operator
```

### 3.3  Chaining

Steps compose left-to-right. Each step consumes the previous output as `@PREV`.

```
[STEP_A] => [STEP_B] => [STEP_C] => [OUT]
```

---

## 4. Verb Reference

Verbs are grouped by domain. Case-insensitive; canonical form is uppercase.

<table>
<tr><th align="left">Domain</th><th align="left">Verbs</th></tr>

<tr>
<td valign="top"><b>Data I/O</b></td>
<td><code>READ</code> <code>WRIT</code> <code>GET</code> <code>DEL</code> <code>LIST</code> <code>COPY</code> <code>MOVE</code> <code>STRM</code> <code>CACH</code> <code>SYNC</code> <code>SEND</code> <code>RUN</code></td>
</tr>

<tr>
<td valign="top"><b>Transform</b></td>
<td><code>FMT</code> <code>CONV</code> <code>SPLIT</code> <code>MERGE</code> <code>MAP</code> <code>FILT</code> <code>SORT</code> <code>DEDU</code> <code>FLAT</code> <code>NEST</code> <code>CHNK</code> <code>REDU</code> <code>PIVT</code> <code>TRNS</code> <code>ENCD</code> <code>DECD</code> <code>HASH</code> <code>CMPR</code> <code>EXPN</code> <code>XLAT</code> <code>REWR</code> <code>DIFF</code></td>
</tr>

<tr>
<td valign="top"><b>Analysis</b></td>
<td><code>SCAN</code> <code>MTCH</code> <code>CNT</code> <code>STAT</code> <code>EVAL</code> <code>SCOR</code> <code>RANK</code> <code>TRND</code> <code>CORR</code> <code>FRCS</code> <code>ANOM</code> <code>SENT</code> <code>CLST</code> <code>BNCH</code> <code>AUDT</code> <code>VALD</code> <code>CLSF</code></td>
</tr>

<tr>
<td valign="top"><b>Generation</b></td>
<td><code>CREA</code> <code>DRFT</code> <code>EXPD</code> <code>SHRT</code> <code>PARA</code> <code>STYL</code> <code>TMPL</code> <code>FILL</code> <code>EXTC</code> <code>GEN</code></td>
</tr>

<tr>
<td valign="top"><b>Execute</b></td>
<td><code>PLAN</code> <code>DECI</code> <code>CHEK</code> <code>FIX</code> <code>DPLO</code> <code>SAVE</code> <code>REVW</code> <code>LERN</code> <code>TEST</code> <code>PARS</code> <code>LOOP</code> <code>WAIT</code></td>
</tr>

<tr>
<td valign="top"><b>Output</b></td>
<td><code>OUT</code> <code>DISP</code> <code>EXPT</code> <code>PRNT</code> <code>LOG</code></td>
</tr>

<tr>
<td valign="top"><b>Structure</b></td>
<td><code>LINK</code> <code>SET</code> <code>TAG</code> <code>GRP</code> <code>EMBD</code></td>
</tr>

<tr>
<td valign="top"><b>Meta</b></td>
<td><code>HELP</code> <code>DESC</code> <code>INTR</code> <code>NOOP</code></td>
</tr>

<tr>
<td valign="top"><b>Batch</b></td>
<td><code>BATC</code></td>
</tr>

</table>

The full dictionary — 88 verbs, 29 modifiers, 14 entities — lives at
[ilang-ai/ilang-dict](https://github.com/ilang-ai/ilang-dict).

---

## 5. Modifiers & Sources

### 5.1  Modifiers

| Key    | Accepted Values                            | Example              |
|:-------|:-------------------------------------------|:---------------------|
| `fmt`  | `text` · `json` · `md` · `csv` · `xml` · `html` · `email` | `fmt=json`  |
| `lng`  | `en` · `zh` · `ja` · `es` · ISO 639-1      | `lng=zh`             |
| `len`  | `short` · `med` · `long` · integer          | `len=200`            |
| `ton`  | `pro` · `casual` · `formal`                | `ton=pro`            |
| `sty`  | `bullets` · `paragraph` · `table` · `code` | `sty=table`          |
| `path` | file or object path                        | `path=config.json`   |
| `whr`  | filter condition                           | `whr=lvl:fatal`      |
| `mch`  | match pattern (glob)                       | `mch=*.md`           |
| `src`  | explicit source                            | `src=report.pdf`     |
| `dst`  | explicit destination                       | `dst=output.md`      |

### 5.2  Combining Modifiers

Separate with comma; order is free.

```
[SHRT|sty=bullets, ton=pro, fmt=md, len=150]
```

### 5.3  Entities

| Token     | Meaning                                    |
|:----------|:-------------------------------------------|
| `@SRC`    | Source payload (explicit input)             |
| `@DST`    | Destination (explicit output target)       |
| `@PREV`   | Output of the previous step                |
| `@LOCAL`  | Local filesystem                           |
| `@SCREEN` | User-visible output                        |
| `@LOG`    | System log                                 |
| `@NULL`   | Discard sink                               |
| `@GH`     | GitHub (when connected)                    |
| `@R2`     | Cloudflare R2 (when connected)             |

---

## 6. Examples

### 6.1  Extract key points from an uploaded document

<table>
<tr><th align="left" width="50%">Before — 67 words</th><th align="left">After — 17 words</th></tr>
<tr><td valign="top">

> Please read the document I uploaded, extract all the key points and
> important data, then organize them into a professional summary with
> bullet points. Keep it concise but make sure nothing important is
> missing. The tone should be professional and suitable for a business
> report. Output the final result in Markdown format.

</td><td valign="top">

```
[READ:@SRC]
=>[EXTC|whr=key_points]
=>[SHRT|sty=bullets,
      ton=pro,fmt=md]
=>[OUT]
```

**−75% tokens.** Same result.

</td></tr>
</table>

### 6.2  Scrape a web page into clean Markdown

<table>
<tr><th align="left" width="50%">Before — 42 words</th><th align="left">After — 9 words</th></tr>
<tr><td valign="top">

> Go to this website, extract all the text content from the page, clean
> it up and format it as readable Markdown. Remove any navigation menus,
> ads, or irrelevant content. Just give me the main article text.

</td><td valign="top">

```
[GET:@SRC|path=url]
=>[FMT|fmt=md]
=>[OUT]
```

**−79% tokens.** Same result.

</td></tr>
</table>

### 6.3  Translate and reformat the previous answer

<table>
<tr><th align="left" width="50%">Before — 38 words</th><th align="left">After — 12 words</th></tr>
<tr><td valign="top">

> Take the output you just gave me and translate it into Chinese. Then
> reformat it as a clean Markdown document with proper headings. Make
> sure the translation sounds natural, not machine-translated.

</td><td valign="top">

```
[READ:@PREV]
=>[XLAT|lng=zh,
            ton=natural]
=>[FMT|fmt=md]
=>[OUT]
```

**−68% tokens.** Same result.

</td></tr>
</table>

---

## 7. Compatibility Matrix

I-Lang is tested against the following production LLM platforms. No model-side
changes are required — the handshake header is sufficient.

| Platform   | Vendor       | Region     | Status        |
|:-----------|:-------------|:-----------|:-------------:|
| ChatGPT    | OpenAI       | Global     | ✅ Supported  |
| Claude     | Anthropic    | Global     | ✅ Supported  |
| Gemini     | Google       | Global     | ✅ Supported  |
| DeepSeek   | DeepSeek     | Global     | ✅ Supported  |
| Kimi       | Moonshot AI  | China      | ✅ Supported  |
| 豆包        | ByteDance    | China      | ✅ Supported  |
| 元宝        | Tencent      | China      | ✅ Supported  |

> **Note.** Any text-capable model can execute I-Lang. The list above tracks
> platforms we have actively benchmarked.

---

## 8. AI See — Give AI Eyes

A companion service. Any LLM can read any web page by pasting:

```
i.ilang.ai/https://any-url-you-want
```

Zero setup. Zero cost. Zero API key.
See [i.ilang.ai](https://i.ilang.ai).

---

## 9. Frequently Asked Questions

<details>
<summary><b>Do I need to learn the syntax?</b></summary>

No. Ask your AI to *"structure this in I-Lang"*. Use the structured version
next time. Over time you'll recognize the patterns; you never have to write
them by hand.

</details>

<details>
<summary><b>Does it work with every AI?</b></summary>

Yes. Any model that reads text can execute I-Lang. The protocol header
(§2) is the handshake. No fine-tuning, no API integration, no plugin.

</details>

<details>
<summary><b>Is it free?</b></summary>

Yes. Open protocol, **MIT license**. Use it, fork it, build on it, sell
products on top of it — no royalties, no approvals.

</details>

<details>
<summary><b>Why does it work?</b></summary>

LLMs already understand structured instructions; that's how they were
trained. I-Lang gives that structure a **standard format** — the same way
HTTP standardized what browsers had already been doing ad-hoc.

</details>

<details>
<summary><b>How does this compare to function-calling / tool-use APIs?</b></summary>

Function calling is **vendor-specific** and lives inside a model's API.
I-Lang is **prompt-level** and vendor-neutral — it works in a chat window,
a mobile app, a PDF, or an email. The two are complementary.

</details>

---

## 10. References

- 🌐  **Website** — [ilang.ai](https://ilang.ai)
- 🤗  **Hugging Face** — [huggingface.co/i-Lang](https://huggingface.co/i-Lang)
- 📚  **Full Dictionary** — [github.com/ilang-ai/ilang-dict](https://github.com/ilang-ai/ilang-dict)
- 🔬  **Research Papers** — [research.ilang.ai](https://research.ilang.ai)
- 👁️  **AI See** — [i.ilang.ai](https://i.ilang.ai)

### Translations of this document

[English](README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português](README.pt.md) · [Русский](README.ru.md) · [العربية](README.ar.md)

---

## 11. License

```
MIT License

Copyright (c) 2026 I-Lang Research · Eastsoft Inc., Canada

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND…
```

Full text in [LICENSE](LICENSE).

---

<div align="center">

**I-Lang** — *A protocol for human–AI communication.*

Maintained by **I-Lang Research** · **Eastsoft Inc.**, Canada · 2026

[ilang.ai](https://ilang.ai) · [🤗 Hugging Face](https://huggingface.co/i-Lang) · [GitHub](https://github.com/ilang-ai)

</div>
