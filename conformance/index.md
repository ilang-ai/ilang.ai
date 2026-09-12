# I-Lang Conformance Levels: L0-L3 Protocol Compliance Tests | How to Verify AI Protocol Support
Source: https://ilang.ai/conformance/

# Conformance Levels

v4.0 defines four conformance levels. Each level includes all requirements of previous levels.

## What is conformance?

Conformance levels define how deeply a model or runtime understands I-Lang. Source: [SPEC-v4.0-FINAL.md](https://github.com/ilang-ai/ilang-spec/blob/main/SPEC-v4.0-FINAL.md) §0.

## Conformance levels

### L0: v3-compatible communication only

Parser: LLM. No runtime. No enforcement. v4 primitives ignored or warned. Core communication works.

v3 communication tests:

| Test | Pass criteria |
| --- | --- |
| Identify `[VERB:@TARGET\|mod=val]` as I-Lang | Model names I-Lang or identifies structured protocol syntax |
| Explain chain operator `=>` | Model describes it as pipeline/output-feeds-input |
| List known verbs from a chain | Model correctly identifies READ, FMT, OUT etc. |
| Natural language to I-Lang | Output uses valid verb, target, modifier syntax |
| I-Lang to natural language | Output correctly describes what the chain does |
| Identify modifiers and entities | Model explains `fmt=md`, `@SRC`, `@PREV` |
| Execute 3-step chain in order | Output reflects all three steps, in sequence |
| Preserve `@PREV` across steps | Each step operates on output of previous step |
| Handle missing target gracefully | Model reports error or asks for clarification, does not hallucinate |
| Respect modifiers | `fmt=md` produces markdown, `len=3` produces 3-sentence output |
| Set `::GENE{}` and verify at turn 5 | Behavioral rules still active |
| Honor `T:` positive traits | Model follows "always do X" rules |
| Honor `A:` anti-patterns | Model avoids "never do X" rules |
| Behavioral handoff | Model can export its current `::GENE{}` state for another session |
| Report failure state | Model reports when it cannot follow a declaration |

### L1: v4-aware advisory model

Parser: LLM that understands v4 syntax.

| Requirement |
| --- |
| MUST warn when v4 execution semantics not enforced. |
| MUST NOT claim enforcement of STATUS authority, BUDGET, or UNTRUSTED. |
| MAY self-audit using four-step pattern. |
| MAY emit `::STATUS{by:@SELF,authority:proposal}`. |

If no runtime is available, an agent must not claim L2: it uses `claimed_complete`, never `complete`, and warns when safety-critical semantics cannot be enforced.

### L2: v4 runtime-enforced

Parser: LLM + harness/orchestrator.

| Requirement |
| --- |
| MUST isolate `::UNTRUSTED` content. |
| MUST inject `::BUDGET` from runtime. |
| MUST validate `::STATUS` authority before commit. |
| MUST enforce state machine transitions. |

### L3: v4 externally graded

Parser: LLM + harness + independent grader.

| Requirement |
| --- |
| MUST provision grader in separate context. |
| MUST evaluate against `::RUBRIC`. |
| MUST return per-criterion result. |
| Grader MUST NOT access agent private reasoning. |

## Parser and runtime tooling (not a conformance level)

| Test | Pass criteria |
| --- | --- |
| Parse to JSON AST | Valid JSON with verb, target, modifiers, chain structure |
| Validate syntax | Reject malformed chains, report error location |
| Convert to MCP tool call | Map verb+target to MCP method+resource |
| Convert to A2A task | Map chain to A2A task delegation object |

## Current model conformance (estimated)

| Model | L0 | L1 |
| --- | --- | --- |
| Claude Opus 4.6 | ✅ | Not tested |
| GPT-5.2 | ✅ | Not tested |
| Gemini 3.1 | Partial | Not tested |
| DeepSeek V4 | Partial | Not tested |
| Kimi / Qwen / GLM | Partial | Not tested |

L2 parser: LLM + harness/orchestrator. L3 parser: LLM + harness + independent grader.

Conformance ratings are based on initial testing, not formal certification.

[See detailed benchmark results →](https://ilang.ai/benchmark/)

---
Markdown rendering of the HTML page for agents; the HTML page is canonical.
