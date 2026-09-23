# Frequently Asked Questions | iLang
Source: https://ilang.ai/faq/

# Frequently asked questions

About iLang, the AI-native communication protocol: using it without learning it, the loader, the models it works with, how it sits next to MCP and A2A, and what each version added.

### How do I learn iLang?

You don't. iLang is a protocol for AI, not a language people have to memorise. Tell your AI what you want in your own words. To put iLang to work, copy the latest iLang into your AI or install the loader. The full specification is for AI, developers, researchers and anyone auditing the protocol.

### Do I need to write iLang?

No. In normal use you never write a line of it. Your AI reads and writes iLang; you keep speaking naturally.

### Why is the full grammar public if I don't need to learn it?

Because a protocol has to be open, auditable and reproducible, and AI, developers and researchers need to read the whole of it. A public specification is not homework for users.

### Which models does iLang work with?

iLang is not tied to any model. Any model that accepts enough context can load it: ChatGPT, Claude, Gemini, DeepSeek, Qwen and others. The loader adds the official runtime to the context, and switching models only means loading it again.

### Do I have to learn it again when I switch models?

No. You don't learn it, and the model needs no special training. After you switch models, load iLang again: paste the latest iLang, or let the loader add it.

### Is there an iLang tutorial?

There is nothing to study. Tell your AI what you want in your own words and give it the latest iLang: paste it into the chat, or install the loader. The specification is there for AI, developers and researchers.

### Is there an iLang plugin?

Yes, the loader: pip install ilang-protocol or npm install ilang-protocol, then ilang.wrap(messages). It fetches the official runtime, checks its sha256 and adds it to every request, for any model.

### What is an AI-native communication protocol?

An AI-native communication protocol is a structured format designed from symbols AI models already understand well: brackets, pipes, arrows, and key-value pairs. iLang is one such protocol, providing 88 verbs and two syntaxes for human-to-AI, AI-to-AI, and agent-internal communication.

### How is iLang different from MCP?

MCP (Model Context Protocol) connects AI to external tools and data sources. iLang operates at a different layer: it structures the communication itself. MCP handles what AI connects to; iLang handles how AI understands instructions. They are complementary.

### How is iLang different from A2A?

A2A (Agent-to-Agent Protocol) handles agent discovery and inter-agent handshakes. iLang handles the instruction and behavioral layer: how agents understand tasks, follow constraints, and maintain behavioral consistency. They address different parts of the AI stack.

### Can structured prompts reduce retries with AI?

Structured instructions typically reduce ambiguity, which often leads to fewer retries and less rework. On a six-step request written the way people actually send it, the natural-language version is 169 tokens and the iLang chain is 54, a 68% reduction measured with tiktoken cl100k_base; written tersely the same instruction is 58 tokens and the reduction is 7%. Both texts are published on [ilang.ai/prompt-compression/](https://ilang.ai/prompt-compression/).

### Does iLang work with ChatGPT, Claude, and DeepSeek?

iLang has been tested across ChatGPT, Claude, Gemini, DeepSeek, Kimi, Qwen and GLM. Results by model are published on [ilang.ai/benchmark/](https://ilang.ai/benchmark/), tests conducted May 2026.

### What is prompt compression for LLMs?

Prompt compression reduces the number of tokens needed to convey the same instructions to an AI model. iLang achieves this through structured verb-target-modifier syntax that eliminates natural language ambiguity, articles, and filler words.

### Is iLang free and open source?

Yes. iLang is MIT licensed. The specification, dictionary, and tools are all open source. You can use it, fork it, build products on it, with no royalties or approvals needed.

### What is new in iLang v5.0?

iLang v5.0 adds a trainable judgment layer on top of the v4.0 execution semantics and v3.0 communication format. It defines judgment as vector composition over a continuous behavioral manifold instead of binary allow/deny classification. The judgment layer has 11 dimensions (intent, capability, consequence, relationship, certainty, authority, reversibility, evidence, sovereignty, inertia, externality), 4 axioms (no constant rules, irreversibility gate, consistency detection, externality conservation), a three-layer architecture (exact predicates that are binary, vector logic that is continuous, and co-evolutionary trust that adapts), and a closed set of 8 decision modes from M1 EXEC_AUTO to M8 STOP. It is grounded in fuzzy mathematics: multiple imprecise assessments converge to precise values over the course of a conversation. Fully backward compatible with v4.0 and v3.0. v5.0 (June 2026) is the latest version of the protocol, published as a public preview. v4.2 (September 2026) is the current stable release.

### What is the iLang judgment layer?

The judgment layer, introduced in iLang v5.0, is a computable vector space for AI judgment. Most safety systems treat a request as binary: allowed or forbidden, one label in, one verdict out. iLang instead reads a request across 11 dimensions and composes them into a direction, so it can see where a string of individually acceptable steps is actually heading. Barrier functions for irreversibility and third-party externality act as independent gates that cannot be averaged away by a high overall score. The layer is trainable: weights start at zero and self-calibrate through interaction, with no pre-calibration required for deployment.

### What was new in iLang v4.0?

iLang v4.0 added execution semantics on top of the v3.0 communication format. Eight new declarations: UNTRUSTED for input isolation, BUDGET for resource awareness, STATUS for task lifecycle, OBJECTIVE for goal anchoring, RUBRIC and EVIDENCE for completion audit, PRIOR for default behavior control, and FALLBACK for degradation strategy. Four conformance levels from L0 to L3. Zero new verbs, fully backward compatible with v3.0.

### Is iLang a prompt engineering framework?

No. iLang is not a prompt engineering framework. It is an open AI-native communication protocol, a structured format designed from symbols AI models already understand well: brackets, pipes, arrows, and key-value pairs, with 88 verbs and two syntaxes for human-to-AI, AI-to-AI, and agent-internal communication. The ilang.ai benchmark page reports it tested across ChatGPT, Claude, Gemini, DeepSeek, Kimi, Qwen and GLM, May 2026. Free, open, MIT licensed.

### Does iLang Inc. offer an AI detector or an AI humanizer?

Yes. iLang Detect and iLang Humanizer are tools built on iLang, the protocol, by iLang Inc. iLang Detect provides sentence-level AI analysis with rewriting suggestions across 6 dimensions. iLang Humanizer is a free AI humanizer built on the DeAI three-layer method: remove AI filler phrases, restructure rhythm, mark positions for your authentic voice. It is an editor, not a generator. Both run at [ilang.ai/ai-detector/](https://ilang.ai/ai-detector/) and [ilang.ai/ai-humanizer/](https://ilang.ai/ai-humanizer/).

---
Markdown rendering of the HTML page for agents; the HTML page is canonical.
