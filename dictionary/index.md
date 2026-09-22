# Structured AI Communication Dictionary: 88 Verbs in 9 Categories | iLang Protocol
Source: https://ilang.ai/dictionary/

# iLang Verb Dictionary

88 verbs across 9 categories. Each verb has a 4-letter mnemonic, a definition, and a usage example. This is the core vocabulary of iLang — the communication layer, unchanged since v3.0 and carried through v5.0.

**Quick navigation:** [Data I/O](https://ilang.ai/dictionary/#data-i-o) · [Transform](https://ilang.ai/dictionary/#transform) · [Analysis](https://ilang.ai/dictionary/#analysis) · [Generation](https://ilang.ai/dictionary/#generation) · [Execute](https://ilang.ai/dictionary/#execute) · [Output](https://ilang.ai/dictionary/#output) · [Structure](https://ilang.ai/dictionary/#structure) · [Meta](https://ilang.ai/dictionary/#meta) · [Batch](https://ilang.ai/dictionary/#batch)

## Data I/O 12 verbs

READ

Read content from source

[READ:@SRC|path=report.pdf]

WRIT

Write content to destination

[WRIT:@DST|path=output.md]

GET

Fetch from URL or API

[GET:@SRC|path=https://api.example.com/data]

DEL

Delete content or file

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

Stream content progressively

[STRM:@SRC|path=large.csv]

CACH

Cache for reuse

[CACH:@PREV|key=q3data]

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

Format output

[FMT:@PREV|fmt=md]

CONV

Convert between formats

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

Filter by condition (alias: φ)

[φ:@PREV|whr=score>80]

SORT

Sort by criteria (alias: ∇)

[∇:@PREV|by=date,desc]

DEDU

Remove duplicates

[DEDU:@PREV|by=email]

FLAT

Flatten nested structure

[FLAT:@PREV|depth=2]

NEST

Create nested structure

[NEST:@PREV|by=category]

CHNK

Split into sized chunks

[CHNK:@PREV|size=500w]

REDU

Reduce to single value

[REDU:@PREV|fn=sum]

PIVT

Pivot table transformation

[PIVT:@PREV|rows=month,cols=product]

TRNS

Transpose rows and columns

[TRNS:@PREV]

ENCD

Encode content

[ENCD:@PREV|fmt=base64]

DECD

Decode content

[DECD:@PREV|fmt=base64]

HASH

Generate hash (alias: ξ)

[ξ:@PREV|algo=sha256]

CMPR

Compress content (alias: ζ)

[ζ:@PREV|fmt=gzip]

EXPN

Expand/decompress

[EXPN:@PREV]

XLAT

Translate language (alias: θ)

[θ:@PREV|lng=ja,ton=formal]

REWR

Rewrite content

[REWR:@PREV|ton=casual]

DIFF

Compare differences (alias: Δ)

[Δ:@SRC|dst=@DST]

## Analysis 17 verbs

SCAN

Scan for patterns

[SCAN:@SRC|mch=email]

MTCH

Match against pattern

[MTCH:@PREV|pat=\d{4}-\d{2}]

CNT

Count items

[CNT:@PREV]

STAT

Statistical summary (alias: μ)

[μ:@PREV]

EVAL

Evaluate quality or correctness

[EVAL:@PREV|criteria=accuracy]

SCOR

Score or rate

[SCOR:@PREV|scale=1-10]

RANK

Rank by criteria

[RANK:@PREV|by=relevance]

TRND

Identify trends

[TRND:@PREV|period=monthly]

CORR

Find correlations

[CORR:@PREV|vars=price,demand]

FRCS

Forecast future values

[FRCS:@PREV|horizon=6m]

ANOM

Detect anomalies

[ANOM:@PREV|threshold=2sigma]

SENT

Sentiment analysis (alias: ψ)

[ψ:@PREV]

CLST

Cluster similar items

[CLST:@PREV|k=5]

BNCH

Benchmark comparison

[BNCH:@PREV|baseline=v2]

AUDT

Audit for compliance

[AUDT:@PREV|standard=gdpr]

VALD

Validate data

[VALD:@PREV|schema=user]

CLSF

Classify into categories

[CLSF:@PREV|categories=spam,ham]

## Generation 10 verbs

CREA

Create new content

[CREA|type=blog,topic=AI protocols]

DRFT

Draft initial version

[DRFT|type=email,ton=formal]

EXPD

Expand with more detail

[EXPD:@PREV|len=2x]

SHRT

Shorten content

[SHRT:@PREV|len=3,sty=bullets]

PARA

Paraphrase

[PARA:@PREV|ton=simple]

STYL

Apply style

[STYL:@PREV|sty=academic]

TMPL

Apply template

[TMPL|name=meeting_notes]

FILL

Fill template with data

[FILL:@PREV|data=@SRC]

EXTC

Extract specific content

[EXTC:@SRC|type=emails]

GEN

Generate from specification

[GEN|spec=api_endpoint]

## Execute 12 verbs

PLAN

Create execution plan

[PLAN|goal=migrate database]

DECI

Make decision

[DECI:@PREV|criteria=cost,speed]

CHEK

Check status or validity

[CHEK:@SRC|type=syntax]

FIX

Fix errors

[FIX:@PREV|type=grammar]

DPLO

Deploy to target

[DPLO:@PREV|dst=production]

SAVE

Save current state

[SAVE:@PREV|path=checkpoint.json]

REVW

Review and critique

[REVW:@PREV|focus=security]

LERN

Learn from input

[LERN:@SRC|type=feedback]

TEST

Test functionality

[TEST:@PREV|type=unit]

PARS

Parse structured content

[PARS:@SRC|fmt=json]

LOOP

Iterate over items

[LOOP:@PREV|fn=process]

WAIT

Wait for condition

[WAIT|until=ready]

## Output 5 verbs

OUT

Final output (alias: Ω)

[Ω]

DISP

Display formatted

[DISP:@PREV|fmt=chart]

EXPT

Export to file

[EXPT:@PREV|path=report.pdf]

PRNT

Print to console

[PRNT:@PREV]

LOG

Log for debugging

[LOG:@PREV|level=info]

## Structure 5 verbs

LINK

Create association

[LINK:@SRC|dst=@DST|rel=parent]

SET

Set variable or state

[SET|key=mode,val=production]

TAG

Add tags/labels

[TAG:@PREV|tags=urgent,review]

GRP

Group by criteria

[GRP:@PREV|by=department]

EMBD

Embed content

[EMBD:@SRC|into=@DST]

## Meta 4 verbs

HELP

Show help

[HELP|topic=FILT]

DESC

Describe content

[DESC:@PREV]

INTR

Introspect state

[INTR:@SELF]

NOOP

No operation

[NOOP]

## Batch 1 verbs

BATC

Batch operation (alias: Π)

[Π:READ|src=file1,file2,file3]

Full machine-readable spec: [github.com/ilang-ai/ilang-dict](https://github.com/ilang-ai/ilang-dict)  ·  [npm: @i-language/spec](https://www.npmjs.com/package/@i-language/spec)

[← Back to iLang](https://ilang.ai/)  ·  [Read the Full Spec →](https://ilang.ai/spec/)  ·  [Compare with MCP & A2A →](https://ilang.ai/mcp-vs-a2a/)

---
Markdown rendering of the HTML page for agents; the HTML page is canonical.
