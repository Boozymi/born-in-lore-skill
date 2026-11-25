// sfx_synth.mjs – every effect the scores ask for, made in code. sound_piece.mjs uses it for any name that has no WAV file in
// sfx/ (SFX_KIT), so the episode builds and sounds complete without an effects library. Your own files always win.
// Levels and lengths match the effect files the example was mixed with (active RMS per name, peak below -0.3 dBFS),
// so the dB values in tools/score/*.mjs stay right whichever source is used. Same name = same sound on every render.
// Names: whoosh_in, whoosh_air, whoosh_air_short, rwhoosh0–6, rswish0–7, swish0–2, whip, thud, boom, impact_big, ding_land,
//        pop0–2, crash (anything else becomes a short air whoosh).
import * as A from './audio.mjs';

// a noise whoosh: band-pass sweep that follows the loudness bump (it rises in pitch as it comes closer)
function whoosh(d, { f0 = 400, f1 = 2400, q = 1.1, peakAt = 0.5, seed = 1, width = 0.5, shape = 1.6 } = {}) {
  const r = A.rng(seed), n = A.sec(d);
  const bump = x => x < peakAt ? Math.pow(x / peakAt, 2) : Math.pow(Math.max(0, 1 - x) / (1 - peakAt), shape);
  let s = A.decorrelatedNoise(n, r, width);
  s = A.filt(s, 'bp', t => f0 + (f1 - f0) * bump(Math.min(1, t / d)), q);
  s = A.filt(s, 'bp', t => 0.8 * (f0 + (f1 - f0) * bump(Math.min(1, t / d))), q * 0.8);   // second pole: smoother, airier
  for (let i = 0; i < n; i++) { const g = bump(i / n); s.L[i] *= g; s.R[i] *= g; }
  return A.fade(s, 0.004, 0.03);
}
// a pitched body (sine with falling pitch and exponential decay)
function body(d, fA, fB, tauPitch, tauAmp, phase = 0) {
  const n = A.sec(d), s = A.make(n); let ph = phase;
  for (let i = 0; i < n; i++) {
    const t = i / A.SR, f = fB + (fA - fB) * Math.exp(-t / tauPitch);
    ph += 2 * Math.PI * f / A.SR;
    const v = Math.sin(ph) * Math.exp(-t / tauAmp) * Math.min(1, t / 0.0015);
    s.L[i] = v; s.R[i] = v;
  }
  return s;
}
// a decaying noise burst through one filter
function burst(d, seed, type, f, q, tau, att = 0.001) {
  const r = A.rng(seed), n = A.sec(d);
  const s = A.filt(A.decorrelatedNoise(n, r, 0.6), type, f, q);
  for (let i = 0; i < n; i++) { const t = i / A.SR, g = Math.min(1, t / att) * Math.exp(-t / tau); s.L[i] *= g; s.R[i] *= g; }
  return s;
}
const mix = (d, ...parts) => { const o = A.make(A.sec(d)); for (const [s, g = 1, t = 0] of parts) A.place(o, A.gain(s, g), t); return o; };

function make(name) {
  const k = Number((name.match(/(\d+)$/) || [0, 0])[1]);
  const base = name.replace(/\d+$/, '');
  switch (base) {
    case 'whoosh_in': return [whoosh(0.56, { f0: 250, f1: 1900, peakAt: 0.75, seed: 3, shape: 3 }), -16.6];
    case 'whoosh_air': return [whoosh(0.9, { f0: 220, f1: 1300, peakAt: 0.42, seed: 5, q: 0.9 }), -20.5];
    case 'whoosh_air_short': return [whoosh(0.48, { f0: 260, f1: 1500, peakAt: 0.42, seed: 6, q: 0.9 }), -21.5];
    case 'rwhoosh': return [whoosh(0.2 + 0.035 * k, { f0: 380 + 40 * k, f1: 2300 + 150 * k, peakAt: 0.33, seed: 20 + k }), -13];
    case 'rswish': return [whoosh(0.22 + 0.02 * (k % 4), { f0: 1100 + 90 * k, f1: 4800 + 200 * k, q: 1.5, peakAt: 0.3, seed: 40 + k, shape: 2.2 }), -11.8];
    case 'swish': return [whoosh(0.8, { f0: 800 + 120 * k, f1: 3800, q: 1.3, peakAt: 0.2, seed: 60 + k, shape: 2.6 }), -31.4];
    case 'whip': {
      const w = whoosh(0.3, { f0: 1400, f1: 6200, q: 1.8, peakAt: 0.62, seed: 7, shape: 4 });
      return [mix(0.33, [w], [burst(0.05, 8, 'hp', 2500, 0.7, 0.006), 0.9, 0.19]), -15.9];
    }
    case 'thud': return [mix(0.35, [body(0.35, 140, 48, 0.035, 0.085)], [burst(0.04, 9, 'lp', 900, 0.7, 0.008), 0.35]), -20.5];
    case 'boom': {
      const low = A.sat(body(1.35, 75, 33, 0.25, 0.42), 1.4);
      return [mix(1.35, [low], [burst(1.35, 11, 'lp', 160, 0.8, 0.5, 0.004), 0.6]), -11.9];
    }
    case 'impact_big': {
      const hit = A.sat(body(2.2, 130, 38, 0.06, 0.5), 1.6);
      const crack = burst(0.5, 13, 'bp', 900, 0.9, 0.09);
      const tail = burst(2.2, 14, 'lp', 260, 0.7, 0.75, 0.02);
      const pre = whoosh(0.4, { f0: 300, f1: 1600, peakAt: 0.95, seed: 15, shape: 6 });
      return [mix(2.4, [pre, 0.5, 0], [hit, 1, 0.4], [crack, 0.7, 0.4], [tail, 0.55, 0.42]), -13.6];
    }
    case 'ding_land': return [mix(1.3, [A.bell(A.note(84), 1.3, { bright: 0.8 })], [A.bell(A.note(91), 0.9, { bright: 0.6 }), 0.3, 0.01]), -13.1];
    case 'pop': {
      const p = body(0.3, 1150 + 120 * k, 360 + 30 * k, 0.012, 0.035);
      return [mix(0.3, [p], [burst(0.02, 30 + k, 'bp', 2500, 1.2, 0.004), 0.25]), -9.2];
    }
    case 'crash': return [mix(2.2, [burst(2.2, 16, 'hp', 3200, 0.7, 0.55)], [burst(2.2, 17, 'bp', 6500, 1.5, 0.35), 0.6]), -20.9];
    default: return [whoosh(0.48, { f0: 260, f1: 1500, peakAt: 0.42, seed: 99, q: 0.9 }), -21.5];
  }
}

const cache = new Map();
export function synth(name) {
  if (!cache.has(name)) {
    let [s, db] = make(name);
    const lim = A.dbToLin(-0.3);
    // reach the level of the original file: noise sweeps have more peak than the (compressed) library files,
    // so the peaks are rounded off softly instead of turning the whole sound down
    for (let it = 0; it < 3; it++) {
      s = A.setLevel(s, 1, db);
      if (A.peak(s) <= lim) break;
      for (const ch of [s.L, s.R]) for (let i = 0; i < ch.length; i++) ch[i] = lim * Math.tanh(ch[i] / lim);
    }
    const p = A.peak(s);
    if (p > lim) A.gain(s, lim / p);
    cache.set(name, s);
  }
  return A.clone(cache.get(name));
}
