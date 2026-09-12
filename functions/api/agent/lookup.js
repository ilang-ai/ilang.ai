import { loadData, lookup, json } from '../../_lib.js';
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url); const q = (url.searchParams.get('q') || '').trim();
  if (!q) return json({ error: 'missing q', example: '/api/agent/lookup?q=XLAT' }, 400);
  const data = await loadData(env, url.origin);
  const matches = lookup(data, q);
  return json({ query: q, not_found: matches.length === 0, matches, dictionary_version: '5.0', source: data.generated_from.dictionary });
}
export async function onRequestOptions() { return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS' } }); }
