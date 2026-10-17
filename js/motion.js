/* ═══════════════════════════════════════════════════════════
   Motion — scroll reveal, sticky header, scrollspy,
   pointer glow, progress bar.  No dependencies.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Scroll reveal ─────────────────────────────────── */
  function initReveal() {
    var items = document.querySelectorAll('[data-rev]');
    if (!items.length) return;

    if (REDUCED || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      document.querySelectorAll('.bx').forEach(function (b) { b.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.style.setProperty('--rd', el.getAttribute('data-rev-d') || 0);
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ── 2. Sticky header + scroll progress + FAB ─────────── */
  function initScrollChrome() {
    var hdr = document.getElementById('hdr');
    var bar = document.querySelector('.scroll-progress');
    var fab = document.getElementById('fab');
    var hero = document.getElementById('hero');
    var apply = document.getElementById('apply');
    var ticking = false;

    function update() {
      var y = window.scrollY || window.pageYOffset;
      var max = document.documentElement.scrollHeight - window.innerHeight;

      if (hdr) hdr.classList.toggle('is-stuck', y > 24);
      if (bar) bar.style.setProperty('--p', (max > 0 ? (y / max) * 100 : 0) + '%');

      if (fab && hero) {
        var pastHero = y > hero.offsetHeight * 0.75;
        var atApply = apply
          ? apply.getBoundingClientRect().top < window.innerHeight * 0.85
          : false;
        fab.classList.toggle('is-on', pastHero && !atApply);
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });

    window.addEventListener('resize', update, { passive: true });
    update();
  }

  /* ── 3. Scrollspy for nav ─────────────────────────────── */
  function initScrollspy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    var map = {};
    var targets = [];
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var sec = document.getElementById(id);
      if (!sec) return;
      map[id] = a;
      targets.push(sec);
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var a = map[e.target.id];
        if (!a) return;
        if (e.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('is-active'); });
          a.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    targets.forEach(function (s) { io.observe(s); });
  }

  /* ── 4. Pointer glow on bento / cards ─────────────────── */
  function initPointerGlow() {
    if (REDUCED || !window.matchMedia('(hover: hover)').matches) return;
    document.querySelectorAll('.bx').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
      });
    });
  }

  /* ── 5. Hero card level bars + equalizer offsets ──────── */
  function initHeroCard() {
    var card = document.querySelector('.hcard');
    if (card) {
      card.querySelectorAll('.lvl').forEach(function (l, i) {
        l.style.setProperty('--i', i);
      });
      if (REDUCED || !('IntersectionObserver' in window)) {
        card.classList.add('is-lit');
      } else {
        var io = new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            if (!e.isIntersecting) return;
            card.classList.add('is-lit');
            io.disconnect();
          });
        }, { threshold: 0.35 });
        io.observe(card);
      }
    }

    document.querySelectorAll('.bx__vis--wave i').forEach(function (bar, i) {
      bar.style.setProperty('--n', i);
    });
  }

  /* ── 6. Bento in-view (drives the mini chart) ─────────── */
  function initBentoInView() {
    var boxes = document.querySelectorAll('.bx');
    if (!boxes.length) return;
    if (REDUCED || !('IntersectionObserver' in window)) {
      boxes.forEach(function (b) { b.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.3 });
    boxes.forEach(function (b) { io.observe(b); });
  }

  /* ── 7. Plane travelling the route path ───────────────── */
  function initRoutePlane() {
    var svg = document.querySelector('.route__svg');
    if (!svg || REDUCED) return;
    var path = svg.querySelector('.route__line');
    var plane = svg.querySelector('.route__plane');
    if (!path || !plane || typeof path.getTotalLength !== 'function') return;

    var len = path.getTotalLength();
    var visible = false;

    var io = 'IntersectionObserver' in window
      ? new IntersectionObserver(function (es) {
          es.forEach(function (e) { visible = e.isIntersecting; });
        }, { threshold: 0.2 })
      : null;
    if (io) io.observe(svg); else visible = true;

    var start = null;
    var DUR = 6200;

    function frame(ts) {
      requestAnimationFrame(frame);
      if (!visible) { start = null; return; }
      if (start === null) start = ts;
      var p = ((ts - start) % DUR) / DUR;

      var pt = path.getPointAtLength(len * p);
      var ahead = path.getPointAtLength(Math.min(len, len * p + 2));
      var angle = Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180 / Math.PI;

      plane.setAttribute('transform',
        'translate(' + pt.x.toFixed(2) + ',' + pt.y.toFixed(2) + ') rotate(' + (angle + 90).toFixed(2) + ')');
    }
    requestAnimationFrame(frame);
  }

  /* ── 8. Smooth in-page scrolling ──────────────────────── */
  function initSmoothLinks() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY -
                (parseInt(getComputedStyle(document.documentElement)
                  .getPropertyValue('--hdr-h'), 10) || 68) - 14;

      window.scrollTo({ top: top, behavior: REDUCED ? 'auto' : 'smooth' });

      // Close mobile nav if open
      var mnav = document.getElementById('mnav');
      if (mnav && !mnav.hidden) {
        mnav.hidden = true;
        var burger = document.getElementById('burger');
        if (burger) burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Boot ─────────────────────────────────────────────── */
  function boot() {
    initReveal();
    initScrollChrome();
    initScrollspy();
    initPointerGlow();
    initHeroCard();
    initBentoInView();
    initRoutePlane();
    initSmoothLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
