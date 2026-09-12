import { json } from '../../_lib.js';
// /api/agent is the anchor of the API in /.well-known/api-catalog; answer it with an index instead of the 404 page.
export async function onRequestGet({ request }) {
  const origin = new URL(request.url).origin;
  return json({
    name: 'I-Lang public lookup API',
    description: 'Read-only lookup over the published I-Lang dictionary and FAQ. No authentication.',
    openapi: origin + '/openapi.json',
    docs: origin + '/ai/',
    endpoints: {
      lookup: origin + '/api/agent/lookup?q=TERM',
      faq: origin + '/api/agent/faq?q=QUESTION',
      health: origin + '/api/agent/health'
    },
    mcp: origin + '/mcp'
  });
}
export async function onRequestOptions() { return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS' } }); }
