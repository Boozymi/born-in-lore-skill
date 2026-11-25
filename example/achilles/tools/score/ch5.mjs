// ch5.mjs – score and effects for chapter V "The Armor" (EPISODE.md § 7). The low point begins: no comedy, thin and dark.
// A · night, the ships burn: slow dark pads, a drone, a few low plucks.  B · in the tent, the plan: pads move Bb – Gm – A.
// C · the rule in the sand: a quiet pluck motif.  D · the charge: war drums on every beat, a driving low arpeggio.
// E · near the walls: the drums stop, the pad darkens; Apollo: a cold glass chord.  F · silence before the death, only a
// thin high tone.  G · Hector: a low swell.  H · "Patroclus doesn't come back.": the music stops; one single low note.
import { tools, fx, card } from './common.mjs';

export function score(X, total) {
  const T = tools(X, total), { A, N } = X, B = T.B;
  const s = k => X.shot(k).start, c = (p, n = 1) => X.cue(p, n);
  card(X, T, { add() {} }, true);

  // A · Patroclus at the door, the ships burning (shots 1–2)
  T.droneAt(38, s(1) - 0.1, s(3) + 0.3, 0.15);
  T.padAt([50, 57, 62, 65], s(1), s(3), { att: 1.2, level: 0.22, cut: 800 }); T.bass(38, s(1), s(3), 0.55);
  [[69, 0.4], [65, 1.9], [62, 3.4], [61, 4.6]].forEach(([nn, dt]) => T.note(nn, s(1) + dt, 0.2, { len: 2.4, decay: 0.998, bright: 0.38 }));

  // B · he asks, the plan, "yes – one rule" (shots 3–5)
  T.padAt([46, 58, 62, 65], s(3), s(4), { att: 0.6, level: 0.22, cut: 900 }); T.bass(34, s(3), s(4), 0.55);
  T.padAt([43, 55, 58, 62], s(4), s(5), { att: 0.5, level: 0.22, cut: 900 }); T.bass(31, s(4), s(5), 0.55);
  T.padAt([45, 57, 61, 64], s(5), s(6), { att: 0.5, level: 0.24, cut: 1000 }); T.bass(33, s(5), s(6), 0.6);
  T.arp([58, 62, 65, 69], s(3) + 0.2, s(4), B, 0.17, { pat: [0, 1, 2, 3], decay: 0.997, bright: 0.4, len: 1.8 });
  T.arp([55, 58, 62, 67], s(4) + 0.1, s(5), B, 0.17, { pat: [0, 1, 2, 3], decay: 0.997, bright: 0.4, len: 1.8 });
  T.note(69, c('One').s + 0.02, 0.28, { len: 2.2, bright: 0.5 });

  // C · the rule in the sand (shots 6–7): a quiet motif; a low note when the walls are crossed out
  T.droneAt(38, s(6), s(8), 0.12);
  T.padAt([50, 57, 60, 65], s(6), s(8) - 0.05, { att: 0.6, level: 0.18, cut: 900 });
  [[62, 0], [65, 0.75], [64, 1.5], [62, 2.25]].forEach(([nn, dt]) => T.note(nn, s(6) + 0.15 + dt, 0.2, { len: 1.6, bright: 0.45 }));
  T.note(50, c('walls.').s + 0.05, 0.4, { len: 2.4, bright: 0.4, decay: 0.998 });
  T.note(58, c('walls.').s + 0.06, 0.2, { len: 2.2, bright: 0.4 });

  // D · the charge (shots 8–9): war drums on every beat, a driving low arpeggio, Dm – C – Bb – A
  const d0 = s(8), d1 = s(10) - 0.03;
  const prog = [[38, [50, 57, 62, 65]], [36, [48, 55, 60, 64]], [34, [46, 53, 58, 62]], [33, [45, 52, 57, 61]]];
  for (let b = 0, t = d0; t < d1 - 0.05; b++, t += 4 * B) {
    const [root, tones] = prog[b % 4], e = Math.min(d1, t + 4 * B);
    T.padAt(tones, t, e, { att: 0.1, rel: 0.1, level: 0.3, cut: 1100 }); T.bass(root, t, e, 0.9);
    T.arp(tones, t, e, B / 2, 0.17, { pat: [0, 1, 2, 3, 2, 1, 2, 3], decay: 0.992, bright: 0.55, len: 0.7 });
  }
  for (let t = d0, k = 0; t < d1 - 0.05; t += B / 2, k++) T.drumAt(t, k % 2 ? 0.26 : (k % 8 === 0 ? 0.62 : 0.46), k % 2 ? 0.6 : 1.15);

  // E · near the walls (shot 10): the drums stop, the pad darkens (Eb over D); Apollo (shot 11): a cold glass chord
  T.droneAt(38, s(10), s(12), 0.16);
  T.padAt([39, 51, 55, 62], s(10), s(11) + 0.3, { att: 0.8, level: 0.22, cut: 800 });
  A.place(T.dry, A.gain(X.glass([N(81), N(87), N(92)], s(12) - s(11), { att: 0.6, rel: 0.6 }), 0.06), s(11));
  T.padAt([38, 50, 53, 56], s(11), s(12), { att: 0.5, level: 0.16, cut: 700 });

  // F · silence before the death (shot 12): only a thin high tone
  A.place(T.dry, A.gain(X.glass([N(86)], s(13) - s(12) + 0.4, { att: 0.3, rel: 0.6 }), 0.03), s(12));

  // G · Hector (shots 13–14): a low swell, very little
  T.droneAt(26, s(13), s(15), 0.2);
  T.padAt([38, 45, 50], s(13), s(15) - 0.05, { att: 1.2, rel: 0.3, level: 0.26, cut: 600 });
  T.note(57, s(14) + 0.3, 0.16, { len: 2.4, bright: 0.35, decay: 0.998 });
  T.note(53, s(14) + 1.5, 0.14, { len: 2.4, bright: 0.35, decay: 0.998 });

  // H · "Patroclus doesn't come back." – the music has stopped; one single low note on "back."
  const back = c('back.', 3).s;   // #1 "you're back," · #2 "in the back." · #3 "come back."
  T.note(38, back + 0.02, 0.6, { len: 5, bright: 0.32, decay: 0.9993 });
  T.padAt([26, 38], back, total - 0.2, { att: 0.05, rel: 1.6, level: 0.4, cut: 300 });
  A.place(T.dry, A.gain(X.glass([N(74), N(81)], total - back - 0.6, { att: 1.5, rel: 1.2 }), 0.025), back + 0.3);
  return T.done({ wet: 0.34 });
}

// a fire: crackling clicks over a soft roar
function crackle(X, d = 2.4) {
  const { A, r } = X, n = A.sec(d), s = A.make(n);
  for (let k = 0; k < d * 38; k++) {
    const t0 = Math.floor(r() * n), len = A.sec(0.003 + r() * 0.012), a = 0.3 + r() * 0.7;
    for (let i = 0; i < len && t0 + i < n; i++) { const v = (r() * 2 - 1) * a * Math.exp(-i / (len * 0.3)); s.L[t0 + i] += v * (0.5 + r() * 0.5); s.R[t0 + i] += v * (0.5 + r() * 0.5); }
  }
  const out = A.filt(s, 'bp', 2200, 0.5);
  A.place(out, A.gain(A.filt(A.decorrelatedNoise(n, r, 0.4), 'lp', 500), 0.25), 0);
  return A.fade(A.norm(out, -4), 0.3, 0.6);
}
// a spear point scratching the sand: three filtered noise strokes
function scratch(X, d = 1.4) {
  const { A, r } = X, n = A.sec(d), s = A.filt(A.decorrelatedNoise(n, r, 0.3), 'bp', 1700, 0.9);
  for (let i = 0; i < n; i++) { const t = i / A.SR, e = Math.max(0, Math.sin(Math.PI * ((t * 2.3) % 1))) ** 2 * Math.min(1, (d - t) / 0.3); s.L[i] *= e; s.R[i] *= e; }
  return A.norm(s, -6);
}

export function sfx(X, total) {
  const F = fx(X, total), s = k => X.shot(k).start, c = (p, n = 1) => X.cue(p, n);
  card(X, { droneAt() {} }, F, true);
  F.add(crackle(X, 2.3), s(2) + 0.05, -17, { pan: 0.1 }, 'the ship burns');
  F.add(scratch(X, 1.5), s(6) + 0.1, -24, { pan: 0.3 }, 'the spear draws in the sand');
  F.add(X.A.bell(620, 1.4, { bright: 0.6 }), c('knocks').s + 0.1, -20, { pan: 0.4 }, 'the helmet is knocked off (a dull ring)');
  F.add(X.kit('rwhoosh1'), c('back.', 2).s - 0.6, -21, { pan: -0.7, panTo: 0.1 }, 'the spear flies (silhouette)');
  F.add(X.kit('thud'), c('back.', 2).s - 0.1, -17, {}, 'the flash; he sinks to one knee');
  return { sfx: F.sfx, ev: F.ev };
}
