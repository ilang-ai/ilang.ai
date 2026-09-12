import { loadData, faq, json } from '../../_lib.js';
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url); const q = url.searchParams.get('q');
  if (!q) return json({ error: 'missing q', example: '/api/agent/faq?q=what is the judgment layer' }, 400);
  const data = await loadData(env, url.origin);
  const matches = faq(data, q);
  return json({ query: q, not_found: matches.length === 0, matches });
}
export async function onRequestOptions() { return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS' } }); }
