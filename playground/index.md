# I-Lang Playground: IML Converter, Validator and Token Counter
Source: https://ilang.ai/playground/

# I-Lang Playground

Convert I-Lang operation chains to IML and back, validate I-Lang documents, and count tokens. Everything runs in the browser page; the input is not sent anywhere.

## Convert

Write I-Lang operation chains, one per line, and read the IML beside them; edit the IML and the I-Lang follows. The converter is a port of the IML 0.5.1 reference codec ([ilang-ai/iml-protocol](https://github.com/ilang-ai/iml-protocol)), so whatever converts comes back unchanged. It converts chains; documents with declarations are converted by the reference codec.

Every IML message starts with its version and registry digest, `#iml/0.5/7e29fae7f5ea`, which is 17 cl100k_base tokens. For a single chain the IML message is therefore longer than the I-Lang line; the document form carries the header once for all chains. Measured figures for the full corpora are in the [IML measurement reports](https://github.com/ilang-ai/iml-protocol/tree/main/measurements).

Example, from the specification §10.1:

```
[READ:@GH|path=config.json]=>[FMT|fmt=json]=>[Ω]
```

## Validate

Paste an I-Lang document, such as an agent's SOUL file, and read what the canon grammar validator reports: errors, warnings and notes with their line and code. The validator is a port of `ilang_grammar_validator.py` at [ilang-ai/ilang-spec](https://github.com/ilang-ai/ilang-spec) commit 127ba56. A text whose first line is `::ILANG::v5.0` is read as a raw I-Lang document; any other text is read as Markdown, and its I-Lang lines and fenced blocks are checked.

## Count

Put any two texts side by side, for example an instruction in prose and the same instruction in I-Lang, and compare cl100k_base tokens, UTF-8 bytes and characters. Nothing is translated; both texts come from the user. cl100k_base is the tokenizer of GPT-4 and GPT-3.5; other models use other tokenizers and count differently.

## Privacy

Your input never leaves your browser. The converter, the validator and the tokenizer run in the page, and nothing typed is sent anywhere or stored. The tools and the tokenizer's vocabulary are loaded from ilang.ai; the site's Cloudflare Web Analytics counts page views, not what is typed.

## Sources

- IML (I-Lang Machine Layer): https://github.com/ilang-ai/iml-protocol
- I-Lang specification: https://ilang.ai/spec/
- Dictionary: https://ilang.ai/dictionary/
- Conformance test suite: https://github.com/ilang-ai/ilang-conformance
