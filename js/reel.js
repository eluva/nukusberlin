/* ═══════════════════════════════════════════════════════════
   Reel — a scripted, scrubbable "video" built from DOM scenes.
   Timeline is driven by rAF; scenes are CSS-animated and
   restarted on seek so scrubbing behaves like a real player.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var player = document.getElementById('player');
  if (!player) return;

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var stage    = document.getElementById('stage');
  var scenes   = Array.prototype.slice.call(stage.querySelectorAll('.sc'));
  var playBtn  = document.getElementById('playBtn');
  var track    = document.getElementById('track');
  var fill     = document.getElementById('trackFill');
  var chapters = document.getElementById('chapters');
  var timeEl   = document.getElementById('time');
  var chipsEl  = document.getElementById('reelChips');

  if (!scenes.length) return;

  /* ── Timeline ─────────────────────────────────────────── */
  var DUR = [5, 5, 5, 5, 5, 5];                    // seconds per scene
  var TOTAL = DUR.reduce(function (a, b) { return a + b; }, 0);
  var STARTS = DUR.reduce(function (acc, d, i) {
    acc.push(i === 0 ? 0 : acc[i - 1] + DUR[i - 1]);
    return acc;
  }, []);

  var time = 0;
  var playing = false;
  var ended = false;
  var current = -1;
  var last = null;
  var scrubbing = false;
  var autoplayed = false;

  /* ── Rendering ────────────────────────────────────────── */
  function sceneAt(t) {
    for (var i = DUR.length - 1; i >= 0; i--) {
      if (t >= STARTS[i]) return i;
    }
    return 0;
  }

  function showScene(i, force) {
    if (i === current && !force) return;
    current = i;
    scenes.forEach(function (s, n) {
      if (n === i) {
        // Re-trigger CSS animations from the top
        s.classList.remove('is-on');
        void s.offsetWidth;
        s.classList.add('is-on');
      } else {
        s.classList.remove('is-on');
      }
    });
    if (chipsEl) {
      Array.prototype.forEach.call(chipsEl.children, function (b, n) {
        b.classList.toggle('is-on', n === i);
        b.setAttribute('aria-current', String(n === i));
      });
    }
  }

  function fmt(s) {
    var m = Math.floor(s / 60);
    var r = Math.floor(s % 60);
    return m + ':' + (r < 10 ? '0' : '') + r;
  }

  function paint() {
    var pct = (time / TOTAL) * 100;
    if (fill) fill.style.width = pct + '%';
    if (timeEl) timeEl.textContent = fmt(time) + ' / ' + fmt(TOTAL);
    if (track) track.setAttribute('aria-valuenow', Math.round(pct));
  }

  function setIcon(name) {
    var use = playBtn && playBtn.querySelector('use');
    if (use) use.setAttribute('href', '#i-' + name);
    if (playBtn) {
      var key = name === 'pause' ? 'a11y.pause' : 'a11y.play';
      playBtn.setAttribute('aria-label', window.I18N ? window.I18N.t(key) : name);
    }
  }

  /* ── Transport ────────────────────────────────────────── */
  function play() {
    if (ended) { time = 0; ended = false; }
    playing = true;
    last = null;
    setIcon('pause');
    requestAnimationFrame(tick);
  }

  function pause() {
    playing = false;
    setIcon(ended ? 'replay' : 'play');
  }

  function toggle() { playing ? pause() : play(); }

  function seek(t, keepPlaying) {
    time = Math.max(0, Math.min(TOTAL, t));
    ended = false;
    showScene(sceneAt(time), true);
    paint();
    if (!keepPlaying) { pause(); setIcon('play'); }
  }

  function tick(ts) {
    if (!playing) return;
    if (last === null) last = ts;
    var dt = (ts - last) / 1000;
    last = ts;

    if (!scrubbing) {
      time += dt;
      if (time >= TOTAL) {
        time = TOTAL;
        playing = false;
        ended = true;
        showScene(DUR.length - 1);
        paint();
        setIcon('replay');
        return;
      }
      showScene(sceneAt(time));
      paint();
    }
    requestAnimationFrame(tick);
  }

  /* ── Chapters + chips ─────────────────────────────────── */
  function buildChapters() {
    if (chapters) {
      chapters.innerHTML = '';
      STARTS.slice(1).forEach(function (s) {
        var i = document.createElement('i');
        i.style.setProperty('--l', (s / TOTAL) * 100 + '%');
        chapters.appendChild(i);
      });
    }

    if (!chipsEl) return;
    chipsEl.innerHTML = '';
    DUR.forEach(function (_, n) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = (window.I18N ? window.I18N.t('reel.ch' + (n + 1)) : 'Scene ' + (n + 1));
      b.addEventListener('click', function () { seek(STARTS[n], playing); if (playing) play(); });
      chipsEl.appendChild(b);
    });
  }

  function relabelChips() {
    if (!chipsEl) return;
    Array.prototype.forEach.call(chipsEl.children, function (b, n) {
      b.textContent = window.I18N.t('reel.ch' + (n + 1));
    });
    setIcon(playing ? 'pause' : (ended ? 'replay' : 'play'));
  }

  /* ── Track interaction ────────────────────────────────── */
  function ratioFromEvent(e) {
    var r = track.getBoundingClientRect();
    var x = (e.clientX !== undefined ? e.clientX : 0) - r.left;
    return Math.max(0, Math.min(1, x / r.width));
  }

  if (track) {
    track.addEventListener('pointerdown', function (e) {
      scrubbing = true;
      // Capture can reject unknown pointer ids — never let that kill the seek
      try { track.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      seek(ratioFromEvent(e) * TOTAL, true);
    });
    track.addEventListener('pointermove', function (e) {
      if (!scrubbing) return;
      seek(ratioFromEvent(e) * TOTAL, true);
    });
    ['pointerup', 'pointercancel'].forEach(function (ev) {
      track.addEventListener(ev, function (e) {
        if (!scrubbing) return;
        scrubbing = false;
        try {
          if (track.hasPointerCapture && track.hasPointerCapture(e.pointerId)) {
            track.releasePointerCapture(e.pointerId);
          }
        } catch (err) { /* ignore */ }
        if (playing) { last = null; requestAnimationFrame(tick); }
      });
    });

    track.addEventListener('keydown', function (e) {
      var step = 2;
      if (e.key === 'ArrowRight') { seek(time + step, playing); }
      else if (e.key === 'ArrowLeft') { seek(time - step, playing); }
      else if (e.key === 'Home') { seek(0, playing); }
      else if (e.key === 'End') { seek(TOTAL, false); }
      else if (e.key === ' ' || e.key === 'Enter') { toggle(); }
      else return;
      e.preventDefault();
      if (playing) { last = null; requestAnimationFrame(tick); }
    });
  }

  if (playBtn) playBtn.addEventListener('click', toggle);

  /* ── Autoplay in view, pause out of view ──────────────── */
  function initVisibility() {
    if (!('IntersectionObserver' in window)) { showScene(0); paint(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && e.intersectionRatio > 0.55) {
          if (!autoplayed && !REDUCED) { autoplayed = true; play(); }
        } else if (playing) {
          pause();
        }
      });
    }, { threshold: [0, 0.55] });
    io.observe(player);
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden && playing) pause();
  });

  document.addEventListener('i18n:changed', relabelChips);

  /* ── Init ─────────────────────────────────────────────── */
  buildChapters();
  showScene(0, true);
  paint();
  setIcon('play');

  if (REDUCED) {
    // No auto motion: let the viewer step through with the chips.
    showScene(0, true);
  } else {
    initVisibility();
  }
})();
