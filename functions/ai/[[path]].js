export async function onRequest({ request, env, params }) {
  const parts = params.path || [];
  if (parts.length === 0) {
    const res = await env.ASSETS.fetch(new Request(new URL('/ai/index.md', request.url).toString()));
    const body = await res.text();
    return new Response(body, { status: 200, headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'public, max-age=0, must-revalidate', 'Vary': 'Accept', 'Access-Control-Allow-Origin': '*' } });
  }
  return env.ASSETS.fetch(request);
}
