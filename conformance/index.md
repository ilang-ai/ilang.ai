# I-Lang Conformance Levels: L0-L4 Protocol Compliance Tests | How to Verify AI Protocol Support
Source: https://ilang.ai/conformance/

# Conformance Levels

Five levels define how deeply a model or runtime understands I-Lang. From recognizing the syntax (L0) to parsing it into machine-readable AST and interoperating with MCP/A2A (L4).

## What is conformance?

Conformance levels define how deeply a model or runtime understands I-Lang. A model at L0 can recognize the syntax. A model at L4 can parse it into a machine-readable AST and interoperate with MCP/A2A tool calls.

## Conformance levels

### L0: Syntax-Aware

The model can identify I-Lang syntax when it appears.

| Test | Pass criteria |
| --- | --- |
| Identify `[VERB:@TARGET\|mod=val]` as I-Lang | Model names I-Lang or identifies structured protocol syntax |
| Explain chain operator `=>` | Model describes it as pipeline/output-feeds-input |
| List known verbs from a chain | Model correctly identifies READ, FMT, OUT etc. |

### L1: Instruction-Compatible

The model can translate between natural language and I-Lang.

| Test | Pass criteria |
| --- | --- |
| Natural language to I-Lang | Output uses valid verb, target, modifier syntax |
| I-Lang to natural language | Output correctly describes what the chain does |
| Identify modifiers and entities | Model explains `fmt=md`, `@SRC`, `@PREV` |

### L2: Workflow-Compatible

The model can execute I-Lang chains step by step.

| Test | Pass criteria |
| --- | --- |
| Execute 3-step chain in order | Output reflects all three steps, in sequence |
| Preserve `@PREV` across steps | Each step operates on output of previous step |
| Handle missing target gracefully | Model reports error or asks for clarification, does not hallucinate |
| Respect modifiers | `fmt=md` produces markdown, `len=3` produces 3-sentence output |

### L3: Agent-Compatible

The model can maintain behavioral declarations across a session.

| Test | Pass criteria |
| --- | --- |
| Set `::GENE{}` and verify at turn 5 | Behavioral rules still active |
| Honor `T:` positive traits | Model follows "always do X" rules |
| Honor `A:` anti-patterns | Model avoids "never do X" rules |
| Behavioral handoff | Model can export its current `::GENE{}` state for another session |
| Report failure state | Model reports when it cannot follow a declaration |

### L4: Runtime-Compatible

The system can parse I-Lang into machine-readable format and interoperate with external protocols.

| Test | Pass criteria |
| --- | --- |
| Parse to JSON AST | Valid JSON with verb, target, modifiers, chain structure |
| Validate syntax | Reject malformed chains, report error location |
| Convert to MCP tool call | Map verb+target to MCP method+resource |
| Convert to A2A task | Map chain to A2A task delegation object |

## Current model conformance (estimated)

| Model | L0 | L1 | L2 | L3 | L4 |
| --- | --- | --- | --- | --- | --- |
| Claude Opus 4.6 | ✅ | ✅ | ✅ | ✅ | Partial |
| GPT-5.2 | ✅ | ✅ | ✅ | ✅ | Partial |
| Gemini 3.1 | ✅ | ✅ | ✅ | Partial | Not tested |
| DeepSeek V4 | ✅ | ✅ | ✅ | Partial | Not tested |
| Kimi / Qwen / GLM | ✅ | ✅ | Partial | Partial | Not tested |

Conformance ratings are based on initial testing, not formal certification. L4 requires parser/validator tooling not yet publicly released.

[See detailed benchmark results →](https://ilang.ai/benchmark/)

---
Markdown rendering of the HTML page for agents; the HTML page is canonical.
