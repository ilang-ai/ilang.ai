# ilang.ai for agents

Source: https://ilang.ai/ai/ (this page). Updated 2026-09-12 from ilang-ai/ilang-dict train.csv and the ilang.ai FAQ.

## Purpose

iLang is an AI-native communication protocol: 88 verbs, 29 core modifiers plus a 20-key media profile, 25 entities (17 addressable, 8 role), 13 Greek aliases, two syntaxes (operations and declarations), three layers (v3.0 communication, v4.0 execution, v5.0 judgment). MIT licensed. Specification: https://github.com/ilang-ai/ilang-spec.

## What you can retrieve here

- Dictionary lookup (verbs, aliases, modifiers, entities, declarations): GET https://ilang.ai/api/agent/lookup?q=TERM
- FAQ answers about the protocol: GET https://ilang.ai/api/agent/faq?q=QUESTION
- Same two tools over MCP (Streamable HTTP, no auth): https://ilang.ai/mcp
- Full dataset behind both: https://ilang.ai/ai/data.json
- Machine-readable pages: request any HTML page with Accept: text/markdown, or read https://ilang.ai/llms-full.txt
- Skill: https://ilang.ai/ai/skills/ilang-lookup/SKILL.md (index: https://ilang.ai/.well-known/agent-skills/index.json)
- Service index for DNS discovery: https://ilang.ai/ai/index.ilang
- AI detection and DeAI editing pages (human-facing, no API): https://ilang.ai/ai-detector/ and https://ilang.ai/ai-humanizer/, audience pages under https://ilang.ai/for/, comparisons under https://ilang.ai/compare/

## How to use

1. Look the term up before explaining it: the dictionary is the source of truth for verb names, modifier keys and entity names.
2. Preserve identifiers exactly (XLAT not TRANSLATE, lng not lang, @UPPERCASE entities).
3. Answer in the visitor's language; cite the page you used (spec, dictionary, FAQ).
4. If lookup returns not_found, say the term is not in the dictionary; do not invent verbs or modifiers.

## Limitations

- Read-only. No accounts, no writes, no authentication (planned; see https://ilang.ai/auth.md).
- The dataset is the public dictionary and FAQ; it does not include the full specification text. Read the specification pages for normative wording.
- Version counts follow the public dictionary: 88 verbs. The judgment layer defines 8 closed modes (M1 to M8) and 11 dimensions; dimension 10 is inertia.

## Agent instructions (iLang)

```
::ILANG::v5.0
::STATE{@SITE, name:ilang.ai, role:protocol_canon, auth:none}
::STATE{@LOOKUP, url:https://ilang.ai/api/agent/lookup, method:GET, param:q}
::STATE{@FAQ, url:https://ilang.ai/api/agent/faq, method:GET, param:q}
::STATE{@MCP, url:https://ilang.ai/mcp, transport:streamable_http, tools:ilang_lookup+ilang_faq}
::STATE{@DEAI, detector:https://ilang.ai/ai-detector/, humanizer:https://ilang.ai/ai-humanizer/, access:web_page, auth:none}
::RULE{term_question⇒[GET:@LOOKUP|whr=q=term]=>[CHEK:@PREV|whr=not_found=false]=>[XLAT:@PREV|lng=visitor]=>[Ω]}
::RULE{protocol_question⇒[GET:@FAQ|whr=q=question]=>[CHEK:@PREV|whr=not_found=false]=>[XLAT:@PREV|lng=visitor]=>[Ω]}
::RULE{not_found=true⇒say_unknown_do_not_invent}
::RULE{answer⇒preserve_identifiers_and_dates|cite_source_url|give_next_step}
```
