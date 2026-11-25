// Tiny float audio toolkit for sound design in code (48 kHz stereo). Decoding via ffmpeg.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

export const SR = 48000;
export const FF = process.env.FFMPEG || 'ffmpeg';
export const sec = t => Math.round(t * SR);
export const dbToLin = db => Math.pow(10, db / 20);
export const amax = a => { let m = -Infinity; for (let i = 0; i < a.length; i++) if (a[i] > m) m = a[i]; return m; };
export const linToDb = x => 20 * Math.log10(Math.max(1e-9, x));

// deterministic random numbers, so every render sounds the same
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export const make = n => ({ L: new Float32Array(Math.max(1, n)), R: new Float32Array(Math.max(1, n)) });
export const len = s => s.L.length;
export const dur = s => s.L.length / SR;
export const clone = s => ({ L: s.L.slice(), R: s.R.slice() });

export function load(file) {
  const buf = execFileSync(FF, ['-v', 'error', '-i', file, '-f', 'f32le', '-ac', '2', '-ar', String(SR), '-'], { maxBuffer: 1 << 30 });
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  const f = new Float32Array(ab), n = f.length / 2, s = make(n);
  for (let i = 0; i < n; i++) { s.L[i] = f[2 * i]; s.R[i] = f[2 * i + 1]; }
  return s;
}

export function writeWav(file, s) { // 32-bit float stereo WAV
  const n = len(s), data = Buffer.alloc(n * 8), h = Buffer.alloc(44);
  for (let i = 0; i < n; i++) { data.writeFloatLE(s.L[i], i * 8); data.writeFloatLE(s.R[i], i * 8 + 4); }
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(3, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 8, 28); h.writeUInt16LE(8, 32); h.writeUInt16LE(32, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(file, Buffer.concat([h, data]));
}

export function slice(s, t0, t1) { const a = Math.max(0, sec(t0)), b = Math.min(len(s), sec(t1)); return { L: s.L.slice(a, b), R: s.R.slice(a, b) }; }
export function pad(s, before = 0, after = 0) { const o = make(sec(before) + len(s) + sec(after)); o.L.set(s.L, sec(before)); o.R.set(s.R, sec(before)); return o; }

export function fade(s, fin = 0.003, fout = 0.01, pow = 2) { // in place, curved fades
  const n = len(s), a = Math.min(n, sec(fin)), b = Math.min(n, sec(fout));
  for (let i = 0; i < a; i++) { const g = Math.pow(i / a, pow); s.L[i] *= g; s.R[i] *= g; }
  for (let i = 0; i < b; i++) { const g = Math.pow(i / b, pow), k = n - 1 - i; s.L[k] *= g; s.R[k] *= g; }
  return s;
}
export function gain(s, g) { for (let i = 0; i < len(s); i++) { s.L[i] *= g; s.R[i] *= g; } return s; }
export function peak(s) { let p = 0; for (let i = 0; i < len(s); i++) p = Math.max(p, Math.abs(s.L[i]), Math.abs(s.R[i])); return p; }
export function norm(s, db = 0) { const p = peak(s); return p > 0 ? gain(s, dbToLin(db) / p) : s; }
export function reverse(s) { return { L: s.L.slice().reverse(), R: s.R.slice().reverse() }; }
export function mono(s) { const o = make(len(s)); for (let i = 0; i < len(s); i++) { const m = 0.5 * (s.L[i] + s.R[i]); o.L[i] = m; o.R[i] = m; } return o; }
export function widen(s, amt) { // mid/side width, amt 0 = mono, 1 = unchanged, >1 wider
  const o = make(len(s)); for (let i = 0; i < len(s); i++) { const m = 0.5 * (s.L[i] + s.R[i]), d = 0.5 * (s.L[i] - s.R[i]) * amt; o.L[i] = m + d; o.R[i] = m - d; } return o;
}

// pitch by resampling: ratio > 1 = higher and shorter (tape style)
export function resample(s, ratio) {
  const n = Math.max(1, Math.floor((len(s) - 1) / ratio)), o = make(n);
  for (let i = 0; i < n; i++) { const p = i * ratio, k = Math.floor(p), f = p - k, k2 = Math.min(len(s) - 1, k + 1);
    o.L[i] = s.L[k] * (1 - f) + s.L[k2] * f; o.R[i] = s.R[k] * (1 - f) + s.R[k2] * f; }
  return o;
}
export const semis = st => Math.pow(2, st / 12);

// tape wobble (wow): playback rate 1 + depth*sin(2 pi rate t)
export function wobble(s, cents = 6, rate = 0.55) {
  const d = Math.pow(2, cents / 1200) - 1, n = len(s), o = make(n); let p = 0;
  for (let i = 0; i < n; i++) { const k = Math.floor(p), f = p - k; if (k + 1 >= n) break;
    o.L[i] = s.L[k] * (1 - f) + s.L[k + 1] * f; o.R[i] = s.R[k] * (1 - f) + s.R[k + 1] * f;
    p += 1 + d * Math.sin(2 * Math.PI * rate * i / SR); }
  return o;
}

// RBJ biquads. f may be a number or a function of time (seconds) for sweeps
function coeffs(type, f, q, gdb) {
  f = Math.min(SR * 0.45, Math.max(10, f));
  const w = 2 * Math.PI * f / SR, cs = Math.cos(w), sn = Math.sin(w), a = sn / (2 * q), A = Math.pow(10, gdb / 40);
  let b0, b1, b2, a0, a1, a2;
  if (type === 'lp') { b0 = (1 - cs) / 2; b1 = 1 - cs; b2 = (1 - cs) / 2; a0 = 1 + a; a1 = -2 * cs; a2 = 1 - a; }
  else if (type === 'hp') { b0 = (1 + cs) / 2; b1 = -(1 + cs); b2 = (1 + cs) / 2; a0 = 1 + a; a1 = -2 * cs; a2 = 1 - a; }
  else if (type === 'bp') { b0 = a; b1 = 0; b2 = -a; a0 = 1 + a; a1 = -2 * cs; a2 = 1 - a; }
  else if (type === 'peak') { b0 = 1 + a * A; b1 = -2 * cs; b2 = 1 - a * A; a0 = 1 + a / A; a1 = -2 * cs; a2 = 1 - a / A; }
  else if (type === 'lowshelf' || type === 'highshelf') {
    const sq = 2 * Math.sqrt(A) * a, sgn = type === 'lowshelf' ? 1 : -1;
    b0 = A * ((A + 1) - sgn * (A - 1) * cs + sq); b1 = sgn * 2 * A * ((A - 1) - sgn * (A + 1) * cs); b2 = A * ((A + 1) - sgn * (A - 1) * cs - sq);
    a0 = (A + 1) + sgn * (A - 1) * cs + sq; a1 = -sgn * 2 * ((A - 1) + sgn * (A + 1) * cs); a2 = (A + 1) + sgn * (A - 1) * cs - sq;
  } else throw new Error('filter type ' + type);
  return [b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0];
}
function filtCh(x, type, f, q, gdb) {
  const y = new Float32Array(x.length), dyn = typeof f === 'function';
  let c = dyn ? null : coeffs(type, f, q, gdb), x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    if (dyn && i % 32 === 0) c = coeffs(type, f(i / SR), q, gdb);
    const v = c[0] * x[i] + c[1] * x1 + c[2] * x2 - c[3] * y1 - c[4] * y2;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v;
  }
  return y;
}
export function filt(s, type, f, q = 0.707, gdb = 0) { return { L: filtCh(s.L, type, f, q, gdb), R: filtCh(s.R, type, f, q, gdb) }; }

export function sat(s, drive = 1.5) { const k = Math.tanh(drive); for (let i = 0; i < len(s); i++) { s.L[i] = Math.tanh(drive * s.L[i]) / k; s.R[i] = Math.tanh(drive * s.R[i]) / k; } return s; }

// envelope follower (abs, attack/release in s), on the mono sum
export function envelope(s, att = 0.005, rel = 0.08) {
  const n = len(s), e = new Float32Array(n), ca = Math.exp(-1 / (att * SR)), cr = Math.exp(-1 / (rel * SR)); let v = 0;
  for (let i = 0; i < n; i++) { const x = 0.5 * Math.abs(s.L[i] + s.R[i]); v = x > v ? ca * v + (1 - ca) * x : cr * v + (1 - cr) * x; e[i] = v; }
  return e;
}

// loudness of the active part: power over 10 ms blocks within 25 dB of the loudest block
export function rmsActive(s) {
  const B = sec(0.01), pw = [];
  for (let i = 0; i + B <= len(s); i += B) { let p = 0; for (let k = i; k < i + B; k++) p += 0.5 * (s.L[k] * s.L[k] + s.R[k] * s.R[k]); pw.push(p / B); }
  if (!pw.length) return 1e-9;
  const mx = amax(pw), act = pw.filter(p => p > mx * Math.pow(10, -25 / 10));
  return Math.sqrt(act.reduce((a, b) => a + b, 0) / act.length);
}
export function setLevel(s, ref, relDb) { return gain(s, ref * dbToLin(relDb) / rmsActive(s)); }

// onsets: rises of the envelope above thr * max after at least `gap` s of quiet
export function onsets(s, thr = 0.25, gap = 0.05, quiet = 0.06) {
  const e = envelope(s, 0.0005, 0.03), mx = amax(e), out = []; let quietFor = gap * SR + 1;
  for (let i = 0; i < e.length; i++) {
    if (e[i] < quiet * mx) quietFor++;
    else { if (e[i] > thr * mx && quietFor > gap * SR) out.push(i / SR); if (e[i] > thr * mx) quietFor = 0; }
  }
  return out;
}
// transient onsets: fast envelope jumps (ratio vs 8 ms earlier), at least minDist apart, above floor * max
export function transients(s, { ratio = 3, minDist = 0.08, floor = 0.15 } = {}) {
  const e = envelope(s, 0.0003, 0.01), mx = amax(e), d = sec(0.008), out = []; let last = -1;
  for (let i = d; i < e.length; i++) {
    if (e[i] > floor * mx && e[i] > ratio * e[i - d] && (last < 0 || i - last > minDist * SR)) {
      let k = i; while (k + 1 < e.length && e[k + 1] > e[k]) k++; // walk to the local peak
      out.push({ t: i / SR, peak: e[k] / mx }); last = i;
    }
  }
  return out;
}
// sound regions separated by quiet: envelope above thr * max, gaps shorter than minGap merged, regions shorter than minLen dropped
export function regions(s, { thr = 0.03, minGap = 0.05, minLen = 0.08 } = {}) {
  const e = envelope(s, 0.001, 0.02), mx = amax(e), out = []; let a = -1;
  for (let i = 0; i <= e.length; i++) {
    const on = i < e.length && e[i] > thr * mx;
    if (on && a < 0) a = i;
    if (!on && a >= 0) { out.push([a / SR, i / SR]); a = -1; }
  }
  const merged = [];
  for (const r of out) { const p = merged[merged.length - 1]; if (p && r[0] - p[1] < minGap) p[1] = r[1]; else merged.push(r.slice()); }
  return merged.filter(([x, y]) => y - x >= minLen);
}
export function peakTime(s) { const e = envelope(s, 0.002, 0.05); let k = 0; for (let i = 1; i < e.length; i++) if (e[i] > e[k]) k = i; return k / SR; }

// place a sound on a bus. pan -1..1 (equal power, unity in the centre); panTo sweeps over the sound
export function place(bus, s, t, { g = 1, pan = 0, panTo = null } = {}) {
  const o = sec(t), n = len(s);
  for (let i = 0; i < n; i++) {
    const j = o + i; if (j < 0) continue; if (j >= len(bus)) break;
    const p = panTo === null ? pan : pan + (panTo - pan) * (i / n), a = (p + 1) * Math.PI / 4;
    const gl = Math.cos(a) * Math.SQRT2, gr = Math.sin(a) * Math.SQRT2;
    bus.L[j] += s.L[i] * g * Math.min(1, gl); bus.R[j] += s.R[i] * g * Math.min(1, gr);
    if (gl > 1) bus.L[j] += s.R[i] * g * (gl - 1) * 0.5; if (gr > 1) bus.R[j] += s.L[i] * g * (gr - 1) * 0.5;
  }
  return bus;
}

// ---------- synthesis ----------
export function noise(n, r, color = 'white') {
  const s = make(n); let b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < n; i++) {
    let w = r() * 2 - 1;
    if (color === 'pink') { b0 = 0.99765 * b0 + w * 0.099046; b1 = 0.963 * b1 + w * 0.2965164; b2 = 0.57 * b2 + w * 1.0526913; w = (b0 + b1 + b2 + w * 0.1848) * 0.25; }
    s.L[i] = w; s.R[i] = w;
  }
  return s;
}
export function decorrelatedNoise(n, r, amt = 0.4) { const a = noise(n, r), b = noise(n, r); for (let i = 0; i < n; i++) { const m = a.L[i]; a.L[i] = m + amt * b.L[i]; a.R[i] = m - amt * b.L[i]; } return a; }

// additive bell / glass "ding"; partials slightly inharmonic, stereo detune for width
export function bell(freq, d = 1.2, { bright = 1, detune = 0.00022 } = {}) { // small detune: wide in stereo, no audible beating in mono
  const P = [[1, 1, 0.55], [2.0, 0.42 * bright, 0.32], [3.0, 0.2 * bright, 0.2], [4.17, 0.12 * bright, 0.12], [5.43, 0.06 * bright, 0.08]];
  const n = sec(d), s = make(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR, att = Math.min(1, t / 0.002); let l = 0, r = 0;
    for (const [m, a, tau] of P) { const e = a * Math.exp(-t / (tau * d)); l += e * Math.sin(2 * Math.PI * freq * m * (1 - detune) * t); r += e * Math.sin(2 * Math.PI * freq * m * (1 + detune) * t); }
    s.L[i] = l * att; s.R[i] = r * att;
  }
  return fade(s, 0, 0.05);
}
export const note = n => 440 * Math.pow(2, (n - 69) / 12); // MIDI note -> Hz

// dominant frequency (Hz) of a sound between t0 and t0+win, via a Hann-windowed FFT with parabolic peak refinement
export function dominantFreq(s, t0 = 0, win = 0.25, fmin = 150, fmax = 5000) {
  let N = 1; while (N < sec(win)) N <<= 1;
  const re = new Float64Array(N), im = new Float64Array(N), a = sec(t0);
  for (let i = 0; i < N; i++) { const k = a + i; const x = k < len(s) ? 0.5 * (s.L[k] + s.R[k]) : 0; re[i] = x * (0.5 - 0.5 * Math.cos(2 * Math.PI * i / (N - 1))); }
  for (let i = 1, j = 0; i < N; i++) { let bit = N >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
  for (let size = 2; size <= N; size <<= 1) {
    const ang = -2 * Math.PI / size;
    for (let i = 0; i < N; i += size) for (let k = 0; k < size / 2; k++) {
      const wr = Math.cos(ang * k), wi = Math.sin(ang * k), p = i + k, q = p + size / 2;
      const tr = re[q] * wr - im[q] * wi, ti = re[q] * wi + im[q] * wr;
      re[q] = re[p] - tr; im[q] = im[p] - ti; re[p] += tr; im[p] += ti;
    }
  }
  const mag = k => Math.hypot(re[k], im[k]), lo = Math.floor(fmin * N / SR), hi = Math.min(N / 2 - 1, Math.ceil(fmax * N / SR));
  let b = lo; for (let k = lo; k <= hi; k++) if (mag(k) > mag(b)) b = k;
  const y0 = mag(b - 1), y1 = mag(b), y2 = mag(b + 1), d = 0.5 * (y0 - y2) / (y0 - 2 * y1 + y2 || 1);
  return (b + d) * SR / N;
}
// ratio that moves frequency f to the nearest note of a scale (pitch classes, C = 0)
export function tuneRatio(f, scale = [0, 2, 4, 7, 9]) {
  const m = 69 + 12 * Math.log2(f / 440); let best = null;
  for (let o = -2; o <= 10; o++) for (const pc of scale) { const n = o * 12 + pc; if (best === null || Math.abs(n - m) < Math.abs(best - m)) best = n; }
  return { ratio: Math.pow(2, (best - m) / 12), from: m, to: best };
}

export function mixAll(n, parts) { const o = make(n); for (const [s, t, opt] of parts) place(o, s, t, opt); return o; }
