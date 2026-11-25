// runner.js – one frame loop for every chapter scene (load last, after cast.js, cast2.js, props.js, scene.js, sets.js).
// A scene page only lists its shots; the runner does the rest the same way for every chapter:
//   chapter card (10 / 25 / 6 frames, measured on Born in Lore) → voice starts at OFF s → scene fades in 5 frames →
//   shots cut on the narrator's words → 6-frame fade to black at the end (the next piece opens on its card).
// Usage in a scene page:
//   const R = RUN({ TEXT, OFF: 1.6, card: ['II', 'Fifty Ships'], tail: 1.3, defs: () => '…', SHOTS: [
//     { cue: 'You sail', n: 1, draw(f, l, d) { return { cam, bg, fg }; } },   // f = frame in the piece, l = frame in the shot, d = shot length
//     { time: t => t.last + 1.0, draw … },                                     // a shot that starts at a time (s, voice clock) instead of a word
//   ] });
//   Inside draw: R.at('word', n, off) = frame of the word (+off, default 2 = a pop lands 2 frames after the word starts),
//   R.F(seconds) = frame of a voice time, R.SH[i] = {a, b} start/end frame of shot i, R.W = the words.
// Words: ?words=../voice/<piece>/words.json (the real take); without it the timings are estimated at 2.5 words/s.
// Options: card: null for no card (the prologue flows on from the hook) · fadeOut: frames (default 6) · first: first shot starts at frame 0.
(function () {
  const S = window.SCENE, FPS = 30;
  window.RUN = function (cfg) {
    const OFF = cfg.OFF ?? (cfg.card ? 1.6 : 0);
    const R = { W: null, SH: [], END: 0, FPS, OFF };
    R.F = (t, off = 0) => Math.round((t + OFF) * FPS) + off;
    R.at = (phrase, n = 1, off = 2) => R.F(S.cue(R.W, phrase, n).s, off);
    R.end = (phrase, n = 1, off = 0) => R.F(S.cue(R.W, phrase, n).e, off);
    const stage = document.getElementById('stage');
    const CARD_FRAMES = Math.round(OFF * FPS) - 3;
    function frame(f) {
      if (cfg.card && f < R.SH[0].a) return `<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">${S.chapterCard(f, 2, cfg.card[0], cfg.card[1])}</svg>`;
      let i = R.SH.length - 1;
      while (i > 0 && f < R.SH[i].a) i--;
      const sh = R.SH[i];
      const out = cfg.SHOTS[i].draw(f, f - sh.a, sh.b - sh.a);
      const fadeIn = cfg.card && i === 0 ? 1 - S.win(f, sh.a, sh.a + 5) : 0;
      const fo = cfg.fadeOut ?? 6;
      return `<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>${S.DEFS}${window.SETS ? window.SETS.defs() : ''}${window.CAST2 && window.CAST2.SHADE_DEFS ? window.CAST2.SHADE_DEFS : ''}${cfg.defs ? cfg.defs() : ''}${out.defs || ''}</defs>
  <g filter="url(#grade)"><g transform="${out.cam}">${out.bg || ''}${out.fg || ''}</g>${out.hud || ''}</g>
  ${out.noVignette ? '' : S.vignette()}${out.over || ''}
  ${fadeIn > 0 ? `<rect width="1920" height="1080" fill="#07050a" opacity="${fadeIn.toFixed(2)}"/>` : ''}
  ${fo > 0 && f > R.END - fo ? `<rect width="1920" height="1080" fill="#000" opacity="${S.win(f, R.END - fo, R.END).toFixed(2)}"/>` : ''}
</svg>`;
    }
    R.frame = frame;
    window.READY = (async () => {
      const url = new URLSearchParams(location.search).get('words');
      const r = await S.loadWords(cfg.TEXT, url);
      R.W = r.words;
      const last = R.W[R.W.length - 1].e;
      R.SH = cfg.SHOTS.map((s, i) => {
        if (i === 0) return { a: cfg.card ? CARD_FRAMES : 0 };
        if (s.time) return { a: R.F(s.time({ last, W: R.W })) };
        return { a: R.F(S.cue(R.W, s.cue, s.n || 1).s, s.off ?? -2) };
      });
      for (let i = 1; i < R.SH.length; i++) if (R.SH[i].a <= R.SH[i - 1].a) throw new Error(`shot ${i + 1} (${cfg.SHOTS[i].cue}) does not start after shot ${i}`);
      R.END = R.F(last + (cfg.tail ?? 1.3));
      R.SH.forEach((s, i) => { s.b = i < R.SH.length - 1 ? R.SH[i + 1].a : R.END; });
      window.TOTAL_FRAMES = R.END;
      window.CUES = { realVoice: r.real, voiceOffset: OFF, card: cfg.card ? { num: cfg.card[0], title: cfg.card[1], frames: CARD_FRAMES } : null,
        shots: R.SH.map((s, i) => ({ shot: i + 1, cue: cfg.SHOTS[i].cue || 'time', start: +(s.a / FPS).toFixed(2), end: +(s.b / FPS).toFixed(2) })) };
      await document.fonts.ready;
      stage.innerHTML = frame(0);
    })();
    window.renderFrame = async f => { stage.innerHTML = frame(f); };
    return R;
  };
})();
