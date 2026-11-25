// prologue.mjs – music and effects for the prologue "Half a God" (EPISODE.md § 2), made in code like the hook and chapter I.
// The music picks up exactly where the hook stops (the Styx drone in D and its glassy pad), turns light and comic for the
// family jokes, sneaky for the night, festive for the wedding, ominous on "Remember that apple.", playful for Chiron's school,
// warm for Patroclus, a small heroic swell on "Then you grow up. Fast." and one big hit on "attention.". No chapter card.
// D dorian, 80 BPM (beat 0.75 s). Effects: ~12 per minute, each on something that happens in the picture.
import { tools, fx } from './common.mjs';

// the Styx drone without a fade-in (the hook's drone is still sounding when this piece starts)
function drone0(X, f0, d) {
  const { A } = X, n = A.sec(d), s = A.make(n);
  for (let i = 0; i < n; i++) {
    const t = i / A.SR, trem = 0.85 + 0.15 * Math.sin(2 * Math.PI * 0.18 * t);
    const v = (Math.sin(2 * Math.PI * f0 * t) + 0.45 * Math.sin(2 * Math.PI * f0 * 1.5 * t + 0.4) + 0.2 * Math.sin(2 * Math.PI * f0 * 2.002 * t)) * trem;
    s.L[i] = v * (1 + 0.1 * Math.sin(2 * Math.PI * 0.07 * t)); s.R[i] = v * (1 - 0.1 * Math.sin(2 * Math.PI * 0.07 * t));
  }
  return A.fade(A.filt(s, 'lp', 600), 0.02, 1.6);
}

export function score(X, total) {
  const { A, N, cue, shot } = X;
  const T = tools(X, total), B = T.B, dry = T.dry;
  const S = k => shot(k).start, c = (p, n = 1) => cue(p, n).s;
  const bell = (nn, t, g, pan = 0, d = 1.6) => A.place(dry, A.gain(A.bell(N(nn), d, { bright: 0.6 }), g), t, { pan });
  const stac = (nn, t, g, o = {}) => T.note(nn, t, g, { len: o.len || 0.45, decay: o.decay || 0.988, bright: o.bright || 0.65, pan: o.pan || 0 });
  // the light comic vamp of chapter I (Dm – G), bouncy bass, staccato plucks
  const vamp = [{ root: 38, t: [62, 65, 69, 74] }, { root: 43, t: [62, 67, 71, 74] }];
  function comic(t0, t1, o = {}) {
    for (let b = 0, t = t0; t < t1 - 0.05; b++, t += 4 * B) {
      const ch = vamp[b % 2], e = Math.min(t1 - 0.05, t + 4 * B);
      T.arp(ch.t, t, e, B / 2, o.g ?? 0.22, { pat: [0, 2, 1, 3, 2, 1, 3, 2], decay: 0.99, bright: 0.7, len: 0.6 });
      for (let k = 0; k < 4 && t + k * B < e; k++) A.place(dry, A.gain(X.pluck(N(ch.root + (k % 2 ? 7 : 0)), 0.5, { decay: 0.985, bright: 0.6 }), o.bass ?? 0.45), t + k * B);
      T.padAt([ch.root + 12, ch.t[0], ch.t[2]], t, e, { level: o.pad ?? 0.15 });
      if (o.drum) for (let k = 0; k < 4 && t + k * B < e; k++) if (o.drum === 'beat' || k === 0) T.drumAt(t + k * B, k ? 0.22 : 0.36, 0.7);
    }
  }
  // the ominous "Remember that …" note: a low drum, a low D with a flat second above it, the drone (used twice: apple, armour)
  const lowNote = (t, d) => { T.drumAt(t, 0.62, 1.7); T.note(38, t, 0.55, { len: 3, bright: 0.3, decay: 0.998 }); T.note(45, t + 0.02, 0.3, { len: 3, bright: 0.3, decay: 0.998 });
    A.place(dry, A.gain(X.drone(N(38), d + 0.8), 0.2), t); T.padAt([38, 45, 50, 51], t, t + d, { level: 0.22, cut: 520, att: 0.05 }); };

  // A · the Styx (shots 1–8): the hook's drone and glassy pad go straight on; a lyre note on "Thetis", a sparkle on "immortal"
  A.place(dry, A.gain(drone0(X, N(38), S(9) + 0.6), 0.16), 0);
  A.place(dry, A.gain(X.glass([N(86), N(93), N(100)], S(4) - 0.3, { att: 0.05, rel: 1.4 }), 0.05), 0);
  T.note(74, c('Thetis,') + 0.02, 0.3, { len: 2.6, bright: 0.35, decay: 0.998, pan: 0.2 });
  T.note(69, c('goddess,') + 0.05, 0.22, { len: 2.2, bright: 0.35, decay: 0.998, pan: -0.2 });
  [81, 86, 88, 93].forEach((nn, k) => bell(nn, c('immortal.') + k * 0.07, 0.05, (k - 1.5) * 0.3));
  T.note(50, c('river.') + 0.1, 0.4, { len: 1.6, bright: 0.4 });                                  // deadpan
  // B · dad (shots 4–5): the light comic vamp over the drone; "consulted." – a stop, then a falling "wah"
  comic(S(4) + 0.05, c('consulted.') - 0.05);
  [69, 65, 62, 57].forEach((nn, k) => stac(nn, c('consulted.') + 0.3 + k * 0.1, 0.26, { len: 0.55 }));
  // C · under water (shots 6–8): a muffled pad, one clear glass note on the heel, a tiny plink on "Tiny detail."
  T.padAt([50, 57, 62, 65], S(6), S(9) - 0.1, { level: 0.28, cut: 420, att: 0.25 });
  A.place(dry, A.gain(X.glass([N(81), N(86)], S(9) - S(6) - 0.4, { att: 0.4, rel: 1 }), 0.04), S(6));
  bell(93, c('heel') + 0.05, 0.08, -0.2, 2.2);
  stac(98, c('detail.') + 0.08, 0.12, { len: 0.4, bright: 0.8 });
  // D · night in the palace (shot 9): tiptoe plucks on her steps, a sneaky chromatic line
  const sneak = [50, 53, 57, 56, 55, 53, 50, 49];
  for (let k = 0, t = S(9) + 0.08; t < S(10) - 0.1; k++, t += B / 2) if (k % 4 !== 3) stac(sneak[k % 8], t, 0.32, { len: 0.3, decay: 0.98, bright: 0.55, pan: (k % 2 ? 0.25 : -0.25) });
  T.padAt([38, 50, 57], S(9), S(10), { level: 0.13, cut: 600 });
  // E · the magic fire (shot 10): warm D major glow and rising bells
  T.padAt([50, 62, 66, 69, 74], S(10), S(11), { level: 0.26, att: 0.2, cut: 1600 }); T.bass(38, S(10), S(11), 0.5);
  [74, 78, 81, 86, 90, 93].forEach((nn, k) => bell(nn, S(10) + 0.1 + k * 0.11, 0.045, (k % 3 - 1) * 0.4, 1.4));
  // F · dad walks in (shot 11): an uneasy low cluster, then a dissonant stab on "screams."
  T.padAt([38, 45, 51], S(11), c('screams.'), { level: 0.24, cut: 500, att: 0.1 });
  T.drumAt(c('screams.') + 0.02, 0.7, 1.5);
  [74, 75, 62, 63].forEach(nn => T.note(nn, c('screams.') + 0.02, 0.2, { len: 1.0, bright: 0.8 }));
  // G · dawn (shots 12–13): Bbmaj7 → Gm, a slow falling lyre line, one deadpan low note on "marriage."
  T.padAt([46, 58, 62, 65, 69], S(12), S(13), { level: 0.26, att: 0.6 }); T.bass(34, S(12), S(13), 0.7);
  T.padAt([43, 55, 58, 62, 67], S(13), S(14) - 0.15, { level: 0.24 }); T.bass(31, S(13), S(14) - 0.15, 0.6);
  [74, 72, 69, 67, 65].forEach((nn, k) => T.note(nn, S(12) + 0.2 + k * B, 0.24, { len: 2.2, decay: 0.997, pan: (k % 2 ? 0.2 : -0.2) }));
  T.note(38, c('marriage.') + 0.05, 0.5, { len: 1.8, bright: 0.35 });
  // H · the wedding (shot 14): festive dance in D – fast plucks, bass, frame drum on every beat
  const fest = [{ root: 38, t: [62, 66, 69, 74] }, { root: 43, t: [62, 67, 71, 74] }, { root: 45, t: [61, 64, 69, 73] }, { root: 38, t: [62, 66, 69, 74] }];
  for (let b = 0, t = S(14); t < S(15) - 0.05; b++, t += 2 * B) {
    const ch = fest[b % 4], e = Math.min(S(15) - 0.05, t + 2 * B);
    T.arp(ch.t, t, e, B / 4, 0.2, { pat: [0, 1, 2, 3, 2, 1], decay: 0.99, bright: 0.75, len: 0.5 });
    T.bass(ch.root, t, e, 0.7); T.padAt([ch.root + 12, ...ch.t.slice(0, 3)], t, e, { level: 0.2, cut: 1800 });
    for (let k = 0; k < 2 && t + k * B < e; k++) T.drumAt(t + k * B, k ? 0.26 : 0.4, 0.8);
  }
  // I · Strife (shot 15): the feast goes sly and minor; a creeping chromatic line on "Strife,"
  T.padAt([38, 50, 53, 57], S(15), S(16), { level: 0.22, cut: 900 }); T.bass(38, S(15), S(16), 0.55);
  for (let k = 0, t = S(15) + 0.05; t < S(16) - 0.1; k++, t += B) stac([50, 49, 48, 47][k % 4], t, 0.3, { len: 0.5, bright: 0.5 });
  [69, 68, 67, 66, 65].forEach((nn, k) => stac(nn, c('Strife,') + k * 0.12, 0.24, { len: 0.6 }));
  // J · the apple rolls in (16), the letters glow (17)
  [74, 76, 77, 79, 81].forEach((nn, k) => stac(nn, S(16) + 0.05 + k * 0.16, 0.17, { len: 0.4, bright: 0.75 }));
  A.place(dry, A.gain(X.glass([N(81), N(86), N(90)], S(18) - S(17)), 0.06), S(17)); T.padAt([50, 62, 66, 69], S(17), S(18), { level: 0.22, att: 0.3 });
  // K · the fight (18): agitated – drums on every half beat, fast minor arps
  const fight = [{ root: 38, t: [62, 65, 69, 74] }, { root: 34, t: [58, 62, 65, 70] }, { root: 36, t: [60, 64, 67, 72] }, { root: 45, t: [61, 64, 69, 73] }];
  for (let b = 0, t = S(18); t < S(19) - 0.05; b++, t += B) {
    const ch = fight[b % 4], e = Math.min(S(19) - 0.05, t + B);
    T.arp(ch.t, t, e, B / 4, 0.18, { pat: [0, 2, 1, 3], decay: 0.988, bright: 0.8, len: 0.35 }); T.bass(ch.root, t, e, 0.65);
    T.drumAt(t, 0.42, 0.7); T.drumAt(t + B / 2, 0.24, 0.5);
  }
  // L · "Remember that apple." – everything stops, the low ominous note
  lowNote(S(19) + 0.03, S(20) - S(19) - 0.1);
  // M · Chiron's school (20–29): playful vamp, a light pulse; more drive from "At six"; heroic stabs on the clacks
  comic(S(20) + 0.1, S(23), { drum: 'bar', g: 0.2 });
  comic(S(23), S(27), { drum: 'beat', g: 0.22, bass: 0.5 });
  for (const w of ['teaches', 'fight,']) { const t = c(w); T.padAt([38, 50, 57, 62, 66], t, t + 0.5, { level: 0.34, att: 0.01, cut: 2200 }); T.drumAt(t, 0.5, 1.1); }
  T.padAt([50, 57, 62], S(27), S(29), { level: 0.16 }); T.bass(38, S(27), S(29), 0.5);
  [62, 65, 69, 74, 77].forEach((nn, k) => T.note(nn, c('lyre.') + k * 0.09, 0.3, { len: 2, decay: 0.997, bright: 0.5, pan: (k - 2) * 0.15 }));   // the lyre, clean
  // N · "The lyre, you think, is useless." – thin; a sour note on "think", a "womp" on "useless."
  T.bass(38, S(30), S(31), 0.4);
  T.note(62, c('think,') - 0.05, 0.32, { len: 1.2, bright: 0.7 }); T.note(63, c('think,') - 0.04, 0.3, { len: 1.2, bright: 0.7 });
  [57, 56].forEach((nn, k) => T.note(nn, c('useless.') + 0.1 + k * 0.3, 0.32, { len: 0.8, bright: 0.45 }));
  // O · "Hold that thought." – everything holds: a glass chord and a soft golden shimmer
  A.place(dry, A.gain(X.glass([N(74), N(81), N(86)], S(32) - S(31) + 0.2, { att: 0.2, rel: 0.8 }), 0.07), S(31));
  [86, 90, 93, 98].forEach((nn, k) => bell(nn, S(31) + 0.25 + k * 0.18, 0.04, (k % 2 ? 0.3 : -0.3)));
  // P · Patroclus (32–37): warm – Fmaj7, C, Bbmaj7, C; a pause for the dice; a bright strum on "Perfect."
  const warm = [{ root: 41, t: [60, 64, 65, 69] }, { root: 36, t: [60, 64, 67, 72] }, { root: 34, t: [58, 62, 65, 69] }, { root: 36, t: [60, 64, 67, 72] }];
  const warmVamp = (t0, t1, g = 0.2) => { for (let b = 0, t = t0; t < t1 - 0.05; b++, t += 2 * B) { const ch = warm[b % 4], e = Math.min(t1 - 0.05, t + 2 * B);
    T.arp(ch.t, t, e, B / 2, g, { pat: [0, 1, 2, 3, 2, 1, 2, 3], decay: 0.996, len: 1.6, bright: 0.5 }); T.padAt([ch.root + 12, ...ch.t.slice(0, 3)], t, e, { level: 0.22, att: 0.3 }); T.bass(ch.root, t, e, 0.6); } };
  warmVamp(S(32), S(33));
  T.padAt([38, 44, 50], S(33), S(34), { level: 0.2, cut: 500 });                                     // the dice: hush
  stac(62, S(34) + 0.05, 0.24); stac(69, S(34) + 0.35, 0.24);                                         // "reaction?" – a question
  T.drumAt(c('Perfect.'), 0.5, 1.1); [65, 69, 72, 77, 81].forEach((nn, k) => T.note(nn, c('Perfect.') + k * 0.035, 0.28, { len: 1.6, bright: 0.65 }));
  warmVamp(c('Perfect.') + 0.4, S(37));
  for (let k = 0, t = S(37); t < c('calm') - 0.1; k++, t += B / 2) stac([38, 41, 38, 44][k % 4], t, 0.36, { len: 0.3, bright: 0.5 });   // fuming
  T.padAt([41, 53, 57, 60, 64], c('calm'), S(38), { level: 0.26, att: 0.4 }); T.note(69, c('calm') + 0.05, 0.28, { len: 2.4, decay: 0.998 });
  // Q · the armour (38): majestic Bbmaj7 → Gm, bells on the gift; "Remember that armor." – the same low note as the apple
  T.padAt([46, 58, 62, 65, 69], S(38), c('gift'), { level: 0.28, att: 0.5, cut: 1500 }); T.bass(34, S(38), c('gift'), 0.7);
  T.padAt([43, 55, 58, 62, 67], c('gift'), S(39) - 0.1, { level: 0.28, cut: 1500 }); T.bass(31, c('gift'), S(39) - 0.1, 0.7);
  [77, 81, 84, 89].forEach((nn, k) => bell(nn, c('gift') + k * 0.1, 0.05, (k - 1.5) * 0.3));
  lowNote(S(39) + 0.03, S(40) - S(39) - 0.1);
  // R · mom (40–42): glassy and tender, a slow lyre in D minor; the hook's glass chord over the thread; a sly turn at the end
  A.place(dry, A.gain(X.glass([N(86), N(93), N(100)], S(43) - S(40) - 0.2, { att: 0.6, rel: 0.8 }), 0.05), S(40));
  T.droneAt(38, S(40), S(43), 0.13);
  [69, 65, 62].forEach((nn, k) => T.note(nn, S(40) + 0.1 + k * 0.6, 0.24, { len: 2.4, decay: 0.998, bright: 0.4 }));
  T.note(62, c('ends.') + 0.05, 0.3, { len: 2.4, bright: 0.3, decay: 0.998 }); T.note(50, c('ends.') + 0.05, 0.3, { len: 2.4, bright: 0.3 });
  stac(74, c('saying.') + 0.05, 0.24, { len: 0.6 }); stac(72, c('saying.') + 0.3, 0.22, { len: 0.8 });
  // S · "Then you grow up. Fast." – a drum on every flash, a big D on "Fast.", then the heroic theme (D major, pulse on every beat)
  for (const t of [S(43), c('grow'), c('up.')]) { T.drumAt(t, 0.5, 0.9); }
  T.padAt([50, 57, 62], S(43), c('Fast.'), { level: 0.2, att: 0.3 });
  const fast = c('Fast.');
  T.drumAt(fast, 0.75, 1.6); [50, 62, 66, 69, 74, 78].forEach((nn, k) => T.note(nn, fast + k * 0.03, 0.3, { len: 2, bright: 0.65 }));
  const hero = [{ root: 38, t: [62, 66, 69, 74] }, { root: 45, t: [61, 64, 69, 73] }, { root: 46, t: [58, 62, 65, 70] }, { root: 48, t: [60, 64, 67, 72] }];
  for (let b = 0, t = fast; t < S(46) - 0.05; b++, t += 2 * B) {
    const ch = hero[b % 4], e = Math.min(S(46) - 0.05, t + 2 * B);
    T.arp(ch.t, t, e, B / 2, 0.24, { pat: [0, 1, 2, 3, 2, 1], bright: 0.6 }); T.padAt([ch.root + 12, ...ch.t.slice(0, 3)], t, e, { level: 0.3, cut: 2000 }); T.bass(ch.root, t, e, 0.8);
    for (let k = 0; k < 2 && t + k * B < e; k++) T.drumAt(t + k * B, k ? 0.3 : 0.45, 1);
  }
  // T · "And still screaming for attention." – a drum roll that grows, one big hit on "attention." that rings out
  const att = c('attention.');
  T.padAt([38, 50, 57, 62], S(46), att, { level: 0.26, att: 0.8, cut: 1400 }); T.bass(38, S(46), att, 0.7);
  for (let t = S(46) + 0.3, k = 0; t < att - 0.05; k++) { const p = (t - S(46)) / (att - S(46)); T.drumAt(t, 0.12 + 0.4 * p, 0.45); t += lerpStep(p); }
  T.drumAt(att, 0.9, 1.9); T.drumAt(att + 0.02, 0.5, 1.2);
  T.padAt([38, 50, 57, 62, 66, 69, 74], att, total - 0.2, { att: 0.02, rel: 1.0, level: 0.5, cut: 2400 }); T.bass(26, att, total - 0.2, 0.9);
  [50, 62, 66, 69, 74, 78, 81].forEach((nn, k) => T.note(nn, att + k * 0.02, 0.32, { len: 2.4, bright: 0.7 }));
  return T.done({ wet: 0.3 });
}
// the drum roll gets faster towards the hit: from a beat to a 32nd
function lerpStep(p) { return 0.75 * (1 - p) * (1 - p) + 0.06; }

// ---------- effects (synthesised) ----------
function underwater(X, d) {
  const { A } = X, n = A.sec(d), s = A.filt(A.decorrelatedNoise(n, X.r, 0.5), 'lp', 360, 0.7);
  for (let i = 0; i < n; i++) { const t = i / A.SR, e = Math.min(1, t / 0.12) * Math.min(1, Math.max(0, (d - t) / 0.4)); s.L[i] *= e; s.R[i] *= e; }
  A.place(s, A.gain(X.splash(), 0.25), 0);
  for (let k = 0; k < 8; k++) A.place(s, A.gain(X.bubble(260 + X.r() * 420), 0.5), 0.15 + X.r() * (d - 0.4), { pan: X.r() * 1.2 - 0.6 });
  return A.norm(s, -3);
}
function crackle(X, d) {
  const { A } = X, n = A.sec(d), s = A.gain(A.filt(A.noise(n, X.r, 'white'), 'lp', 500), 0.25);
  for (let k = 0; k < Math.round(d * 26); k++) { const c = A.fade(A.filt(A.noise(A.sec(0.006 + X.r() * 0.01), X.r, 'white'), 'bp', 1800 + X.r() * 2600, 1.2), 0.0005, 0.004);
    A.place(s, A.gain(c, 0.3 + X.r() * 0.9), X.r() * (d - 0.05), { pan: X.r() * 1.4 - 0.7 }); }
  for (let i = 0; i < n; i++) { const t = i / A.SR, e = Math.min(1, t / 0.2) * Math.min(1, (d - t) / 0.3); s.L[i] *= e; s.R[i] *= e; }
  return A.norm(s, -4);
}
function waves(X, d) {
  const { A } = X, n = A.sec(d);
  const s = A.filt(A.decorrelatedNoise(n, X.r, 0.6), 'lp', t => 320 + 1100 * Math.sin(Math.PI * Math.min(1, t / d)), 0.6);
  for (let i = 0; i < n; i++) { const t = i / A.SR, e = Math.pow(Math.sin(Math.PI * Math.min(1, t / d)), 1.5) * (0.8 + 0.2 * Math.sin(t * 5)); s.L[i] *= e; s.R[i] *= e; }
  return A.norm(s, -4);
}
function rollDing(X, d) {
  // the apple rolling on the floor (a low rumble ticking with the turns), then the ding when it stops
  const { A } = X, n = A.sec(d), s = A.filt(A.decorrelatedNoise(n, X.r, 0.3), 'lp', 240, 0.8);
  for (let i = 0; i < n; i++) { const t = i / A.SR, e = Math.min(1, t / 0.1) * Math.max(0, 1 - Math.max(0, t - (d - 0.25)) / 0.25) * (0.7 + 0.3 * Math.sin(2 * Math.PI * 7 * t)); s.L[i] *= e * 1.6; s.R[i] *= e * 1.6; }
  for (let t = 0.05; t < d - 0.2; t += 0.14) A.place(s, A.gain(A.fade(A.filt(A.noise(A.sec(0.012), X.r, 'white'), 'bp', 1200, 2), 0.001, 0.008), 0.25), t);
  const o = A.make(n + A.sec(2.6)); A.place(o, A.norm(s, -6), 0); A.place(o, A.gain(X.kit('ding_land'), 0.9), d);
  return o;
}
function scuffle(X, d) {
  const { A } = X, o = A.make(A.sec(d + 1));
  const sw = ['rswish0', 'rswish2', 'rswish4', 'rswish5', 'rswish1', 'rswish6'];
  for (let k = 0, t = 0; t < d - 0.2; k++, t += 0.28 + X.r() * 0.12) A.place(o, A.gain(X.kit(sw[k % sw.length]), 0.5 + X.r() * 0.3), t, { pan: X.r() * 1.4 - 0.7 });
  for (let k = 0, t = 0.15; t < d - 0.2; k++, t += 0.45 + X.r() * 0.2) A.place(o, A.gain(X.kit('thud'), 0.35), t, { pan: X.r() * 1.2 - 0.6 });
  A.place(o, A.gain(X.rustle(d * 0.9), 0.5), 0.05);
  return A.norm(o, -3);
}
function slurp(X) {
  const { A } = X, d = 0.5, n = A.sec(d);
  const s = A.filt(A.decorrelatedNoise(n, X.r, 0.2), 'bp', t => 1900 * Math.exp(-t / 0.18) + 420, 3);
  for (let i = 0; i < n; i++) { const t = i / A.SR, e = Math.min(1, t / 0.04) * Math.max(0, 1 - t / d); s.L[i] *= e; s.R[i] *= e; }
  for (let k = 0; k < 3; k++) A.place(s, A.gain(X.bubble(300 + k * 120), 0.6), 0.08 + k * 0.1);
  return A.norm(s, -3);
}
function clack(X) {
  // wood on wood: two damped partials and a click
  const { A } = X, n = A.sec(0.25), s = A.make(n);
  for (let i = 0; i < n; i++) { const t = i / A.SR, v = (Math.sin(2 * Math.PI * 830 * t) + 0.6 * Math.sin(2 * Math.PI * 1370 * t) + 0.3 * Math.sin(2 * Math.PI * 2240 * t)) * Math.exp(-t / 0.035); s.L[i] = v; s.R[i] = v; }
  A.place(s, A.gain(A.fade(A.filt(A.noise(A.sec(0.01), X.r, 'white'), 'hp', 2000), 0.0005, 0.006), 0.6), 0);
  return A.norm(s, -3);
}
function shimmer(X) {
  const { A } = X, o = A.make(A.sec(2.4));
  [81, 86, 89, 93, 98].forEach((nn, k) => A.place(o, A.gain(A.bell(X.N(nn), 1.6, { bright: 0.7 }), 0.6), k * 0.07, { pan: (k - 2) * 0.25 }));
  return A.norm(o, -4);
}

export function sfx(X, total) {
  const { A, cue, shot, kit } = X;
  const F = fx(X, total), S = k => shot(k).start, c = (p, n = 1) => cue(p, n).s;
  F.add(X.splash(), c('river.') + 0.12, -15, {}, 'the baby is dipped into the river');
  F.add(kit('thud'), c('consulted.') + 0.07, -11, { pan: 0.3 }, 'red line strikes "um–"');
  F.add(underwater(X, S(7) - S(6) + 0.15), S(6) + 0.02, -12, {}, 'under water: muffled, bubbles');
  F.add(kit('rwhoosh3'), S(8) - 0.02, -15, { pan: 0.2, panTo: -0.2 }, 'fast zoom out: tiny detail');
  F.add(crackle(X, S(11) - S(10) + 0.2), S(10) + 0.02, -15, {}, 'the magic fire crackles');
  F.add(kit('impact_big'), c('screams.') + 0.02, -13, {}, 'dad screams in the doorway');
  F.add(waves(X, S(14) - S(12) - 0.2), S(12) + 0.05, -15, {}, 'dawn waves: she walks into the sea, a wave wipes the footprints');
  const roll = c('rolled'), stop = c('apple') + 4 / 30;
  F.add(rollDing(X, stop - roll), roll, -14, {}, 'the golden apple rolls in under the table, ding when it stops');
  F.add(scuffle(X, S(19) - S(18) - 0.1), S(18) + 0.05, -14, {}, 'the goddesses fight (scuffle)');
  F.add(slurp(X), c('marrow.') + 0.08, -13, { pan: -0.2 }, 'slurp: the kid eats the breakfast');
  F.add(kit('thud'), S(24) + 13 / 30, -11, { pan: -0.3 }, 'the dragged lion bumps down');
  F.add(kit('thud'), S(25) + 0.12, -12, { pan: -0.3 }, 'the boar is dragged in');
  F.add(kit('rwhoosh2'), S(26) + 0.55, -15, { pan: -0.5, panTo: 0.6 }, 'he overtakes the deer');
  const cl = A.make(A.sec(4)); A.place(cl, clack(X), 0); A.place(cl, A.gain(clack(X), 0.9), c('fight,') - c('teaches'));
  F.add(cl, c('teaches'), -11, { pan: 0.2 }, 'two clacks: wooden sword on the staff');
  F.add(kit('thud'), c('dice.') + 2 / 30, -9, { pan: 0 }, 'BY ACCIDENT stamp');
  F.add(shimmer(X), c('gift') - 0.05, -17, { pan: 0.1 }, 'the armour shimmers (the gift tag swings)');
  F.add(kit('whoosh_in'), c('grow') - 0.12, -14, {}, 'growth flashes, then the dust cloud');
  F.add(kit('whoosh_air_short'), c('fastest') - 4 / 30, -12, { pan: -0.7, panTo: 0.8 }, 'he zips across the frame');
  F.add(kit('thud'), c('screaming') + 3 / 30, -12, {}, 'LOUD pops (the hook callback)');
  const end = A.make(A.sec(6)); A.place(end, kit('impact_big'), 0); A.place(end, A.gain(kit('boom'), 0.9), 0.02);
  F.add(end, c('attention.') - 0.02, -10, {}, 'the big ending hit on "attention."');
  return { sfx: F.sfx, ev: F.ev };
}
