// The iLang Journal, an essay page: the discussion takes the page's paper or ink and follows the switch, and the list
// of sections shows which one is being read.
(function(){
  'use strict';
  var root = document.documentElement, slot = document.getElementById('giscusSlot');
  function ink(){ return (root.getAttribute('data-theme') || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'ink' : 'paper')) === 'ink'; }
  if (slot) {
    var s = document.createElement('script'), conf = { repo: 'ilang-ai/ilang.ai', 'repo-id': 'R_kgDORdhCaQ', category: 'Announcements', 'category-id': 'DIC_kwDORdhCac4C8mxx',
      mapping: 'pathname', strict: '0', 'reactions-enabled': '1', 'emit-metadata': '0', 'input-position': 'bottom', theme: ink() ? 'noborder_dark' : 'noborder_light', lang: 'en', loading: 'lazy' };
    s.src = 'https://giscus.app/client.js';
    for (var k in conf) s.setAttribute('data-' + k, conf[k]);
    s.crossOrigin = 'anonymous'; s.async = true;
    slot.appendChild(s);
    document.addEventListener('ilang:theme', function(){
      var f = document.querySelector('iframe.giscus-frame');
      if (f && f.contentWindow) f.contentWindow.postMessage({ giscus: { setConfig: { theme: ink() ? 'noborder_dark' : 'noborder_light' } } }, 'https://giscus.app');
    });
  }
  var links = Array.prototype.slice.call(document.querySelectorAll('#toc a[href^="#"]')), heads = [];
  links.forEach(function(a){ var h = document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1))); if (h) heads.push([h, a]); });
  if (!heads.length) return;
  var ticking = false;
  function mark(){
    ticking = false;
    var at = -1, line = innerHeight * .3;
    for (var i = 0; i < heads.length; i++) if (heads[i][0].getBoundingClientRect().top <= line) at = i;
    heads.forEach(function(p, i){ p[1].classList.toggle('cur', i === at); });
  }
  window.addEventListener('scroll', function(){ if (!ticking) { ticking = true; requestAnimationFrame(mark); } }, { passive: true });
  window.addEventListener('resize', mark);
  mark();
})();
