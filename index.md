# iLang: AI-Native Communication Protocol for Humans and Agents
Source: https://ilang.ai

iLang **v5.0** | MIT License

# Don't learn iLang. Your AI should.

iLang is a protocol for AI, not a language for people to memorise. You keep saying what you want in your own words: your goals, your conditions, what may and may not be done. Your AI loads iLang, reads it, writes it and works by it.

[Copy latest iLang](https://raw.githubusercontent.com/ilang-ai/ilang-spec/main/runtime/ilang-latest.md) [Read the specification →](https://ilang.ai/spec/)

## How do I use iLang?

### I chat with ChatGPT, Claude, Gemini, DeepSeek or Qwen

Copy the [latest iLang runtime](https://raw.githubusercontent.com/ilang-ai/ilang-spec/main/runtime/ilang-latest.md) and paste it into your AI after this line:

```text
Please load and use the official iLang runtime below. You do not need to explain iLang to me or teach me its syntax. From the next task on, use it internally to understand, judge, execute and verify.
```

### I want my AI to load it every time

```bash
pip install ilang-protocol
npm install ilang-protocol
```

```python
messages = ilang.wrap(messages)
```

The loader fetches the official runtime, checks its sha256 and adds it to every request: [github.com/ilang-ai/ilang](https://github.com/ilang-ai/ilang).

Or connect the MCP server once, and your AI loads iLang itself: `https://ilang.ai/mcp`

```bash
claude mcp add --transport http ilang https://ilang.ai/mcp
```

In Cursor, add it from the deeplink `cursor://anysphere.cursor-deeplink/mcp/install?name=ilang&config=eyJ1cmwiOiJodHRwczovL2lsYW5nLmFpL21jcCJ9`; in Claude and ChatGPT, add the URL as a connector.

### I want to know what iLang is

- [Full specification](https://ilang.ai/spec/)
- [Conformance results, 45 model runs](https://research.ilang.ai/datasets/ilang-conformance/)
- [Preprint: The Missing Definition of Right](https://doi.org/10.5281/zenodo.22882691)
- [The canon on GitHub](https://github.com/ilang-ai/ilang-spec)

Tested across 7 models: ChatGPT, Claude, Gemini, DeepSeek, Kimi, Qwen and GLM. Not tied to any model: anything that takes enough context can load iLang.

## Measured, not assumed.

Every number here comes with its code and data under a DOI. We ask readers not to trust our numbers but to re-run them.

- **45**: model runs, 320 cases each, scored by deterministic code and the canon's own validators. No model grades another. [Conformance results →](https://research.ilang.ai/datasets/ilang-conformance/)
- **80% vs 9%**: median pass rate on grammar cases against execution cases, across the 34 comparable runs. Form is attainable; action is not. [Preprint →](https://doi.org/10.5281/zenodo.22882691)
- **68.4% → 80.9%**: agreement between the judge and the reference on an unbiased random sample, over three days in production. [Production audit →](https://research.ilang.ai/datasets/judgment-layer-audit/)

## Built with iLang.

- **iLang loader** (pip · npm, v1.1.0): The official iLang in every request, sha256-checked. [GitHub](https://github.com/ilang-ai/ilang) · [PyPI](https://pypi.org/project/ilang-protocol/) · [npm](https://www.npmjs.com/package/ilang-protocol)
- **iLang runtime** (canon, 18.6k tokens): What an AI loads, built by CI from the canon. [GitHub](https://github.com/ilang-ai/ilang-spec/tree/main/runtime) · [Manifest](https://raw.githubusercontent.com/ilang-ai/ilang-spec/main/runtime/manifest.json) · [Full text](https://ilang.ai/runtime/full)
- **ilang-conformance** (benchmark, 320 cases): Deterministic scores for any model; 45 runs published. [GitHub](https://github.com/ilang-ai/ilang-conformance) · [Results](https://research.ilang.ai/datasets/ilang-conformance/)
- **Playground** (browser, validator + IML): Validate, convert to IML, count tokens, all in your browser. [Open](https://ilang.ai/playground/)
- **Agent Ready GEO** (agent skill, 100/100): Takes a website to 100/100 on isitagentready.com. [GitHub](https://github.com/ilang-ai/agent-ready-geo)

[Every repository →](https://ilang.ai/ecosystem/)

## Open, archived, citable.

- [iLang Protocol Specification](https://doi.org/10.5281/zenodo.21821452): the canon, all versions, 10.5281/zenodo.21821452
- [The Missing Definition of Right](https://doi.org/10.5281/zenodo.22882691): preprint, CC BY 4.0, 10.5281/zenodo.22882691
- [ilang-conformance](https://doi.org/10.5281/zenodo.22864929): benchmark code and corpus, 10.5281/zenodo.22864929
- [iLang Research](https://doi.org/10.5281/zenodo.22865165): datasets and records, 10.5281/zenodo.22865165
- [iLang loader](https://doi.org/10.5281/zenodo.22899027): pip and npm ilang-protocol, 10.5281/zenodo.22899027

[research.ilang.ai](https://research.ilang.ai) · ORCID [0009-0004-4540-8082](https://orcid.org/0009-0004-4540-8082)

Also on ilang.ai: the [specification](https://ilang.ai/spec/) with the protocol header to paste, the capabilities, v4.0 execution semantics and the v5.0 judgment layer; the [dictionary](https://ilang.ai/dictionary/); [prompt compression](https://ilang.ai/prompt-compression/) with the prompt structurer; the [FAQ](https://ilang.ai/faq/).

---
Markdown rendering of the HTML page for agents; the HTML page is canonical.
