// Markdown for agents: Accept: text/markdown returns the page's Markdown twin (path/index.md or page.md).
export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const accept = request.headers.get('accept') || '';
  if (request.method === 'GET' && /text\/markdown/i.test(accept)) {
    const p = url.pathname;
    const cands = p.endsWith('/') ? [p + 'index.md'] : p.endsWith('.html') ? [p.replace(/\.html$/, '.md')] : (/\.[a-z0-9]+$/i.test(p) ? [] : [p + '/index.md', p + '.md']);
    for (const md of cands) {
      const res = await env.ASSETS.fetch(new Request(new URL(md, url.origin).toString(), { method: 'GET' }));
      // Pages has no 404.html: a missing asset comes back as the homepage HTML with 200 (and _headers relabels *.md paths as
      // text/markdown), so the only reliable check is the body itself: twins start with a Markdown heading, the fallback with <!DOCTYPE.
      if (!res.ok) continue;
      const twin = await res.text();
      if (/^\s*<(!doctype|html)/i.test(twin) || !/^\s*#/.test(twin)) continue;
      {
        const canonical = url.origin + (p.endsWith('/') || /\.[a-z0-9]+$/i.test(p) ? p : p + '/');
        const body = '::ILANG::v5.0\n[TYPE:page_representation][LANG:en]\n\n::STATE{@SOURCE, url:' + canonical + '}\n::STATE{@ENTRY, url:' + url.origin + '/ai/}\n::STATE{@LOOKUP, url:' + url.origin + '/api/agent/lookup, method:GET, param:q}\n\n' + twin;
        const h = new Headers();
        h.set('Content-Type', 'text/markdown; charset=utf-8');
        h.set('Vary', 'Accept');
        h.set('x-markdown-tokens', String(Math.ceil(body.length / 4)));
        h.set('Cache-Control', 'public, max-age=0, must-revalidate');
        h.set('Content-Location', md);
        return new Response(body, { status: 200, headers: h });
      }
    }
  }
  const res = await next();
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('text/html')) {
    const h = new Headers(res.headers);
    h.append('Vary', 'Accept');
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
  }
  return res;
}
