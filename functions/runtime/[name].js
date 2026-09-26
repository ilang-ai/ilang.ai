// The official iLang runtime on ilang.ai, served from the canon: /runtime/core, /runtime/full,
// /runtime/media and /runtime/manifest pass through the generated files in ilang-spec/runtime,
// byte for byte, through runtime.ilang.app, so the site never holds a second copy. The core bundle tells a model to read
// /runtime/full when it is unsure how a rule applies.
const RAW = 'https://runtime.ilang.app/';
const CANON = 'https://raw.githubusercontent.com/ilang-ai/ilang-spec/main/runtime/';
const FILES = { core: 'ilang-latest.md', full: 'ilang-full.md', media: 'ilang-media-latest.md', manifest: 'manifest.json' };

export async function onRequestGet({ params }) {
  const file = FILES[params.name];
  if (!file) {
    return new Response('Use /runtime/core, /runtime/full, /runtime/media or /runtime/manifest.\n',
      { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  const res = await fetch(RAW + file, { cf: { cacheTtl: 300, cacheEverything: true } });
  if (!res.ok) {
    return new Response('The runtime host did not answer; the same file is at ' + CANON + file + '\n',
      { status: 502, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  return new Response(res.body, {
    status: 200,
    headers: {
      'Content-Type': file.endsWith('.json') ? 'application/json; charset=utf-8' : 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      'Access-Control-Allow-Origin': '*',
      'Link': '<' + RAW + file + '>; rel="canonical"',
    },
  });
}
