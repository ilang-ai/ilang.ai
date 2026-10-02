// ilang.ai v3: what every page does. The theme switch, the menu on small screens, the hairline under the nav once
// the page has moved, and the reading line.
(function(){
  'use strict';
  var root = document.documentElement,
      $ = function(s, c){ return (c || document).querySelector(s); },
      $$ = function(s, c){ return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  clearTimeout(window.__ilangSafe);
  window.ILANG = { $: $, $$: $$, reduce: reduce, root: root };

  // ---- paper or ink
  var themeBtn = $('#theme');
  function current(){ return root.getAttribute('data-theme') || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'ink' : 'paper'); }
  function sync(){
    var ink = current() === 'ink';
    if (themeBtn) themeBtn.setAttribute('aria-checked', ink ? 'true' : 'false');
    if (root.hasAttribute('data-theme')) $$('meta[name="theme-color"]').forEach(function(m){ m.setAttribute('content', ink ? '#12100c' : '#f5f1e8'); });
  }
  sync();
  if (themeBtn) themeBtn.addEventListener('click', function(ev){
    var next = current() === 'ink' ? 'paper' : 'ink';
    var apply = function(){ root.setAttribute('data-theme', next); try { localStorage.setItem('ilang-theme', next); } catch (e) {} sync(); document.dispatchEvent(new CustomEvent('ilang:theme', { detail: next })); };
    if (!document.startViewTransition || reduce) { apply(); return; }
    var r = themeBtn.getBoundingClientRect(), x = ev.clientX || r.left + r.width / 2, y = ev.clientY || r.top + r.height / 2;
    var far = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    var vt = document.startViewTransition(apply);
    vt.ready.then(function(){
      root.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + far + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: 750, easing: 'cubic-bezier(.3,.6,.2,1)', pseudoElement: '::view-transition-new(root)' });
    }).catch(function(){});
  });

  // ---- the menu on small screens
  var nav = $('#nav'), toggle = $('#navToggle'), links = $('#navLinks');
  function menu(open){
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
    $$('body > *').forEach(function(el){ if (el === nav || el.tagName === 'SCRIPT') return; if (open) el.setAttribute('inert', ''); else el.removeAttribute('inert'); });
  }
  if (toggle && links) {
    toggle.addEventListener('click', function(){ menu(!links.classList.contains('open')); });
    links.addEventListener('click', function(e){ if (e.target.closest('a')) menu(false); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && links.classList.contains('open')) { menu(false); toggle.focus(); } });
    window.addEventListener('resize', function(){ if (innerWidth > 1060 && links.classList.contains('open')) menu(false); });
  }

  // ---- the hairline under the nav and the reading line
  var prog = $('#progress'), ticking = false;
  function onScroll(){
    ticking = false;
    var y = window.scrollY || window.pageYOffset, max = document.documentElement.scrollHeight - innerHeight, p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
    if (nav) nav.classList.toggle('scrolled', y > 8);
    if (prog) prog.style.transform = 'scaleX(' + p + ')';
    window.ILANG.progress = p;
    document.dispatchEvent(new CustomEvent('ilang:scroll', { detail: { y: y, p: p, max: max } }));
  }
  window.addEventListener('scroll', function(){ if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', onScroll);
  onScroll();

})();

// ilang.ai v3: the inner pages. Every section title can be linked to, and a page with several sections gets the rail
// of the home page: a ruler that shows where you are.
(function(){
  'use strict';
  var I = window.ILANG;
  if (!I) return;
  var $ = I.$, $$ = I.$$, root = I.root;
  var heads = $$('.content h2').filter(function(h){ return !h.closest('.pane-head'); });
  if (!heads.length) return;

  // ---- every title can be linked to
  var used = {};
  $$('[id]').forEach(function(el){ used[el.id] = 1; });
  heads.forEach(function(h){
    if (h.id) return;
    var own = '';
    h.childNodes.forEach(function(nd){ if (nd.nodeType === 3) own += nd.nodeValue; });
    var slug = (own || h.textContent).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section', id = slug, k = 2;
    while (used[id]) id = slug + '-' + (k++);
    used[id] = 1; h.id = id;
  });
  if (location.hash.length > 1) { var want = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (want) want.scrollIntoView(); }

  // ---- the rail
  if (heads.length < 3) return;
  var rail = document.createElement('aside');
  rail.className = 'rail'; rail.setAttribute('aria-hidden', 'true');
  var mark = document.createElement('u'), out = document.createElement('output');
  out.textContent = '0.00';
  rail.appendChild(mark); rail.appendChild(out);
  // where the titles carry their own numbers ("13. Judgment Layer"), the rail shows those and not a count of its own
  var titles = heads.map(function(h){
    var own = '';
    h.childNodes.forEach(function(nd){ if (nd.nodeType === 3) own += nd.nodeValue; });
    return (own || h.textContent).replace(/\s+/g, ' ').trim();
  });
  var numbered = titles.some(function(t){ return /^\d+\./.test(t); });
  var links = heads.map(function(h, i){
    var a = document.createElement('a'), n = numbered ? (/^(\d+)\./.exec(titles[i]) || [])[1] : String(i + 1);
    a.href = '#' + h.id; a.tabIndex = -1;
    a.textContent = n ? (n.length < 2 ? '0' : '') + n : '·';
    a.setAttribute('data-t', titles[i]);
    rail.appendChild(a);
    return a;
  });
  document.body.insertBefore(rail, document.body.firstChild.nextSibling);
  root.classList.add('has-rail');
  var footer = $('footer'), tops = [];
  function place(){
    var max = document.documentElement.scrollHeight - innerHeight, H = rail.clientHeight - 22, last = -99;
    // a title that is stuck under the nav reports where it is stuck, so a section's top is read from what follows its title
    tops = heads.map(function(h){ return (h.nextElementSibling || h).getBoundingClientRect().top + window.scrollY; });
    links.forEach(function(a, i){
      var y = Math.min(1, tops[i] / Math.max(1, max)) * H;
      a.style.top = y + 'px';
      a.classList.toggle('dim', y - last < 13);
      if (y - last >= 13) last = y;
    });
  }
  function onScroll(){
    var y = window.scrollY || window.pageYOffset, max = document.documentElement.scrollHeight - innerHeight, p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0, at = -1;
    mark.style.transform = 'translateY(' + p * (rail.clientHeight - 22) + 'px)';
    out.textContent = p.toFixed(2);
    for (var i = 0; i < tops.length; i++) if (tops[i] <= y + innerHeight * .4) at = i;
    links.forEach(function(a, i){ a.classList.toggle('cur', i === at); });
    if (footer) rail.classList.toggle('away', footer.getBoundingClientRect().top < innerHeight - 40);
  }
  place(); onScroll();
  document.addEventListener('ilang:scroll', onScroll);
  window.addEventListener('resize', function(){ place(); onScroll(); });
  window.addEventListener('load', function(){ place(); onScroll(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ place(); onScroll(); });
})();
