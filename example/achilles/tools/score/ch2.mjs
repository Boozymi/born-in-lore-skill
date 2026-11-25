// ch2.mjs – score and effects for chapter II "Fifty Ships" (scenes/chapter2.html, EPISODE.md part 4).
// Same palette as the hook and chapter I (D dorian, 80 BPM, lyre plucks, pads, frame drum, hall reverb). Sections on the shots:
//   A  1–5   seafaring march (lilting plucks, drum on the beat) – a falling run on WRONG COUNTRY, a fast "skip" on "Long story."
//   B  6–10  dusk at Troy: a sneaky low motif for Cycnus, a pause for the bending sword, a scuffle, a bright stab on SOLVED
//   C  11–14 "Quick pause.": the music stops dead, then a soft waiting bed (music-box plucks over a sus pad), warm on the laurel
//   D  15–19 the raids: a driving pulse and a bass ostinato, a drop-out and one low note on the heel, the march returns on the cheer
//   E  20–23 Agamemnon: a pompous, heavy Bb-major motif (dotted plucks, big drum on the bar)
//   F  24–25 a heroic D-major chord for "the best of the Greeks", then the tense face-off: drone, trembling plucks, a hit on "problem"
import { tools, fx, card } from './common.mjs';

export function score(X, total) {
  const { A, N } = X, T = tools(X, total), B = T.B, dry = T.dry;
  const S = k => X.shot(k).start, E = k => X.shot(k).end;
  const at = (w, n = 1) => X.cue(w, n).s;
  const stab = (notes, t, g = 0.3, o = {}) => notes.forEach((nn, k) => T.note(nn, t + k * (o.spread ?? 0.03), g, { len: o.len || 1.6, bright: o.bright || 0.6, pan: (k - notes.length / 2) * 0.15 }));
  card(X, T, { add: () => {} });   // the card's low swell (the card effects are added in sfx)

  // ---- A · the fleet sets sail: a march in D dorian (Dm – C – Bb – C), lilting eighth plucks, drum on every beat ----
  const marchCh = [{ r: 38, t: [62, 65, 69, 74] }, { r: 36, t: [60, 64, 67, 72] }, { r: 34, t: [58, 62, 65, 70] }, { r: 36, t: [60, 64, 67, 72] }];
  const wr = at('wrong'), A0 = S(1), A1 = wr - 0.05;
  for (let b = 0, t0 = A0; t0 < A1 - 0.05; b++, t0 += 4 * B) {
    const c = marchCh[b % 4], t1 = Math.min(A1, t0 + 4 * B);
    T.arp(c.t, t0, t1, B / 2, 0.24, { pat: [0, 2, 1, 3, 2, 1, 3, 2], decay: 0.993, bright: 0.65, len: 0.8 });
    T.padAt([c.r + 12, c.t[0], c.t[2]], t0, t1, { level: 0.2, att: 0.2 });
    T.bass(c.r, t0, Math.min(t1, t0 + 2 * B), 0.9); if (t0 + 2 * B < t1) T.bass(c.r + 7, t0 + 2 * B, t1, 0.75);
    for (let k = 0; k < 4 && t0 + k * B < t1; k++) T.drumAt(t0 + k * B, k === 0 ? 0.5 : 0.28, k === 0 ? 1.1 : 0.7);
  }
  // the route swerves: a falling run and a low "bonk" under the red X
  [81, 77, 74, 69, 65, 62, 57].forEach((nn, k) => T.note(nn, wr - 0.1 + k * 0.06, 0.28, { len: 0.5, bright: 0.7 }));
  T.bass(37, wr + 0.32, wr + 1.0, 0.9); T.drumAt(wr + 0.3, 0.45, 0.8);
  // "Long story.": a fast scurrying run up and down (fast-forward), then silence for the landing
  T.arp([62, 64, 65, 67, 69, 71, 72, 74, 76, 77], S(5) + 0.05, E(5) - 0.05, B / 6, 0.16, { pat: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1], decay: 0.985, bright: 0.75, len: 0.35 });

  // ---- B · Troy at dusk ----
  T.droneAt(38, S(6), S(8) + 0.2, 0.12);
  T.padAt([50, 57, 62, 65], S(6), S(7) + 0.3, { att: 0.8, level: 0.3 });
  T.arp([62, 65, 69, 72], S(6) + 0.2, S(7), B, 0.2, { pat: [0, 1, 2, 3], decay: 0.997, len: 1.8, bright: 0.45 });
  // Cycnus: a sneaky low motif (D – F – E – C#), soft drum on the bar
  const sneak = [50, 53, 52, 49];
  for (let t = S(7), k = 0; t < S(8) - 0.1; t += B / 2, k++) if (k % 4 !== 3) T.note(sneak[Math.floor(k / 4) % 4] + (k % 4 === 2 ? 12 : 0), t, 0.3, { len: 0.6, bright: 0.45 });
  for (let t = S(7); t < S(8) - 0.1; t += 2 * B) T.drumAt(t, 0.3, 0.8);
  T.padAt([38, 50, 57], S(7), S(8), { level: 0.25, cut: 700 });
  // the sword bends: everything holds for the gag (only a thin pad), then the scuffle
  T.padAt([50, 57, 64], S(8), S(9), { level: 0.18, att: 0.1, cut: 900 });
  for (let t = S(9), k = 0; t < S(10) - 0.1; t += B / 4, k++) T.drumAt(t, 0.14 + 0.04 * ((k * 7) % 3), 0.45);
  T.arp([50, 53, 56, 53], S(9), S(10), B / 4, 0.18, { pat: [0, 1, 2, 1, 0, 2], decay: 0.985, len: 0.3, bright: 0.7 });
  T.bass(38, S(9), S(10), 0.7);
  // SOLVED: a bright D-major stab and a held chord
  const sv = at('solved');
  T.drumAt(sv, 0.6, 1.3); stab([62, 66, 69, 74, 78], sv, 0.3);
  T.padAt([50, 62, 66, 69], sv, S(11) + 0.6, { att: 0.05, level: 0.32, cut: 1800 }); T.bass(38, sv, S(11) + 0.6, 0.8);

  // ---- C · "Quick pause." – a waiting bed: music-box plucks over a D sus2 pad ----
  const C0 = S(11) + 0.45, C1 = S(14);
  T.padAt([50, 57, 64, 69], C0, C1 + 0.2, { att: 0.9, level: 0.22, cut: 1400 });
  const box = [86, 81, 79, 76, 81, 79, 74, 76];
  for (let t = C0 + 0.3, k = 0; t < C1 - 0.1; t += B, k++) T.note(box[k % box.length], t, 0.16, { len: 1.6, bright: 0.8, decay: 0.998, pan: (k % 2 ? 0.3 : -0.3) });
  // the laurel: warm Bbmaj7 → D, a rising arpeggio as it lands
  const wn = at('wins');
  T.padAt([46, 58, 62, 65, 69], S(14), wn, { att: 0.3, level: 0.3 });
  T.padAt([50, 62, 66, 69, 74], wn, S(15) + 0.2, { att: 0.05, level: 0.34, cut: 2000 });
  stab([62, 66, 69, 74, 78, 81], wn - 0.03, 0.24, { spread: 0.05 });

  // ---- D · the raids: driving pulse, bass ostinato in eighths ----
  const D0 = S(15), D1 = S(18);
  const ost = [38, 38, 41, 43, 38, 38, 45, 43];
  for (let t = D0, k = 0; t < D1 - 0.05; t += B / 2, k++) T.note(ost[k % 8], t, 0.34, { len: 0.4, bright: 0.5, decay: 0.99 });
  for (let t = D0, k = 0; t < D1 - 0.05; t += B, k++) T.drumAt(t, k % 4 === 0 ? 0.55 : 0.32, k % 4 === 0 ? 1.2 : 0.75);
  T.padAt([50, 57, 62, 65], D0, D1, { level: 0.24, cut: 1000 });
  T.arp([74, 77, 81, 79], S(16), D1, B / 2, 0.16, { pat: [0, 1, 2, 3, 2, 1], decay: 0.99, len: 0.5, bright: 0.7 });
  // the heel: the music drops out, one low ominous note and a cold glass shimmer
  const al = at('almost');
  T.droneAt(38, S(18), S(19), 0.14);
  T.note(38, al, 0.5, { len: 2.6, bright: 0.3, decay: 0.999 });
  A.place(dry, A.gain(X.glass([N(86), N(93)], E(18) - al, { att: 0.3, rel: 0.4 }), 0.05), al);
  // the cheer: the march returns, bright (D major)
  const D2 = S(19), D3 = S(20);
  T.padAt([50, 62, 66, 69, 74], D2, D3, { att: 0.15, level: 0.34, cut: 2000 }); T.bass(38, D2, D3, 0.9);
  T.arp([62, 66, 69, 74, 78], D2, D3, B / 2, 0.26, { pat: [0, 1, 2, 3, 4, 3, 2, 1], bright: 0.65, len: 0.9 });
  for (let t = D2, k = 0; t < D3 - 0.05; t += B, k++) T.drumAt(t, k % 2 ? 0.3 : 0.5, k % 2 ? 0.7 : 1.1);

  // ---- E · Agamemnon: pompous Bb major – a heavy dotted motif, big drum on the bar ----
  const E0 = S(20), E1 = S(24);
  const pomp = [[58, 0], [65, 0.75], [62, 1.125], [70, 1.5], [65, 2.25], [58, 2.625]];
  for (let t0 = E0, b = 0; t0 < E1 - 0.1; t0 += 4 * B, b++) {
    const t1 = Math.min(E1, t0 + 4 * B), up = b % 2 ? 5 : 0;
    T.padAt([46, 58, 62, 65 + up], t0, t1, { att: 0.08, level: 0.3, cut: 1300 }); T.bass(34 + (b % 2 ? 5 : 0), t0, t1, 1);
    pomp.forEach(([nn, dt]) => { if (t0 + dt < t1 - 0.05) T.note(nn + up, t0 + dt, 0.3, { len: 0.9, bright: 0.55 }); });
    T.drumAt(t0, 0.6, 1.4); if (t0 + 2 * B < t1) T.drumAt(t0 + 2 * B, 0.4, 1.1);
  }
  // the parasol: the motif becomes dainty (high, staccato); the loot: a little descending comic run
  for (let t = S(21) + 0.1, k = 0; t < S(22) - 0.1; t += B / 2, k++) T.note([82, 77, 74, 77][k % 4], t, 0.12, { len: 0.4, bright: 0.8, decay: 0.99 });
  const bgst = at('biggest');
  [77, 74, 70, 65, 62, 58].forEach((nn, k) => T.note(nn, bgst + 0.12 + k * 0.08, 0.2, { len: 0.45, bright: 0.7, decay: 0.99 }));

  // ---- F · "the best of the Greeks": heroic D major; the face-off: tense, then a hit on "problem" ----
  const F0 = S(24), F1 = S(25), pb = at('problem');
  T.drumAt(F0 + 0.02, 0.55, 1.3); stab([62, 66, 69, 74, 78], F0 + 0.02, 0.28);
  T.padAt([50, 62, 66, 69, 74], F0, F1, { att: 0.05, level: 0.36, cut: 2200 }); T.bass(38, F0, F1, 1);
  T.arp([66, 69, 74, 78, 81], F0 + 0.4, F1, B / 2, 0.22, { pat: [0, 1, 2, 3, 4], bright: 0.65 });
  T.droneAt(38, F1, total - 0.2, 0.2);
  T.padAt([50, 57, 58, 62], F1, total - 0.2, { att: 0.2, level: 0.28, cut: 900 });
  for (let t = F1, k = 0; t < pb - 0.05; t += B / 4, k++) T.note(k % 2 ? 70 : 69, t, 0.08 + 0.12 * (t - F1) / Math.max(0.3, pb - F1), { len: 0.25, bright: 0.6, decay: 0.985 });
  T.drumAt(pb - 0.02, 0.8, 1.7); stab([50, 57, 62, 65, 70], pb - 0.02, 0.3, { spread: 0.0, len: 2.4, bright: 0.5 });
  for (let t = pb + 3 * B; t < total - 0.4; t += 2 * B) T.drumAt(t, 0.3, 0.9);

  const music = T.done();
  // "Quick pause.": the bed stops dead on the freeze (tails included), the waiting bed starts after a short silence
  const c0 = A.sec(S(11) + 0.02), c1 = A.sec(C0 - 0.02);
  for (let i = c0; i < c1 && i < A.len(music); i++) { const g = Math.max(0, 1 - (i - c0) / A.sec(0.035)); music.L[i] *= g; music.R[i] *= g; }
  return music;
}

// a metallic clang (sword on an unbreakable arm): inharmonic partials, quick decay
function clang(X) {
  const { A } = X, n = A.sec(1.0), s = A.make(n);
  const parts = [[1180, 1, 0.35], [1730, 0.7, 0.25], [2510, 0.55, 0.18], [3390, 0.35, 0.12], [620, 0.5, 0.3]];
  for (let i = 0; i < n; i++) { const t = i / A.SR; let v = 0; for (const [fq, a, d] of parts) v += Math.sin(2 * Math.PI * fq * t) * a * Math.exp(-t / d); v *= Math.min(1, t / 0.001); s.L[i] = v; s.R[i] = v * 0.96; }
  const hit = A.gain(A.filt(A.noise(A.sec(0.03), X.r, 'white'), 'hp', 2500), 0.6);
  A.place(s, A.fade(hit, 0.0005, 0.02), 0);
  return A.norm(s, -3);
}
// a cartoon "boing" (the blade goes floppy): a low tone with a fast decaying vibrato, gliding down
function boing(X) {
  const { A } = X, d = 0.7, n = A.sec(d), s = A.make(n); let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / A.SR, fq = 200 * (1 - 0.35 * t / d) * (1 + 0.22 * Math.sin(2 * Math.PI * 11 * t) * Math.exp(-t / 0.25));
    ph += fq / A.SR; const v = (Math.sin(2 * Math.PI * ph) + 0.3 * Math.sin(4 * Math.PI * ph)) * Math.min(1, t / 0.005) * Math.exp(-t / 0.28); s.L[i] = v; s.R[i] = v; }
  return A.norm(s, -4);
}
// a quill scratching on parchment: short band-passed noise strokes
function scratch(X, strokes = 5) {
  const { A } = X, s = A.make(A.sec(0.9));
  for (let k = 0; k < strokes; k++) { const one = A.filt(A.noise(A.sec(0.09), X.r, 'white'), 'bp', 3800 + 600 * (k % 2), 1.4);
    A.place(s, A.fade(A.gain(one, 0.6 + 0.3 * (k % 2)), 0.01, 0.04), k * 0.15); }
  return A.norm(s, -6);
}

export function sfx(X, total) {
  const F = fx(X, total), { add } = F;
  const S = k => X.shot(k).start;
  const at = (w, n = 1) => X.cue(w, n).s;
  card(X, { droneAt() {} }, F);                                                                      // 1–2 card whoosh + boom
  add(X.kit('thud'), at('wrong') + 0.02, -12, { pan: 0.35 }, 'red X on the wrong country');           // 3
  add(X.rustle(0.9), S(5) + 0.05, -15, { pan: -0.1, panTo: 0.2 }, 'LONG STORY scroll unrolls');       // 4
  add(clang(X), at('blade') - 0.03, -15, { pan: 0.25 }, 'sword hits Cycnus');                         // 5
  add(boing(X), at('blade') + 0.12, -14, { pan: 0.2 }, 'the blade bends');                            // 6
  add(X.kit('rswish3'), S(9) + 0.08, -16, { pan: -0.3, panTo: 0.3 }, 'fight cloud');                  // 7
  add(X.kit('thud'), at('solved') + 0.02, -9, { pan: -0.1 }, 'SOLVED stamp');                         // 8
  add(scratch(X), at('Write') + 0.12, -19, { pan: -0.2, panTo: 0.2 }, 'the quill writes NAME');       // 9
  add(X.kit('ding_land'), at('wins') - 0.05, -17, { pan: 0 }, 'the laurel lands');                    // 10
  add(X.plink(1650), S(17) + 4 / 30, -21, { pan: -0.4 }, 'arrow bounces off');                        // 11
  add(X.kit('whip'), at('swift-footed') - 0.12, -14, { pan: -0.8, panTo: 0.8 }, 'he zips past');      // 12
  add(X.kit('boom'), at('problem') - 0.02, -10, {}, 'thunder between them');                          // 13
  return { sfx: F.sfx, ev: F.ev };
}
