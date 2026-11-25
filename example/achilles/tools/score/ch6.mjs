// ch6.mjs – score and effects for chapter VI "Three Screams" (EPISODE.md § 8). Grief first, almost silent.
// A · the news, the dirt: a drone and a thin high pad.  B · his mother rises: the river glass of the hook.
// C · she holds his head: a warm pad and a slow, soft lyre; a glass note when the golden thread appears.
// D · the threads and the shears: plum glass, a low note on "die".  E · "So be it.": a firm low chord.
// F · the walk to the trench: a pulse that grows; the three screams sit on three deep booms (effects) over a held chord.
// G · panic, then mourning.  H · the forge: anvil hits on the hammer's beat, drum and bass, the pad climbs Bb – C – D.
// I · the shield: a shimmering swell.  J · "Tomorrow, Hector.": dawn, one drum on "Hector."
import { tools, fx, card } from './common.mjs';

// an anvil hit: inharmonic ringing partials + a click (the forge rhythm is part of the music)
function anvilHit(X) {
  const { A, r } = X, n = A.sec(1.3), s = A.make(n), f0 = 980;
  for (let i = 0; i < n; i++) { const t = i / A.SR; let v = 0;
    for (const [m, a] of [[1, 1], [2.76, 0.55], [5.4, 0.3], [8.93, 0.16]]) v += a * Math.sin(2 * Math.PI * f0 * m * t) * Math.exp(-t / (0.42 / m));
    s.L[i] = v; s.R[i] = v * 0.96; }
  A.place(s, A.gain(A.fade(A.filt(A.noise(A.sec(0.02), r, 'white'), 'hp', 2500), 0.001, 0.015), 0.7), 0);
  return A.norm(A.filt(s, 'lp', 6000), -3);
}

export function score(X, total) {
  const T = tools(X, total), { A, N } = X, B = T.B;
  const s = k => X.shot(k).start, c = (p, n = 1) => X.cue(p, n);
  card(X, T, { add() {} }, true);

  // A · the news (shot 1), the dirt (shot 2)
  T.droneAt(38, s(1) - 0.1, s(3) + 0.4, 0.15);
  T.padAt([62, 65, 69], s(1) + 0.2, s(3), { att: 1.2, level: 0.12, cut: 1600 });
  T.note(50, c('you.').s + 0.05, 0.36, { len: 3, bright: 0.35, decay: 0.999 });

  // B · she rises from the sea (shots 3–4): the glass of the river, very soft
  T.droneAt(38, s(3), s(5) + 0.4, 0.13);
  A.place(T.dry, A.gain(X.glass([N(74), N(81), N(86)], s(5) - s(3), { att: 1.2, rel: 1.0 }), 0.05), s(3) + 0.1);
  [[86, 1.1], [93, 2.6], [88, 3.9]].forEach(([nn, dt]) => A.place(T.dry, A.gain(A.bell(N(nn), 1.6, { bright: 0.5 }), 0.03), s(3) + dt, { pan: nn % 2 ? 0.5 : -0.5 }));

  // C · she holds his head (shot 5): a warm pad, a slow soft lyre; a glass note when the thread appears
  T.padAt([41, 53, 57, 60, 64], s(5), s(6) + 0.2, { att: 1.2, rel: 0.6, level: 0.3, cut: 1500 }); T.bass(29, s(5), s(6), 0.5);
  [[69, 0.3], [72, 1.05], [76, 1.8], [74, 2.55], [72, 3.3]].forEach(([nn, dt]) => T.note(nn, s(5) + dt, 0.2, { len: 2.8, bright: 0.42, decay: 0.9985, pan: -0.2 }));
  A.place(T.dry, A.gain(A.bell(N(86), 2.2, { bright: 0.55 }), 0.06), c('secret.').s - 0.1, { pan: 0.1 });

  // D · the two threads (shot 6): plum glass, low drone, a low note on "die"
  T.droneAt(38, s(6), s(7) + 0.3, 0.16);
  A.place(T.dry, A.gain(X.glass([N(81), N(86), N(93)], s(7) - s(6), { att: 0.5, rel: 0.6 }), 0.05), s(6));
  T.note(38, c('die').s, 0.5, { len: 3, bright: 0.3, decay: 0.999 });
  T.padAt([38, 50, 51], c('die').s, s(7) + 0.1, { att: 0.3, level: 0.18, cut: 500 });

  // E · "Your answer?" thin; "So be it." a firm low chord (shots 7–9)
  T.padAt([62, 65], s(7), s(8), { att: 0.4, level: 0.1, cut: 1400 });
  const be = c('So be').s;
  T.drumAt(be, 0.5, 1.4);
  T.padAt([26, 38, 45, 50, 57], be, s(10), { att: 0.04, rel: 0.6, level: 0.36, cut: 900 });
  T.droneAt(38, s(9), s(10) + 0.2, 0.14);

  // F · the walk to the trench (shot 10): a growing pulse; under the three screams (shot 11) a held chord
  for (let k = 0, t = s(10) + 0.1; t < c('scream.').s - 0.1; k++, t += B) T.drumAt(t, 0.25 + k * 0.05, 0.8);
  T.padAt([45, 57, 62, 64], s(10), c('scream.').s, { att: 1.0, level: 0.26, cut: 1100 }); T.bass(33, s(10), c('scream.').s, 0.7);
  T.padAt([38, 50, 57, 62, 65, 69], c('Three').s - 0.04, s(12), { att: 0.05, rel: 0.4, level: 0.42, cut: 1400 }); T.bass(26, c('Three').s, s(12), 1);

  // G · panic (shot 12): fast low drums and a dissonant pad; then mourning (shot 13)
  for (let t = s(12), k = 0; t < s(13) - 0.05; t += B / 2, k++) T.drumAt(t, k % 2 ? 0.25 : 0.42, 0.7);
  T.padAt([38, 51, 56, 62], s(12), s(13), { att: 0.1, level: 0.28, cut: 900 });
  T.padAt([50, 57, 62, 65], s(13), s(14), { att: 0.8, level: 0.16, cut: 900 }); T.droneAt(38, s(13), s(14) + 0.3, 0.13);
  [[65, 0.4], [62, 1.3]].forEach(([nn, dt]) => T.note(nn, s(13) + dt, 0.22, { len: 2.6, bright: 0.38, decay: 0.998 }));

  // H · the forge (shots 14–15): anvil hits exactly on the hammer (the scene's beat), drum + bass, Bb – C – D
  const hits = [];
  for (let k = 1; ; k++) { const t = s(14) + (22.5 * k - 12) / 30; if (t >= s(15)) break; hits.push(t); }
  for (let k = 1; ; k++) { const t = s(15) + (22.5 * k - 4) / 30; if (t >= s(16)) break; hits.push(t); }
  const anv = anvilHit(X);
  hits.forEach((t, i) => { A.place(T.dry, A.gain(A.clone(anv), 0.2), t, { pan: i % 2 ? 0.15 : -0.1 }); T.drumAt(t, 0.42, 1.0); });
  T.padAt([46, 58, 62, 65], s(14), s(15), { att: 0.3, level: 0.26, cut: 1100 }); T.bass(34, s(14), s(15), 0.8);
  T.padAt([48, 60, 64, 67], s(15), s(16), { att: 0.2, level: 0.3, cut: 1300 }); T.bass(36, s(15), s(16), 0.85);
  T.arp([58, 62, 65, 70], s(14) + 0.05, s(16) - 0.05, B / 2, 0.14, { pat: [0, 1, 2, 3, 2, 1, 2, 3], decay: 0.992, bright: 0.55, len: 0.7 });

  // I · the shield (shot 16): a shimmering swell
  T.padAt([50, 62, 66, 69, 74, 78], s(16), s(17) + 0.2, { att: 1.4, rel: 0.4, level: 0.34, cut: 2200 }); T.bass(38, s(16), s(17), 0.7);
  A.place(T.dry, A.gain(X.glass([N(86), N(90), N(93), N(98)], s(17) - s(16), { att: 1.2, rel: 0.6 }), 0.07), s(16));
  for (let k = 0; k < 9; k++) A.place(T.dry, A.gain(A.bell(N([86, 90, 93, 98, 102][k % 5]), 1.0, { bright: 0.8 }), 0.025 + k * 0.004), s(16) + 0.2 + k * 0.24, { pan: (k % 3 - 1) * 0.5 });

  // J · "Tomorrow, Hector." – dawn; one drum on "Hector."
  const hec = c('Hector.', 2).s;
  T.padAt([38, 50, 57, 62], s(17), total - 0.2, { att: 0.8, rel: 1.4, level: 0.28, cut: 1100 }); T.droneAt(38, s(17), total, 0.14);
  T.drumAt(hec - 0.02, 0.85, 1.7);
  T.padAt([26, 38, 50], hec, total - 0.2, { att: 0.02, rel: 1.4, level: 0.4, cut: 500 });
  return T.done({ wet: 0.33 });
}

// a low rumble: the panic of horses and chariots far off
function rumble(X, d = 1.6) {
  const { A, r } = X, n = A.sec(d), s = A.filt(A.decorrelatedNoise(n, r, 0.5), 'lp', 160, 0.8);
  for (let i = 0; i < n; i++) { const t = i / A.SR, e = Math.min(1, t / 0.15) * Math.max(0, 1 - t / d) * (0.75 + 0.25 * Math.sin(t * 23)); s.L[i] *= e; s.R[i] *= e; }
  return A.norm(s, -3);
}

export function sfx(X, total) {
  const F = fx(X, total), s = k => X.shot(k).start, c = (p, n = 1) => X.cue(p, n);
  card(X, { droneAt() {} }, F, true);
  F.add(X.rustle(1.2), s(2) + 0.15, -24, { pan: 0.1 }, 'dirt runs through his fingers');
  F.add(X.snip(), c('Hector,').s + 6 / 30, -12, { pan: -0.3 }, 'the shears cut the HECTOR thread');
  const t1 = c('Three').s - 1 / 30;
  [0, 16, 32].forEach((df, k) => F.add(X.kit('boom'), t1 + df / 30 - 0.02, -11 + k * 1.5, {}, `scream ${k + 1}: shock ring`));
  F.add(rumble(X, 1.6), s(12) + 0.05, -15, {}, 'horses rear, chariots tangle');
  return { sfx: F.sfx, ev: F.ev };
}
