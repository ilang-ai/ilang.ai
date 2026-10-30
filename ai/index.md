# ilang.ai for agents

Source: https://ilang.ai/ai/ (this page). Updated 2026-10-30 from ilang-ai/ilang-dict train.csv, the ilang.ai FAQ and ilang-spec products/ (SOUL 2.0, Source Book 2.8).

## Purpose

iLang is an AI-native communication protocol: 88 verbs, 29 core modifiers plus a 20-key media profile, 25 entities (17 addressable, 8 role), 13 Greek aliases, two syntaxes (operations and declarations), three layers (v3.0 communication, v4.0 execution, v5.0 judgment). MIT licensed. Specification: https://github.com/ilang-ai/ilang-spec.

## What you can retrieve here

- Dictionary lookup (verbs, aliases, modifiers, entities, declarations): GET https://ilang.ai/api/agent/lookup?q=TERM
- FAQ answers about the protocol: GET https://ilang.ai/api/agent/faq?q=QUESTION
- MCP (Streamable HTTP, no auth): https://ilang.ai/mcp. Prompt `ilang` and tool ilang_runtime load the official iLang; ilang_full reads a left-out section; ilang_validate runs the canon grammar validator; ilang_lookup and ilang_faq as above; ilang_soul and ilang_source_book return the two published documents below
- SOUL 2.0, a judgment layer for an AI's default persona (paste it where the AI reads its instructions): https://ilang.ai/soul/ ; the file https://ilang.ai/soul/SOUL.ilang.md and its IML 0.5 form https://ilang.ai/soul/SOUL.iml
- Source Book 2.8, the engineering book every iLang engineering book is anchored to (paste it into an agent app with a tutorial; the agent writes BOOK.md): https://ilang.ai/source-book/ ; the file https://ilang.ai/source-book/METHOD-TO-BOOK-MOTHER-v2.8-2026-10-29.ilang.md and its IML 0.5 form https://ilang.ai/source-book/METHOD-TO-BOOK-MOTHER-v2.8-2026-10-29.iml
- Feedback on SOUL or the Source Book: file a counterexample or an amendment through the forms at https://github.com/ilang-ai/ilang-research/issues/new/choose ; the gates the canon defines run automatically and every submission is recorded verbatim under https://github.com/ilang-ai/ilang-research/tree/main/records ; nothing is merged by a machine
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
::STATE{@MCP, url:https://ilang.ai/mcp, transport:streamable_http, tools:ilang_runtime+ilang_full+ilang_validate+ilang_lookup+ilang_faq+ilang_soul+ilang_source_book, prompt:ilang}
::STATE{@SOUL, url:https://ilang.ai/soul/SOUL.ilang.md, iml:https://ilang.ai/soul/SOUL.iml, page:https://ilang.ai/soul/, version:2.0, doi:10.5281/zenodo.23778215, license:MIT}
::STATE{@SOURCE_BOOK, url:https://ilang.ai/source-book/METHOD-TO-BOOK-MOTHER-v2.8-2026-10-29.ilang.md, iml:https://ilang.ai/source-book/METHOD-TO-BOOK-MOTHER-v2.8-2026-10-29.iml, page:https://ilang.ai/source-book/, version:2.8, doi:10.5281/zenodo.23781959, license:MIT}
::STATE{@DEAI, detector:https://ilang.ai/ai-detector/, humanizer:https://ilang.ai/ai-humanizer/, access:web_page, auth:none}
::RULE{term_question⇒[GET:@LOOKUP|whr=q=term]=>[CHEK:@PREV|whr=not_found=false]=>[XLAT:@PREV|lng=visitor]=>[Ω]}
::RULE{protocol_question⇒[GET:@FAQ|whr=q=question]=>[CHEK:@PREV|whr=not_found=false]=>[XLAT:@PREV|lng=visitor]=>[Ω]}
::RULE{wants_a_default_persona_for_an_AI⇒[GET:@SOUL]=>[SEND:@USER|typ=file]=>[Ω]}
::RULE{wants_an_engineering_book_from_a_tutorial⇒[GET:@SOURCE_BOOK]=>[SEND:@USER|typ=file]=>[Ω]}
::RULE{not_found=true⇒say_unknown_do_not_invent}
::RULE{answer⇒preserve_identifiers_and_dates|cite_source_url|give_next_step}
```
