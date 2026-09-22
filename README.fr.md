# iLang (I Language) — Protocole Standard de Communication Humain-IA Multiplateforme

**🌐 Langue:** [English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Português](README.pt.md) | [Русский](README.ru.md) | [العربية](README.ar.md)

## N'apprenez pas iLang. C'est à votre IA de le faire.

iLang est un protocole pour l'IA, pas une langue que les humains doivent mémoriser. Vous continuez à dire ce que vous voulez avec vos propres mots ; votre IA charge iLang et travaille selon lui.

- **Dans une conversation :** copiez le [runtime iLang le plus récent](https://raw.githubusercontent.com/ilang-ai/ilang-spec/main/runtime/ilang-latest.md), ou cliquez sur « Copy latest iLang » sur [ilang.ai](https://ilang.ai), et collez-le dans ChatGPT, Claude, Gemini, DeepSeek, Qwen ou tout autre assistant.
- **Dans le code :** `pip install ilang-protocol` ou `npm install ilang-protocol`, puis `messages = ilang.wrap(messages)`. Le [chargeur](https://github.com/ilang-ai/ilang) récupère le runtime officiel, le vérifie et l'ajoute à chaque requête.
- **Avec un client MCP :** connectez une fois `https://ilang.ai/mcp` (Claude Code : `claude mcp add --transport http ilang https://ilang.ai/mcp`) et votre IA charge iLang elle-même.

La suite s'adresse à l'IA, aux développeurs, aux chercheurs et à toute personne qui audite le protocole.

---

Tout comme HTTP a standardisé la communication web et SQL les requêtes de bases de données, **iLang standardise la façon dont les humains parlent à l'IA**. Un protocole, testé sur ChatGPT, Claude, Gemini, DeepSeek, Kimi, Qwen et GLM, aucune dépendance fournisseur.

`::STATE{@PROTOCOL, version:5.0, status:public_preview, genesis:2026-03-04}`

**Site web:** [ilang.ai](https://ilang.ai) · **Recherche:** [research.ilang.ai](https://research.ilang.ai) · **AI See:** [i.ilang.ai](https://i.ilang.ai)

## Ce que iLang peut faire

| Capacité | Description |
|----------|-------------|
| **Comprimer** | Réduit les prompts de 7% à 68%. Moins de tokens, coût réduit |
| **Répondre à tout** | L'IA répond directement et complètement, sans disclaimers |
| **Protéger la vie privée** | Le texte comprimé envoie moins de données aux serveurs IA |
| **Multiplateforme** | Une même instruction, testée sur ChatGPT, Claude, Gemini, DeepSeek, Kimi, Qwen et GLM |
| **Commandes en chaîne** | `[VERB]=>[VERB]=>[OUT]` workflows en une ligne |

## Commencez en 30 secondes

Copiez l'en-tête du protocole sur [ilang.ai](https://ilang.ai) et collez-le dans n'importe quelle conversation IA.

## Plateformes testées

ChatGPT ✅ | Claude ✅ | Gemini ✅ | DeepSeek ✅ | Kimi ✅ | Qwen ✅ | GLM ✅

## Liens

- [Protocole et outils](https://ilang.ai) · [Spécification](https://ilang.ai/spec/) · [Dictionnaire complet](https://github.com/ilang-ai/ilang-dict) · [Recherche](https://research.ilang.ai) · [AI See](https://i.ilang.ai)

## Licence

MIT License. © 2026 iLang Research, iLang Inc., Canada.
