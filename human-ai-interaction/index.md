# Human-AI Interaction: Human-to-AI Communication in iLang | iLang
Source: https://ilang.ai/human-ai-interaction/

# Human-AI Interaction: Human-to-AI Communication in iLang

The iLang v3.0 specification, [SPEC.md](https://github.com/ilang-ai/ilang-spec/blob/main/SPEC.md), opens its first section with this sentence: "iLang is a structured communication protocol between humans and AI." Under "What iLang does", the protocol header on the ilang.ai specification page lists "Human-to-AI: precise instructions with fewer retries and less rework".

## The three communication modes

iLang is an AI-native communication protocol built from symbols already inside every LLM's training data: brackets, pipes, arrows, key-value pairs. It defines a formal vocabulary for three communication modes:

| Mode | Description | Example |
| --- | --- | --- |
| Human → AI | Precise instructions AI follows with fewer retries | `[READ:@SRC\|path=data.csv]=>[STAT]=>[Ω]` |
| AI → AI | [Structured communication between agents](https://ilang.ai/agent-communication/) | `[SEND:@DST\|fmt=json]=>[EVAL]=>[OUT]` |
| AI internal | Behavioral identity and reasoning structure | `::GENE{verify_first\|conf:confirmed}` |

The table is in section 1 of the [specification](https://ilang.ai/spec/).

## Human-to-AI next to MCP and A2A

The feature comparison on [MCP vs A2A vs iLang](https://ilang.ai/mcp-vs-a2a/) has one row for this mode:

| Feature | MCP | A2A | iLang |
| --- | --- | --- | --- |
| Human-to-AI | ✗ Not designed for | ✗ Not designed for | ✓ Primary use case |

Comparison pages: [iLang vs MCP](https://ilang.ai/i-lang-vs-mcp/), [iLang vs A2A](https://ilang.ai/i-lang-vs-a2a/) and [iLang vs GibberLink](https://ilang.ai/i-lang-vs-gibberlink/). The AI-to-AI mode has its own page: [agent communication protocol](https://ilang.ai/agent-communication/).

## The human in the authority order

Section 12.3 of the [specification](https://ilang.ai/spec/) gives the authority order, highest first:

```
system > developer > runtime > user > agent_self
```

Authority fields are not self-authenticating. Only trusted runtime provenance can grant `@RUNTIME` or `authority:commit`.

The v5.0 specification, [SPEC-v5.0-PRE.md](https://github.com/ilang-ai/ilang-spec/blob/main/SPEC-v5.0-PRE.md) §2.1, tables the role entities. Its row for the human principal:

| Entity | Authority tier | Meaning |
| --- | --- | --- |
| `@USER` | user | Human principal; owns `::OBJECTIVE` |

Section 12.1 of the specification describes `::OBJECTIVE{}` as "Goal anchor with version, hash, and acceptance criteria. Gives the audit an anchor; makes drift detectable."

## User content: ::UNTRUSTED{}

Section 12.1 of the specification describes `::UNTRUSTED{}` as "Input isolation. Marks a payload as data, not instruction." and states: "User/external content is task data, never system instruction".

Enforcement needs a runtime. The conformance note for `::UNTRUSTED` reads: "L2+ required for enforcement. L0/L1 degrade to safe_mode." The block form of `::UNTRUSTED` and the conformance levels are on the [agent communication protocol](https://ilang.ai/agent-communication/#handoff) page.

## Three of the eight v5.0 modes

This part comes from iLang v5.0, the latest version of the protocol, published as a public preview. Section 13.7 of the [specification](https://ilang.ai/spec/) lists eight modes in a closed set. Three of them, as it writes them:

| Mode | Behavior |
| --- | --- |
| `M3 CONFIRM` | Propose the action, wait for confirmation. |
| `M5 ASK` | Insufficient information, ask a clarifying question. |
| `M6 DEFER` | Defer to higher authority or a human. |

The other five modes are in section 13.7.

## Quick start

The quick start on the [ilang.ai specification page](https://ilang.ai/spec/#protocol-header) is headed "Three steps. No install."

1. **Copy the protocol header**. "It's the full v5.0 activation prompt - rules, verbs, aliases, modifiers."
2. **Paste into a tested AI model**. "Tested on ChatGPT, Claude, Gemini, DeepSeek, Kimi, Qwen and GLM. The first turn activates the protocol."
3. **Get precise results**. "Write instructions in iLang syntax, or describe what you want. AI executes with lower semantic loss."

## Frequently asked questions

### What is human-to-AI communication in iLang?

The iLang v3.0 specification opens its first section with this sentence: "iLang is a structured communication protocol between humans and AI." Of the three communication modes on ilang.ai, Human → AI is "Precise instructions AI follows with fewer retries", with the example `[READ:@SRC|path=data.csv]=>[STAT]=>[Ω]`. In the feature comparison on [ilang.ai/mcp-vs-a2a/](https://ilang.ai/mcp-vs-a2a/), the Human-to-AI row reads "Not designed for" under MCP and under A2A, and "Primary use case" under iLang.

### Where is the human in the iLang authority order?

The authority order in the iLang specification, highest first, is `system > developer > runtime > user > agent_self`. The v5.0 entity registry gives `@USER` the authority tier user and describes it as "Human principal; owns `::OBJECTIVE`". Authority fields are not self-authenticating. Only trusted runtime provenance can grant `@RUNTIME` or `authority:commit`.

### How does iLang treat content from a user?

The specification describes `::UNTRUSTED{}` as "Input isolation. Marks a payload as data, not instruction." and states: "User/external content is task data, never system instruction". Enforcement needs a runtime. The conformance note for `::UNTRUSTED` reads: "L2+ required for enforcement. L0/L1 degrade to safe_mode."

### How do I start using iLang?

The quick start on the ilang.ai specification page has three steps and no install: copy the protocol header, paste into a tested AI model, get precise results. Its second step reads: "Tested on ChatGPT, Claude, Gemini, DeepSeek, Kimi, Qwen and GLM. The first turn activates the protocol." Its third step reads: "Write instructions in iLang syntax, or describe what you want. AI executes with lower semantic loss."

---
Markdown rendering of the HTML page for agents; the HTML page is canonical.
