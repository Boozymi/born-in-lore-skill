// sound_piece.mjs – music, effects and mix for the Achilles pieces, all made in code.
// Music: our own score (lyre = Karplus-Strong plucks, string pad, frame drum, Styx drone), freeverb hall.
// Effects: from your effects kit (sfx/, see SKILL.md) if you have one, otherwise made in code (tools/sfx_synth.mjs),
// plus synthesised splash, snip and drips. Born in Lore measured ~12 effects
// per minute (a cartoon is busier than a talking video); every effect sits on something that happens in the picture.
// Mix: music ducked under the voice, two-pass loudnorm to -14 LUFS / -1.5 dBTP. Writes <out>_stems/ (voice, music, sfx).
// Usage (from the episode folder): node tools/sound_piece.mjs <piece> <voice.mp3> <words.json> <cues.json> <out.wav>
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import * as A from './audio.mjs';
import { synth } from './sfx_synth.mjs';

const [piece, voiceF, wordsF, cuesF, outF] = process.argv.slice(2);
const KIT = process.env.SFX_KIT || new URL('../sfx/', import.meta.url).pathname.replace(/^\/(\w:)/, '$1');
const W = JSON.parse(fs.readFileSync(wordsF, 'utf8'));
const CUES = JSON.parse(fs.readFileSync(cuesF, 'utf8'));
const VOFF = CUES.voiceOffset || 0;              // chapter I: the voice starts after the chapter card
const norm = w => w.toLowerCase().replace(/[^a-z0-9']/g, '');
function cue(phrase, n = 1) {
  const p = phrase.split(/\s+/).map(norm); let hit = 0;
  for (let i = 0; i + p.length <= W.length; i++) if (p.every((x, k) => norm(W[i + k].w) === x) && ++hit === n) return { s: W[i].s + VOFF, e: W[i + p.length - 1].e + VOFF };
  throw new Error('cue ' + phrase);
}
const shot = k => CUES.shots[k - 1];            // {start, end} in seconds
const r = A.rng(7);

// ---------- instruments ----------
function pluck(freq, d = 2.2, { bright = 0.55, decay = 0.9965, pan = 0 } = {}) {
  const n = A.sec(d), out = A.make(n);
  for (const [ch, det] of [['L', 0.9985], ['R', 1.0015]]) {
    const N = Math.max(2, Math.round(A.SR / (freq * det)));
    const buf = new Float32Array(N); let lp = 0;
    for (let i = 0; i < N; i++) { lp = lp + bright * ((r() * 2 - 1) - lp); buf[i] = lp; }
    const y = out[ch]; let k = 0;
    for (let i = 0; i < n; i++) { const a = buf[k], b = buf[(k + 1) % N]; const v = decay * 0.5 * (a + b); y[i] = a; buf[k] = v; k = (k + 1) % N; }
  }
  let s = A.filt(out, 'peak', 220, 1.2, 4);
  s = A.filt(s, 'highshelf', 4500, 0.7, -6);
  return A.fade(A.widen(s, 0.6 + pan * 0), 0.002, 0.3);
}
// soft sine "glass" chord for the river of the dead: no harmonics in the voice range, slow shimmer
function glass(freqs, d, { att = 1.5, rel = 1.5 } = {}) {
  const n = A.sec(d + rel), s = A.make(n);
  freqs.forEach((f, k) => {
    for (let i = 0; i < n; i++) {
      const t = i / A.SR, e = Math.min(1, t / att) * (t > d ? Math.max(0, 1 - (t - d) / rel) : 1), sh = 0.75 + 0.25 * Math.sin(2 * Math.PI * (0.21 + k * 0.07) * t + k);
      s.L[i] += Math.sin(2 * Math.PI * f * 0.9993 * t) * e * sh / freqs.length; s.R[i] += Math.sin(2 * Math.PI * f * 1.0007 * t) * e * sh / freqs.length;
    }
  });
  return s;
}
function pad(freqs, d, { att = 0.9, rel = 1.2, cut = 1300, level = 1, hp = 90 } = {}) {
  const n = A.sec(d + rel), s = A.make(n);
  for (const f0 of freqs) for (const [det, ch] of [[-0.006, 'L'], [0.004, 'L'], [0.006, 'R'], [-0.004, 'R'], [0, 'L'], [0, 'R']]) {
    const f = f0 * (1 + det); let ph = r();
    for (let i = 0; i < n; i++) { ph += f / A.SR; ph -= Math.floor(ph); s[ch][i] += (2 * ph - 1) * 0.12; }
  }
  for (let i = 0; i < n; i++) {
    const t = i / A.SR, e = Math.min(1, t / att) * (t > d ? Math.max(0, 1 - (t - d) / rel) : 1);
    s.L[i] *= e * level; s.R[i] *= e * level;
  }
  return A.filt(A.filt(s, 'lp', cut, 0.6), 'hp', hp);
}
function drum(big = 1) {
  const n = A.sec(0.9), s = A.make(n); let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / A.SR, f = 52 + 70 * Math.exp(-t / 0.045);
    ph += f / A.SR; const v = Math.sin(2 * Math.PI * ph) * Math.exp(-t / (0.32 * big));
    s.L[i] = v; s.R[i] = v;
  }
  const hit = A.gain(A.filt(A.noise(A.sec(0.04), r, 'white'), 'bp', 900, 0.8), 0.25);
  A.place(s, A.fade(hit, 0.001, 0.03), 0);
  return A.sat(s, 1.3);
}
function drone(f0, d) {
  const n = A.sec(d), s = A.make(n);
  for (let i = 0; i < n; i++) {
    const t = i / A.SR, trem = 0.85 + 0.15 * Math.sin(2 * Math.PI * 0.18 * t);
    const v = (Math.sin(2 * Math.PI * f0 * t) + 0.45 * Math.sin(2 * Math.PI * f0 * 1.5 * t + 0.4) + 0.2 * Math.sin(2 * Math.PI * f0 * 2.002 * t)) * trem;
    s.L[i] = v * (1 + 0.1 * Math.sin(2 * Math.PI * 0.07 * t)); s.R[i] = v * (1 - 0.1 * Math.sin(2 * Math.PI * 0.07 * t));
  }
  return A.fade(A.filt(s, 'lp', 600), 0.8, 1.2);
}
// freeverb (8 combs + 4 allpasses per channel)
function reverb(s, { room = 0.84, damp = 0.35, wet = 0.3, pre = 0.02 } = {}) {
  const C = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map(x => Math.round(x * A.SR / 44100));
  const AP = [556, 441, 341, 225].map(x => Math.round(x * A.SR / 44100));
  const n = A.len(s) + A.sec(3), o = A.make(n), P = A.sec(pre);
  for (const [ch, spread] of [['L', 0], ['R', 23]]) {
    const x = s[ch], y = o[ch];
    const combs = C.map(d => ({ b: new Float32Array(d + spread), i: 0, f: 0 }));
    const aps = AP.map(d => ({ b: new Float32Array(d + spread), i: 0 }));
    for (let i = 0; i < n; i++) {
      const inp = (i - P >= 0 && i - P < x.length ? x[i - P] : 0) * 0.015;
      let acc = 0;
      for (const c of combs) { const v = c.b[c.i]; c.f = v * (1 - damp) + c.f * damp; c.b[c.i] = inp + c.f * room; c.i = (c.i + 1) % c.b.length; acc += v; }
      for (const a of aps) { const v = a.b[a.i]; const nv = -acc + v; a.b[a.i] = acc + v * 0.5; a.i = (a.i + 1) % a.b.length; acc = nv; }
      y[i] = (i < x.length ? x[i] : 0) * (1 - wet * 0.5) + acc * wet * 3;
    }
  }
  return o;
}
// synthesised effects
function splash() {
  const n = A.sec(1.1), s = A.decorrelatedNoise(n, r, 0.5);
  const f = A.filt(s, 'bp', t => 2600 * Math.exp(-t / 0.25) + 380, 0.9);
  for (let i = 0; i < n; i++) { const t = i / A.SR, e = Math.min(1, t / 0.008) * Math.exp(-t / 0.22); f.L[i] *= e; f.R[i] *= e; }
  for (let k = 0; k < 6; k++) A.place(f, A.gain(bubble(300 + r() * 500), 0.35), 0.15 + r() * 0.6, { pan: r() * 1.2 - 0.6 });
  return A.fade(f, 0.002, 0.2);
}
function bubble(f0) {
  const n = A.sec(0.07), s = A.make(n);
  for (let i = 0; i < n; i++) { const t = i / A.SR, f = f0 * (1 + 2.2 * t / 0.07), v = Math.sin(2 * Math.PI * f * t) * Math.sin(Math.PI * t / 0.07); s.L[i] = v; s.R[i] = v; }
  return s;
}
function plink(f0 = 1400) {
  const n = A.sec(0.12), s = A.make(n);
  for (let i = 0; i < n; i++) { const t = i / A.SR, f = f0 * (1 + 0.6 * t / 0.12), v = Math.sin(2 * Math.PI * f * t) * Math.exp(-t / 0.03); s.L[i] = v; s.R[i] = v; }
  return s;
}
function snip() {
  const one = () => A.fade(A.filt(A.noise(A.sec(0.03), r, 'white'), 'bp', 5200, 2.5), 0.0005, 0.02);
  const s = A.make(A.sec(0.2));
  A.place(s, A.gain(one(), 0.9), 0); A.place(s, A.gain(one(), 0.6), 0.06);
  return A.filt(s, 'peak', 3200, 2, 6);
}
// an effect: your WAV from sfx/ (SFX_KIT) if it is there, otherwise the same effect made in code (tools/sfx_synth.mjs)
const madeInCode = new Set();
const kit = name => {
  const f = path.join(KIT, `${name}.wav`);
  if (fs.existsSync(f)) return A.load(f);
  if (!madeInCode.has(name)) { madeInCode.add(name); console.log(`  effect "${name}": no ${name}.wav in ${KIT} - made in code`); }
  return synth(name);
};

// ---------- the hook ----------
function hookScore(total) {
  const music = A.make(A.sec(total + 3)), dry = A.make(A.sec(total + 3));
  const tBut = cue('But right').s, tBaby = cue('baby,').s;
  const BEAT = 0.75, BAR = 3.0;
  const N = A.note;
  // D dorian: Dm9 · Bbmaj7 · Gm7 · A (sus4 → 3) · Dm
  const chords = [
    { root: 38, tones: [62, 65, 69, 72, 76] }, { root: 34, tones: [58, 62, 65, 69, 74] },
    { root: 43, tones: [62, 67, 70, 74, 77] }, { root: 45, tones: [61, 64, 69, 73, 76] }, { root: 38, tones: [62, 65, 69, 74, 77] },
  ];
  const pattern = [0, 2, 4, 2, 1, 3, 2, 4];
  for (let b = 0; b * BAR < tBut; b++) {
    const ch = chords[b % chords.length], t0 = b * BAR;
    const padLen = Math.min(BAR + 0.1, tBut - t0);
    A.place(dry, pad([N(ch.root + 12), ...ch.tones.slice(0, 3).map(N)], padLen, { att: b === 0 ? 1.2 : 0.4, rel: 0.25, level: 0.4, cut: 1200 }), t0);
    A.place(dry, A.gain(pad([N(ch.root)], padLen, { att: 0.05, rel: 0.2, cut: 260, level: 1.8, hp: 30 }), 1), t0);
    for (let k = 0; k < 8; k++) {
      const t = t0 + k * BEAT / 2;
      if (t > tBut - 0.1 || (b === 0 && k < 2)) continue;
      A.place(dry, A.gain(pluck(N(ch.tones[pattern[k]] + (k > 4 ? 0 : 0)), 1.6, { bright: 0.5 }), 0.32 * (k % 2 ? 0.75 : 1)), t, { pan: (k % 4) / 3 * 0.6 - 0.3 });
    }
    if (b > 0 || true) A.place(dry, A.gain(drum(b === 2 ? 1.4 : 1), 0.55), t0);
    if (b % 2 === 1) A.place(dry, A.gain(drum(0.6), 0.25), t0 + BEAT * 3.5);
  }
  // Styx: a short silence after the cut, then the drone, a glassy pad, one soft lyre note on "baby"
  const styx0 = tBut + 0.18;
  A.place(dry, A.gain(drone(N(38), total - styx0 + 2), 0.16), styx0);
  A.place(dry, A.gain(glass([N(86), N(93), N(100)], total - styx0 + 0.5), 0.05), styx0);
  A.place(dry, A.gain(pluck(N(74), 2.6, { bright: 0.35, decay: 0.998 }), 0.3), tBaby + 0.05, { pan: 0.2 });
  for (const [dt, nn] of [[1.2, 86], [3.1, 93], [5.0, 88]]) A.place(dry, A.gain(A.bell(N(nn), 1.6, { bright: 0.6 }), 0.035), styx0 + dt, { pan: nn % 2 ? 0.5 : -0.5 });
  // hard stop of the montage music at the cut (the turn to the baby)
  const cut = A.sec(tBut - 0.04);
  for (let i = cut; i < A.sec(styx0); i++) { const g = Math.max(0, 1 - (i - cut) / A.sec(0.03)); dry.L[i] *= g; dry.R[i] *= g; }
  const wet = reverb(dry, { room: 0.86, damp: 0.4, wet: 0.32 });
  A.place(music, wet, 0);
  return music;
}

function hookSfx(total) {
  const sfx = A.make(A.sec(total + 2)), ev = [];
  const add = (s, t, db, opt = {}, what = '') => { A.place(sfx, A.gain(s, A.dbToLin(db)), t, opt); ev.push([t, what, db]); };
  add(kit('thud'), shot(2).start + 0.06, -9, { pan: 0.3 }, 'lion lands / is dragged');
  add(kit('impact_big'), shot(3).start + 0.3, -12, { pan: -0.4 }, 'Cycnus hits the sand');
  add(kit('whoosh_air'), shot(4).start - 0.35, -14, { pan: -0.3, panTo: 0.3 }, 'whoosh into Troy');
  add(snip(), shot(7).end - 0.22, -10, { pan: 0.25 }, 'the shears snip');
  add(splash(), shot(10).start + 0.36, -9, {}, 'dipped into the Styx');
  for (const [dt, f] of [[0.55, 1500], [1.5, 1750]]) add(plink(f), shot(11).start + dt, -24, { pan: (f - 1600) / 600 }, 'drip');
  add(kit('thud'), cue('screaming').s + 0.2, -13, {}, 'LOUD pops');
  return { sfx, ev };
}

// ---------- chapter I "Pyrrha" ----------
function hornCall(d = 1.7) {
  // a distant war horn: stacked saws, filter opens, slight vibrato, then band-limited (far away)
  const n = A.sec(d), s = A.make(n);
  for (const [f0, a] of [[220, 1], [330, 0.5], [110, 0.6]]) {
    let ph = r();
    for (let i = 0; i < n; i++) { const t = i / A.SR, f = f0 * (1 + 0.006 * Math.sin(2 * Math.PI * 5.2 * t)) * (t < 0.12 ? 0.94 + 0.06 * t / 0.12 : 1);
      ph += f / A.SR; ph -= Math.floor(ph); const v = (2 * ph - 1) * a; s.L[i] += v; s.R[i] += v; }
  }
  let o = A.filt(s, 'lp', t => 300 + 2200 * Math.min(1, t / 0.35), 0.9);
  o = A.filt(A.filt(o, 'hp', 160), 'peak', 900, 1, 4);
  for (let i = 0; i < n; i++) { const t = i / A.SR, e = Math.min(1, t / 0.08) * Math.min(1, (d - t) / 0.4); o.L[i] *= e; o.R[i] *= e; }
  return A.norm(o, -3);
}
function rustle(d = 0.45) {
  const n = A.sec(d), s = A.filt(A.decorrelatedNoise(n, r, 0.6), 'bp', 3200, 0.7);
  for (let i = 0; i < n; i++) { const t = i / A.SR, crackle = 0.4 + 0.6 * Math.abs(Math.sin(i * 0.0021 + Math.sin(i * 0.00037) * 6)), e = Math.min(1, t / 0.02) * Math.max(0, 1 - t / d); s.L[i] *= e * crackle; s.R[i] *= e * crackle; }
  return A.norm(s, -6);
}
function ch1Score(total) {
  const music = A.make(A.sec(total + 3)), dry = A.make(A.sec(total + 3));
  const N = A.note, B = 0.75;
  const arp = (tones, t0, t1, step, g, o = {}) => {
    let k = 0;
    for (let t = t0; t < t1 - 0.05; t += step, k++) A.place(dry, A.gain(pluck(N(tones[(o.pat || [0, 1, 2, 1])[k % (o.pat || [0, 1, 2, 1]).length]]), o.len || 1.4, { bright: o.bright || 0.5, decay: o.decay || 0.9965 }), g * (k % 2 ? 0.8 : 1)), t, { pan: ((k % 3) - 1) * 0.35 });
  };
  const padAt = (notes, t0, t1, o = {}) => A.place(dry, pad(notes.map(N), Math.max(0.2, t1 - t0), { att: o.att || 0.5, rel: o.rel || 0.4, level: o.level || 0.35, cut: o.cut || 1200 }), t0);
  const bass = (root, t0, t1, g = 1) => A.place(dry, A.gain(pad([N(root)], Math.max(0.2, t1 - t0), { att: 0.04, rel: 0.25, cut: 260, level: 1.6, hp: 30 }), g), t0);
  const S1 = shot(1).start, S2 = shot(2).start, S9 = shot(9).start, S10 = shot(10).start, S11 = shot(11).start, S12 = shot(12).start, S15 = shot(15).start, S16 = shot(16).start, S17 = shot(17).start;
  const blows = cue('blows.').s, great = cue('not going great').s, end = cue('war.').e;
  // card: a low swell under the title
  A.place(dry, A.gain(drone(N(38), 1.8), 0.12), 0.1);
  // A · the seer: drone + slow, low, ominous plucks
  A.place(dry, A.gain(drone(N(38), S2 - S1 + 0.6), 0.16), S1);
  arp([50, 53, 57, 56], S1 + 0.3, S2, B, 0.3, { pat: [0, 1, 2, 3], decay: 0.997, bright: 0.4, len: 1.8 });
  // B · comedy on Skyros: light staccato plucks over a Dorian vamp (Dm – G), bouncy bass, a falling run on "not going great"
  const ch = [{ root: 38, t: [62, 65, 69, 74] }, { root: 43, t: [62, 67, 71, 74] }];
  for (let b = 0, t0 = S2; t0 < S9 - 0.05; b++, t0 += 4 * B) {
    const c = ch[b % 2], t1 = Math.min(S9 - 0.05, t0 + 4 * B);
    arp(c.t, t0, t1, B / 2, 0.24, { pat: [0, 2, 1, 3, 2, 1, 3, 2], decay: 0.99, bright: 0.7, len: 0.6 });
    for (let k = 0; k < 4 && t0 + k * B < t1; k++) A.place(dry, A.gain(pluck(N(c.root + (k % 2 ? 7 : 0)), 0.5, { decay: 0.985, bright: 0.6 }), 0.5), t0 + k * B);
    padAt([c.root + 12, c.t[0], c.t[2]], t0, t1, { level: 0.18 });
  }
  [81, 77, 74, 69, 65, 62].forEach((nn, k) => A.place(dry, A.gain(pluck(N(nn), 0.5, { decay: 0.99, bright: 0.7 }), 0.3), great + 0.12 + k * 0.07));
  // C · silence for the war horn (an effect), D · the run: fast scurrying plucks
  arp([74, 76, 77, 79, 81, 79, 77, 76], S10, S11 - 0.05, B / 4, 0.18, { pat: [0, 1, 2, 3, 4, 5, 6, 7], decay: 0.988, bright: 0.75, len: 0.4 });
  // E · the spear: a bright D-major stab + drum
  A.place(dry, A.gain(drum(1.3), 0.6), S11 + 0.05);
  padAt([50, 62, 66, 69, 74], S11 + 0.05, S12, { att: 0.05, level: 0.4, cut: 1800 });
  [62, 66, 69, 74, 78].forEach((nn, k) => A.place(dry, A.gain(pluck(N(nn), 1.6, { bright: 0.6 }), 0.32), S11 + 0.05 + k * 0.04));
  // F · night on the beach: slow, warm, no jokes; the "short life" turns golden (Bbmaj7)
  padAt([50, 62, 65, 69, 76], S12, S15, { att: 1.2, level: 0.32 }); bass(38, S12, S15, 0.8);
  arp([62, 65, 69, 72, 76], S12 + 0.4, S15, B, 0.22, { pat: [0, 1, 2, 3, 4, 3, 2, 1], decay: 0.997, len: 2 });
  padAt([46, 58, 62, 65, 69], S15, S16 + 0.3, { att: 0.6, level: 0.36, cut: 1600 }); bass(34, S15, S16 + 0.3, 0.8);
  arp([58, 62, 65, 69, 74], S15 + 0.2, S16, B / 2, 0.22, { pat: [0, 2, 4, 2, 1, 3, 4, 3], decay: 0.996, len: 1.6 });
  padAt([45, 57, 61, 64, 69], S16, S17, { att: 0.3, level: 0.3 }); bass(33, S16, S17, 0.8);
  // G · "Congratulations, Pyrrha. You're going to war." – full, heroic, a final hit on "war"
  padAt([50, 62, 66, 69, 74, 78], S17, end + 0.4, { att: 0.4, level: 0.42, cut: 2000 }); bass(38, S17, end + 0.4, 1);
  arp([62, 66, 69, 74, 78], S17, end, B / 2, 0.28, { pat: [0, 1, 2, 3, 4, 3, 2, 1], bright: 0.6 });
  for (let t = S17; t < end - 0.1; t += 2 * B) A.place(dry, A.gain(drum(1), 0.45), t);
  A.place(dry, A.gain(drum(1.6), 0.75), end - 0.02);
  padAt([38, 50, 62, 66, 69, 74], end - 0.02, total - 0.3, { att: 0.02, rel: 1.2, level: 0.5, cut: 2200 });
  const wet = reverb(dry, { room: 0.86, damp: 0.4, wet: 0.3 });
  A.place(music, wet, 0);
  return music;
}
function ch1Sfx(total) {
  const sfx = A.make(A.sec(total + 2)), ev = [];
  const add = (s, t, db, opt = {}, what = '') => { A.place(sfx, A.gain(s, A.dbToLin(db)), t, opt); ev.push([t, what, db]); };
  add(kit('whoosh_in'), 0.05, -14, {}, 'chapter card whoosh');
  add(kit('boom'), 0.4, -18, {}, 'chapter card boom');
  add(splash(), shot(2).start + 0.15, -14, { pan: -0.4 }, 'Thetis rises from the sea');
  add(kit('whip'), cue('hides').s - 0.05, -12, { pan: -0.2, panTo: 0.8 }, 'whisked away');
  const pop = cue('Pyrrha.').s + 2 / 30, hit = pop - 16 / 30;
  add(kit('swish1'), hit, -15, { pan: -0.3, panTo: 0.2 }, 'strike through ACHILLES');
  add(kit('thud'), pop, -14, { pan: -0.3 }, 'PYRRHA pops');
  add(kit('thud'), cue('not going great').s + 6 / 30, -9, { pan: -0.2 }, 'falls flat');
  add(hornCall(), cue('blows.').s - 0.25, -9, { pan: 0.35 }, 'war horn outside');
  add(kit('rwhoosh2'), shot(10).start + 0.2, -15, { pan: 0.4, panTo: -0.8 }, 'everyone runs');
  add(kit('ding_land'), shot(11).start + 0.33, -20, { pan: 0.3 }, 'spear shine');
  add(rustle(), shot(13).start + 0.1, -16, { pan: -0.4 }, 'scroll unrolls');
  add(rustle(), shot(13).start + 0.18, -16, { pan: 0.4 }, 'scroll unrolls');
  add(kit('thud'), cue('fast.').s, -8, { pan: 0.3 }, 'CHOSEN stamp');
  return { sfx, ev };
}

// ---------- mix ----------
const voiceRaw = A.load(voiceF);
const voice = VOFF ? A.pad(voiceRaw, VOFF, 0) : voiceRaw;
const total = Math.max(A.dur(voice), shot(CUES.shots.length).end) + 0.3;
// the other pieces (prologue, ch2 … ch9) have their own score file: tools/score/<piece>.mjs exporting score(X, total) → music
// and sfx(X, total) → { sfx, ev }. X hands them this file's instruments, the word/shot clock and the audio toolkit.
let music, sfx, ev;
if (piece === 'ch1') { music = ch1Score(total); ({ sfx, ev } = ch1Sfx(total)); }
else if (piece === 'hook') { music = hookScore(total); ({ sfx, ev } = hookSfx(total)); }
else {
  const mod = await import(new URL(`./score/${piece}.mjs`, import.meta.url).href);
  const X = { A, N: A.note, r, cue, shot, CUES, W, VOFF, kit, pluck, glass, pad, drum, drone, reverb, splash, bubble, plink, snip, hornCall, rustle };
  music = mod.score(X, total);
  ({ sfx, ev } = mod.sfx(X, total));
}
const n = A.sec(total + 1.5);
const vb = A.make(n); A.place(vb, voice, 0);
// levels: a cartoon score is more present than a voice-over bed: ~13 dB under the voice, 5 dB more while he speaks
const vRef = A.rmsActive(voice);
A.setLevel(music, vRef, -11);
const env = A.envelope(vb, 0.02, 0.35), em = A.amax(env);
for (let i = 0; i < A.len(music) && i < n; i++) { const g = A.dbToLin(-5 * Math.min(1, env[i] / (0.25 * em))); music.L[i] *= g; music.R[i] *= g; }
A.gain(sfx, vRef / 0.12);
const mix = A.make(n);
A.place(mix, vb, 0); A.place(mix, music, 0); A.place(mix, sfx, 0);
const stems = outF.replace(/\.wav$/, '_stems');
fs.mkdirSync(stems, { recursive: true });
A.writeWav(path.join(stems, 'voice.wav'), vb); A.writeWav(path.join(stems, 'music.wav'), music); A.writeWav(path.join(stems, 'sfx.wav'), sfx);
const pre = path.join(stems, 'mix_pre.wav'); A.writeWav(pre, mix);
const log = spawnSync(A.FF, ['-hide_banner', '-i', pre, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
const meas = JSON.parse(log.slice(log.lastIndexOf('{'), log.lastIndexOf('}') + 1));
spawnSync(A.FF, ['-v', 'error', '-y', '-i', pre, '-af',
  `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${meas.input_i}:measured_TP=${meas.input_tp}:measured_LRA=${meas.input_lra}:measured_thresh=${meas.input_thresh}:offset=${meas.target_offset}:linear=true`,
  '-ar', '48000', '-c:a', 'pcm_s24le', outF]);
fs.writeFileSync(path.join(stems, 'timeline.md'), `# ${piece} – sound timeline\n\n| t (s) | effect | level dB |\n|---|---|---|\n` + ev.map(([t, w, db]) => `| ${t.toFixed(2)} | ${w} | ${db} |`).join('\n') + '\n');
console.log(`mix ${total.toFixed(2)} s, ${ev.length} effects (${(ev.length / total * 60).toFixed(1)} per minute), input ${meas.input_i} LUFS -> ${outF}`);
