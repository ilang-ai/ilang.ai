# Tokens, measured: what structure costs and buys | iLang Protocol
Source: https://ilang.ai/prompt-compression/

# Tokens, measured

iLang is not a compression format. This page shows what structure costs and what it buys, with every text and every count published so you can repeat them.

## What is being counted

Every figure here is a token count from a named tokenizer, not a word count. Tokens are what a model reads and what an API bills, so the question "does structure save tokens" has a measurable answer, and the answer depends almost entirely on what the structure is compared with.

## The same request, three ways

A six-step data request written tersely, the same request as people actually send it, and the iLang chain for both.

### Before: natural language, written tersely (49 words, 58 tokens)

```
Please read the sales data from the CSV file. Then filter it to only include records where the revenue is greater than 1000. After that, calculate statistics grouped by region. Sort the results by revenue in descending order. Finally, format the output as a markdown table and display it.
```

### After: iLang (55 tokens)

```
[READ:@SRC|path=sales.csv]
=>[FILT|whr=revenue>1000]
=>[STAT|grp=region]
=>[SORT|srt=revenue,desc]
=>[FMT|fmt=md]
=>[OUT]
```

### Counts

| Metric | Natural language | iLang | Difference |
| --- | --- | --- | --- |
| Tokens (cl100k_base) | 58 | 55 | 3 tokens |
| Ambiguity | Multiple interpretations possible | One interpretation | Lower |

Five per cent is the honest number for that comparison, and it is worth understanding why it is so small. The sentence above was written tersely, by someone who already knows what the chain has to say. Brackets, pipes and colons are not free: the tokenizer charges for them. On a short instruction that nobody pads, structure buys precision, not tokens.

## Where the difference comes from

### Requests as people actually write them

Real requests are not terse. They open with a greeting, hedge every instruction, explain why, and close with thanks. Here is the same six-step request as it usually arrives:

```
Hi! Hope you're doing well. I've got a quick favour to ask if you don't mind. So I have this sales data sitting in a CSV file and I was wondering if you could take a look at it for me? What I'm trying to do is basically narrow it down to just the bigger deals, so anything where the revenue is above 1000 I think. Once you've got that, could you please work out the summary statistics for me, broken down by region? I'd also really appreciate it if you could sort everything from highest revenue down to lowest, since that's how my manager likes to see it. And then if it's not too much trouble, please present the final result as a nice markdown table so I can paste it straight into our report. Thank you so much, really appreciate the help!
```

That is 169 tokens against the same 55-token chain. Nothing about the chain changed. The greeting, the hedging and the thank-you are what disappeared, and they are what real prompts are made of. Structure did not make the instruction cheaper; it made a padded request terse, and a terse one could have been written in plain words for about the same price.

### System prompts and behavioral rules

System prompts run on every turn, so whatever a rule costs is paid with every message. Rewriting a set of behavioral rules as `::GENE{}` lines costs about what the rules cost as dense sentences (74 against 65 tokens on the five-rule case on the benchmark page); what changes is that each rule becomes one line code can point at, test and remove.

### Long context sessions

As context fills up, quality degrades. A chain states the task without the padding, so more of the window is left for the work, but the chain itself is not smaller than a terse sentence.

### Per-token billing

If you pay per token, every token in a system prompt is paid on every request. Structure does not make a terse instruction cheaper; it removes the padding that most prompts carry and gives the rest a shape that can be checked.

## How it works technically

iLang uses an 88-verb dictionary where each verb is a 3-5 character code (READ, FILT, STAT, FMT, OUT). Verbs chain with `=>`. Modifiers use `key=value` pairs. Targets use `@ENTITY` references. No articles, no prepositions, no filler.

The padding that disappears comes from three places:

| Source | Natural language overhead | iLang equivalent |
| --- | --- | --- |
| Verb phrases | "Please read the data from" | `[READ:@SRC\|path=...]` |
| Connectors | "Then", "After that", "Finally" | `=>` |
| Behavioral rules | "Always give conclusions first and do not hedge" | `T:conclusions_first A:hedging⇒remove` |

### Before and after

The same instruction, written as a sentence and written as a chain.

| What you want | iLang |
| --- | --- |
| Extract text from a URL and format as Markdown | [GET:@SRC\|path=url]=>[FMT\|fmt=md]=>[OUT] |
| Read all .md files, merge into one, output result | [LIST:@LOCAL\|mch=*.md]=>[Π:READ]=>[Σ]=>[Ω] |
| Shorten previous output into 3 professional bullet points | [SHRT:@PREV\|sty=bullets,len=3,ton=pro]=>[Ω] |
| Translate to Japanese, formal tone, then format as table | [θ:@PREV\|lng=ja,ton=formal]=>[FMT\|fmt=csv]=>[Ω] |


## Line for line, four tokenizers

Short declarations, measured 2026-11-06 in OpenAI cl100k_base and o200k_base, DeepSeek-V3 and Qwen3 (the tokenizers that are public; Anthropic's is not). Each cell is iLang / Chinese / English.

| Line | cl100k | o200k | DeepSeek-V3 | Qwen3 |
| --- | --- | --- | --- | --- |
| One `T:` line of a `::GENE{}` | 16 / 18 / 16 | 15 / 15 / 16 | 16 / 15 / 16 | 14 / 15 / 16 |
| One `::RULE{}` | 16 / 18 / 12 | 14 / 11 / 12 | 18 / 8 / 12 | 14 / 9 / 12 |
| One `::STATE{}` | 14 / 12 / 9 | 14 / 9 / 9 | 17 / 8 / 9 | 14 / 9 / 9 |
| A four-step chain | 29 / 24 / 21 | 31 / 19 / 21 | 32 / 21 / 21 | 28 / 21 / 21 |

The structural symbols (`::`, `=>`, `|`, brackets, `@`) are one token in all four tokenizers; the mnemonics are not, and an underscore-joined phrase splits into more pieces than the same words with spaces. So a line of iLang costs about what a terse sentence costs, sometimes a little more. The per-symbol counts are in the dictionary (https://ilang.ai/dictionary/#machine-cost).

## Try it

Drop any prompt in. The iLang engine rewrites it in protocol syntax. Lower semantic loss. AI executes with fewer retries. The structurer runs on the HTML version of this page, https://ilang.ai/prompt-compression/.

Input is sent to api.ilang.ai for structuring. We do not store or use submitted prompts for training. Do not paste sensitive information. See [Privacy Policy](https://ilang.ai/privacy).

Want nothing to leave your browser? The [Playground](https://ilang.ai/playground/) converts iLang chains to IML and back, checks documents against the grammar and counts tokens, all inside the page.

**Bonus.** Your AI can now read any webpage. Send it: `i.ilang.ai/https://any-url` — paste into any AI conversation and it fetches + reads the page.

[Read the full iLang specification →](https://ilang.ai/spec/)

---
Markdown rendering of the HTML page for agents; the HTML page is canonical.
