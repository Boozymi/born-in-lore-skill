// ch7.mjs – score and effects for chapter VII "Hector" (EPISODE.md § 9). No jokes, no comedy stings.
// A · the storm (shots 1–2): driving eighth drums, a low D ostinato, a dark pad; thunder on "storm".
// B · the river (shots 3–4): a rising tremolo pad under the roaring wave; one big hit when it breaks on "can't".
// C · the gate (shots 5–6): the drums stop; a slow heartbeat drum and a held A chord; a lone high note on "Alone."
// D · his face, he runs (shots 7–8): a swell, then the chase pulse starts on "runs".
// E · three laps, swift-footed (shots 9–10): a tense eighth pulse in plucks and drums that climbs.
// F · he turns (shot 11): a held chord and a drum. G · your armour (shot 12): the old wave motif, soft and cold.
// H · the gap (shot 13): near silence, a cold glass; ONE hit on "gap.", then nothing.
// I · Priam on the wall (shot 14): a slow lament on the lyre. J · the drag (shots 15–16): drone, slow drum, hooves (effect).
// K · "You don't feel better." (shot 17): an empty pad, a fifth, nothing resolves.
import { tools, fx, card } from './common.mjs';

export function score(X, total) {
  const T = tools(X, total), { A, N } = X, B = T.B;
  const s = k => X.shot(k).start, c = (p, n = 1) => X.cue(p, n);
  card(X, T, { add() {} }, true);

  // A · the storm
  const a0 = s(1), a1 = s(3);
  for (let t = a0, k = 0; t < a1 - 0.05; t += B / 2, k++) T.drumAt(t, k % 4 === 0 ? 0.55 : k % 2 ? 0.22 : 0.34, k % 4 === 0 ? 1.1 : 0.6);
  for (let t = a0, k = 0; t < a1 - 0.05; t += B / 2, k++) T.note([38, 38, 50, 38, 41, 38, 50, 36][k % 8], t, 0.34, { len: 0.42, bright: 0.6, decay: 0.99 });
  T.padAt([50, 53, 57, 58], a0, a1, { att: 0.3, level: 0.26, cut: 900 }); T.bass(26, a0, a1, 0.9);
  T.drumAt(c('storm.').s, 0.8, 1.8);

  // B · the river rises (shot 3) and breaks (shot 4)
  const b0 = s(3), b1 = s(5);
  T.padAt([50, 53, 57, 62], b0, s(4), { att: 1.6, level: 0.3, cut: 1300 }); T.droneAt(38, b0, s(4) + 0.3, 0.2);
  for (let t = b0, k = 0; t < s(4) - 0.05; t += B / 4, k++) T.note([74, 77][k % 2], t, 0.06 + 0.12 * (t - b0) / (s(4) - b0), { len: 0.3, bright: 0.5, decay: 0.985 });
  T.drumAt(c("can't.").s, 0.85, 1.9);
  T.padAt([38, 50, 57, 62], c("can't.").s, b1, { att: 0.02, rel: 0.5, level: 0.36, cut: 700 });

  // C · the gate: heartbeat drums, a held A (dominant), a lone high note on "Alone."
  const c0 = s(5), c1 = s(7);
  for (let t = c0 + 0.1; t < c1 - 0.1; t += 0.86) { T.drumAt(t, 0.34, 0.8); T.drumAt(t + 0.22, 0.2, 0.55); }
  T.padAt([45, 57, 61, 64], c0, c1, { att: 0.6, level: 0.26, cut: 1000 }); T.bass(33, c0, c1, 0.8);
  T.note(81, c('Alone.').s + 0.05, 0.22, { len: 2.4, bright: 0.35, decay: 0.999, pan: 0.3 });

  // D · he sees your face: a swell; on "runs" the chase begins
  T.padAt([46, 58, 62, 65, 69], s(7), s(8) + 0.2, { att: 1.1, level: 0.34, cut: 1600 }); T.bass(34, s(7), s(8), 0.9);
  T.drumAt(c('runs.').s - 0.02, 0.7, 1.4);

  // E · the chase (shots 8–10): eighth plucks D–E–F–E, drums on the beat, climbing a step at the second wall shot
  const e0 = c('runs.').s, e1 = s(11);
  for (let t = e0, k = 0; t < e1 - 0.05; t += B / 2, k++) {
    const up = t >= s(10) ? 2 : 0;
    T.note([62, 64, 65, 64, 62, 64, 67, 64][k % 8] + up, t, 0.2 + (k % 2 ? 0 : 0.06), { len: 0.4, bright: 0.65, decay: 0.988, pan: (k % 2) * 0.4 - 0.2 });
    if (k % 2 === 0) T.drumAt(t, k % 4 === 0 ? 0.48 : 0.3, 0.75);
  }
  T.padAt([50, 57, 60, 64], e0, s(10), { att: 0.3, level: 0.22, cut: 1100 }); T.bass(38, e0, s(10), 0.8);
  T.padAt([52, 59, 62, 66], s(10), e1, { att: 0.2, level: 0.26, cut: 1300 }); T.bass(40, s(10), e1, 0.85);

  // F · he turns to fight
  T.drumAt(c('turns').s - 0.02, 0.75, 1.6);
  T.padAt([38, 50, 57, 62, 65], c('turns').s, s(12), { att: 0.05, rel: 0.4, level: 0.34, cut: 1200 }); T.bass(26, c('turns').s, s(12), 1);

  // G · your armour: the old wave motif (D–F–A–G), soft and cold over a thin pad
  T.padAt([62, 65, 69], s(12), s(13), { att: 0.3, level: 0.14, cut: 1600 }); T.droneAt(38, s(12), s(13) + 0.3, 0.12);
  [[62, 0.1], [65, 0.45], [69, 0.8], [67, 1.15]].forEach(([nn, dt]) => T.note(nn, s(12) + dt, 0.22, { len: 1.6, bright: 0.4, decay: 0.997 }));

  // H · the gap: almost silence, a cold glass, ONE hit on "gap.", then nothing until his father
  const gap = c('gap.').s;
  A.place(T.dry, A.gain(X.glass([N(86), N(93)], gap - s(13) - 0.1, { att: 0.8, rel: 0.2 }), 0.05), s(13));
  T.drumAt(gap - 0.01, 0.95, 2.0); T.note(26, gap, 0.6, { len: 3, bright: 0.25, decay: 0.999 });
  T.padAt([26, 38], gap, s(14) - 0.2, { att: 0.02, rel: 0.6, level: 0.3, cut: 300 });

  // I · his father on the wall: a slow lament (A–G–F–E–D over Dm – Gm/Bb – A)
  const i0 = s(14), i1 = s(15);
  T.padAt([50, 57, 62, 65], i0, i1, { att: 0.6, level: 0.26, cut: 1100 }); T.bass(38, i0, i1, 0.6);
  [[81, 0.05], [79, 0.4], [77, 0.75], [76, 1.1], [74, 1.45]].forEach(([nn, dt]) => T.note(nn, i0 + dt, 0.26, { len: 2.4, bright: 0.38, decay: 0.998, pan: 0.15 }));

  // J · the chariot, the dust: a low drone and a dark pad; slow muffled drums under the hooves
  const j0 = s(15), j1 = s(17);
  T.droneAt(38, j0, j1 + 0.4, 0.18);
  T.padAt([46, 50, 53, 58], j0, s(16), { att: 0.5, level: 0.24, cut: 800 }); T.padAt([43, 50, 55, 58], s(16), j1, { att: 0.4, level: 0.24, cut: 800 });
  for (let t = j0 + 0.2; t < j1 - 0.2; t += 1.5) T.drumAt(t, 0.32, 0.9);

  // K · "You don't feel better.": an empty pad – a high open fifth, a low D, nothing resolves
  const k0 = s(17);
  T.padAt([62, 69, 74], k0, total - 0.3, { att: 1.0, rel: 1.2, level: 0.16, cut: 1400 }); T.droneAt(38, k0, total, 0.12);
  T.note(69, c('better.').s + 0.2, 0.18, { len: 3, bright: 0.3, decay: 0.999, pan: -0.2 });
  return T.done({ wet: 0.34 });
}

// the river god: water rushing up through a rising filter + a slow low growl
function roar(X, d) {
  const { A, r } = X, n = A.sec(d);
  const rush = A.filt(A.decorrelatedNoise(n, r, 0.5), 'lp', t => 250 + 2400 * Math.min(1, t / (d * 0.7)), 0.7);
  const growl = A.make(n); let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / A.SR, f = 46 + 8 * Math.sin(2 * Math.PI * 0.6 * t); ph += f / A.SR; ph -= Math.floor(ph); const v = (2 * ph - 1) * 0.6; growl.L[i] = v; growl.R[i] = v; }
  const g = A.filt(growl, 'lp', 380, 0.8);
  A.place(rush, A.gain(g, 0.8), 0);
  for (let i = 0; i < n; i++) { const t = i / A.SR, e = Math.min(1, Math.pow(t / (d * 0.75), 1.5)) * Math.min(1, (d - t) / 0.25); rush.L[i] *= e; rush.R[i] *= e; }
  return A.norm(rush, -3);
}
// hooves: a gallop of three knocks per stride, far off
function hooves(X, d, stride = 0.44) {
  const { A, r } = X, out = A.make(A.sec(d + 0.4));
  const knock = (big) => { const n = A.sec(0.1), k = A.make(n);
    for (let i = 0; i < n; i++) { const t = i / A.SR, v = Math.sin(2 * Math.PI * (110 + 60 * Math.exp(-t / 0.01)) * t) * Math.exp(-t / 0.035) * (big ? 1 : 0.75); k.L[i] = v; k.R[i] = v; }
    A.place(k, A.gain(A.fade(A.filt(A.noise(A.sec(0.02), r, 'white'), 'bp', 1600, 1.2), 0.001, 0.015), 0.35), 0);
    return k; };
  for (let t = 0, j = 0; t < d; t += stride, j++) [0, 0.1, 0.19].forEach((dt, m) => A.place(out, A.gain(knock(m === 2), 0.55 + 0.25 * r()), t + dt, { pan: 0.2 * Math.sin(j) }));
  for (let i = 0; i < A.len(out); i++) { const t = i / A.SR, e = Math.min(1, t / 0.5) * Math.max(0, Math.min(1, (d + 0.2 - t) / 1.2)); out.L[i] *= e; out.R[i] *= e; }
  return A.norm(A.filt(out, 'lp', 2600), -3);
}

export function sfx(X, total) {
  const F = fx(X, total), s = k => X.shot(k).start, c = (p, n = 1) => X.cue(p, n);
  card(X, { droneAt() {} }, F, true);
  F.add(X.kit('impact_big'), c('storm.').s, -12, { pan: 0.35 }, 'thunder: the lightning on "storm"');
  F.add(roar(X, s(4) - s(3) + 0.15), s(3) + 0.05, -10, { pan: -0.3, panTo: 0 }, 'the river rises as a wave and roars');
  F.add(X.splash(), s(4) + 0.05, -6, {}, 'the wave crashes down on him');
  F.add(X.kit('rwhoosh3'), c('runs.').s + 0.05, -16, { pan: 0.3, panTo: -0.8 }, 'Hector turns and runs');
  F.add(X.kit('thud'), c('gap.').s + 2 / 30, -12, {}, 'GAP: the one hit on the neck');
  F.add(hooves(X, s(17) - s(15) + 0.2), s(15) + 0.3, -13, { pan: -0.2, panTo: 0.3 }, 'hooves under the chariot drag');
  return { sfx: F.sfx, ev: F.ev };
}
