// ch3.mjs – score and effects for chapter III "The Prize" (scenes/chapter3.html, EPISODE.md part 5).
// Serious and thin (no comedy stings around Briseis). Same palette as chapter I: D dorian/minor, lyre plucks, pads, drone, drum.
//   1–4   Briseis is taken: a thin low pad and drone, the music thins further for the silent ring, a slow dignified lyre line
//   5–7   the sword: a trembling pluck tremolo and a heartbeat drum, a low stab on the lunge, release when the sword goes back
//   8–9   Thetis rises (again): a soft, warm swell with a rising harp-like arpeggio
//   10–11 Olympus: a low ominous pad for Zeus, heavy drums under the scale
//   12    you sit down: sad and sparse – slow lyre notes repeating while the days go by, ending unresolved
import { tools, fx, card } from './common.mjs';

export function score(X, total) {
  const { A, N } = X, T = tools(X, total), B = T.B, dry = T.dry;
  const S = k => X.shot(k).start, E = k => X.shot(k).end;
  const at = (w, n = 1) => X.cue(w, n).s;
  card(X, T, { add: () => {} });

  // 1–4 · thin and tense
  T.droneAt(38, S(1), S(5) + 0.3, 0.14);
  T.padAt([50, 57, 62], S(1), S(2) + 0.4, { att: 1.0, level: 0.26, cut: 800 });
  for (const [dt, nn] of [[0.3, 62], [1.8, 65], [3.0, 64]]) T.note(nn, S(1) + dt, 0.22, { len: 2.4, bright: 0.4, decay: 0.998 });
  A.place(dry, A.gain(X.glass([N(81), N(86)], E(2) - S(2) + 0.6, { att: 0.4, rel: 0.8 }), 0.04), S(2));   // the silent ring: only drone + glass
  T.padAt([50, 57, 60, 65], S(3), S(5), { att: 0.8, level: 0.24, cut: 900 });
  [[0.2, 69], [1.1, 65], [1.9, 64], [2.9, 62], [4.2, 60], [5.0, 62]].forEach(([dt, nn]) => { if (S(3) + dt < S(5) - 0.2) T.note(nn, S(3) + dt, 0.26, { len: 2.6, bright: 0.42, decay: 0.998 }); });
  T.bass(38, S(4), S(5), 0.7);

  // 5–7 · the sword: tremolo plucks + heartbeat, the lunge stab, release
  const rc = at('reach');
  for (let t = S(5), k = 0; t < S(6) - 0.05; t += B / 4, k++) T.note(k % 2 ? 63 : 62, t, 0.06 + 0.14 * (t - S(5)) / (S(6) - S(5)), { len: 0.25, bright: 0.6, decay: 0.985 });
  for (let t = rc; t < S(6) - 0.1; t += B) { T.drumAt(t, 0.32, 0.6); T.drumAt(t + 0.22, 0.2, 0.5); }
  T.padAt([38, 50, 51], S(5), S(6), { level: 0.22, cut: 600 });
  T.drumAt(S(6) + 0.08, 0.85, 1.7);
  [38, 50, 53, 56, 62].forEach((nn, k) => T.note(nn, S(6) + 0.08 + k * 0.01, 0.3, { len: 2.0, bright: 0.55 }));
  T.padAt([38, 50, 56, 62], S(6) + 0.08, S(7) + 0.3, { att: 0.02, level: 0.3, cut: 1100 });
  T.drumAt(at('kill'), 0.6, 1.4);
  T.padAt([50, 57, 62], S(7), S(8), { att: 0.6, level: 0.2, cut: 700 }); T.note(38, S(7) + 0.1, 0.4, { len: 2.4, bright: 0.3, decay: 0.999 });

  // 8–9 · Thetis comes out of the sea: a soft warm swell (Bbmaj7 → F), a rising arpeggio; a little two-note reply on "Again."
  T.padAt([46, 58, 62, 65, 69], S(8), S(9) + 0.2, { att: 0.9, level: 0.3, cut: 1600 });
  T.arp([58, 62, 65, 69, 74, 77], S(8) + 0.25, S(9), B / 3, 0.17, { pat: [0, 1, 2, 3, 4, 5, 4, 3, 2, 1], decay: 0.997, bright: 0.55, len: 1.6 });
  T.padAt([41, 53, 57, 60, 65], S(9), S(10) + 0.2, { att: 0.3, level: 0.26, cut: 1400 });
  const ag = at('Again');
  T.note(77, ag + 0.3, 0.14, { len: 1.2, bright: 0.6 }); T.note(72, ag + 0.62, 0.14, { len: 1.6, bright: 0.6 });

  // 10–11 · Zeus: a low ominous pad, a drone, heavy slow drums; the scale tips on "lose" and "beg"
  T.droneAt(38, S(10), S(12) + 0.4, 0.2);
  T.padAt([26, 38, 45, 50, 51], S(10), S(12) + 0.3, { att: 0.5, level: 0.4, cut: 520 });
  for (let t = S(10); t < S(12) - 0.2; t += 2 * B) T.drumAt(t, 0.42, 1.3);
  T.drumAt(at('lose'), 0.7, 1.6); T.drumAt(at('beg'), 0.7, 1.6);
  [50, 53, 49].forEach((nn, k) => T.note(nn, at('lose') + 0.05 + k * 0.5, 0.26, { len: 1.6, bright: 0.4 }));

  // 12 · you sit down, and you don't get up: sparse, slow, the same few notes while the days go by; ends unresolved
  const st = at('sit');
  T.padAt([50, 57, 62, 65], S(12), total - 0.2, { att: 1.2, level: 0.22, cut: 900 }); T.bass(38, S(12), total - 0.2, 0.55);
  const line = [74, 69, 65, 62, 64, 65, 69, 67];
  for (let t = st + 0.4, k = 0; t < total - 0.8; t += B, k++) T.note(line[k % line.length], t, 0.2, { len: 2.2, bright: 0.4, decay: 0.998, pan: k % 2 ? 0.25 : -0.25 });
  T.padAt([46, 58, 62, 67], total - 1.6, total - 0.1, { att: 0.6, level: 0.18, cut: 900 });
  return T.done({ wet: 0.34 });
}

// a blade sliding on its scabbard (up = drawn out, down = put back): a filtered noise sweep with a faint metal ring
function shing(X, up = true, d = 0.5) {
  const { A } = X, n = A.sec(d);
  let s = A.filt(A.decorrelatedNoise(n, X.r, 0.3), 'bp', t => up ? 2200 + 4000 * t / d : 6000 - 3600 * t / d, 2.2);
  for (let i = 0; i < n; i++) { const t = i / A.SR, e = Math.min(1, t / 0.04) * Math.max(0, 1 - t / d); s.L[i] *= e; s.R[i] *= e; }
  const ring = A.make(n);
  for (let i = 0; i < n; i++) { const t = i / A.SR, v = Math.sin(2 * Math.PI * 3150 * t) * 0.25 * Math.exp(-Math.max(0, t - d * 0.6) / 0.08) * Math.min(1, t / (d * 0.6)); ring.L[i] = v; ring.R[i] = v; }
  A.place(s, ring, 0);
  return A.norm(s, -4);
}

export function sfx(X, total) {
  const F = fx(X, total), { add } = F;
  const S = k => X.shot(k).start;
  const at = (w, n = 1) => X.cue(w, n).s;
  card(X, { droneAt() {} }, F, true);                                                                // 1–2 card whoosh + boom (darker)
  add(shing(X, true, 0.55), at('reach') + 0.2, -16, { pan: 0.3 }, 'the blade slides out a little');  // 3
  add(X.kit('impact_big'), S(6) + 0.1, -12, { pan: 0.1 }, 'the lunge');                              // 4
  add(shing(X, false, 0.6), at('put') + 0.05, -17, { pan: 0.3 }, 'the sword goes back');             // 5
  add(X.splash(), S(8) + 0.12, -15, { pan: -0.35 }, 'Thetis rises from the sea');                     // 6
  add(X.kit('boom'), at('lose') - 0.06, -12, { pan: -0.2 }, 'lightning strikes the Greek pan');       // 7
  return { sfx: F.sfx, ev: F.ev };
}
