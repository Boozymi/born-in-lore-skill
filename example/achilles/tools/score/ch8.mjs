// ch8.mjs – score and effects for chapter VIII "Priam" (EPISODE.md § 10). The quietest piece of the episode:
// soft lyre and pad only, no drums except one soft touch. Almost no effects.
// A · the grave at dawn (shot 1): a thin D–A pad, a few tired lyre notes.
// B · night, the old man walks in (shots 2–3): a low drone, a cold glass far above, one low note on "Alone."
// C · Priam, Hector's father (shots 4–5): Gm, a soft pluck on his name, a low Bb on "father".
// D · he kneels and kisses the hands (shots 6–8): a slow lyre line A–G–F–E–D over Dm and Gm.
// E · your own father (shot 9): the memory – a warm Bbmaj7 with soft bells.
// F · you both cry (shots 10–12): the warm major turn: F – Bb – F/A – C, the lyre opens up.
// G · the cart at dawn, eleven days of peace (shots 13–14): gentle dawn in D major, an open fifth to finish.
import { tools, fx, card } from './common.mjs';

export function score(X, total) {
  const T = tools(X, total), { A, N } = X, B = T.B;
  const s = k => X.shot(k).start, c = (p, n = 1) => X.cue(p, n);
  card(X, T, { add() {} }, true);
  const soft = (nn, t, g = 0.2, pan = 0) => T.note(nn, t, g, { len: 2.8, bright: 0.36, decay: 0.9985, pan });

  // A · the grave at dawn
  T.padAt([50, 57, 62], s(1), s(2), { att: 1.0, level: 0.18, cut: 1200 }); T.droneAt(38, s(1), s(2) + 0.3, 0.1);
  [[69, 0.4], [65, 1.4], [62, 2.4]].forEach(([nn, dt]) => soft(nn, s(1) + dt, 0.18, -0.2));

  // B · night: drone, a cold glass high up, one low note on "Alone."
  T.droneAt(38, s(2), s(4) + 0.3, 0.13);
  A.place(T.dry, A.gain(X.glass([N(81), N(88)], s(4) - s(2), { att: 1.2, rel: 0.6 }), 0.035), s(2) + 0.2);
  [[74, 0.5], [72, 1.6], [69, 2.6]].forEach(([nn, dt]) => soft(nn, s(2) + dt, 0.14, 0.3));
  T.note(38, c('Alone.').s, 0.36, { len: 3, bright: 0.25, decay: 0.999 });

  // C · Priam (Gm), "Hector's father" (a low Bb)
  T.padAt([43, 55, 58, 62], s(4), s(6), { att: 0.8, level: 0.2, cut: 1100 }); T.bass(31, s(4), s(5), 0.5);
  soft(67, c('Priam.').s + 0.05, 0.22, 0.2); soft(70, c('king.').s + 0.05, 0.16, -0.2);
  T.note(34, c('father.').s, 0.36, { len: 3, bright: 0.25, decay: 0.999 }); T.bass(34, c('father.').s, s(6), 0.5);

  // D · he kneels, the hands, his plea: a slow lyre line over Dm – Gm
  T.padAt([50, 57, 62, 65], s(6), s(8), { att: 0.8, level: 0.22, cut: 1100 }); T.bass(38, s(6), s(8), 0.5);
  T.padAt([43, 55, 58, 62], s(8), s(9), { att: 0.5, level: 0.22, cut: 1100 }); T.bass(31, s(8), s(9), 0.5);
  [[69, 0.2], [67, 0.95], [65, 1.7], [64, 2.45], [62, 3.2]].forEach(([nn, dt]) => soft(nn, s(6) + dt, 0.22, 0.1));
  [[70, 0.1], [69, 0.7]].forEach(([nn, dt]) => soft(nn, s(8) + dt, 0.2, -0.1));

  // E · the memory of your father: a warm Bbmaj7, soft bells
  T.padAt([46, 58, 62, 65, 69], s(9), s(10) + 0.2, { att: 0.5, level: 0.26, cut: 1500 }); T.bass(34, s(9), s(10), 0.55);
  [[86, 0.15], [81, 0.55], [77, 0.95]].forEach(([nn, dt]) => A.place(T.dry, A.gain(A.bell(N(nn), 1.8, { bright: 0.5 }), 0.03), s(9) + dt, { pan: nn % 2 ? 0.4 : -0.4 }));

  // F · you both cry: the warm major turn F – Bb – F/A – C – F, the lyre opens into slow arpeggios
  const f0 = s(10), f1 = s(13), step = (f1 - f0) / 4;
  const turn = [{ r: 41, t: [65, 69, 72, 77] }, { r: 46, t: [65, 70, 74, 77] }, { r: 45, t: [65, 69, 72, 76] }, { r: 48, t: [64, 67, 72, 76] }];
  turn.forEach((ch, k) => { const t0 = f0 + k * step, t1 = t0 + step;
    T.padAt([ch.r + 12, ...ch.t.slice(0, 3)], t0, t1 + 0.1, { att: k ? 0.4 : 0.9, level: 0.26, cut: 1500 }); T.bass(ch.r - 12, t0, t1, 0.55);
    T.arp(ch.t, t0 + 0.1, t1, B / 2, 0.15, { pat: [0, 1, 2, 3, 2, 1], decay: 0.997, bright: 0.42, len: 2 }); });
  A.place(T.dry, A.gain(A.bell(N(84), 2.2, { bright: 0.5 }), 0.035), c('Patroclus.').s + 0.1, { pan: -0.3 });

  // G · the cart at dawn, eleven days of peace: D major, gentle, an open fifth at the end
  const g0 = s(13), g1 = s(14);
  T.padAt([50, 62, 66, 69], g0, g1 + 0.2, { att: 0.8, level: 0.24, cut: 1500 }); T.bass(38, g0, g1, 0.5);
  T.arp([62, 66, 69, 74], g0 + 0.3, g1, B, 0.15, { pat: [0, 1, 2, 3, 2, 1], decay: 0.998, bright: 0.4, len: 2.2 });
  T.padAt([50, 57, 62, 69, 74], g1, total - 0.2, { att: 1.0, rel: 1.4, level: 0.24, cut: 1700 }); T.droneAt(38, g1, total, 0.1);
  [[74, 0.3], [78, 1.1], [81, 1.9], [74, 3.0]].forEach(([nn, dt]) => soft(nn, g1 + dt, 0.16, 0.25));
  return T.done({ wet: 0.36 });
}

// small birds at dawn: short rising chirps, quiet
function chirps(X, n = 5) {
  const { A, r } = X, out = A.make(A.sec(2.6));
  for (let k = 0; k < n; k++) {
    const t0 = 0.1 + k * 0.42 + r() * 0.15, f0 = 2600 + r() * 1400, d = 0.07 + r() * 0.05, m = A.sec(d), ch = A.make(m);
    for (let i = 0; i < m; i++) { const t = i / A.SR, f = f0 * (1 + 0.5 * t / d), v = Math.sin(2 * Math.PI * f * t) * Math.sin(Math.PI * t / d); ch.L[i] = v; ch.R[i] = v; }
    A.place(out, A.gain(ch, 0.6), t0, { pan: r() * 1.2 - 0.6 });
    if (r() > 0.4) A.place(out, A.gain(A.clone(ch), 0.45), t0 + d + 0.04, { pan: r() * 1.2 - 0.6 });
  }
  return A.norm(out, -4);
}

export function sfx(X, total) {
  const F = fx(X, total), s = k => X.shot(k).start, c = (p, n = 1) => X.cue(p, n);
  card(X, { droneAt() {} }, F, true);
  F.add(X.rustle(0.7), s(3) + 0.05, -24, { pan: 0.5 }, 'the tent flap: the old man in the door');
  F.add(chirps(X, 5), s(14) + 0.4, -22, { pan: 0.2 }, 'birds over a quiet Troy');
  return { sfx: F.sfx, ev: F.ev };
}
