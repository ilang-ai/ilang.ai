const body = JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32000, message: 'A2A endpoint is planned and not available yet. Use the MCP server at https://ilang.ai/mcp or https://ilang.ai/api/agent/lookup.' }, status: 'planned', available: false });
export async function onRequest() {
  return new Response(body, { status: 503, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Retry-After': '86400', 'Access-Control-Allow-Origin': '*' } });
}
