---
name: ilang-lookup
description: Retrieve actual public information about the iLang protocol from ilang.ai (dictionary of verbs, modifiers, entities, declarations, and the published FAQ) and answer without inventing terms.
license: MIT
metadata:
  site: https://ilang.ai
  version: "1.0.0"
  updated: "2026-09-12"
---

# ilang-lookup

Use this skill when a question involves the iLang protocol: a verb, modifier, entity, declaration, version, or how iLang relates to MCP, A2A or prompt compression.

## Endpoints (no authentication)

- `GET https://ilang.ai/api/agent/lookup?q=TERM` returns dictionary entries: type, name, alias, category, meaning, values, source_url. Empty match returns `not_found: true`.
- `GET https://ilang.ai/api/agent/faq?q=QUESTION` returns the closest published FAQ entries with `source_url`.
- MCP: `https://ilang.ai/mcp` (Streamable HTTP) with tools `ilang_lookup` and `ilang_faq`, same semantics.
- Full data: `https://ilang.ai/ai/data.json`. Pages as Markdown: send `Accept: text/markdown`.

## Instructions (iLang)

```
::ILANG::v5.0
::STATE{@LOOKUP, url:https://ilang.ai/api/agent/lookup, method:GET, param:q}
::STATE{@FAQ, url:https://ilang.ai/api/agent/faq, method:GET, param:q}
::RULE{question_names_a_term⇒[GET:@LOOKUP|whr=q=term]=>[CHEK:@PREV|whr=not_found=false]=>[Ω]}
::RULE{question_about_protocol⇒[GET:@FAQ|whr=q=question]=>[CHEK:@PREV|whr=not_found=false]=>[Ω]}
::RULE{not_found=true⇒state_unknown|never_invent_verbs_modifiers_or_counts}
::RULE{answer⇒preserve_identifiers_exactly|keep_dates_and_qualifiers|answer_in_visitor_language|cite_source_url|end_with_next_step}
::FACT{key:verbs|value:88|conf:confirmed}
::FACT{key:modifiers|value:29_core_plus_20_key_media_profile|conf:confirmed}
::FACT{key:judgment_modes|value:M1-M8_closed|conf:confirmed}
::FACT{key:dimension_10|value:inertia|conf:confirmed}
```

## Interpreting results

- `type` is one of verb, modifier, entity, declaration, declaration_narrative, dimension, mode; `alias` holds the Greek alias when one exists (for example XLAT has alias θ). The entity list holds 25 entities: 8 core and 6 external (v3.0), 8 role (v4.0) and 3 media (@IMG, @VID, @AUD, v4.1); the public count is 25 entities (17 addressable, 8 role).
- `values` lists closed value sets for modifiers (for example fmt accepts text, json, md, csv, xml, html, email).
- Cite `source_url`. If the user needs normative wording, point to https://github.com/ilang-ai/ilang-spec.

## Edge cases

- A term with a lowercase or different spelling (translate, lang=) may match by meaning; report the canonical name and say the input form is not a dictionary token.
- Questions about pricing, accounts or authentication: everything here is free, read-only and unauthenticated; authentication is planned only (https://ilang.ai/auth.md).
