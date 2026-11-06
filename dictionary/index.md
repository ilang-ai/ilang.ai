# Structured AI Communication Dictionary: 88 Verbs in 9 Categories | iLang Protocol
Source: https://ilang.ai/dictionary/

# iLang Verb Dictionary

88 verbs across 9 categories. Each verb has a 4-letter mnemonic, a definition, and a usage example. This is the core vocabulary of iLang — the communication layer, unchanged since v3.0 and carried through v5.0. Each verb also carries a plain word (CHECK for CHEK) that the lookup API accepts, and a measured token cost in four public tokenizers; see Machine cost below.

**Quick navigation:** [Data I/O](https://ilang.ai/dictionary/#data-i-o) · [Transform](https://ilang.ai/dictionary/#transform) · [Analysis](https://ilang.ai/dictionary/#analysis) · [Generation](https://ilang.ai/dictionary/#generation) · [Execute](https://ilang.ai/dictionary/#execute) · [Output](https://ilang.ai/dictionary/#output) · [Structure](https://ilang.ai/dictionary/#structure) · [Meta](https://ilang.ai/dictionary/#meta) · [Batch](https://ilang.ai/dictionary/#batch)

## Data I/O 12 verbs

READ

Read content from source

[READ:@SRC|path=report.pdf]

WRIT

Write content to destination (word: WRITE)

[WRIT:@DST|path=output.md]

GET

Fetch from URL or API

[GET:@SRC|path=https://api.example.com/data]

DEL

Delete content or file (word: DELETE)

[DEL:@LOCAL|path=temp.txt]

LIST

List files or items

[LIST:@LOCAL|mch=*.md]

COPY

Copy content

[COPY:@SRC|dst=@DST]

MOVE

Move content

[MOVE:@SRC|dst=archive/]

STRM

Stream content progressively (word: STREAM)

[STRM:@SRC|path=large.csv]

CACH

Cache for reuse (word: CACHE)

[CACH:@PREV|path=q3data]

SYNC

Synchronize between sources

[SYNC:@SRC|dst=@DST]

SEND

Send to external destination

[SEND:@DST|fmt=json]

RUN

Execute command or script

[RUN|cmd=python script.py]

## Transform 22 verbs

FMT

Format output (word: FORMAT)

[FMT:@PREV|fmt=md]

CONV

Convert between formats (word: CONVERT)

[CONV:@SRC|src=csv,dst=json]

SPLIT

Split into parts (alias: ∂)

[∂:@PREV|by=paragraph]

MERGE

Merge multiple inputs (alias: Σ)

[Σ:@PREV]

MAP

Apply function to each item (alias: λ)

[λ:@PREV|fn=summarize]

FILT

Filter by condition (alias: φ; word: FILTER)

[φ:@PREV|whr=score>80]

SORT

Sort by criteria (alias: ∇)

[∇:@PREV|by=date,desc]

DEDU

Remove duplicates (word: DEDUPE)

[DEDU:@PREV|col=email]

FLAT

Flatten nested structure (word: FLATTEN)

[FLAT:@PREV|dep=2]

NEST

Create nested structure

[NEST:@PREV|grp=category]

CHNK

Split into sized chunks (word: CHUNK)

[CHNK:@PREV|cap=500]

REDU

Reduce to single value (word: REDUCE)

[REDU:@PREV|whr=sum]

PIVT

Pivot table transformation (word: PIVOT)

[PIVT:@PREV|row=month,col=product]

TRNS

Transpose rows and columns (word: TRANSPOSE)

[TRNS:@PREV]

ENCD

Encode content (word: ENCODE)

[ENCD:@PREV|fmt=base64]

DECD

Decode content (word: DECODE)

[DECD:@PREV|fmt=base64]

HASH

Generate hash (alias: ξ)

[ξ:@PREV|algo=sha256]

CMPR

Compress content (alias: ζ; word: COMPRESS)

[ζ:@PREV|fmt=gzip]

EXPN

Expand/decompress (word: DECOMPRESS)

[EXPN:@PREV]

XLAT

Translate language (alias: θ; word: TRANSLATE)

[θ:@PREV|lng=ja,ton=formal]

REWR

Rewrite content (word: REWRITE)

[REWR:@PREV|ton=casual]

DIFF

Compare differences (alias: Δ)

[Δ:@SRC|dst=@DST]

## Analysis 17 verbs

SCAN

Scan for patterns

[SCAN:@SRC|mch=email]

MTCH

Match against pattern (word: MATCH)

[MTCH:@PREV|mch="\d{4}-\d{2}",typ=regex]

CNT

Count items (word: COUNT)

[CNT:@PREV]

STAT

Statistical summary (alias: μ; word: STATS)

[μ:@PREV]

EVAL

Evaluate quality or correctness (word: EVALUATE)

[EVAL:@PREV|whr=accuracy]

SCOR

Score or rate (word: SCORE)

[SCOR:@PREV|rng=1:10]

RANK

Rank by criteria

[RANK:@PREV|srt=relevance]

TRND

Identify trends (word: TREND)

[TRND:@PREV|grp=month]

CORR

Find correlations (word: CORRELATE)

[CORR:@PREV|col=price,demand]

FRCS

Forecast future values (word: FORECAST)

[FRCS:@PREV|to="+6 months"]

ANOM

Detect anomalies (word: ANOMALY)

[ANOM:@PREV|whr="beyond 2 sigma"]

SENT

Sentiment analysis (alias: ψ; word: SENTIMENT)

[ψ:@PREV]

CLST

Cluster similar items (word: CLUSTER)

[CLST:@PREV|lim=5]

BNCH

Benchmark comparison (word: BENCHMARK)

[BNCH:@PREV|whr="baseline v2"]

AUDT

Audit for compliance (word: AUDIT)

[AUDT:@PREV|whr=gdpr]

VALD

Validate data (word: VALIDATE)

[VALD:@PREV|src=schemas/user.json]

CLSF

Classify into categories (word: CLASSIFY)

[CLSF:@PREV|typ="spam,ham"]

## Generation 10 verbs

CREA

Create new content (word: CREATE)

[CREA|type=blog,topic=AI protocols]

DRFT

Draft initial version (word: DRAFT)

[DRFT|type=email,ton=formal]

EXPD

Expand with more detail (word: EXPAND)

[EXPD:@PREV|len=2x]

SHRT

Shorten content (word: SHORTEN)

[SHRT:@PREV|len=3,sty=bullets]

PARA

Paraphrase (word: PARAPHRASE)

[PARA:@PREV|ton=simple]

STYL

Apply style (word: STYLE)

[STYL:@PREV|sty=academic]

TMPL

Apply template (word: TEMPLATE)

[TMPL|name=meeting_notes]

FILL

Fill template with data

[FILL:@PREV|src=@SRC]

EXTC

Extract specific content (word: EXTRACT)

[EXTC:@SRC|typ=email]

GEN

Generate from specification (word: GENERATE)

[GEN|spec=api_endpoint]

## Execute 12 verbs

PLAN

Create execution plan

[PLAN|goal=migrate database]

DECI

Make decision (word: DECIDE)

[DECI:@PREV|whr="cost,speed"]

CHEK

Check status or validity (word: CHECK)

[CHEK:@SRC|typ=syntax]

FIX

Fix errors

[FIX:@PREV|typ=grammar]

DPLO

Deploy to target (word: DEPLOY)

[DPLO:@PREV|dst=production]

SAVE

Save current state

[SAVE:@PREV|path=checkpoint.json]

REVW

Review and critique (word: REVIEW)

[REVW:@PREV|whr=security]

LERN

Learn from input (word: LEARN)

[LERN:@SRC|typ=feedback]

TEST

Test functionality

[TEST:@PREV|typ=unit]

PARS

Parse structured content (word: PARSE)

[PARS:@SRC|fmt=json]

LOOP

Iterate over items

[LOOP:@PREV|op=RUN]

WAIT

Wait for condition

[WAIT|until=ready]

## Output 5 verbs

OUT

Final output (alias: Ω; word: OUTPUT)

[Ω]

DISP

Display formatted (word: DISPLAY)

[DISP:@PREV|fmt=chart]

EXPT

Export to file (word: EXPORT)

[EXPT:@PREV|path=report.pdf]

PRNT

Print to console (word: PRINT)

[PRNT:@PREV]

LOG

Log for debugging

[LOG:@PREV|typ=info]

## Structure 5 verbs

LINK

Create association

[LINK:@SRC|dst=@DST,typ=parent]

SET

Set variable or state

[SET|key=mode,val=production]

TAG

Add tags/labels

[TAG:@PREV|typ="urgent,review"]

GRP

Group by criteria (word: GROUP)

[GRP:@PREV|grp=department]

EMBD

Embed content (word: EMBED)

[EMBD:@SRC|dst=@DST]

## Meta 4 verbs

HELP

Show help

[HELP|topic=FILT]

DESC

Describe content (word: DESCRIBE)

[DESC:@PREV]

INTR

Introspect state (word: INTROSPECT)

[INTR:@SELF]

NOOP

No operation

[NOOP]

## Batch 1 verbs

BATC

Batch operation (alias: Π; word: BATCH)

[Π:READ|src=file1,file2,file3]

Full machine-readable spec: [github.com/ilang-ai/ilang-dict](https://github.com/ilang-ai/ilang-dict)  ·  [npm: @i-language/spec](https://www.npmjs.com/package/@i-language/spec)

[← Back to iLang](https://ilang.ai/)  ·  [Read the Full Spec →](https://ilang.ai/spec/)  ·  [Compare with MCP & A2A →](https://ilang.ai/mcp-vs-a2a/)

---
Markdown rendering of the HTML page for agents; the HTML page is canonical.

## Machine cost

Every entry in the dictionary now carries a plain word (CHECK for CHEK, where for whr), accepted by the lookup API, and the number of tokens the bare symbol costs in four public tokenizers: OpenAI cl100k_base and o200k_base, DeepSeek-V3 and Qwen3. Measured 2026-11-06 with token_cost.py (https://github.com/ilang-ai/ilang-dict/blob/main/tools/token_cost.py); the columns are in train.csv and in https://ilang.ai/ai/data.json.

| Symbols | cl100k | o200k | DeepSeek-V3 | Qwen3 |
| --- | --- | --- | --- | --- |
| `::` `=>` `\|` `{` `}` `[` `]` `@` | 1 token each | 1 | 1 | 1 |
| `⇒` | 3 | 1 | 1 | 1 |
| Greek aliases, share that is one token | 30% | 84% | 100% | 100% |
| Verbs, share that is one token | 37% | 32% | 14% | 37% |
| CHEK / CHECK | 2 / 1 | 2 / 1 | 2 / 1 | 2 / 1 |
| whr / where | 2 / 1 | 2 / 1 | 2 / 1 | 2 / 1 |

The structural symbols are the native units; a four-letter mnemonic is not. Several mnemonics cost more than the word they shorten, and line for line an iLang declaration costs about as many tokens as the same instruction written tersely in English or Chinese. iLang is not a compression format; the mnemonic is kept because the canon is frozen on it and the validator checks it, and the word is there so a model that writes the natural spelling still lands on the entry.
