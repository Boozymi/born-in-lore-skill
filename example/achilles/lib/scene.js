// scene.js – shared tools for the Achilles scenes: timing from the voice, camera, and the text devices
// with the timing measured on Born in Lore (study/animation_timing.md):
//   text pops in 3–4 frames with overshoot and settles in ~6 · arrows draw on in ~10 frames after the word
//   strike line wipes in 3 frames · joke pause 13 frames · chapter card fade 10 / hold 25 / fade 6
(function () {
  const FPS = 30;
  const INK = '#2a1f1b';
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const ease = t => (t = clamp(t), t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOut = t => 1 - Math.pow(1 - clamp(t), 3);
  const win = (f, a, b) => clamp((f - a) / (b - a));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rnd = i => { const a = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return a - Math.floor(a); };

  // ---------- voice timing ----------
  const norm = w => w.toLowerCase().replace(/[^a-z0-9']/g, '');
  // estimate word timings from the script (2.5 words/s incl. pauses) until the real voice exists
  function estimateWords(text, wps = 2.5) {
    const toks = text.trim().split(/\s+/);
    let t = 0;
    const raw = toks.map(w => {
      const d = 0.16 + 0.05 * w.replace(/[^A-Za-z]/g, '').length;
      const s = t; t += d;
      const pause = /[.!?]$/.test(w) ? 0.45 : /[,;:]$/.test(w) ? 0.18 : 0.02;
      const e = t; t += pause;
      return { w, s, e };
    });
    const k = (toks.length / wps) / t;
    return raw.map(o => ({ w: o.w, s: +(o.s * k).toFixed(3), e: +(o.e * k).toFixed(3) }));
  }
  async function loadWords(text, url) {
    if (url) { try { const r = await fetch(url); if (r.ok) return { words: await r.json(), real: true }; } catch (e) { /* fall back */ } }
    return { words: estimateWords(text), real: false };
  }
  // find the n-th occurrence of a phrase; returns {s, e, i} in seconds
  function cue(words, phrase, n = 1) {
    const p = phrase.split(/\s+/).map(norm);
    let hit = 0;
    for (let i = 0; i + p.length <= words.length; i++) {
      if (p.every((x, k) => norm(words[i + k].w) === x) && ++hit === n) return { s: words[i].s, e: words[i + p.length - 1].e, i };
    }
    throw new Error('cue not found: ' + phrase + ' #' + n);
  }

  // ---------- camera ----------
  // keys: [[frame, x, y, zoom], ...] – (x, y) is the point of the 1920x1080 stage that sits in the middle of the frame.
  // v2 (after measuring v1 against Kratos: 44 % static shots vs 19 %): every move is CAM_AMP times bigger than written,
  // linear-ish instead of eased (constant drift, no dead start), plus a slow float so no frame stands completely still.
  const CAM_AMP = 2.4, FLOAT = 7;
  function camera(f, keys) {
    let k0 = keys[0], k1 = keys[keys.length - 1];
    for (let i = 0; i < keys.length - 1; i++) if (f >= keys[i][0] && f <= keys[i + 1][0]) { k0 = keys[i]; k1 = keys[i + 1]; break; }
    const tl = k1[0] === k0[0] ? 1 : clamp((f - k0[0]) / (k1[0] - k0[0]));
    const t = 0.35 * ease(tl) + 0.65 * tl;
    const b = keys[0];
    const amp = (v, i) => b[i] + (v - b[i]) * CAM_AMP;
    const z = amp(lerp(k0[3], k1[3], t), 3);
    // keep the view inside the 1920x1080 stage (no black edges)
    const hx = 960 / z, hy = 540 / z;
    const x = clamp(amp(lerp(k0[1], k1[1], t), 1) + Math.sin(f / 41) * FLOAT, hx, 1920 - hx);
    const y = clamp(amp(lerp(k0[2], k1[2], t), 2) + Math.cos(f / 53) * FLOAT * 0.6, hy, 1080 - hy);
    return `translate(960 540) scale(${z.toFixed(4)}) translate(${(-x).toFixed(2)} ${(-y).toFixed(2)})`;
  }

  // ---------- text devices ----------
  // pop scale: 0 → tiny, frame 3 → 1.12 (overshoot), frame 6 → 0.97, frame 9 → 1
  function popScale(d) {
    if (d < 0) return 0;
    const K = [[0, 0.12], [3, 1.12], [6, 0.97], [9, 1]];
    if (d >= 9) return 1;
    for (let i = 0; i < K.length - 1; i++) if (d <= K[i + 1][0]) {
      const t = (d - K[i][0]) / (K[i + 1][0] - K[i][0]);
      return lerp(K[i][1], K[i + 1][1], i === 0 ? easeOut(t) : ease(t));
    }
    return 1;
  }
  const FONT = `font-family="Segoe UI Black, Arial Black, sans-serif" font-weight="900"`;
  function word(x, y, size, str, o = {}) {
    const fill = o.fill || '#fff', sw = o.sw ?? size * 0.17, anchor = o.anchor || 'middle';
    return `<text x="${x}" y="${y}" ${o.font || FONT} font-size="${size}" text-anchor="${anchor}" fill="${fill}" stroke="${INK}"
      stroke-width="${sw}" stroke-linejoin="round" paint-order="stroke" ${o.extra || ''}>${str}</text>`;
  }
  // a label that pops at frame f0: main text + optional small line under it
  function popLabel(f, f0, x, y, size, str, o = {}) {
    const s = popScale(f - f0);
    if (s <= 0) return '';
    const rot = o.rot || 0;
    const sub = o.sub ? word(x, y + size * 0.62, size * 0.42, o.sub, { font: `font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-style="italic"`, sw: size * 0.09 }) : '';
    return `<g filter="url(#drop)" transform="translate(${x} ${y - size * 0.35}) rotate(${rot}) scale(${s.toFixed(3)}) translate(${-x} ${-(y - size * 0.35)})">
      ${word(x, y, size, str, o)}${sub}</g>`;
  }
  // a hand-drawn arrow that draws itself in 10 frames, head appears at the end
  function arrow(f, f0, d, len, head, o = {}) {
    const t = easeOut(win(f, f0, f0 + 10));
    if (t <= 0) return '';
    const w = o.w || 9, col = o.col || '#fff';
    return `<g filter="url(#drop)"><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"
      stroke-dasharray="${len}" stroke-dashoffset="${(len * (1 - t)).toFixed(1)}"/>
      ${t >= 0.98 ? `<path d="${head}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` : ''}</g>`;
  }
  // red strike line, wipes left to right in 3 frames
  function strike(f, f0, x1, y1, x2, y2, o = {}) {
    const t = easeOut(win(f, f0, f0 + 3));
    if (t <= 0) return '';
    const x = lerp(x1, x2, t), y = lerp(y1, y2, t);
    return `<path d="M${x1},${y1} L${x.toFixed(1)},${y.toFixed(1)}" stroke="${INK}" stroke-width="${(o.w || 12) + 7}" stroke-linecap="round"/>
      <path d="M${x1},${y1} L${x.toFixed(1)},${y.toFixed(1)}" stroke="${o.col || '#e2433a'}" stroke-width="${o.w || 12}" stroke-linecap="round"/>`;
  }
  // a rubber stamp that slams down in 3 frames (big → 1, tiny bounce)
  function stamp(f, f0, x, y, size, str, o = {}) {
    const d = f - f0;
    if (d < 0) return '';
    const s = d < 3 ? lerp(1.9, 0.94, easeOut(d / 3)) : d < 6 ? lerp(0.94, 1, ease((d - 3) / 3)) : 1;
    const col = o.col || '#c8302a', rot = o.rot ?? -9;
    const w = str.length * size * 0.72 + size * 0.9, h = size * 1.45;
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s.toFixed(3)})" opacity="${d < 1 ? 0.6 : 0.92}">
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${size * 0.18}" fill="none" stroke="${col}" stroke-width="${size * 0.14}"/>
      <text x="0" y="${size * 0.36}" ${FONT} font-size="${size}" text-anchor="middle" fill="${col}" letter-spacing="${size * 0.06}">${str}</text></g>`;
  }
  // chapter card: fade in 10, hold 25, fade out 6 (≈ 1.4 s + the black around it)
  function chapterCard(f, f0, num, title) {
    const d = f - f0;
    if (d < 0 || d > 47) return '';
    const a = d < 10 ? d / 10 : d < 35 ? 1 : d < 41 ? 1 - (d - 35) / 6 : 0;
    return `<rect width="1920" height="1080" fill="#07050a"/>
      <g opacity="${a.toFixed(3)}">
        <circle cx="960" cy="400" r="34" fill="#d6a04a" stroke="${INK}" stroke-width="4"/>
        <circle cx="960" cy="400" r="24" fill="none" stroke="#2f7f88" stroke-width="5"/>
        <path d="M944,402 q4,-6 8,0 q4,6 8,0 q4,-6 8,0" fill="none" stroke="#225f67" stroke-width="4" stroke-linecap="round"/>
        <text x="960" y="502" font-family="Constantia, Palatino Linotype, Georgia, serif" font-size="34" font-weight="700" fill="#d9b25c" text-anchor="middle" letter-spacing="14">CHAPTER ${num}</text>
        <text x="960" y="612" font-family="Constantia, Palatino Linotype, Georgia, serif" font-size="96" font-style="italic" fill="#f3e6c8" text-anchor="middle">${title}</text>
      </g>`;
  }

  // ---------- atmosphere ----------
  function motes(f, n = 26, o = {}) {
    let s = '';
    const col = o.col || '#fff', x0 = o.x0 || 0, w = o.w || 1920, y0 = o.y0 || 0, h = o.h || 1080;
    for (let i = 0; i < n; i++) {
      const a = rnd(i + (o.seed || 0)), b = rnd(i * 3.7 + 11 + (o.seed || 0));
      const x = x0 + ((a * w + Math.sin((f + i * 37) / 45) * 18) % w);
      const y = y0 + ((b * h - f * (0.35 + a * 0.6)) % h + h) % h;
      s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.8 + b * 3).toFixed(1)}" fill="${col}" opacity="${(0.15 + a * 0.4).toFixed(2)}"/>`;
    }
    return s;
  }
  // v2 colour grade (v1 measured luma 0.47 / saturation 0.39; Born in Lore 0.23–0.36 / 0.44–0.62):
  // darker mid-tones with warm shadows (blue pushed down more than red), then more saturation. Whites stay white.
  // ?grade=r,g,b,sat overrides it (for tuning against the measurement)
  const qg = new URLSearchParams(location.search).get('grade');
  const GRADE = qg ? Object.fromEntries(['r', 'g', 'b', 'sat'].map((k, i) => [k, +qg.split(',')[i]])) : { r: 1.55, g: 1.68, b: 1.82, sat: 0.95 };   // tuned on 218 sample frames, see measure/COMPARE.md
  function gradeFilter() {
    return `<filter id="grade" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
      <feComponentTransfer><feFuncR type="gamma" amplitude="1" exponent="${GRADE.r}" offset="0"/><feFuncG type="gamma" amplitude="1" exponent="${GRADE.g}" offset="0"/><feFuncB type="gamma" amplitude="1" exponent="${GRADE.b}" offset="0"/></feComponentTransfer>
      <feColorMatrix type="saturate" values="${GRADE.sat}"/></filter>`;
  }
  const DEFS = `<filter id="drop" x="-20%" y="-20%" width="140%" height="170%"><feDropShadow dx="0" dy="6" stdDeviation="3" flood-color="#1c120d" flood-opacity="0.5"/></filter>
    <filter id="soft"><feGaussianBlur stdDeviation="14"/></filter>
    <filter id="blur4"><feGaussianBlur stdDeviation="4"/></filter>
    <radialGradient id="vig" cx="0.5" cy="0.48" r="0.75"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#140b06" stop-opacity="0.55"/></radialGradient>
    ${gradeFilter()}`;
  const vignette = () => `<rect width="1920" height="1080" fill="url(#vig)"/>`;
  // blink: closes 3 frames, opens 3 frames (measured), at the given frames
  function blink(f, at) { for (const s of at) { const d = f - s; if (d >= 0 && d <= 6) return d <= 3 ? d / 3 : (6 - d) / 3; } return 0; }

  window.SCENE = { FPS, INK, clamp, ease, easeOut, win, lerp, rnd, estimateWords, loadWords, cue, camera, popScale, word, popLabel, arrow, strike, stamp, chapterCard, motes, DEFS, vignette, blink };
})();
