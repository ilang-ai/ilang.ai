const body = JSON.stringify({ status: 'under_construction', available: false, error: 'temporarily_unavailable', error_description: 'Coming soon. No registration or token issuance is available. Use the public lookup service at https://ilang.ai/api/agent/lookup or the MCP server at https://ilang.ai/mcp without credentials.' });
export async function onRequest() {
  return new Response(body, { status: 503, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Retry-After': '86400', 'Access-Control-Allow-Origin': '*' } });
}
