/* ═══════════════════════════════════════════════════════════
   App — language switcher, nav, course index, slider, apply form.
   Edit CONFIG below to point the site at your real contacts.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ═══════════════ CONFIG — edit these ═══════════════ */
  var CONFIG = {
    telegram: 'https://t.me/TabisxanovNurasil',
    instagram: 'https://www.instagram.com/berlin_nukus/',

    // Displayed in the footer and used for the tel: link.
    phoneDisplay: '+998 93 712 14 96',
    phoneDial: '+998937121496',

    // OPTIONAL. Leave '' to run without a backend: the form then
    // stores the lead locally and hands the visitor to Telegram
    // with a pre-filled message. Set a URL to POST JSON instead.
    formEndpoint: ''
  };

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var T  = function (k) { return window.I18N ? window.I18N.t(k) : k; };

  /* ═══════════════ 1. Language — inline segmented control ═══════════════
     Each segment is a real link to that language's page; clicking only
     remembers the choice and carries the current #section across. */
  function initLang() {
    $$('[data-set-lang]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        var lang = b.getAttribute('data-set-lang');
        window.I18N.remember(lang);
        e.preventDefault();
        if (lang !== window.I18N.page) location.href = b.getAttribute('href') + location.hash;
      });
    });
    window.I18N.apply(window.I18N.detect());
  }

  /* ═══════════════ 2. Mobile nav ═══════════════ */
  function initBurger() {
    var burger = $('#burger');
    var mnav = $('#mnav');
    if (!burger || !mnav) return;

    burger.addEventListener('click', function () {
      var open = mnav.hidden;
      mnav.hidden = !open;
      burger.setAttribute('aria-expanded', String(open));
      var use = burger.querySelector('use');
      if (use) use.setAttribute('href', open ? '#i-close' : '#i-menu');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !mnav.hidden) {
        mnav.hidden = true;
        burger.setAttribute('aria-expanded', 'false');
        var use = burger.querySelector('use');
        if (use) use.setAttribute('href', '#i-menu');
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1080 && !mnav.hidden) {
        mnav.hidden = true;
        burger.setAttribute('aria-expanded', 'false');
      }
    }, { passive: true });
  }

  /* ═══════════════ 3. Course index — expandable rows ═══════════════ */
  function initRows() {
    var toggles = $$('.idx__tg');
    if (!toggles.length) return;

    function label(btn) {
      var row = btn.closest('tr');
      var name = row && row.querySelector('.idx__name b');
      if (name) btn.setAttribute('aria-label', name.textContent);
    }

    toggles.forEach(function (btn) {
      label(btn);
      btn.addEventListener('click', function () {
        var det = document.getElementById(btn.getAttribute('aria-controls'));
        if (!det) return;
        var open = btn.getAttribute('aria-expanded') === 'true';

        // Accordion: only one course open at a time
        if (!open) {
          toggles.forEach(function (o) {
            if (o === btn) return;
            o.setAttribute('aria-expanded', 'false');
            var d = document.getElementById(o.getAttribute('aria-controls'));
            if (d) d.hidden = true;
          });
        }
        btn.setAttribute('aria-expanded', String(!open));
        det.hidden = open;
      });
    });

    // Course titles are translated, so refresh the labels on language change
    document.addEventListener('i18n:changed', function () { toggles.forEach(label); });
  }

  /* ═══════════════ 4. Testimonial slider ═══════════════ */
  function initSlider() {
    var vp    = $('#tvp');
    var trk   = $('#ttrack');
    var prev  = $('#tPrev');
    var next  = $('#tNext');
    var dots  = $('#tdots');
    if (!vp || !trk) return;

    var slides = $$('.tq', trk);
    var index = 0;

    function perView() {
      var w = window.innerWidth;
      if (w <= 760) return 1;
      if (w <= 1080) return 2;
      return 3;
    }
    function maxIndex() { return Math.max(0, slides.length - perView()); }

    function step() {
      if (!slides[0]) return 0;
      var gap = parseFloat(getComputedStyle(trk).gap) || 0;
      return slides[0].getBoundingClientRect().width + gap;
    }

    function render() {
      index = Math.min(index, maxIndex());
      trk.style.transform = 'translate3d(' + (-index * step()) + 'px,0,0)';
      if (prev) prev.disabled = index <= 0;
      if (next) next.disabled = index >= maxIndex();
      if (dots) {
        $$('button', dots).forEach(function (d, i) {
          d.classList.toggle('is-on', i === index);
          d.setAttribute('aria-current', String(i === index));
        });
      }
    }

    function buildDots() {
      if (!dots) return;
      dots.innerHTML = '';
      for (var i = 0; i <= maxIndex(); i++) {
        (function (n) {
          var b = document.createElement('button');
          b.type = 'button';
          b.setAttribute('aria-label', 'Slide ' + (n + 1));
          b.addEventListener('click', function () { index = n; render(); });
          dots.appendChild(b);
        })(i);
      }
    }

    if (prev) prev.addEventListener('click', function () { index = Math.max(0, index - 1); render(); });
    if (next) next.addEventListener('click', function () { index = Math.min(maxIndex(), index + 1); render(); });

    // Touch swipe
    var x0 = null;
    vp.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    vp.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) {
        index = dx < 0 ? Math.min(maxIndex(), index + 1) : Math.max(0, index - 1);
        render();
      }
      x0 = null;
    }, { passive: true });

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { buildDots(); render(); }, 140);
    }, { passive: true });

    buildDots();
    render();
  }

  /* ═══════════════ 5. FAQ — one open at a time ═══════════════ */
  function initFaq() {
    var items = $$('.ac');
    items.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        items.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  }

  /* ═══════════════ 6. Contacts from CONFIG ═══════════════ */
  function initContacts() {
    $$('[data-phone]').forEach(function (el) { el.textContent = CONFIG.phoneDisplay; });
    $$('[data-phone-link]').forEach(function (a) { a.href = 'tel:' + CONFIG.phoneDial; });
    $$('a[href*="t.me"]').forEach(function (a) { a.href = CONFIG.telegram; });
    $$('a[href*="instagram.com"]').forEach(function (a) { a.href = CONFIG.instagram; });
    var yr = $('#yr');
    if (yr) yr.textContent = new Date().getFullYear();
  }

  /* ═══════════════ 7. Apply form ═══════════════ */
  function initForm() {
    var form = $('#applyForm');
    var done = $('#done');
    var btn  = $('#submitBtn');
    if (!form) return;

    var chosenProgram = '';

    /* — "Tańlaw" buttons pre-fill the form — */
    $$('[data-apply]').forEach(function (el) {
      el.addEventListener('click', function () {
        chosenProgram = el.getAttribute('data-apply');

        var level = form.elements.level;
        var opt = Array.prototype.filter.call(level.options, function (o) {
          return o.value === chosenProgram;
        })[0];
        if (opt) level.value = opt.value;

        if (chosenProgram === 'Ausbildung') {
          var r = form.querySelector('input[name="goal"][value="Ausbildung"]');
          if (r) r.checked = true;
        }

        // Show the form again if a previous submission is on screen
        if (done && !done.hidden) { done.hidden = true; form.hidden = false; }
      });
    });

    /* — Validation — */
    function digits(s) { return (s || '').replace(/\D/g, ''); }

    var RULES = {
      name: function (v) { return v.trim().length >= 2; },
      phone: function (v) {
        var d = digits(v);
        return d.length >= 9 && d.length <= 15;
      }
    };

    function setError(field, on) {
      var input = form.elements[field];
      var slot = form.querySelector('[data-err="' + field + '"]');
      if (input) input.classList.toggle('is-bad', on);
      if (input) input.setAttribute('aria-invalid', String(on));
      if (slot) {
        slot.textContent = on ? T('err.' + field) : '';
        slot.classList.toggle('is-on', on);
      }
    }

    function validate(silent) {
      var bad = null;
      Object.keys(RULES).forEach(function (f) {
        var ok = RULES[f](form.elements[f].value);
        if (!silent) setError(f, !ok);
        if (!ok && !bad) bad = f;
      });
      return bad;
    }

    Object.keys(RULES).forEach(function (f) {
      var input = form.elements[f];
      if (!input) return;
      input.addEventListener('blur', function () {
        if (input.value.trim()) setError(f, !RULES[f](input.value));
      });
      input.addEventListener('input', function () {
        if (input.classList.contains('is-bad') && RULES[f](input.value)) setError(f, false);
      });
    });

    /* — Payload — */
    function collect() {
      var fd = new FormData(form);
      return {
        name: (fd.get('name') || '').toString().trim(),
        phone: (fd.get('phone') || '').toString().trim(),
        level: fd.get('level'),
        goal: fd.get('goal'),
        time: fd.get('time'),
        note: (fd.get('note') || '').toString().trim(),
        program: chosenProgram || '—',
        lang: window.I18N ? window.I18N.lang : '',
        page: location.href,
        at: new Date().toISOString()
      };
    }

    function telegramMessage(d) {
      return [
        'BERLIN — jańa ariza / новая заявка',
        'Atı / Имя: ' + d.name,
        'Telefon: ' + d.phone,
        'Deńgey / Уровень: ' + d.level,
        'Maqset / Цель: ' + d.goal,
        'Waqıt / Время: ' + d.time,
        'Kurs: ' + d.program,
        d.note ? ('Qosımsha / Комментарий: ' + d.note) : ''
      ].filter(Boolean).join('\n');
    }

    function store(d) {
      try {
        var all = JSON.parse(localStorage.getItem('berlin.leads') || '[]');
        all.push(d);
        localStorage.setItem('berlin.leads', JSON.stringify(all.slice(-50)));
      } catch (e) { /* storage unavailable — not fatal */ }
    }

    function succeed(d) {
      form.hidden = true;
      if (done) {
        done.hidden = false;
        var tg = done.querySelector('a[href*="t.me"]');
        if (tg) {
          tg.href = CONFIG.telegram;
          // Hand the visitor a message they can paste straight into the chat
          try { navigator.clipboard && navigator.clipboard.writeText(telegramMessage(d)); }
          catch (e) { /* clipboard blocked — harmless */ }
        }
        done.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot — silently accept and drop
      if (form.elements.company && form.elements.company.value) return;

      var bad = validate(false);
      if (bad) {
        var el = form.elements[bad];
        el.focus();
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        return;
      }

      var data = collect();
      btn.classList.add('is-busy');

      function finish() {
        btn.classList.remove('is-busy');
        store(data);
        succeed(data);
        form.reset();
        chosenProgram = '';
      }

      if (CONFIG.formEndpoint) {
        fetch(CONFIG.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
          .then(finish)
          .catch(function () {
            // Network failed — still hand off via Telegram rather than lose the lead
            finish();
          });
      } else {
        setTimeout(finish, 700);
      }
    });

    var again = $('#againBtn');
    if (again) {
      again.addEventListener('click', function () {
        if (done) done.hidden = true;
        form.hidden = false;
        form.elements.name.focus();
      });
    }
  }

  /* ═══════════════ Boot ═══════════════ */
  function boot() {
    initLang();
    initBurger();
    initRows();
    initSlider();
    initFaq();
    initContacts();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
