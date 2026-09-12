let cache = null;
export async function loadData(env, origin) {
  if (cache) return cache;
  const res = await env.ASSETS.fetch(new Request(origin + '/ai/data.json'));
  cache = await res.json();
  return cache;
}
export function norm(s) { return String(s || '').toLowerCase().replace(/^@/, '').trim(); }
export function lookup(data, q) {
  const n = norm(q); if (!n) return [];
  const exact = [], partial = [];
  for (const e of data.entries) {
    const name = norm(e.name), alias = norm(e.alias);
    if (name === n || alias === n || (n.endsWith('=') && name === n.slice(0, -1))) exact.push(e);
    else if (name.includes(n) || (alias && alias === n) || norm(e.meaning).includes(n) || norm(e.category).includes(n)) partial.push(e);
  }
  return exact.concat(partial).slice(0, 20).map(e => Object.assign({}, e, { source_url: 'https://ilang.ai/dictionary/' }));
}
export function faq(data, q) {
  const words = norm(q).split(/[^a-z0-9\-]+/).filter(w => w.length > 2 && !['the','and','what','how','does','with','for','are','can','you','from','that','this'].includes(w));
  const scored = data.faq.map(f => {
    const tq = norm(f.question), ta = norm(f.answer);
    let s = 0; for (const w of words) { if (tq.includes(w)) s += 2; else if (ta.includes(w)) s += 1; }
    return { s, f };
  }).filter(x => x.s > 0).sort((a, b) => b.s - a.s);
  return scored.slice(0, 3).map(x => x.f);
}
export function json(obj, status = 200, extra = {}) {
  const h = Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=300' }, extra);
  return new Response(JSON.stringify(obj), { status, headers: h });
}
