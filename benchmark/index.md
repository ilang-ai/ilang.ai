# iLang Benchmark: LLM Recognition, Execution, and Token Reduction Tests | Protocol Testing
Source: https://ilang.ai/benchmark/

# Benchmark

How well do major LLMs recognize, translate, execute, and persist iLang instructions? Tested across 7 models, May 2026.

## Testing methodology

Each model is tested with identical prompts across five task categories. Tests are run in fresh sessions with no prior context. Results measure whether the model correctly recognizes, translates, executes, and preserves iLang syntax.

## Task categories

| Category | What it tests | Example prompt |
| --- | --- | --- |
| Recognize | Can the model identify iLang syntax when it appears | "What protocol is this: `[READ:@SRC\|path=data.csv]=>[STAT]=>[OUT]`" |
| Translate | Can the model convert natural language to iLang and back | "Convert this to iLang: read the sales CSV, filter revenue over 1000, output as markdown" |
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

Every figure below is a token count, not a word count or a character estimate, and the text behind each one is published so the count can be repeated. What structure saves depends almost entirely on what it is compared against, so the same request appears twice.

| Case | Natural language | iLang | Reduction | Text |
| --- | --- | --- | --- | --- |
| Six-step data request, written tersely | 58 tokens | 55 tokens | 5% | [on the compression page](https://ilang.ai/prompt-compression/) |
| The same request, as people actually send it | 169 tokens | 55 tokens | 67% | [on the compression page](https://ilang.ai/prompt-compression/) |
| Five behavioural rules, natural language vs `::GENE{}` | 74 tokens | 65 tokens | 12% | below |

Counted with OpenAI tiktoken, encoding cl100k_base. A terse rewrite of an instruction is already close to minimal, so the brackets and pipes of a chain cost about as much as the words they replace. The saving comes from the greetings, hedging and repetition that real prompts carry, and in a system prompt it is paid again on every turn.

### The five-rule case

```
You must check before you execute. Before running anything, verify the current state first.
When you start a new project, review the architecture before writing code.
Never execute blindly: acting without checking first is a fatal error.
Always confirm the target exists before you write to it.
When the user asks for a deletion, ask for confirmation first unless they have already approved it.
```

```
::GENE{verify_first|conf:confirmed|scope:global}
  T:check_before_execute
  T:architecture_review|when:new_project
  A:blind_execution⇒fatal
  T:confirm_target_exists|when:write
  T:ask_confirmation|when:delete&not_approved
```

## Common failure modes

| Failure | Description | Frequency |
| --- | --- | --- |
| Partial chain execution | Model executes first 2-3 steps, skips later steps | Occasional on smaller models |
| Declaration decay | `::GENE{}` rules followed in turn 1-3, ignored by turn 8+ | Common on all models in long sessions |
| Alias confusion | Greek aliases (Ω, Σ) interpreted as math symbols | Rare on major models |
| Modifier hallucination | Model invents modifiers not in the dictionary | Occasional |

## Reproduce these tests

We welcome community-submitted benchmark results for additional models.

---
Markdown rendering of the HTML page for agents; the HTML page is canonical.
