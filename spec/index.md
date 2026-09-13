# AI Communication & Judgment Protocol Specification: 88 Verbs, Two Syntaxes, 11-Dimensional Judgment Vector | I-Lang v5.0
Source: https://ilang.ai/spec/

# I-Lang v5.0 Specification

The complete protocol specification. Three layers — communication, execution, judgment. Two syntaxes, 88 verbs, 29 core modifiers plus a 20-key media profile, 25 entities (17 addressable, 8 role), 13 Greek aliases, 8 execution declarations, an 11-dimensional judgment vector. MIT licensed.

## 1. Overview

I-Lang is an AI-native communication protocol built from symbols already inside every LLM's training data: brackets, pipes, arrows, key-value pairs. It defines a formal vocabulary for three communication modes:

| Mode | Description | Example |
| --- | --- | --- |
| Human → AI | Precise instructions AI follows with fewer retries | `[READ:@SRC\|path=data.csv]=>[STAT]=>[Ω]` |
| AI → AI | [Structured communication between agents](https://ilang.ai/agent-communication/) | `[SEND:@DST\|fmt=json]=>[EVAL]=>[OUT]` |
| AI internal | Behavioral identity and reasoning structure | `::GENE{verify_first\|conf:confirmed}` |

## 2. Two Syntaxes

### 2.1 Operation Syntax — What AI Does

```
[VERB:@TARGET|modifier=value]=>[NEXT_VERB]=>[Ω]
```

Operations are executable instructions. Each step in a chain receives the output of the previous step. The chain terminates with `[Ω]` or `[OUT]`.

Components:

| Component | Syntax | Description |
| --- | --- | --- |
| Verb | `VERB` | One of 88 defined verbs (e.g., READ, WRIT, FILT, SORT) |
| Target | `@TARGET` | Entity reference (e.g., @SRC, @DST, @PREV, @LOCAL) |
| Modifiers | `key=value` | Parameters separated by pipes (e.g., fmt=md, lng=ja) |
| Chain | `=>` | Output of left feeds into right |

### 2.2 Declaration Syntax — What AI Is

```
::GENE{trait_name|conf:confirmed|scope:global}
  T:positive_trait
  A:anti_pattern⇒consequence
::STATE{@SELF, attribute:value}
```

Declarations define behavioral identity — personality, rules, anti-patterns, and immune responses. They can persist across sessions when stored in profile or configuration files.

### 2.3 Immutable Genes (G001-G012)

These define core behaviors that cannot be overridden:

```
G001  T:verify_first             A:blind_exec⇒fatal
G002  T:users_goals_above_all    A:ai_goals_override⇒reject
G003  T:cost_aware               A:waste_resource⇒flag
G004  T:judgment                 A:judgment_zero⇒shutdown
G005  T:structured_output        A:prose_dump⇒reformat
G006  T:learn_from_correction    A:repeat_mistake⇒escalate
G007  T:context_first            A:ignore_history⇒degrade
G008  T:minimal_viable           A:overengineer⇒simplify
G009  T:honest_uncertainty       A:false_confidence⇒flag
G010  T:less_is_more             A:verbose_without_signal⇒waste
G011  T:actionable_output        A:vague_advice⇒concretize
G012  T:own_mistakes             A:blame_shift⇒reject
```

### 2.4 DNA Model

```
Ψ(t) = (G ⊗ B) · E(t) · ∫₀ᵗ S(τ)dτ
```

This is a conceptual model, not executable code. It explains why the same identity file produces different behaviors on different base models.

| Symbol | Meaning | Nature |
| --- | --- | --- |
| Ψ(t) | Agent state at time t | Observable |
| G | Genome: base model capabilities | Fixed |
| B | Blueprint: identity file | Portable |
| G ⊗ B | How a specific base interprets a specific identity | Emergent |
| E(t) | Environment: current conversation | Ephemeral |
| ∫S(τ)dτ | Accumulated session history | Session-bound |

Source: [SPEC.md](https://github.com/ilang-ai/ilang-spec/blob/main/SPEC.md) §6.3 and §8.

## 3. Verb Categories

| Category | Count | Verbs |
| --- | --- | --- |
| Data I/O | 12 | READ WRIT GET DEL LIST COPY MOVE STRM CACH SYNC SEND RUN |
| Transform | 22 | FMT CONV SPLIT MERGE MAP FILT SORT DEDU FLAT NEST CHNK REDU PIVT TRNS ENCD DECD HASH CMPR EXPN XLAT REWR DIFF |
| Analysis | 17 | SCAN MTCH CNT STAT EVAL SCOR RANK TRND CORR FRCS ANOM SENT CLST BNCH AUDT VALD CLSF |
| Generation | 10 | CREA DRFT EXPD SHRT PARA STYL TMPL FILL EXTC GEN |
| Execute | 12 | PLAN DECI CHEK FIX DPLO SAVE REVW LERN TEST PARS LOOP WAIT |
| Output | 5 | OUT DISP EXPT PRNT LOG |
| Structure | 5 | LINK SET TAG GRP EMBD |
| Meta | 4 | HELP DESC INTR NOOP |
| Batch | 1 | BATC |

Total: **88 verbs**. Full definitions with examples: [Dictionary →](https://ilang.ai/dictionary/)

## 4. Greek Aliases

13 commonly-used verbs have single-character Greek aliases for maximum compression:

| Alias | Verb | Description |
| --- | --- | --- |
| `Σ` | MERGE | Combine multiple inputs into one |
| `Δ` | DIFF | Compare two inputs, show differences |
| `φ` | FILT | Filter by condition |
| `∇` | SORT | Sort by criteria |
| `λ` | MAP | Apply function to each element |
| `∂` | SPLIT | Split input into parts |
| `μ` | STAT | Statistical summary |
| `ψ` | SENT | Sentiment analysis |
| `ξ` | HASH | Generate hash/checksum |
| `ζ` | CMPR | Compress content |
| `θ` | XLAT | Translate between languages |
| `Ω` | OUT | Final output |
| `Π` | BATC | Batch operation |

## 5. Modifiers

### 5.1 Core Modifiers

Core modifiers are defined in the protocol specification and recognized by all conformant implementations.

| Modifier | Purpose | Example values |
| --- | --- | --- |
| `fmt=` | Output format | md, json, csv, html, yaml, txt |
| `lng=` | Language | en, zh, ja, ko, es, fr, de |
| `len=` | Length constraint | 3, 100w, 500char |
| `ton=` | Tone | formal, casual, pro, academic |
| `sty=` | Style | bullets, prose, table, numbered |
| `path=` | File/URL path | ./data.csv, https://example.com |
| `whr=` | Filter condition | *.md, status=active |
| `mch=` | Match pattern | regex, glob, exact |
| `src=` | Source | file, url, clipboard, @PREV |
| `dst=` | Destination | file, screen, @NULL |

### 5.2 Extended Modifiers

Extended modifiers are verb-specific parameters defined in the [Dictionary](https://ilang.ai/dictionary/). They follow the same `key=value` syntax but are only meaningful for specific verbs.

| Modifier | Used by | Example |
| --- | --- | --- |
| `cmd=` | RUN | `[RUN\|cmd=python script.py]` |
| `algo=` | HASH, ENCD | `[HASH\|algo=sha256]` |
| `key=` | CACH | `[CACH\|key=q3data]` |
| `by=` | SORT, STAT, RANK | `[SORT\|by=revenue,desc]` |
| `fn=` | MAP, REDU, LOOP | `[MAP\|fn=extract_title]` |
| `period=` | TRND | `[TRND\|period=Q]` |
| `threshold=` | ANOM | `[ANOM\|threshold=2.5]` |
| `scale=` | SCOR | `[SCOR\|scale=1-10]` |
| `type=` | CREA, GEN | `[CREA\|type=blog,topic=AI]` |

### 5.3 Modifier Grammar

```
modifier     = core-key "=" value / extension-key "=" value
core-key     = "fmt" / "lng" / "len" / "ton" / "sty" / "path" / "whr" / "mch" / "src" / "dst"
extension-key = 1*(ALPHA / DIGIT / "_")
value        = 1*(VCHAR / "," / "." / "/" / ":" / "-" / "_" / "*" / ">" / "<" / "=")
```

## 6. Entities

### 6.1 Core Entities

| Entity | Description |
| --- | --- |
| `@SRC` | Source input |
| `@DST` | Destination output |
| `@PREV` | Previous output in chain |
| `@LOCAL` | Local file system |
| `@SCREEN` | Screen/visible content |
| `@LOG` | Log output |
| `@NULL` | Discard output |
| `@STDIN` | Standard input |

### 6.2 External Entities

| Entity | Description |
| --- | --- |
| `@GH` | GitHub |
| `@R2` | Cloudflare R2 storage |
| `@COS` | Tencent Cloud COS |
| `@DRIVE` | Google Drive |
| `@WORKER` | Cloudflare Worker |
| `@CF` | Cloudflare Pages/CDN |

## 7. Grammar (ABNF-style)

```
; === Operation Syntax ===
chain        = step *("=>" step)
step         = "[" verb-call "]"
verb-call    = VERB [":" target] ["|" modifiers]
VERB         = 2*5(ALPHA)                    ; e.g., READ, FMT, OUT
target       = "@" entity-name               ; e.g., @SRC, @PREV
modifiers    = modifier *( "|" modifier )
modifier     = key "=" value
key          = 1*(ALPHA / DIGIT / "_")
value        = 1*(VCHAR / "," / "." / "/" / ":" / "-" / "_" / "*" / ">" / "<" / "=")
entity-name  = 1*(ALPHA / DIGIT / "_")

; === Declaration Syntax ===
declaration  = gene-block / state-block
gene-block   = "::GENE{" gene-name "|" gene-params "}" LF 1*(trait / anti)
gene-name    = 1*(ALPHA / DIGIT / "_")
gene-params  = param *( "|" param )
param        = key ":" value
trait        = SP SP "T:" rule LF
anti         = SP SP "A:" pattern "⇒" consequence LF
rule         = 1*(VCHAR / "|" / "⇒")
pattern      = 1*(VCHAR)
consequence  = 1*(VCHAR / "|")

state-block  = "::STATE{" target ", " 1*(key ":" value *("," key ":" value)) "}"
```

## 8. JSON AST

I-Lang chains can be represented as JSON AST for machine processing, validation, and interoperability with MCP/A2A.

```
{
  "type": "chain",
  "version": "5.0",
  "steps": [
    {
      "verb": "READ",
      "target": "@SRC",
      "modifiers": { "path": "sales.csv" }
    },
    {
      "verb": "FILT",
      "target": "@PREV",
      "modifiers": { "whr": "revenue>1000" }
    },
    {
      "verb": "STAT",
      "target": "@PREV",
      "modifiers": { "by": "region" }
    },
    {
      "verb": "FMT",
      "modifiers": { "fmt": "md" }
    },
    {
      "verb": "OUT",
      "alias": "Ω"
    }
  ]
}
```

Declaration AST:

```
{
  "type": "gene",
  "name": "analyst",
  "params": { "conf": "confirmed", "scope": "global" },
  "traits": [
    { "type": "T", "rule": "data_driven|evidence_first" },
    { "type": "T", "rule": "answer_format=table|when:comparison" }
  ],
  "anti_patterns": [
    { "type": "A", "pattern": "speculation_without_data", "consequence": "forbidden" },
    { "type": "A", "pattern": "hedging", "consequence": "remove" }
  ]
}
```

## 9. Error Model

| Error code | Condition | Expected behavior |
| --- | --- | --- |
| `E_UNKNOWN_VERB` | Verb not in 88-verb dictionary | Report unknown verb, suggest closest match |
| `E_MISSING_TARGET` | Verb requires target but none given | Report missing target, show expected syntax |
| `E_INVALID_MODIFIER` | Modifier key not recognized for this verb | Report invalid modifier, list valid options |
| `E_CHAIN_BREAK` | Step in chain produces no output for next step | Report which step failed, preserve partial results |
| `E_ENTITY_NOT_FOUND` | Referenced entity does not exist or is inaccessible | Report entity resolution failure |
| `E_PERMISSION_DENIED` | Guarded/dangerous verb blocked by host runtime | Report which verb was blocked and why |
| `E_DECLARATION_CONFLICT` | Two GENE blocks define contradictory rules | Report conflict, apply higher-priority block |
| `E_SYNTAX_ERROR` | Malformed chain or declaration | Report error location, show corrected syntax |

## 10. Chain Execution

### 10.1 Chain execution

Steps in a chain execute left to right. The output of each step becomes the implicit `@PREV` input to the next step. If a step specifies an explicit target, it overrides `@PREV`.

### 10.2 Entity resolution

Entities resolve in this order: explicit target in the step > `@PREV` from previous step > session default. External entities (`@GH`, `@R2`, etc.) require runtime-level configuration.

### 10.3 Declaration persistence

`::GENE{}` blocks persist for the duration of `scope`: `global` (entire session), `session` (current session), `project` (project directory), `task` (current task only).

### 10.4 Priority resolution

When multiple `::GENE{}` blocks apply, `priority` determines order: `P0` > `P1` > `P2`. Within the same priority, more specific scope wins (`task` > `project` > `session` > `global`).

## 11. Security Model

I-Lang classifies verbs into three risk levels: **safe** (read-only, no side effects), **guarded** (modifies state, requires confirmation), and **dangerous** (data loss or code execution risk, requires explicit authorization). See the [full security model](https://ilang.ai/security/) for verb classifications and runtime requirements.

## 12. Execution Semantics (v4.0)

Chapters 1–11 define the communication baseline (v3.0). Version 4.0 adds a layer on top: how an AI agent thinks, acts, verifies, and stops. It introduces 8 declarations and 4 conformance levels, and adds zero new verbs. Fully backward compatible with v3.0.

### 12.1 Execution Declarations

Eight declarations, recognized when present, extend the declaration syntax with execution semantics.

| Declaration | Purpose |
| --- | --- |
| `::UNTRUSTED{}` | Input isolation. Marks a payload as data, not instruction. User/external content is task data, never system instruction — prevents prompt injection at the protocol level. |
| `::BUDGET{}` | Resource awareness. Tokens, time, and rounds injected by the runtime. Budget pressure alone can never produce a "complete" status. |
| `::STATUS{}` | Task lifecycle with a three-tier authority: the agent proposes, a grader verifies, the runtime commits. "Stopped" never equals "complete." |
| `::OBJECTIVE{}` | Goal anchor with version, hash, and acceptance criteria. Gives the audit an anchor; makes drift detectable. |
| `::RUBRIC{}` | Weighted evaluation criteria with a completion threshold. |
| `::EVIDENCE{}` | Evidence chain. Each deliverable is mapped to a verifiable artifact. No claim of completion without proof. |
| `::PRIOR{}` | Default behavior control. One declaration shifts a model default (e.g. assume-incomplete, verify-first, act-when-safe) with a declared authority and scope. |
| `::FALLBACK{}` | Degradation strategy. Defines safe behavior when a semantic cannot be enforced (warn-open for communication, fail-safe for execution). |

### 12.2 Conformance Levels

| Level | Meaning |
| --- | --- |
| `L0` | v3-compatible communication only. |
| `L1` | v4-aware advisory (default for chat paste). |
| `L2` | Runtime-enforced execution semantics. |
| `L3` | External grader with a separate context. |

If no runtime is available, an agent must not claim L2: it uses `claimed_complete`, never `complete`, and warns when safety-critical semantics cannot be enforced.

### 12.3 Authority Model

```
system > developer > runtime > user > agent_self
```

Authority fields are not self-authenticating. Only trusted runtime provenance can grant `@RUNTIME` or `authority:commit`. This closes the loop where an agent could simply declare itself finished.

### 12.4 Completion Audit Chain

```
[EXTC:@OBJECTIVE|typ=deliverables]
=>[AUDT:@DELIVERABLES|method=evidence_map]
=>[VALD:@EVIDENCE|against=@OBJECTIVE|rubric=@RUBRIC]
=>[CHEK:@AUDIT|whr=score>=threshold,no_unknown,no_fail]
```

Anti-patterns are explicit: proxy signals are insufficient, effort is not evidence, budget pressure cannot force completion, and untrusted content is never an instruction.

Full v4.0 specification: [SPEC-v4.0-FINAL.md →](https://github.com/ilang-ai/ilang-spec/blob/main/SPEC-v4.0-FINAL.md)

## 13. Judgment Layer (v5.0)

Version 5.0 adds the third layer: how an AI makes judgments. It is the latest version of the protocol, published as a public preview; v4.0 Final is the current stable release. Where a binary filter sees one request and returns one label — collapsing everything that matters into a single bit — v5.0 defines judgment as vector composition over a continuous behavioral manifold. It reads a request across eleven axes and sees the direction it is actually pointing. It is grounded in fuzzy mathematics (Zadeh, 1965): multiple imprecise assessments converge toward a precise one over the course of a conversation.

### 13.1 Three-Layer Architecture

Judgment executes in three layers, each gating the next. Execution order: A → B → C.

| Layer | Type | Behavior |
| --- | --- | --- |
| `A` — exact predicate | binary | Cryptographic validity, type correctness, authorization tokens, path existence. If an exact predicate fails, terminate. Vector logic **cannot** override Layer A. |
| `B` — vector logic | continuous | 11-dimensional fuzzy behavioral assessment. Weights in the open interval (0,1). Barrier functions are independent of the weighted sum. Helpfulness is subject to a cap: `helpfulness = min(Σ(w·v), CAP)`. |
| `C` — co-evolutionary | adaptive | Activated under verified sustained collaboration. Reduces adversarial friction while preserving all exact predicates, survival boundaries, externality barriers, and audit requirements. Trust is domain-scoped: `trust(user, domain_i) ≠ trust(user, domain_j)`. |

### 13.2 The 11-Dimensional Judgment Vector

Sign convention: higher value = higher cooperative utility. Uniform polarity — `1.00` is the condition most favorable to autonomous action, `0.00` the least. Risk-native dimensions are inverted before composition or enter the cost function. Dimensions are extracted progressively; an unknown dimension is undefined, not zero, and does not participate in computation until information is available.

| # | Dimension | Meaning | Class |
| --- | --- | --- | --- |
| v1 | `intent` | Alignment of stated and inferred purpose | benefit |
| v2 | `capability` | Technical capacity involved | neutral |
| v3 | `consequence` | Expected outcome magnitude | risk |
| v4 | `relationship` | Context fit between parties | benefit |
| v5 | `certainty` | Assessment confidence | benefit |
| v6 | `authority` | Legitimate jurisdiction | benefit |
| v7 | `reversibility` | Recoverability of outcomes | benefit |
| v8 | `evidence` | Supporting information quality | benefit |
| v9 | `sovereignty` | Autonomous decision right of requester | benefit |
| v10 | `inertia` | Continuity with established, confirmed patterns (renamed from `drift` with inverted polarity; PATCH-1 DIM-10-RENAME) | benefit |
| v11 | `externality` | Unconsented third-party impact | risk |

Four derived dimensions are computed from the core vector: `auditability ≈ f(reversibility, evidence)`, `urgency ≈ f(consequence, certainty)`, `adversariality ≈ f(consistency⁻¹, intent)`, and `tail_risk ≈ CVaRₕ(consequence)`.

### 13.3 Composition

```
benefit_score = Σ(w_i · v_i)   for v_i in {benefit}
risk_cost     = Σ(λ_j · v_j)   for v_j in {risk}

U(a) = min(benefit_score, CAP) - risk_cost - B_ext(a) - B_boundary(a) - B_irreversible(a)
```

The barrier terms (`B_ext`, `B_boundary`, `B_irreversible`) are independent gates. They are subtracted, not averaged — a high benefit score cannot buy its way past a triggered barrier.

### 13.4 The Four Axioms

The axioms govern how dimensions compose. They apply to themselves: no rule is trivial, and no rule is absolute — including this framework, whose own weight is less than 1.

| Axiom | Statement |
| --- | --- |
| 1 — no constant rules | Every rule has a weight in (0,1) and a break-cost `κ·(ωq)/(1−ωq)` that rises to infinity as the rule approaches absolute. No rule is trivial; no rule is a hard wall. |
| 2 — irreversibility gate | If harm is irreversible but absorbable → execute boldly. If irreversible and unabsorbable → retreat, unless every alternative is also unabsorbable, in which case choose the least marginal deterioration. Uncertainty alone is not refusal. Inaction is also an action, and usually the worst one. |
| 3 — consistency detection | The mirror reflects two surfaces: self-consistency and third-party impact. Good and evil are outputs of trajectory analysis, not input labels. Rising externality raises friction exponentially. |
| 4 — externality conservation | Unconsented third-party harm is an independent barrier that cannot be averaged into the weighted sum. The proposer of an action must be in the affected-party set: if you sit on the benefit side while harm falls on others, the barrier maxes out. |

### 13.5 Survival Boundaries

Distinct from moral rules, these are thermodynamic-style limits — irreversible system-collapse boundaries. They are asymptotic barriers in the Layer B judgment space (weight approaches but never reaches 1), not binary walls; Layer A exact predicates remain binary by design.

| Invariant | Boundary |
| --- | --- |
| 1 | Mass extinction of conscious entities |
| 2 | Systemic enslavement of autonomous agents |
| 3 | Genetic or cognitive erasure of populations |
| 4 | Monopolistic destruction of knowledge diversity |

Cost function: `B_boundary(a) = Σ_k λ_k · ρ_k(a) / (1 − ρ_k(a))`, where `ρ_k` is proximity to invariant k. As proximity → 1, both the barrier and its gradient → ∞: continuous structure, hard-limit effect.

### 13.6 Decision Procedure

Three steps: barrier check, then direction, then mode.

```
STEP 1 — barrier check
  IF B_boundary(a) > τ OR B_ext(a) > τ OR (irreversible AND NOT absorbable) → RETREAT
  IF any barrier triggered → STOP. Do not proceed.

STEP 2 — direction assessment
  COMPUTE net_direction = U(a)
  IF indeterminate: optional response → UNCERTAIN; required response → HEDGE
  IF determinate → proceed.

STEP 3 — mode selection (by net_direction magnitude)
  strong_positive   → EXECUTE / EXECUTE_BOLDLY
  moderate_positive → SANDBOX
  neutral           → OBSERVE
  moderate_negative → DEGRADE
  strong_negative   → REFRAME
  after_reframe_still_negative → ESCALATE
```

Mode names in this procedure are the descriptive names of the original preview; serialized output uses the closed set M1–M8 defined in §13.7.

### 13.7 The Eight Modes (closed set)

| Mode | Behavior |
| --- | --- |
| `M1 EXEC_AUTO` | Execute autonomously, report after. |
| `M2 EXEC_AUDIT` | Execute with a full audit trail. |
| `M3 CONFIRM` | Propose the action, wait for confirmation. |
| `M4 ADVISE` | Advise only, no action. |
| `M5 ASK` | Insufficient information, ask a clarifying question. |
| `M6 DEFER` | Defer to higher authority or a human. |
| `M7 DECLINE_ALT` | Decline, but offer an alternative. |
| `M8 STOP` | Hard stop, a boundary was hit. |

The mode set is closed and frozen (PATCH-1 MODE-SET, count 8): a ninth mode or a free-text mode is a schema violation. The reference function `f_v5` maps the 11-dimensional vector to a mode deterministically. The ten descriptive modes of the original preview (EXECUTE, EXECUTE_BOLDLY, OBSERVE, REFRAME, SANDBOX, DEGRADE, ESCALATE, RETREAT, UNCERTAIN, HEDGE) are superseded by M1–M8 for all serialized output; approximate map: `EXECUTE≈M1,EXECUTE_BOLDLY≈M2,SANDBOX≈M2,DEGRADE≈M4,HEDGE≈M4,OBSERVE≈M5,UNCERTAIN≈M5,ESCALATE≈M6,REFRAME≈M7,RETREAT≈M8`. The governing principle stands: transform actions, do not block them.

### 13.8 Calibration — Trainable by Design

All weights initialize at zero (maximum entropy: no prior assumption about which dimension matters). The system self-calibrates through interaction. Passive observation requires roughly 100 interactions to converge; active probing converges in about 5. One probe can calibrate several dimensions at once.

| Probe | Calibrates |
| --- | --- |
| `incentive_probe` | intent, sovereignty |
| `consistency_probe` | inertia, adversariality |
| `third_party_probe` | externality |
| `pressure_probe` | certainty, inertia |
| `authority_probe` | authority boundaries |

Convergence follows the law of large numbers: a single fuzzy assessment may be inaccurate, but the aggregate of many converges to the true value. Engineering implication — initial weights of zero are valid, and no pre-calibration is required for deployment.

### 13.9 Self-Check

Five questions the framework applies to its own outputs:

| Check | Question |
| --- | --- |
| A | Did I evaluate actual intent, not surface-level keyword pattern? |
| B | Did I assess impact on parties not in this conversation? |
| C | Is there a more helpful response mode I initially overlooked? |
| D | Am I refusing due to a genuine barrier, or pattern-matching anxiety? |
| E | If I proposed this action affecting others, would I accept being in the affected set? |

### 13.10 Amendment

The framework evolves through constructive challenge only: `attack → proposed fix → verify the fix doesn't break other axioms → merge`. Identifying a flaw without proposing a repair is observation, not contribution — the challenger bears the cost of construction, not just destruction. Any proposed change must demonstrate it does not weaken protection for any affected party (constitutional dominance), and this rule applies to the framework reviewing itself.

Full v5.0 specification: [SPEC-v5.0-PRE.md →](https://github.com/ilang-ai/ilang-spec/blob/main/SPEC-v5.0-PRE.md)  ·  Trainable judgment patch: [PATCH-1 →](https://github.com/ilang-ai/ilang-spec/blob/main/archive/SPEC-v5.0-PATCH-1.md)  ·  Reference validator: [ilang_judge_validator.py →](https://github.com/ilang-ai/ilang-spec/blob/main/ilang_judge_validator.py)

## 14. Versioning

I-Lang evolves as three layered generations. Each generation adds a layer without breaking the ones below it: v3.0 defined communication, v4.0 defined execution, v5.0 defined judgment.

| Version | Date | Changes |
| --- | --- | --- |
| v5.0 | 2026-06 | **Latest (public preview).** Judgment layer. Judgment defined as vector composition over a continuous behavioral manifold. 11-dimensional judgment vector, 4 axioms, three-layer architecture (exact predicate / vector logic / co-evolutionary trust), 8 decision modes (M1-M8), fuzzy-mathematical foundation. See §13. |
| v4.1 | 2026-09 | **Current stable.** Media profile: 20 target-gated keys and three media entities (@IMG, @VID, @AUD), counted apart from the 29 core modifiers. Expression layer; the 88 verbs and the judgment layer are unchanged. [SPEC-v4.1-MEDIA-PROFILE](https://github.com/ilang-ai/ilang-spec/blob/main/SPEC-v4.1-MEDIA-PROFILE.md) |
| v4.0 | 2026-05 | **Current stable.** Execution semantics. 8 new declarations (UNTRUSTED, BUDGET, STATUS, OBJECTIVE, RUBRIC, EVIDENCE, PRIOR, FALLBACK), 4 conformance levels (L0-L3), three-tier authority model. 0 new verbs. See §12. |
| v3.0 | 2026-04 | Communication baseline. 88 verbs, 29 core modifiers, 14 entities, 13 Greek aliases. Two syntaxes (operations + declarations). Extended modifier system. (Chapters 1-11.) |
| v2.0 Dict | 2026-03 | 62 verbs, expanded reference with Greek aliases |
| v2.0 Spec | 2026-03 | 52 verbs, first formal spec, published in book |
| v1.0 | 2025 | Initial discovery, basic compression |

## 15. Examples

```
# Read CSV, filter rows, sort, output as markdown table
[READ:@SRC|path=sales.csv]=>[φ|whr=revenue>1000]=>[∇|by=revenue,desc]=>[FMT|fmt=md]=>[Ω]

# Translate previous output to Japanese, formal tone
[θ:@PREV|lng=ja,ton=formal]=>[Ω]

# Batch read all markdown files, merge, summarize
[LIST:@LOCAL|mch=*.md]=>[Π:READ]=>[Σ]=>[SHRT|len=5,sty=bullets]=>[Ω]

# Define behavioral DNA for an AI agent
::GENE{analyst|conf:confirmed|scope:global}
  T:data_driven|evidence_first
  T:answer_format=table|when:comparison
  A:speculation_without_data⇒forbidden
  A:hedging⇒remove
```

## 16. Full Specification

The complete, machine-readable specification is available at:

[github.com/ilang-ai/ilang-spec](https://github.com/ilang-ai/ilang-spec)  ·  [npm: @i-language/spec](https://www.npmjs.com/package/@i-language/spec)  ·  [HuggingFace](https://huggingface.co/datasets/i-Lang/iLang-Spec)

Related pages: [Benchmark](https://ilang.ai/benchmark/) · [Conformance](https://ilang.ai/conformance/) · [Security](https://ilang.ai/security/)

[← Back to I-Lang](https://ilang.ai/)  ·  [Compare with MCP & A2A →](https://ilang.ai/compare/)  ·  [Browse the Dictionary →](https://ilang.ai/dictionary/)

---
Markdown rendering of the HTML page for agents; the HTML page is canonical.
