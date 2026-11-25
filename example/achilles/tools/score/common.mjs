// common.mjs – helpers shared by the chapter scores (tools/score/<piece>.mjs). Same palette as the hook and chapter I:
// lyre = Karplus–Strong plucks, string pad, frame drum, Styx drone, freeverb hall, D dorian at 80 BPM (beat 0.75 s).
// A score file exports score(X, total) -> stereo buffer and sfx(X, total) -> { sfx, ev }; X comes from tools/sound_piece.mjs:
//   X.A (audio toolkit), X.N (MIDI note -> Hz), X.cue(phrase, n) -> {s, e} in piece seconds (voice offset included),
//   X.shot(k) -> {start, end} of shot k (1-based), X.CUES (cues.json), X.kit(name) (sfx/<name>.wav, or made in code), and the
//   instruments pluck, pad, drum, drone, glass, reverb, splash, bubble, plink, snip, hornCall, rustle.
// Rules (STYLE_BIBLE §7 + chapter I): music all the way through, a steady low pulse in action, silence or a thin pad at the low
// points, ~12 effects per minute on things that happen on screen, whoosh + soft boom under every chapter card.
export function tools(X, total) {
  const { A, N } = X;
  const dry = A.make(A.sec(total + 3));
  const T = {
    dry,
    B: 0.75,
    // arpeggio of plucks over [t0, t1)
    arp(tones, t0, t1, step, g, o = {}) {
      const pat = o.pat || [0, 1, 2, 1]; let k = 0;
      for (let t = t0; t < t1 - 0.05; t += step, k++) A.place(dry, A.gain(X.pluck(N(tones[pat[k % pat.length]]), o.len || 1.4, { bright: o.bright || 0.5, decay: o.decay || 0.9965 }), g * (k % 2 ? 0.8 : 1)), t, { pan: ((k % 3) - 1) * 0.35 });
    },
    padAt(notes, t0, t1, o = {}) { A.place(dry, X.pad(notes.map(N), Math.max(0.2, t1 - t0), { att: o.att || 0.5, rel: o.rel || 0.4, level: o.level || 0.35, cut: o.cut || 1200 }), t0); },
    bass(root, t0, t1, g = 1) { A.place(dry, A.gain(X.pad([N(root)], Math.max(0.2, t1 - t0), { att: 0.04, rel: 0.25, cut: 260, level: 1.6, hp: 30 }), g), t0); },
    drumAt(t, g = 0.5, big = 1) { A.place(dry, A.gain(X.drum(big), g), t); },
    // a steady pulse (frame drum on every bar, a lighter hit on beat 3.5 every second bar)
    pulse(t0, t1, g = 0.45, bar = 3.0) { for (let t = t0, b = 0; t < t1 - 0.1; t += bar, b++) { A.place(dry, A.gain(X.drum(1), g), t); if (b % 2) A.place(dry, A.gain(X.drum(0.6), g * 0.45), t + 0.75 * 3.5); } },
    droneAt(root, t0, t1, g = 0.14) { A.place(dry, A.gain(X.drone(N(root), Math.max(0.3, t1 - t0)), g), t0); },
    note(nn, t, g = 0.3, o = {}) { A.place(dry, A.gain(X.pluck(N(nn), o.len || 1.8, { bright: o.bright || 0.5, decay: o.decay || 0.997 }), g), t, { pan: o.pan || 0 }); },
    // finish: hall reverb over everything (same settings as chapter I)
    done(o = {}) { const music = A.make(A.sec(total + 3)); A.place(music, X.reverb(dry, { room: 0.86, damp: 0.4, wet: o.wet || 0.3 }), 0); return music; },
  };
  return T;
}
// effects list with a log (every effect sits on something that happens on screen)
export function fx(X, total) {
  const { A } = X;
  const sfx = A.make(A.sec(total + 2)), ev = [];
  const add = (s, t, db, opt = {}, what = '') => { if (t < 0) t = 0; A.place(sfx, A.gain(s, A.dbToLin(db)), t, opt); ev.push([t, what, db]); };
  return { sfx, ev, add };
}
// the chapter card: a whoosh in, a soft boom under the title, and a low swell (same as chapter I)
export function card(X, T, F, dark = false) {
  F.add(X.kit('whoosh_in'), 0.05, dark ? -17 : -14, {}, 'chapter card whoosh');
  F.add(X.kit('boom'), 0.4, dark ? -16 : -18, {}, 'chapter card boom');
  T.droneAt(38, 0.1, 1.9, 0.12);
}
