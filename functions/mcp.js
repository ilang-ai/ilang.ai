import { loadData, lookup, faq } from './_lib.js';
const PROTOCOL = '2025-06-18';
const TOOLS = [
  { name: 'ilang_lookup', title: 'I-Lang dictionary lookup',
    description: '[GET:@DICT|whr=q=term]=>[Ω] Look up an I-Lang verb, modifier, entity or declaration by name, alias or meaning. Returns type, name, alias, category, meaning, values and source_url. not_found=true when nothing matches; never invent terms.',
    inputSchema: { type: 'object', properties: { q: { type: 'string', description: 'Term, alias or keyword, e.g. XLAT, lng, @PREV, BUDGET' } }, required: ['q'] } },
  { name: 'ilang_faq', title: 'I-Lang FAQ',
    description: '[GET:@FAQ|whr=q=question]=>[Ω] Return the published ilang.ai FAQ entries closest to a question about the protocol (what it is, MCP/A2A comparison, prompt compression, versions, judgment layer). Includes source_url.',
    inputSchema: { type: 'object', properties: { q: { type: 'string' } }, required: ['q'] } },
];
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Accept, Mcp-Session-Id, MCP-Protocol-Version' };
function rpc(id, result) { return { jsonrpc: '2.0', id, result }; }
function rpcErr(id, code, message) { return { jsonrpc: '2.0', id: id === undefined ? null : id, error: { code, message } }; }
async function handle(msg, env, origin) {
  const { id, method, params } = msg || {};
  if (!method) return rpcErr(id, -32600, 'Invalid Request');
  if (method === 'resources/read') { const data = await loadData(env, origin); return rpc(id, { contents: [{ uri: origin + '/ai/data.json', mimeType: 'application/json', text: JSON.stringify(data) }] }); }
  if (method === 'initialize') return rpc(id, { protocolVersion: PROTOCOL, capabilities: { tools: { listChanged: false }, resources: { listChanged: false }, prompts: { listChanged: false } }, serverInfo: { name: 'ilang-lookup', version: '1.0.0', title: 'I-Lang Lookup' }, instructions: 'Read-only lookup over the I-Lang dictionary and FAQ. Preserve identifiers exactly; if not_found is true, say the term is unknown.' });
  if (method === 'ping') return rpc(id, {});
  if (method.startsWith('notifications/')) return null;
  if (method === 'tools/list') return rpc(id, { tools: TOOLS });
  if (method === 'resources/list') return rpc(id, { resources: [{ uri: origin + '/ai/data.json', name: 'ilang-data', mimeType: 'application/json', description: 'Full dictionary + FAQ dataset' }] });
  if (method === 'prompts/list') return rpc(id, { prompts: [] });
  if (method === 'tools/call') {
    const name = params && params.name; const args = (params && params.arguments) || {};
    if ((name === 'ilang_lookup' || name === 'ilang_faq') && (typeof args.q !== 'string' || !args.q.trim())) return rpcErr(id, -32602, 'Invalid params: ' + name + ' requires q, a non-empty string');
    const data = await loadData(env, origin);
    if (name === 'ilang_lookup') { const m = lookup(data, args.q); return rpc(id, { content: [{ type: 'text', text: JSON.stringify({ query: args.q, not_found: m.length === 0, matches: m }) }], isError: false }); }
    if (name === 'ilang_faq') { const m = faq(data, args.q); return rpc(id, { content: [{ type: 'text', text: JSON.stringify({ query: args.q, not_found: m.length === 0, matches: m }) }], isError: false }); }
    return rpcErr(id, -32602, 'Unknown tool: ' + name);
  }
  return rpcErr(id, -32601, 'Method not found: ' + method);
}
export async function onRequestOptions() { return new Response(null, { status: 204, headers: CORS }); }
export async function onRequestGet() {
  return new Response(JSON.stringify({ name: 'ilang-lookup', transport: 'streamable-http', usage: 'POST JSON-RPC 2.0 to this endpoint (initialize, tools/list, tools/call)', card: 'https://ilang.ai/.well-known/mcp/server-card.json' }), { status: 405, headers: Object.assign({ 'Content-Type': 'application/json', 'Allow': 'POST, OPTIONS' }, CORS) });
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
