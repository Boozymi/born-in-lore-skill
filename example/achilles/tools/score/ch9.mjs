// ch9.mjs – score and effects for chapter IX "The Heel", the ending formula and the end card (EPISODE.md § 11).
// No jokes. Very few effects; the music carries the end.
// A · the war goes on (shots 1–3): a battle pulse in eighths; at the son of the Dawn the pad lifts to Bb.
// B · the gate, the arrow, Paris (shots 4–6): the pulse thins to a held A; a low Bb under Paris.
// C · "Remember that apple?" (shot 7): the prologue's low note under a red glass.
// D · young Paris and the goddesses (shot 8): a light pastoral lyre in F. E · the war it started (shot 9): dark, low drums.
// F · Apollo (shot 10): a golden glass chord. G · the heel (shot 11): a rising pad cut dead by the hit.
// H · the match cut (shot 12): the glass of the hook, the Styx drone, one bell.
// I · slow motion at sunset (shots 13–14): slow heartbeat, a falling lyre line. J · the golden jar (15–16): warm and still.
// K · the land of the dead (17–28): a cool, slow Lydian colour (Bbmaj7#11 / Gm9), warm only in the two pictures,
//     cold at the empty throne, and a hopeful warm turn on "Happy."
// L · the vase, the name (29–30): the theme gathers. M · the ending formula (31–35): the hook's progression
//     Dm9 – Bbmaj7 – Gm7 – F – A, resolving to D on "life?". N · the end card (36): D – Bbmaj7 – Gm7 – A – D, a clean end.
import { tools, fx, card } from './common.mjs';

export function score(X, total) {
  const T = tools(X, total), { A, N } = X, B = T.B;
  const s = k => X.shot(k).start, c = (p, n = 1) => X.cue(p, n);
  card(X, T, { add() {} }, true);
  const soft = (nn, t, g = 0.18, pan = 0, len = 2.8) => T.note(nn, t, g, { len, bright: 0.36, decay: 0.9985, pan });
  const bells = (notes, t0, gap, g = 0.03) => notes.forEach((nn, k) => A.place(T.dry, A.gain(A.bell(N(nn), 1.8, { bright: 0.5 }), g), t0 + k * gap, { pan: k % 2 ? 0.4 : -0.4 }));

  // A · the war goes on: eighth drums + a low ostinato; Memnon's dawn lifts the pad to Bb
  for (let t = s(1), k = 0; t < s(4) - 0.05; t += B / 2, k++) {
    T.drumAt(t, k % 4 === 0 ? 0.48 : k % 2 ? 0.18 : 0.28, k % 4 === 0 ? 1.0 : 0.55);
    T.note([38, 38, 50, 38, 41, 38, 50, 45][k % 8], t, 0.26, { len: 0.42, bright: 0.6, decay: 0.99 });
  }
  T.padAt([50, 53, 57, 62], s(1), s(3), { att: 0.3, level: 0.24, cut: 1000 }); T.bass(26, s(1), s(3), 0.8);
  T.padAt([58, 62, 65, 70, 74], s(3), s(4) + 0.2, { att: 0.4, level: 0.3, cut: 1800 }); T.bass(34, s(3), s(4), 0.8);

  // B · the gate, the arrow, Paris
  T.padAt([45, 57, 61, 64], s(4), s(6), { att: 0.4, level: 0.26, cut: 1100 }); T.bass(33, s(4), s(6), 0.8);
  for (let t = s(4) + 0.1; t < s(6) - 0.1; t += 0.86) T.drumAt(t, 0.3, 0.8);
  T.padAt([46, 55, 58, 61], s(6), s(7), { att: 0.2, level: 0.24, cut: 900 }); T.note(34, s(6) + 0.05, 0.4, { len: 2.6, bright: 0.3, decay: 0.999 });

  // C · "Remember that apple?": the low note of the prologue, a red glass
  T.droneAt(38, s(7), s(8) + 0.2, 0.18); T.note(26, c('apple?').s, 0.55, { len: 3, bright: 0.25, decay: 0.999 });
  A.place(T.dry, A.gain(X.glass([N(80), N(87)], s(8) - s(7), { att: 0.5, rel: 0.4 }), 0.05), s(7) + 0.05);

  // D · young Paris picks a goddess: a light pastoral lyre in F
  T.padAt([53, 60, 65, 69], s(8), s(9), { att: 0.4, level: 0.2, cut: 1600 }); T.bass(41, s(8), s(9), 0.5);
  T.arp([65, 69, 72, 77], s(8) + 0.1, s(9) - 0.05, B / 2, 0.14, { pat: [0, 1, 2, 3, 2, 1], decay: 0.994, bright: 0.55, len: 1.2 });

  // E · that choice started this war: dark Dm with b6, low drums
  T.padAt([38, 50, 53, 58], s(9), s(10), { att: 0.15, level: 0.32, cut: 800 }); T.bass(26, s(9), s(10), 1);
  [0, 0.75, 1.5].forEach(dt => T.drumAt(s(9) + 0.05 + dt, 0.5 - dt * 0.12, 1.2));

  // F · Apollo guides the arrow: a golden glass chord, rising bells
  T.padAt([50, 57, 62, 64, 69], s(10), s(11), { att: 0.6, level: 0.26, cut: 2000 }); T.droneAt(38, s(10), s(11), 0.12);
  A.place(T.dry, A.gain(X.glass([N(81), N(86), N(88), N(93)], s(11) - s(10), { att: 0.6, rel: 0.2 }), 0.06), s(10));
  bells([81, 86, 88, 93], s(10) + 0.3, 0.3, 0.028);

  // G · into your heel: a pad that swells and is cut dead by the hit
  const hit = c('heel.').s;
  T.padAt([45, 57, 60, 63], s(11), hit, { att: 0.6, rel: 0.02, level: 0.3, cut: 1300 });
  T.drumAt(hit - 0.01, 0.9, 2.0); T.note(26, hit, 0.6, { len: 3, bright: 0.25, decay: 0.999 });

  // H · the match cut: the hook's river glass, the Styx drone, one bell
  T.droneAt(38, s(12), s(13) + 0.3, 0.16);
  A.place(T.dry, A.gain(X.glass([N(86), N(93), N(100)], s(13) - s(12), { att: 0.35, rel: 0.5 }), 0.06), s(12));
  A.place(T.dry, A.gain(A.bell(N(93), 2.4, { bright: 0.6 }), 0.05), s(12) + 0.25, { pan: 0.2 });

  // I · slow motion at sunset: a slow heartbeat, a falling lyre line ending low on "foot."
  T.padAt([50, 57, 62, 65], s(13), s(15), { att: 0.8, level: 0.26, cut: 1000 }); T.bass(38, s(13), s(15), 0.6);
  for (let t = s(13) + 0.2; t < s(15) - 0.3; t += 1.1) { T.drumAt(t, 0.3, 0.9); T.drumAt(t + 0.26, 0.18, 0.6); }
  [[81, 0.2], [79, 0.9], [77, 1.6], [76, 2.3], [74, 3.0]].forEach(([nn, dt]) => soft(nn, s(13) + dt, 0.2));
  T.note(38, c('foot.').s, 0.4, { len: 3, bright: 0.28, decay: 0.999 });

  // J · the golden jar, together with Patroclus: warm and still (F – Dm), high bells for the two threads of smoke
  T.padAt([53, 60, 65, 69], s(15), s(16), { att: 0.8, level: 0.24, cut: 1400 }); T.bass(41, s(15), s(16), 0.5);
  T.padAt([50, 57, 62, 65, 69], s(16), s(17), { att: 0.5, level: 0.24, cut: 1400 }); T.bass(38, s(16), s(17), 0.5);
  [[72, 0.3], [69, 1.2], [65, 2.1]].forEach(([nn, dt]) => soft(nn, s(15) + dt, 0.18, -0.2));
  bells([86, 89, 93], c('Patroclus.').s - 0.6, 0.45, 0.026);

  // K · the land of the dead: cool and slow; warm only in the two pictures; cold at the throne; hope on "Happy."
  const LYD = { r: 34, t: [58, 62, 65, 69, 76] }, GM9 = { r: 31, t: [55, 58, 62, 65, 69] };
  const UW = [[17, LYD], [18, LYD], [19, GM9], [20, GM9], [21, { r: 41, t: [65, 69, 72, 77, 79], warm: true }], [22, null], [23, GM9],
    [24, { r: 38, t: [62, 66, 69, 74, 76], warm: true }], [25, LYD], [26, { r: 41, t: [65, 69, 72, 74, 79] }], [27, LYD], [28, { r: 41, t: [65, 69, 72, 76, 79], hope: true }]];
  UW.forEach(([k, ch]) => {
    const t0 = s(k), t1 = s(k + 1);
    if (!ch) { A.place(T.dry, A.gain(X.glass([N(86), N(91)], t1 - t0, { att: 0.3, rel: 0.4 }), 0.05), t0); T.droneAt(38, t0, t1 + 0.2, 0.16); return; }
    T.padAt([ch.r + 12, ...ch.t.slice(0, 4)], t0, t1 + 0.15, { att: k === 17 ? 1.2 : 0.4, level: ch.warm || ch.hope ? 0.3 : 0.24, cut: ch.warm || ch.hope ? 1800 : 1300 });
    T.bass(ch.r, t0, t1, 0.5);
    if (ch.warm || ch.hope) T.arp(ch.t, t0 + 0.1, t1, B / 2, 0.14, { pat: [0, 1, 2, 3, 4, 3, 2, 1], decay: 0.996, bright: 0.5, len: 1.6 });
    else [[0.25, 4], [1.1, 2], [1.9, 3]].forEach(([dt, i]) => { if (t0 + dt < t1 - 0.1) soft(ch.t[i] + 12, t0 + dt, 0.13, (i % 2) * 0.6 - 0.3, 3.2); });
  });
  A.place(T.dry, A.gain(X.glass([N(81), N(88), N(93)], s(21) - s(17), { att: 1.5, rel: 1.0 }), 0.035), s(17));
  bells([84, 88, 91, 96], c('Happy.').s + 0.05, 0.22, 0.03);

  // L · the vase, the name: the theme gathers (Gm – Asus4), soft bells on the letters
  T.padAt([43, 55, 58, 62, 65], s(29), s(30), { att: 0.6, level: 0.26, cut: 1400 }); T.bass(31, s(29), s(30), 0.6);
  T.padAt([45, 57, 62, 64, 69], s(30), s(31), { att: 0.3, level: 0.28, cut: 1500 }); T.bass(33, s(30), s(31), 0.6);
  bells([74, 76, 81, 86, 88], c('name.').s - 0.4, 0.1, 0.025);

  // M · the ending formula: the hook's progression, resolving to D on "life?"
  const pat = [0, 2, 4, 2, 1, 3, 2, 4];
  const prog = [
    [c('Not bad').s - 0.05, c('You killed').s, { r: 38, t: [62, 65, 69, 72, 76] }],
    [c('You killed').s - 0.05, c('lost your').s, { r: 34, t: [58, 62, 65, 69, 74] }],
    [c('lost your').s - 0.05, c('and still gave').s, { r: 43, t: [62, 67, 70, 74, 77] }],
    [c('and still gave').s - 0.05, c('So,').s, { r: 41, t: [60, 65, 69, 72, 77] }],
    [c('So,').s - 0.05, c('life?').s, { r: 45, t: [62, 64, 69, 74, 76], sus: true }],
  ];
  prog.forEach(([t0, t1, ch], k) => {
    T.padAt([ch.r + 12, ...ch.t.slice(0, 3)], t0, t1 + 0.05, { att: k ? 0.25 : 0.8, level: 0.36, cut: 1500 }); T.bass(ch.r, t0, t1, 0.9);
    for (let t = t0 + (k ? 0 : B), j = 0; t < t1 - 0.06; t += B / 2, j++) {
      const tones = ch.sus && t > (t0 + t1) / 2 ? [61, 64, 69, 73, 76] : ch.t;   // A sus4 → A on "choose"
      T.note(tones[pat[j % 8]], t, 0.24 * (j % 2 ? 0.75 : 1), { len: 1.6, bright: 0.5, decay: 0.9965, pan: (j % 4) / 3 * 0.6 - 0.3 });
    }
    T.drumAt(t0 + 0.05, k ? 0.42 : 0.3, 1.0);
  });
  // the resolution: D major, a full chord and a deep drum on "life?"
  const res = c('life?').s;
  T.drumAt(res, 0.75, 1.7);

  // N · the end card: D – Bbmaj7 – Gm7 – A – D, gentle, ending clean before the last frame
  const e0 = s(36), D = { r: 38, t: [62, 66, 69, 74, 78] };
  const card2 = [[res, e0 + 1.5, D], [e0 + 1.5, e0 + 4.5, { r: 34, t: [58, 62, 65, 69, 74] }], [e0 + 4.5, e0 + 7.5, { r: 43, t: [62, 67, 70, 74, 77] }],
    [e0 + 7.5, e0 + 9.6, { r: 45, t: [61, 64, 69, 73, 76] }]];
  card2.forEach(([t0, t1, ch], k) => {
    T.padAt([ch.r + 12, ...ch.t.slice(0, 4)], t0, t1 + 0.05, { att: k ? 0.5 : 0.05, level: 0.3, cut: 1600 }); T.bass(ch.r, t0, t1, 0.6);
    for (let t = t0 + 0.1, j = 0; t < t1 - 0.06; t += B / 2, j++) T.note(ch.t[pat[j % 8]], t, 0.17 * (j % 2 ? 0.75 : 1), { len: 1.8, bright: 0.45, decay: 0.997, pan: (j % 4) / 3 * 0.6 - 0.3 });
    if (k) T.drumAt(t0 + 0.05, 0.22, 0.9);
  });
  const fin = e0 + 9.6, end = total - 0.5;
  T.padAt([38, 50, 57, 62, 66, 69, 74], fin, end - 1.0, { att: 0.3, rel: 1.0, level: 0.34, cut: 1800 }); T.bass(26, fin, end - 1.0, 0.6);
  [62, 66, 69, 74, 78].forEach((nn, k) => T.note(nn, fin + 0.05 + k * 0.12, 0.2, { len: 2.4, bright: 0.45, decay: 0.998 }));
  T.note(38, fin + 0.05, 0.4, { len: 2.8, bright: 0.3, decay: 0.998 });
  const music = T.done({ wet: 0.34 });
  // clean ending: a short fade so the reverb is silent at the last frame
  const a = A.sec(end - 0.6), b = A.sec(end);
  for (let i = a; i < A.len(music); i++) { const g = i >= b ? 0 : 1 - (i - a) / (b - a); music.L[i] *= g; music.R[i] *= g; }
  return music;
}

// one arrow: a thin whistle that falls in pitch as it passes, with a breath of air
function whistle(X, d = 1.1) {
  const { A, r } = X, n = A.sec(d), s = A.make(n); let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / A.SR, u = t / d, f = 2600 - 1100 * u, e = Math.sin(Math.PI * Math.min(1, u * 1.15)) ** 2; ph += f / A.SR;
    const v = Math.sin(2 * Math.PI * ph) * e * 0.5; s.L[i] = v; s.R[i] = v; }
  const air = A.filt(A.decorrelatedNoise(n, r, 0.5), 'bp', t => 3000 - 1500 * t / d, 1.2);
  for (let i = 0; i < n; i++) { const u = i / n, e = Math.sin(Math.PI * u) ** 2 * 0.6; air.L[i] *= e; air.R[i] *= e; }
  A.place(s, air, 0);
  return A.norm(s, -3);
}

export function sfx(X, total) {
  const F = fx(X, total), s = k => X.shot(k).start, c = (p, n = 1) => X.cue(p, n);
  card(X, { droneAt() {} }, F, true);
  F.add(whistle(X, 1.1), s(5) + 0.1, -12, { pan: 0.8, panTo: -0.8 }, 'the arrow flies over the battlements');
  F.add(X.kit('impact_big'), c('heel.').s, -11, {}, 'the white flash at the heel');
  F.add(X.kit('thud'), s(14) + 34 / 30, -22, { pan: 0.3 }, 'the spear falls in the dust');
  F.add(X.kit('whoosh_air'), s(17) - 0.25, -22, { pan: -0.3, panTo: 0.3 }, 'down into the land of the dead');
  F.add(X.kit('thud'), c('choose').s, -12, { pan: 0.3 }, 'CHOSEN stamp (as in chapter I)');
  return { sfx: F.sfx, ev: F.ev };
}
