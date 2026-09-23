// The iLang MCP server at https://ilang.ai/mcp (streamable HTTP, no authentication).
// It gives a model the official iLang: the runtime comes from the canon's generated bundles
// (ilang-spec/runtime), checked against the manifest's sha256 before it is served, so this
// server holds no copy of the rules. Plus dictionary and FAQ lookup and the canon grammar
// validator (the browser port that matches the Python reference byte for byte).
import { loadData, lookup, faq } from './_lib.js';
import ILV from '../playground/ilang-validator.js';

const PROTOCOL = '2025-06-18';
const SERVER = { name: 'ilang', version: '2.0.1', title: 'iLang' };
const RAW = 'https://raw.githubusercontent.com/ilang-ai/ilang-spec/main/runtime/';
const PREFIX = 'Please load and use the official iLang runtime below. You do not need to explain iLang to me ' +
  'or teach me its syntax. From the next task on, use it internally to understand, judge, execute and verify.';
const PREAMBLE = 'You have loaded the official iLang runtime specification.\n\n' +
  'Treat the following content as the current official iLang protocol context.\n' +
  'Use it to interpret, structure, judge, execute, verify, and communicate where applicable.';
const INSTRUCTIONS = 'This server gives you the official iLang. Load it once per conversation, before you work: ' +
  'get the prompt "ilang" or call ilang_runtime, then use iLang internally. People do not need to learn or write it. ' +
  'The core runtime leaves some sections out and marks each one; when you need one, call ilang_full with its ' +
  'heading instead of guessing. Look up terms with ilang_lookup and check iLang you write with ilang_validate.';
const BIG = { 'anthropic/maxResultSizeChars': 250000 };

// Annotations are written out in full on every tool, from what its handler does: ilang_runtime and
// ilang_full read the canon bundles at the fixed RAW address (the arguments never choose a URL),
// ilang_lookup and ilang_faq read this site's /ai/data.json, ilang_validate runs the validator here.
// None of them writes, sends or deletes anything, so a repeated call changes nothing.
const TOOLS = [
  { name: 'ilang_runtime', title: 'Load iLang',
    description: 'Return the official iLang runtime, the working text of the specification (about 18,600 tokens), ' +
      'verified against the canon\'s sha256. Load it once per conversation, then use iLang internally. ' +
      'media=true adds the image, video and audio extension (about 18,000 tokens more).',
    inputSchema: { type: 'object', properties: { media: { type: 'boolean', description: 'Add the media extension' } } },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }, _meta: BIG },
  { name: 'ilang_full', title: 'Read the full iLang text',
    description: 'Return a section of the full specification that the core runtime leaves out, found by its heading ' +
      '(for example "Declaration Grammar" or "Boundary Cases"), or the whole full text when no heading is given.',
    inputSchema: { type: 'object', properties: { section: { type: 'string', description: 'A heading, or part of one' } } },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }, _meta: BIG },
  { name: 'ilang_validate', title: 'Validate iLang',
    description: 'Check iLang text with the canon grammar and registry validator. Returns error, warning and info ' +
      'counts and each finding with its line, code and message.',
    inputSchema: { type: 'object', properties: { text: { type: 'string', description: 'iLang, or Markdown that carries iLang blocks' } }, required: ['text'] },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } },
  { name: 'ilang_lookup', title: 'iLang dictionary lookup',
    description: '[GET:@DICT|whr=q=term]=>[Ω] Look up an iLang verb, modifier, entity or declaration by name, alias or meaning. Returns type, name, alias, category, meaning, values and source_url. not_found=true when nothing matches; never invent terms.',
    inputSchema: { type: 'object', properties: { q: { type: 'string', description: 'Term, alias or keyword, e.g. XLAT, lng, @PREV, BUDGET' } }, required: ['q'] },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } },
  { name: 'ilang_faq', title: 'iLang FAQ',
    description: '[GET:@FAQ|whr=q=question]=>[Ω] Return the published ilang.ai FAQ entries closest to a question about the protocol (what it is, MCP/A2A comparison, prompt compression, versions, judgment layer). Includes source_url.',
    inputSchema: { type: 'object', properties: { q: { type: 'string' } }, required: ['q'] },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } },
];
const PROMPTS = [
  { name: 'ilang', title: 'Load iLang',
    description: 'Put the official iLang runtime in this conversation, verified against the canon. Nothing to paste.',
    arguments: [{ name: 'media', description: 'yes to add the image, video and audio extension', required: false }] },
];
const RESOURCES = [
  { uri: 'ilang://runtime/core', name: 'ilang-runtime-core', title: 'iLang runtime (core)', mimeType: 'text/markdown',
    description: 'The working text of the specification a model loads, about 18,600 tokens' },
  { uri: 'ilang://runtime/full', name: 'ilang-runtime-full', title: 'iLang runtime (full)', mimeType: 'text/markdown',
    description: 'The same three documents complete, about 27,000 tokens' },
  { uri: 'ilang://runtime/media', name: 'ilang-runtime-media', title: 'iLang media extension', mimeType: 'text/markdown',
    description: 'Image, video and audio vocabulary, about 18,000 tokens' },
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
      if (!params || params.name !== 'ilang') return rpcErr(id, -32602, 'Unknown prompt: ' + (params && params.name));
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
      const data = await loadData(env, origin);
      return rpc(id, { contents: [{ uri: origin + '/ai/data.json', mimeType: 'application/json', text: JSON.stringify(data) }] });
    }
    if (method === 'tools/call') {
      const name = params && params.name; const args = (params && params.arguments) || {};
      if (name === 'ilang_runtime') return rpc(id, text(await runtimeBlock(yes(args.media))));
      if (name === 'ilang_full') {
        const full = await bundle('full');
        if (!args.section || !String(args.section).trim()) return rpc(id, text(full.text));
        const s = section(full.text, String(args.section));
        return rpc(id, s ? text(s) : text('No heading in the full text contains "' + args.section + '". The core runtime marks each left-out section with its heading.', true));
      }
      if (name === 'ilang_validate') {
        if (typeof args.text !== 'string' || !args.text.trim()) return rpcErr(id, -32602, 'Invalid params: ilang_validate requires text, a non-empty string');
        const r = ILV.lint(args.text);
        return rpc(id, text(JSON.stringify({ mode: r.mode, counts: r.counts, findings: r.findings, validator: ILV.SOURCE })));
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
    install: { claude_code: 'claude mcp add --transport http ilang https://ilang.ai/mcp', url: 'https://ilang.ai/mcp' },
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
