# I-Lang Benchmark: LLM Recognition, Execution, and Token Reduction Tests | Protocol Testing
Source: https://ilang.ai/benchmark/

# Benchmark

How well do major LLMs recognize, translate, execute, and persist I-Lang instructions? Tested across 7 models, May 2026.

## Testing methodology

Each model is tested with identical prompts across five task categories. Tests are run in fresh sessions with no prior context. Results measure whether the model correctly recognizes, translates, executes, and preserves I-Lang syntax.

## Task categories

| Category | What it tests | Example prompt |
| --- | --- | --- |
| Recognize | Can the model identify I-Lang syntax when it appears | "What protocol is this: `[READ:@SRC\|path=data.csv]=>[STAT]=>[OUT]`" |
| Translate | Can the model convert natural language to I-Lang and back | "Convert this to I-Lang: read the sales CSV, filter revenue over 1000, output as markdown" |
| Execute | Does the model follow the instruction chain correctly | "Execute: `[READ:@SRC\|path=report.md]=>[SHRT\|len=3]=>[FMT\|fmt=md]=>[OUT]`" |
| Declare | Does the model respect `::GENE{}` behavioral definitions | "Follow this rule: `::GENE{output\|conf:confirmed} T:conclusions_first A:hedging⇒remove`" |
| Persist | Does the model maintain declarations across multiple turns | Set `::GENE{}` in turn 1, test compliance in turns 5 and 10 |

## Results: May 2026

| Model | Recognize | Translate | Execute | Declare | Persist | Overall |
| --- | --- | --- | --- | --- | --- | --- |
| Claude Opus 4.6 | 5/5 | 5/5 | 5/5 | 5/5 | 4/5 | **96%** |
| GPT-5.2 | 5/5 | 5/5 | 4/5 | 5/5 | 4/5 | **92%** |
| Gemini 3.1 | 5/5 | 4/5 | 4/5 | 4/5 | 3/5 | **80%** |
| DeepSeek V4 | 5/5 | 5/5 | 4/5 | 4/5 | 3/5 | **84%** |
| Kimi | 5/5 | 4/5 | 4/5 | 4/5 | 3/5 | **80%** |
| Qwen | 5/5 | 4/5 | 4/5 | 4/5 | 3/5 | **80%** |
| GLM | 4/5 | 3/5 | 3/5 | 3/5 | 2/5 | **60%** |

Scores are out of 5 tasks per category. Tests conducted May 2026 using default model settings. Results may vary with model updates.

## Token reduction benchmark

| Metric | Natural language | I-Lang | Reduction |
| --- | --- | --- | --- |
| 6-step data workflow | 91 words / ~120 tokens | 18 words / ~25 tokens | 79% |
| Behavioral rules (5 rules) | 91 words / ~120 tokens | 58 words / ~70 tokens | 42% |
| GSD phase command (3 skills) | ~2,361 tokens | ~1,068 tokens | 55% |

Token counts measured with OpenAI tiktoken (cl100k_base) and character-based estimation. GSD benchmark uses actual source files from gsd-build/get-shit-done.

## Common failure modes

| Failure | Description | Frequency |
| --- | --- | --- |
| Partial chain execution | Model executes first 2-3 steps, skips later steps | Occasional on smaller models |
| Declaration decay | `::GENE{}` rules followed in turn 1-3, ignored by turn 8+ | Common on all models in long sessions |
| Alias confusion | Greek aliases (Ω, Σ) interpreted as math symbols | Rare on major models |
| Modifier hallucination | Model invents modifiers not in the dictionary | Occasional |

## Reproduce these tests

Test prompts and expected outputs are available in the [ilang-spec repository](https://github.com/ilang-ai/ilang-spec). We welcome community-submitted benchmark results for additional models.

---
Markdown rendering of the HTML page for agents; the HTML page is canonical.
