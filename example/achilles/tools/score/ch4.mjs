// ch4.mjs – score and effects for chapter IV "The Lyre" (EPISODE.md § 6). The last chapter with jokes.
// A · the battle goes wrong: tense low ostinato + frame drum; a deadpan falling figure on "Badly."
// B · "And you?": the music cuts, one warm lyre note from the tent.
// C · the lyre solo: he really plays – a little melody on the plucks while he sits and sings; a sour pluck on "useless";
//     the old songs on a fuller pad, the phrase ends unresolved over the empty place in the frieze.
// D · Odysseus and the offer: light staccato comedy vamp, one pluck per item (seven quick ones for the cities, one per
//     cauldron while the tower stacks up), the vamp stops for "Just in case".
// E · the memory of the trick: dark, a far war horn (the trumpet of chapter I).  F · a build-up into a firm "NO".
// G · "Tomorrow, you sail home.": a calm night, the tent melody once more, slow and warm.
import { tools, fx, card } from './common.mjs';

export function score(X, total) {
  const T = tools(X, total), { A, N } = X, B = T.B;
  const s = k => X.shot(k).start, c = (p, n = 1) => X.cue(p, n);
  card(X, T, { add() {} });
  const lyre = (nn, t, g = 0.3, o = {}) => A.place(T.dry, A.gain(X.pluck(N(nn), o.len || 2.0, { bright: o.bright || 0.62, decay: o.decay || 0.9975 }), g), t, { pan: o.pan ?? -0.15 });
  const play = (mel, t0, step, g, tEnd = Infinity, o = {}) => { let t = t0; for (const [nn, du] of mel) { if (t > tEnd - 0.05) break; if (nn) lyre(nn, t, g * (o.acc && t === t0 ? 1.15 : 1), o); t += du * step; } return t; };

  // A · the battle (shots 1–2)
  const a0 = s(1), a1 = s(3) - 0.04;
  T.droneAt(38, a0, a1 + 0.3, 0.13);
  T.padAt([50, 57, 62, 65], a0, a1, { att: 0.4, rel: 0.15, level: 0.22, cut: 900 });
  T.bass(38, a0, a1, 0.8);
  for (let t = a0, k = 0; t < a1 - 0.1; t += B, k++) T.drumAt(t, k % 4 === 0 ? 0.5 : 0.28, k % 4 === 0 ? 1.1 : 0.7);
  T.arp([50, 53, 57, 55], a0 + 0.02, c('Badly.').s - 0.1, B / 2, 0.2, { pat: [0, 1, 2, 1, 3, 1, 2, 1], decay: 0.99, bright: 0.55, len: 0.7 });
  [69, 65, 62].forEach((nn, k) => T.note(nn, c('Badly.').s + 0.05 + k * 0.14, 0.26, { len: 0.5, decay: 0.988, bright: 0.7 }));
  T.arp([50, 53, 57, 55], c('Badly.').e + 0.1, a1, B / 2, 0.18, { pat: [0, 1, 2, 1, 3, 1, 2, 1], decay: 0.99, bright: 0.5, len: 0.6 });

  // B · "And you?" – silence, then one warm note from the tent
  lyre(74, s(3) + 0.28, 0.3, { len: 2.6 });
  T.padAt([50, 57, 62], s(3) + 0.2, s(4) + 0.4, { att: 0.5, level: 0.14, cut: 1000 });

  // C · the lyre solo (shot 4), the sour pluck (shot 5), the old songs (shots 6–7)
  const step = B / 2;
  const tent = [[74, 1], [77, 1], [81, 1], [79, 1], [77, 1], [76, 1], [74, 1], [72, 1], [74, 2], [69, 1], [72, 1], [74, 1], [77, 1], [76, 2]];
  T.padAt([50, 57, 62, 65, 69], s(4), s(5) + 0.2, { att: 0.8, level: 0.2, cut: 1300 }); T.bass(38, s(4), s(5) + 0.2, 0.6);
  play(tent, s(4) + 0.12, step, 0.32, s(5) - 0.02);
  const sour = c('useless').s;
  for (const [nn, det] of [[68, 0.985], [74, 1.012]]) A.place(T.dry, A.gain(X.pluck(N(nn) * det, 1.2, { bright: 0.85, decay: 0.993 }), 0.3), sour + 0.02, { pan: -0.1 });
  T.padAt([46, 58, 62, 65, 69], s(6), s(7), { att: 0.5, level: 0.26, cut: 1500 }); T.bass(34, s(6), s(7), 0.7);
  T.padAt([43, 55, 58, 62, 70], s(7), s(8) - 0.1, { att: 0.4, level: 0.22, cut: 1300 }); T.bass(31, s(7), s(8) - 0.1, 0.6);
  const song = [[81, 2], [79, 1], [77, 1], [79, 2], [81, 1], [84, 1], [81, 2], [79, 1], [77, 1], [76, 4]];
  play(song, s(6) + 0.05, step, 0.3, s(7) + 0.3);
  // the phrase stops on a question over the empty place: a high glass chord
  A.place(T.dry, A.gain(X.glass([N(86), N(91), N(93)], s(8) - s(7) - 0.2, { att: 0.6, rel: 0.8 }), 0.05), s(7) + 0.1);
  lyre(76, c('yet.').s, 0.28, { len: 2.4 });

  // D · Odysseus and the offer (shots 8–12): light staccato vamp (Dm – G), a bouncy bass
  const vamp = (t0, t1, g = 0.2) => {
    const ch = [{ root: 38, t: [62, 65, 69, 74] }, { root: 43, t: [62, 67, 71, 74] }];
    for (let b = 0, t = t0; t < t1 - 0.05; b++, t += 4 * B) {
      const cc = ch[b % 2], e = Math.min(t1 - 0.05, t + 4 * B);
      T.arp(cc.t, t, e, B / 2, g, { pat: [0, 2, 1, 3, 2, 1, 3, 2], decay: 0.99, bright: 0.7, len: 0.5 });
      for (let k = 0; k < 4 && t + k * B < e; k++) A.place(T.dry, A.gain(X.pluck(N(cc.root + (k % 2 ? 7 : 0)), 0.45, { decay: 0.985, bright: 0.6 }), 0.45), t + k * B);
    }
  };
  // sneaky entrance: low staccato steps
  [50, 45, 50, 53, 50, 45].forEach((nn, k) => T.note(nn, s(8) + 0.1 + k * B / 2, 0.36, { len: 0.4, decay: 0.982, bright: 0.6 }));
  T.note(57, c('up.').s + 0.05, 0.3, { len: 0.5, decay: 0.985, bright: 0.7 });
  // "Again." – everything stops; one low plunk after the word
  T.note(38, c('Again.').e + 0.02, 0.5, { len: 0.8, decay: 0.986, bright: 0.45 });
  // "With an offer." – a little flourish
  [62, 65, 69, 74, 77].forEach((nn, k) => T.note(nn, c('offer.').s + k * 0.06, 0.24, { len: 0.8, decay: 0.99, bright: 0.7 }));
  vamp(c('offer.').e + 0.05, c('Just').s - 0.05, 0.16);
  // one pluck per item; seven for the cities; one per cauldron while the tower stacks up (every 2 frames)
  T.note(81, c('Gold,').s + 0.03, 0.3, { len: 0.9, bright: 0.75 });
  T.note(84, c('horses,').s + 0.03, 0.3, { len: 0.9, bright: 0.75 });
  const cs = c('seven').s, ce = c('cities,').s + 0.13;
  [74, 76, 77, 79, 81, 83, 86].forEach((nn, k) => T.note(nn, cs + (ce - cs) * k / 6 + 0.02, 0.2, { len: 0.6, bright: 0.75, pan: (k - 3) * 0.12 }));
  A.place(T.dry, A.gain(A.bell(N(93), 1.2, { bright: 0.8 }), 0.06), c('princess,').s + 0.04, { pan: 0.3 });
  T.note(88, c('princess,').s + 0.04, 0.22, { len: 1.0, bright: 0.8 });
  const tw = c('twenty').s;
  const scale = [50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83];
  scale.forEach((nn, k) => T.note(nn, tw + k * 2 / 30, 0.14, { len: 0.35, decay: 0.985, bright: 0.7, pan: (k % 2 ? 0.25 : -0.25) }));
  // "Just in case." – the vamp is gone; a nervous trill while the tower wobbles
  for (let k = 0; k < 8; k++) T.note(k % 2 ? 70 : 69, c('Just').s + 0.05 + k * 0.11, 0.18 * (1 - k / 10), { len: 0.3, decay: 0.98, bright: 0.6 });

  // E · the memory of the trick (shot 13): dark Gm, a far war horn
  T.droneAt(38, s(13), s(14) + 0.2, 0.14);
  T.padAt([43, 55, 58, 62], s(13), s(14), { att: 0.5, level: 0.24, cut: 900 }); T.bass(31, s(13), s(14), 0.7);
  T.arp([55, 58, 62, 61], s(13) + 0.3, s(14) - 0.1, B, 0.22, { pat: [0, 1, 2, 3], decay: 0.996, bright: 0.4, len: 1.6 });
  A.place(T.dry, A.gain(A.filt(X.hornCall(1.4), 'lp', 1400), 0.08), s(13) + 0.25, { pan: 0.4 });

  // F · build-up into "NO" (shot 14)
  const no = c('no.').s;
  T.padAt([45, 57, 62, 64, 69], s(14), no, { att: 1.0, level: 0.3, cut: 1600 }); T.bass(33, s(14), no, 0.8);
  for (let k = 0, t = s(14) + 0.1; t < no - 0.12; k++, t += Math.max(0.12, 0.42 - k * 0.05)) T.drumAt(t, 0.2 + k * 0.03, 0.55);
  T.drumAt(no - 0.01, 0.85, 1.7);
  T.padAt([26, 38, 50, 57, 62], no - 0.01, no + 0.5, { att: 0.01, rel: 0.6, level: 0.55, cut: 1200 });

  // G · "Tomorrow, you sail home." – a calm night; the tent melody, slower, to the end
  const g0 = s(15);
  T.padAt([50, 57, 62, 65, 69, 76], g0, total - 0.2, { att: 1.4, rel: 1.4, level: 0.24, cut: 1300 }); T.bass(38, g0, total - 0.4, 0.55);
  play([[74, 2], [77, 1], [81, 1], [79, 2], [77, 2], [74, 4]], g0 + 0.35, B / 1.6, 0.27, total - 0.6, { len: 2.6, decay: 0.998 });
  A.place(T.dry, A.gain(X.glass([N(74), N(81), N(88)], total - g0 - 0.5, { att: 1.2, rel: 1.2 }), 0.03), g0 + 0.2);
  return T.done();
}

// a few metal clinks: the cauldrons rattle on the wobbling tower
function clinks(X) {
  const { A } = X, s = A.make(A.sec(1.4));
  [[0, 1180], [0.17, 1420], [0.31, 980], [0.52, 1310], [0.7, 1100], [0.95, 1250]].forEach(([t, f], k) => A.place(s, A.gain(A.bell(f, 0.5, { bright: 0.9 }), 0.5 - k * 0.05), t, { pan: (k % 2 ? 0.3 : -0.2) }));
  return A.norm(s, -4);
}

export function sfx(X, total) {
  const F = fx(X, total), s = k => X.shot(k).start, c = (p, n = 1) => X.cue(p, n);
  card(X, { droneAt() {} }, F);
  F.add(X.kit('rwhoosh3'), c('Badly.').s - 0.02, -14, { pan: 0.8, panTo: -0.8 }, 'the half-helmet soldier zips past');
  F.add(X.kit('pop1'), s(5) + 3 / 30, -18, { pan: 0.4 }, 'USELESS thought bubble pops');
  F.add(X.rustle(0.5), s(10) + 0.08, -17, { pan: 0.25 }, 'the offer scroll unrolls');
  F.add(clinks(X), c('Just').s + 0.04, -17, { pan: 0.2 }, 'the cauldron tower wobbles');
  F.add(X.kit('thud'), c('no.').s - 0.03, -7, {}, 'NO stamp slams down');
  return { sfx: F.sfx, ev: F.ev };
}
