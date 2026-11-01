// The iLang MCP server (streamable HTTP, no authentication). Its public address is https://mcp.ilang.ai/mcp,
// a Worker (ilang-mcp-gateway) that passes every request here to https://ilang.ai/mcp; this host also answers directly.
// It gives a model the official iLang: the runtime comes from the canon's generated bundles
// (ilang-spec/runtime), checked against the manifest's sha256 before it is served, so this
// server holds no copy of the rules. Plus dictionary and FAQ lookup, the canon grammar
// validator (the browser port that matches the Python reference byte for byte), and the two
// published documents, SOUL 2.0 and Source Book 2.9, served as the files this site holds.
import { loadData, lookup, faq } from './_lib.js';
import ILV from '../playground/ilang-validator.js';
import HINTS from './_modifier-hints.js';

const PROTOCOL = '2025-06-18';
const SERVER = { name: 'ilang', version: '2.3.0', title: 'iLang' };
const RAW = 'https://runtime.ilang.app/';
const PREFIX = 'Please load and use the official iLang runtime below. You do not need to explain iLang to me ' +
  'or teach me its syntax. From the next task on, use it internally to understand, judge, execute and verify.';
const PREAMBLE = 'You have loaded the official iLang runtime specification.\n\n' +
  'Treat the following content as the current official iLang protocol context.\n' +
  'Use it to interpret, structure, judge, execute, verify, and communicate where applicable.';
const INSTRUCTIONS = 'This server gives you the official iLang. Load it once per conversation, before you work: ' +
  'get the prompt "ilang" or call ilang_runtime, then use iLang internally. People do not need to learn or write it. ' +
  'When you only need to write or check iLang, ilang_runtime_lite returns its syntax and vocabulary alone, about a fifth of the runtime. ' +
  'The core runtime leaves some sections out and marks each one; when you need one, call ilang_full with its ' +
  'heading instead of guessing. Look up terms with ilang_lookup and check iLang you write with ilang_validate. '
  + 'To turn a tutorial into an executable engineering book, use the source_book prompt and check the book with ilang_book_check. ' +
  'Two published iLang documents are here as files: ilang_soul returns SOUL 2.0, a judgment layer for an AI\'s default persona; ' +
  'ilang_source_book returns Source Book 2.9, the engineering book every iLang engineering book is anchored to. form=iml gives the IML 0.5 form.';
const BIG = { 'anthropic/maxResultSizeChars': 250000 };
const LITE_META = { 'anthropic/maxResultSizeChars': 50000 };
const LITE_PREAMBLE = 'You have loaded iLang runtime lite: the syntax and vocabulary of iLang, taken word for word from the official full runtime ' +
  'and checked against the canon\'s sha256. It is enough to read and write iLang and to check it with ilang_validate. ' +
  'It leaves out the execution layer (v4.0), the judgment layer (v5.0), the media profile, the declaration block shapes and the examples. ' +
  'When a task needs them, call ilang_runtime, or ilang_full with a heading, instead of guessing.';
// The sections of ilang_runtime_lite, in order: the document inside the full runtime and the start of the heading line.
const LITE = [
  ['SPEC.md', '## 2. The Two Syntaxes'], ['SPEC.md', '## 3. Verb Table'], ['SPEC.md', '## 4. Modifiers'], ['SPEC.md', '## 9. Error Codes'],
  ['SPEC-v5.0.md', '### §1.2 Body line forms'], ['SPEC-v5.0.md', '### §1.5 Declaration registry'], ['SPEC-v5.0.md', '### §2.1 Three tiers'],
];

// Annotations are written out in full on every tool, from what its handler does: ilang_runtime and
// ilang_full read the canon bundles at the fixed RAW address (the arguments never choose a URL),
// ilang_lookup and ilang_faq read this site's /ai/data.json, ilang_validate runs the validator here,
// ilang_soul and ilang_source_book read the two document files this site serves (the arguments never choose a URL).
// None of them writes, sends or deletes anything, so a repeated call changes nothing.
const TOOLS = [
  { name: 'ilang_runtime', title: 'Load iLang',
    description: 'iLang is a specification between humans and AI: before the AI acts, it defines what that action is authorized to become; after, code checks whether it was done right. Return the official iLang runtime, the working text of the specification (about 18,600 tokens), ' +
      'verified against the canon\'s sha256. Load it once per conversation, then use iLang internally. ' +
      'media=true adds the image, video and audio extension (about 18,000 tokens more).',
    inputSchema: { type: 'object', properties: { media: { type: 'boolean', description: 'Add the media extension' } } },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }, _meta: BIG },
  { name: 'ilang_runtime_lite', title: 'Load iLang (syntax and vocabulary)',
    description: 'Return iLang runtime lite: the two syntaxes, the verb table (88 verbs with their 13 Greek aliases), the 29 modifiers, the error codes, ' +
      'the declaration body forms, the registry of 32 declarations and the entity registry (25 entities), taken word for word from the canon\'s full runtime ' +
      'and checked against its sha256. About 18,000 characters, where ilang_runtime returns about 93,000. Enough to write iLang and check it with ilang_validate; ' +
      'it leaves out the execution and judgment layers, so load ilang_runtime when a task needs them.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }, _meta: LITE_META },
  { name: 'ilang_full', title: 'Read the full iLang text',
    description: 'Return a section of the full specification that the core runtime leaves out, found by its heading ' +
      '(for example "Declaration Grammar" or "Boundary Cases"), or the whole full text when no heading is given.',
    inputSchema: { type: 'object', properties: { section: { type: 'string', description: 'A heading, or part of one' } } },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }, _meta: BIG },
  { name: 'ilang_validate', title: 'Validate iLang',
    description: 'Check iLang text with the canon grammar and registry validator. Returns error, warning and info ' +
      'counts and each finding with its line, code and message. An E302 finding (unknown modifier) may also carry did_you_mean, ' +
      'the registered modifier this server suggests for the key; the suggestion is added here and is not part of the canon validator\'s output.',
    inputSchema: { type: 'object', properties: { text: { type: 'string', description: 'iLang, or Markdown that carries iLang blocks' } }, required: ['text'] },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } },
  { name: 'ilang_lookup', title: 'iLang dictionary lookup',
    description: '[GET:@DICT|whr=q=term]=>[Ω] Look up an iLang verb, modifier, entity or declaration by name, alias or meaning. Returns type, name, alias, category, meaning, values and source_url. not_found=true when nothing matches; never invent terms.',
    inputSchema: { type: 'object', properties: { q: { type: 'string', description: 'Term, alias or keyword, e.g. XLAT, lng, @PREV, BUDGET' } }, required: ['q'] },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } },
  { name: 'ilang_faq', title: 'iLang FAQ',
    description: '[GET:@FAQ|whr=q=question]=>[Ω] Return the published ilang.ai FAQ entries closest to a question about the protocol (what it is, MCP/A2A comparison, prompt compression, versions, judgment layer, SOUL, the Source Book). Includes source_url.',
    inputSchema: { type: 'object', properties: { q: { type: 'string' } }, required: ['q'] },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } },
  { name: 'ilang_soul', title: 'SOUL 2.0',
    description: '[GET:@SOUL|whr=form]=>[Ω] Return SOUL 2.0, the published iLang document that sets how an AI behaves by default: a judgment layer for its default persona. ' +
      'The text comes back as the file on ilang.ai/soul/ (about 2,000 characters), followed by a JSON line with version, date, license, DOI, file url and the sha256 of the text served. ' +
      'Paste the text where the AI reads its instructions. form=iml returns the IML 0.5 form instead.',
    inputSchema: { type: 'object', properties: { form: { type: 'string', enum: ['ilang', 'iml'], description: 'ilang (default) or iml' } } },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } },
  { name: 'ilang_source_book', title: 'Source Book 2.9',
    description: '[GET:@SOURCE_BOOK|whr=form]=>[Ω] Return Source Book 2.9, the engineering book every iLang engineering book is anchored to: pasted into an agent app that has a shell, files and the web, ' +
      'and given a tutorial, the agent confirms the tutorial\'s numbers against official sources and writes BOOK.md, an English iLang book any agent can carry out. ' +
      'The text comes back as the file on ilang.ai/source-book/ (about 7,600 characters), followed by a JSON line with version, date, license, DOI, file url and the sha256 of the text served. form=iml returns the IML 0.5 form instead.',
    inputSchema: { type: 'object', properties: { form: { type: 'string', enum: ['ilang', 'iml'], description: 'ilang (default) or iml' } } },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } },
  { name: 'ilang_book_check', title: 'Check an engineering book',
    description: '[CHEK:@BOOK|whr=rubric_A1_A2]=>[Ω] Run the Source Book\'s two code checks on an engineering book: A1, the text opens and closes with the ::ILANG::v5.0::ENGINEERING_BOOK marker (exactly two such lines), and A2, the canon grammar validator reports zero errors and zero warnings (strict). ' +
      'Returns pass or fail per item with the validator\'s findings. For an agent that has no shell to run ilang_grammar_validator.py; same validator, same result.',
    inputSchema: { type: 'object', properties: { text: { type: 'string', description: 'The full text of BOOK.md' } }, required: ['text'] },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } },
];
const PROMPTS = [
  { name: 'ilang', title: 'Load iLang',
    description: 'Put the official iLang runtime in this conversation, verified against the canon. Nothing to paste.',
    arguments: [{ name: 'media', description: 'yes to add the image, video and audio extension', required: false }] },
  { name: 'source_book', title: 'Write an engineering book from a tutorial',
    description: 'Run Source Book 2.9 in this conversation: the published book comes in with your tutorial filled in; the model fetches, confirms the numbers, writes BOOK.md and checks it with ilang_book_check. The work runs on this conversation\'s own model and tools.',
    arguments: [{ name: 'tutorial', description: 'The tutorial or methodology: pasted text or one link', required: false },
                { name: 'lang', description: 'The language of the one-sentence reply to the user (default: the language of the tutorial)', required: false }] },
];
const RESOURCES = [
  { uri: 'ilang://runtime/core', name: 'ilang-runtime-core', title: 'iLang runtime (core)', mimeType: 'text/markdown',
    description: 'The working text of the specification a model loads, about 18,600 tokens' },
  { uri: 'ilang://runtime/full', name: 'ilang-runtime-full', title: 'iLang runtime (full)', mimeType: 'text/markdown',
    description: 'The same three documents complete, about 27,000 tokens' },
  { uri: 'ilang://runtime/media', name: 'ilang-runtime-media', title: 'iLang media extension', mimeType: 'text/markdown',
    description: 'Image, video and audio vocabulary, about 18,000 tokens' },
  { uri: 'ilang://products/soul', name: 'ilang-soul', title: 'SOUL 2.0', mimeType: 'text/markdown',
    description: 'A judgment layer for an AI\'s default persona, the published iLang document; ilang://products/soul/iml is the IML 0.5 form' },
  { uri: 'ilang://products/source-book', name: 'ilang-source-book', title: 'Source Book 2.9', mimeType: 'text/markdown',
    description: 'The engineering book every iLang engineering book is anchored to; ilang://products/source-book/iml is the IML 0.5 form' },
];

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Accept, Mcp-Session-Id, MCP-Protocol-Version' };
function rpc(id, result) { return { jsonrpc: '2.0', id, result }; }
function rpcErr(id, code, message) { return { jsonrpc: '2.0', id: id === undefined ? null : id, error: { code, message } }; }
function text(t, isError) { return { content: [{ type: 'text', text: t }], isError: Boolean(isError) }; }

// ------------------------------------------------------------------ runtime from the canon
let memo = { at: 0, manifest: null, texts: {} };
async function hex(s) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
async function bundle(name) {
  if (Date.now() - memo.at > 300000) memo = { at: Date.now(), manifest: null, texts: {} };
  if (!memo.manifest) {
    const r = await fetch(RAW + 'manifest.json', { cf: { cacheTtl: 300, cacheEverything: true } });
    if (!r.ok) throw new Error('the canon manifest did not answer (HTTP ' + r.status + ')');
    memo.manifest = await r.json();
  }
  const meta = memo.manifest.bundles[name];
  if (!meta) throw new Error('the runtime has no bundle named ' + name);
  if (!memo.texts[name]) {
    const r = await fetch(meta.url, { cf: { cacheTtl: 300, cacheEverything: true } });
    if (!r.ok) throw new Error('the ' + name + ' bundle did not answer (HTTP ' + r.status + ')');
    const t = await r.text();
    if ((await hex(t)) !== meta.sha256) throw new Error('the ' + name + ' bundle failed its sha256 check');
    memo.texts[name] = t;
  }
  return { text: memo.texts[name], version: memo.manifest.version };
}
async function runtimeBlock(media) {
  const core = await bundle('core');
  const parts = [core.text];
  if (media) parts.push((await bundle('media')).text);
  return PREAMBLE + '\n\n<ilang-runtime version="' + core.version + '">\n' + parts.join('\n\n') + '\n</ilang-runtime>';
}
// ilang_runtime_lite: whole sections of the full runtime, cut by heading inside their own document.
// A heading that is missing or found twice is an error, so the tool never serves a partial text.
function docBlock(full, doc) {
  const b = '===== BEGIN ' + doc + ' =====', e = '===== END ' + doc + ' =====';
  const i = full.indexOf(b), j = full.indexOf(e, i);
  if (i < 0 || j < 0) throw new Error('the full runtime has no document ' + doc);
  return full.slice(i + b.length, j);
}
function headed(body, start, doc) {
  const lines = body.split('\n'), heads = [];
  let fence = false;
  lines.forEach((l, i) => {
    if (l.trimStart().startsWith('```')) { fence = !fence; return; }
    const m = !fence && /^(#+) (.*)$/.exec(l);
    if (m) heads.push({ i, depth: m[1].length, line: l });
  });
  const hits = heads.filter((h) => h.line.startsWith(start));
  if (hits.length !== 1) throw new Error((hits.length ? 'more than one' : 'no') + ' heading "' + start + '" in ' + doc + '; ilang_runtime still has the whole text');
  const next = heads.find((h) => h.i > hits[0].i && h.depth <= hits[0].depth);
  const out = lines.slice(hits[0].i, next ? next.i : lines.length);
  while (out.length && /^(\s*|---)$/.test(out[out.length - 1])) out.pop();
  return out.join('\n');
}
async function liteBlock() {
  const full = await bundle('full');
  const docs = {}, parts = [];
  let last = null;
  for (const [doc, start] of LITE) {
    if (!docs[doc]) docs[doc] = docBlock(full.text, doc);
    if (doc !== last) { parts.push('===== FROM ' + doc + ' ====='); last = doc; }
    parts.push(headed(docs[doc], start, doc));
  }
  return LITE_PREAMBLE + '\n\n<ilang-runtime-lite version="' + full.version + '">\n' + parts.join('\n\n') + '\n</ilang-runtime-lite>';
}

// did_you_mean on E302: the registered modifier an unknown key most likely stands for (rules in _modifier-hints.js).
function lev(a, b) {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}
function suggestModifier(key, media) {
  const allowed = media ? ILV.registries.modifiers.concat(ILV.registries.media_profile) : ILV.registries.modifiers;
  const low = key.toLowerCase();
  if (allowed.includes(low)) return low;                       // modifiers are lowercase (v3.0 2.5)
  const alias = Object.prototype.hasOwnProperty.call(HINTS.aliases, low) ? HINTS.aliases[low] : null;
  if (alias && allowed.includes(alias)) return alias;
  // a candidate is at most max_distance away and keeps at least one character of both keys
  let best = null, bestD = Infinity, tie = false;
  for (const k of allowed) {
    const d = lev(low, k);
    if (d > HINTS.max_distance || d >= low.length || d >= k.length) continue;
    if (d < bestD) { best = k; bestD = d; tie = false; } else if (d === bestD) tie = true;
  }
  return best && !tie ? best : null;
}
function withHints(findings) {
  return findings.map((f) => {
    if (f.code !== 'E302') return f;
    const m = /^modifier `(.+)` not in (.*)$/.exec(f.message);
    if (!m || /\)$/.test(m[2])) return f;                    // no key, or the validator already explains it
    const s = suggestModifier(m[1], /media profile$/.test(m[2]));
    return s ? Object.assign({}, f, { did_you_mean: s }) : f;
  });
}

// One section of the full text by heading: the heading line and everything under it. A heading
// whose title is the request, numbering aside, wins; otherwise the deepest heading that contains it.
const bare = (t) => t.toLowerCase().replace(/^(part [ivx]+|appendix [a-z]|§?[\d.]+)\s*[—:.-]?\s*/, '').trim();
function section(full, want) {
  const lines = full.split('\n'), w = want.toLowerCase().replace(/^#+\s*/, '').trim();
  const heads = [];
  let fence = false;
  lines.forEach((l, i) => {
    if (l.trimStart().startsWith('```')) { fence = !fence; return; }
    const m = !fence && /^(#+) (.*)$/.exec(l);
    if (m) heads.push({ i, depth: m[1].length, title: m[2] });
  });
  const hits = heads.filter((h) => h.title.toLowerCase().includes(w));
  if (!hits.length) return null;
  const pick = hits.find((h) => bare(h.title) === bare(w)) ||
    hits.reduce((a, b) => (b.depth > a.depth ? b : a));
  const next = heads.find((h) => h.i > pick.i && h.depth <= pick.depth);
  return lines.slice(pick.i, next ? next.i : lines.length).join('\n');
}
const yes = (v) => v === true || /^(1|true|yes|y|media)$/i.test(String(v || '').trim());

// ------------------------------------------------------------------ the two published documents, from this site's own files
const PRODUCTS = {
  ilang_soul: { product: 'SOUL', version: '2.0', date: '2026-10-29', license: 'MIT', doi: '10.5281/zenodo.23778215', page: '/soul/', feedback: 'https://github.com/ilang-ai/ilang-research/issues/new/choose',
    canon: 'https://github.com/ilang-ai/ilang-spec/tree/main/products/soul', files: { ilang: '/soul/SOUL.ilang.md', iml: '/soul/SOUL.iml' } },
  ilang_source_book: { product: 'Source Book', version: '2.9', date: '2026-10-30', license: 'MIT', doi: '10.5281/zenodo.23824138', page: '/source-book/', feedback: 'https://github.com/ilang-ai/ilang-research/issues/new/choose',
    canon: 'https://github.com/ilang-ai/ilang-spec/tree/main/products/source-book', files: { ilang: '/source-book/METHOD-TO-BOOK-MOTHER-v2.9-2026-10-30.ilang.md', iml: '/source-book/METHOD-TO-BOOK-MOTHER-v2.9-2026-10-30.iml' } },
};
async function product(name, form, env, origin) {
  const p = PRODUCTS[name];
  const f = String(form || 'ilang').trim().toLowerCase() === 'iml' ? 'iml' : 'ilang';
  const r = await env.ASSETS.fetch(new Request(origin + p.files[f]));
  if (!r.ok) throw new Error('the ' + p.product + ' file did not answer (HTTP ' + r.status + ')');
  const t = await r.text();
  const meta = { product: p.product, version: p.version, date: p.date, license: p.license, doi: p.doi, form: f, file: origin + p.files[f],
    page: origin + p.page, canon: p.canon, feedback: p.feedback, sha256: await hex(t), chars: t.length };
  return { text: t, meta };
}

// ------------------------------------------------------------------ JSON-RPC
async function handle(msg, env, origin) {
  const { id, method, params } = msg || {};
  if (!method) return rpcErr(id, -32600, 'Invalid Request');
  if (method === 'initialize') return rpc(id, { protocolVersion: PROTOCOL, capabilities: { tools: { listChanged: false }, resources: { listChanged: false }, prompts: { listChanged: false } }, serverInfo: SERVER, instructions: INSTRUCTIONS });
  if (method === 'ping') return rpc(id, {});
  if (method.startsWith('notifications/')) return null;
  if (method === 'tools/list') return rpc(id, { tools: TOOLS });
  if (method === 'prompts/list') return rpc(id, { prompts: PROMPTS });
  if (method === 'resources/list') return rpc(id, { resources: RESOURCES.concat([{ uri: origin + '/ai/data.json', name: 'ilang-data', mimeType: 'application/json', description: 'Full dictionary + FAQ dataset' }]) });
  try {
    if (method === 'prompts/get') {
      const pname = params && params.name;
      if (pname === 'source_book') {
        const d = await product('ilang_source_book', 'ilang', env, origin);
        const tutorial = String((params.arguments && params.arguments.tutorial) || '').trim();
        const lang = String((params.arguments && params.arguments.lang) || '').trim() || 'the language of the tutorial';
        const fill = 'FILL_METHOD: ' + (tutorial || 'not given yet: ask the user for the tutorial as text or one link, in one sentence, and stop until it arrives') +
          '\nFILL_LANG: ' + lang + '\nFILL_FOLDER: your working folder';
        const note = 'Run the engineering book below now, as its STEPs say, with your own web, file and shell tools. Where it says to run ' +
          'ilang_grammar_validator.py and you have no shell, call the ilang_book_check tool with the full text of BOOK.md instead: it runs RUBRIC A1 and A2 ' +
          'with the same validator on ilang.ai. The book is the published Source Book ' + d.meta.version + ' (sha256 ' + d.meta.sha256 + ', DOI ' + d.meta.doi + ').';
        return rpc(id, { description: 'Source Book ' + d.meta.version + ' with the tutorial filled in',
          messages: [{ role: 'user', content: { type: 'text', text: note + '\n\n' + d.text + '\n' + fill } }] });
      }
      if (pname !== 'ilang') return rpcErr(id, -32602, 'Unknown prompt: ' + pname);
      const media = yes(params.arguments && params.arguments.media);
      const core = await bundle('core');
      const body = await runtimeBlock(media);
      return rpc(id, { description: 'The official iLang runtime ' + core.version + (media ? ' with the media extension' : ''),
        messages: [{ role: 'user', content: { type: 'text', text: PREFIX + '\n\n' + body } }] });
    }
    if (method === 'resources/read') {
      const uri = params && params.uri;
      const m = /^ilang:\/\/runtime\/(core|full|media)$/.exec(uri || '');
      if (m) { const b = await bundle(m[1]); return rpc(id, { contents: [{ uri, mimeType: 'text/markdown', text: b.text }] }); }
      const pm = /^ilang:\/\/products\/(soul|source-book)(?:\/(iml))?$/.exec(uri || '');
      if (pm) { const d = await product(pm[1] === 'soul' ? 'ilang_soul' : 'ilang_source_book', pm[2], env, origin); return rpc(id, { contents: [{ uri, mimeType: 'text/markdown', text: d.text }] }); }
      const data = await loadData(env, origin);
      return rpc(id, { contents: [{ uri: origin + '/ai/data.json', mimeType: 'application/json', text: JSON.stringify(data) }] });
    }
    if (method === 'tools/call') {
      const name = params && params.name; const args = (params && params.arguments) || {};
      if (name === 'ilang_runtime') return rpc(id, text(await runtimeBlock(yes(args.media))));
      if (name === 'ilang_runtime_lite') return rpc(id, text(await liteBlock()));
      if (name === 'ilang_full') {
        const full = await bundle('full');
        if (!args.section || !String(args.section).trim()) return rpc(id, text(full.text));
        const s = section(full.text, String(args.section));
        return rpc(id, s ? text(s) : text('No heading in the full text contains "' + args.section + '". The core runtime marks each left-out section with its heading.', true));
      }
      if (name === 'ilang_validate') {
        if (typeof args.text !== 'string' || !args.text.trim()) return rpcErr(id, -32602, 'Invalid params: ilang_validate requires text, a non-empty string');
        const r = ILV.lint(args.text);
        return rpc(id, text(JSON.stringify({ mode: r.mode, counts: r.counts, findings: withHints(r.findings), validator: ILV.SOURCE })));
      }
      if (name === 'ilang_book_check') {
        if (typeof args.text !== 'string' || !args.text.trim()) return rpcErr(id, -32602, 'Invalid params: ilang_book_check requires text, the full text of the book');
        const book = args.text.replace(/\r\n?/g, '\n');
        const markers = (book.match(/^::ILANG::v5\.0::ENGINEERING_BOOK$/gm) || []).length;
        const r = ILV.lint(book);
        const a1 = markers === 2, a2 = r.counts.errors === 0 && r.counts.warnings === 0;
        return rpc(id, text(JSON.stringify({ pass: a1 && a2,
          A1: { item: 'the book opens and closes with the marker', expect: 2, found: markers, pass: a1 },
          A2: { item: 'the grammar validator reports zero errors in strict mode', errors: r.counts.errors, warnings: r.counts.warnings, pass: a2 },
          findings: r.findings, validator: ILV.SOURCE,
          note: 'A3, whether the book does the tutorial\'s job and nothing else, is for a person to decide.' })));
      }
      if (name === 'ilang_soul' || name === 'ilang_source_book') {
        const d = await product(name, args.form, env, origin);
        return rpc(id, { content: [{ type: 'text', text: d.text }, { type: 'text', text: JSON.stringify(d.meta) }], isError: false });
      }
      if ((name === 'ilang_lookup' || name === 'ilang_faq') && (typeof args.q !== 'string' || !args.q.trim())) return rpcErr(id, -32602, 'Invalid params: ' + name + ' requires q, a non-empty string');
      const data = await loadData(env, origin);
      if (name === 'ilang_lookup') { const m = lookup(data, args.q); return rpc(id, text(JSON.stringify({ query: args.q, not_found: m.length === 0, matches: m }))); }
      if (name === 'ilang_faq') { const m = faq(data, args.q); return rpc(id, text(JSON.stringify({ query: args.q, not_found: m.length === 0, matches: m }))); }
      return rpcErr(id, -32602, 'Unknown tool: ' + name);
    }
  } catch (err) {
    if (method === 'tools/call') return rpc(id, text('iLang runtime unavailable: ' + err.message, true));
    return rpcErr(id, -32603, 'iLang runtime unavailable: ' + err.message);
  }
  return rpcErr(id, -32601, 'Method not found: ' + method);
}
export async function onRequestOptions() { return new Response(null, { status: 204, headers: CORS }); }
export async function onRequestGet() {
  return new Response(JSON.stringify({ name: SERVER.name, title: SERVER.title, transport: 'streamable-http',
    usage: 'POST JSON-RPC 2.0 to this endpoint (initialize, tools/list, tools/call, prompts/get, resources/read)',
    install: { claude_code: 'claude mcp add --transport http ilang https://mcp.ilang.ai/mcp', url: 'https://mcp.ilang.ai/mcp' },
    card: 'https://ilang.ai/.well-known/mcp/server-card.json' }), { status: 405, headers: Object.assign({ 'Content-Type': 'application/json', 'Allow': 'POST, OPTIONS' }, CORS) });
}
export async function onRequestPost({ request, env }) {
  const origin = new URL(request.url).origin;
  let body;
  try { body = await request.json(); } catch (e) { return new Response(JSON.stringify(rpcErr(null, -32700, 'Parse error')), { status: 400, headers: Object.assign({ 'Content-Type': 'application/json' }, CORS) }); }
  const msgs = Array.isArray(body) ? body : [body];
  const out = [];
  for (const m of msgs) { const r = await handle(m, env, origin); if (r) out.push(r); }
  if (out.length === 0) return new Response(null, { status: 202, headers: CORS });
  const payload = Array.isArray(body) ? out : out[0];
  return new Response(JSON.stringify(payload), { status: 200, headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'MCP-Protocol-Version': PROTOCOL }, CORS) });
}
