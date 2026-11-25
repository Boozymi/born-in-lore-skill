// sets.js – the places of "What If You Were Born as Achilles?", shared by every scene (load after cast.js and scene.js).
// Our own designs in the measured Born-in-Lore look (STYLE_BIBLE.md §3): flat vector, thin dark-brown
// outline, warm parchment walls with a meander border, dusk skies, night with moon and fire, silhouettes against bright light.
// Every set draws the full 1920x1080 stage and moves a little by itself (f = frame): water, smoke, motes, flames, stars.
// SETS.defs() returns every gradient and filter the sets use – put it once into each frame's <defs>.
(function () {
  const S = window.SCENE, K = window.CAST, C = K.C, INK = K.INK;
  const { motes, rnd, lerp, clamp } = S;
  const n = v => Math.round(v * 10) / 10;

  // ---------- defs ----------
  const grad = (id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
  const radial = (id, stops, cx = 0.5, cy = 0.5, r = 0.7) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a !== undefined ? ` stop-opacity="${a}"` : ''}/>`).join('')}</radialGradient>`;
  function defs() {
    return [
      grad('dusk', [[0, '#2d2c3b'], [0.45, '#5f596f'], [0.62, '#b8705a'], [0.7, '#f0a060']]),
      grad('day', [[0, '#8cc6e6'], [1, '#e2f2ef']]),
      grad('beach', [[0, '#7cb9de'], [0.5, '#cfe9f2'], [1, '#cfe9f2']]),
      grad('troy', [[0, '#231a33'], [0.35, '#6b3a5e'], [0.55, '#d6705a'], [0.7, '#f4a755']]),
      grad('warm', [[0, '#f1b27a'], [1, '#f8d6a6']]),
      grad('plum', [[0, '#120c19'], [1, '#2a1c33']]),
      grad('styxs', [[0, '#050b0e'], [1, '#0f2a31']]),
      grad('styxw', [[0, '#0d2b33'], [1, '#040b0e']]),
      grad('moonsky', [[0, '#1d1a3c'], [0.7, '#4a4378'], [1, '#6b6296']]),
      grad('night', [[0, '#070b18'], [0.6, '#16213d'], [1, '#22304f']]),
      grad('dawn', [[0, '#6f86b8'], [0.45, '#e8a7a0'], [0.6, '#f6c890']]),
      grad('violet', [[0, '#3a2a63'], [0.6, '#8a5aa6'], [1, '#e6a0b8']]),
      grad('tent', [[0, '#2a1a26'], [1, '#4a2d33']]),
      grad('hall', [[0, '#dcc092'], [1, '#bf9a68']]),
      grad('hallPhthia', [[0, '#d9a77e'], [1, '#b4805a']]),
      grad('hallNight', [[0, '#2b2a45'], [1, '#3e3550']]),
      grad('canvas', [[0, '#c9a77a'], [1, '#9c7a52']]),
      grad('canvasNight', [[0, '#5a3f36'], [1, '#3a2724']]),
      grad('olympus', [[0, '#f6d38a'], [0.6, '#f9e8c4'], [1, '#fff6e2']]),
      grad('forge', [[0, '#1a0f0c'], [1, '#3a1d12']]),
      grad('under', [[0, '#2c2838'], [0.55, '#5b5570'], [1, '#8a83a0']]),
      grad('battle', [[0, '#5a4a52'], [0.5, '#b8806a'], [1, '#e3b07c']]),
      grad('fireNight', [[0, '#120a14'], [0.55, '#3a1a1e'], [1, '#8a3a1e']]),
      grad('sepia', [[0, '#e9cf9c'], [1, '#c9a26a']]),
      grad('wood', [[0, '#3b2619'], [1, '#22150e']]),
      grad('parch', [[0, '#f1e2bf'], [1, '#e0c995']]),
      grad('mountain', [[0, '#8f8aa8'], [1, '#6c6a86']]),
      grad('grass', [[0, '#8fa556'], [1, '#6e8440']]),
      radial('heroic', [[0, '#ffd27a'], [0.45, '#e2683a'], [1, '#7a1f24']], 0.5, 0.52, 0.75),
      radial('burst', [[0, '#fff3c4'], [0.35, '#f6c453'], [1, '#e0702e']], 0.5, 0.45, 0.7),
      radial('gold', [[0, '#fff1c2'], [0.5, '#f0b94e'], [1, '#9a5a1e']], 0.5, 0.5, 0.75),
      radial('cool', [[0, '#cfe3ee'], [0.5, '#6f97b8'], [1, '#263a5a']], 0.5, 0.5, 0.75),
      radial('hallshade', [[0.35, '#2a1608', 0], [1, '#2a1608', 0.45]], 0.5, 0.4, 0.8),
      radial('spot', [[0.34, '#000', 0], [0.62, '#0b0710', 0.78], [1, '#0b0710', 0.9]], 0.5, 0.52, 0.42),
      radial('lamp', [[0, '#ffe2a0', 0.9], [0.4, '#ffb85c', 0.35], [1, '#ff9a40', 0]], 0.5, 0.5, 0.5),
      radial('glowRed', [[0, '#ff6a3a', 0.7], [1, '#ff6a3a', 0]], 0.5, 0.5, 0.5),
      // silhouettes: dark (against a bright sky) and warm (against fire)
      `<filter id="sil"><feColorMatrix type="matrix" values="0 0 0 0 0.09  0 0 0 0 0.06  0 0 0 0 0.10  0 0 0 1 0"/></filter>`,
      `<filter id="silBlue"><feColorMatrix type="matrix" values="0 0 0 0 0.16  0 0 0 0 0.20  0 0 0 0 0.28  0 0 0 1 0"/></filter>`,
      `<filter id="silRed"><feColorMatrix type="matrix" values="0 0 0 0 0.18  0 0 0 0 0.05  0 0 0 0 0.06  0 0 0 1 0"/></filter>`,
      // flashbacks: warm sepia; freeze frame: grey
      `<filter id="sepiaF" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.39 0.77 0.19 0 0.02  0.35 0.69 0.17 0 0  0.27 0.53 0.13 0 -0.02  0 0 0 1 0"/></filter>`,
      `<filter id="greyF" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0.12"/><feComponentTransfer><feFuncR type="linear" slope="0.8"/><feFuncG type="linear" slope="0.8"/><feFuncB type="linear" slope="0.85"/></feComponentTransfer></filter>`,
      // the land of the dead: grey-lilac, a little see-through
      `<filter id="ghost" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.25 0.45 0.1 0 0.12  0.22 0.42 0.1 0 0.1  0.28 0.45 0.14 0 0.18  0 0 0 0.86 0"/></filter>`,
      `<filter id="glowF" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`,
    ].join('\n');
  }

  // ---------- small pieces ----------
  const sky = id => `<rect x="-200" y="-200" width="2320" height="1480" fill="url(#${id})"/>`;
  const sun = (x, y, r, col = '#ffd28a', halo = '#ffb060') => `<circle cx="${x}" cy="${y}" r="${r * 1.75}" fill="${halo}" opacity="0.2"/><circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/>`;
  const moon = (x, y, r = 70) => `<circle cx="${x}" cy="${y}" r="${r * 2.1}" fill="#f4ecd0" opacity="0.1"/><circle cx="${x}" cy="${y}" r="${r}" fill="#f4ecd0"/>
    <circle cx="${x - r * 0.3}" cy="${y - r * 0.2}" r="${r * 0.17}" fill="#e3d9b8"/><circle cx="${x + r * 0.3}" cy="${y + r * 0.3}" r="${r * 0.12}" fill="#e3d9b8"/>`;
  function stars(f, k = 40, h = 460, seed = 90) {
    let s = '';
    for (let i = 0; i < k; i++) { const a = rnd(i + seed), b = rnd(i * 2.3 + seed + 7); s += `<circle cx="${(a * 1920).toFixed(0)}" cy="${(b * h).toFixed(0)}" r="${(1.5 + a * 2.5).toFixed(1)}" fill="#fff" opacity="${(0.4 + 0.5 * Math.abs(Math.sin(f / 20 + i))).toFixed(2)}"/>`; }
    return s;
  }
  function seaBand(y, h, col, streak, f, seed = 0) {
    let s = `<rect x="-400" y="${y}" width="2720" height="${h}" fill="${col}"/>`;
    for (let i = 0; i < 22; i++) {
      const a = rnd(i + seed), b = rnd(i * 5.1 + seed);
      const x = -200 + ((a * 2400 + f * (0.4 + b * 0.5)) % 2400), yy = y + 10 + b * (h - 20);
      s += `<path d="M${x.toFixed(0)},${yy.toFixed(0)} l${(40 + a * 90).toFixed(0)},0" stroke="${streak}" stroke-width="${(2 + b * 3).toFixed(1)}" stroke-linecap="round" opacity="${(0.25 + a * 0.4).toFixed(2)}"/>`;
    }
    return s;
  }
  function meander(y, h, col, bg) {
    let s = `<rect x="-200" y="${y}" width="2320" height="${h}" fill="${bg}"/>`;
    const k = h * 0.62, top = y + (h - k) / 2, a = k * 0.18;
    for (let x = -200; x < 2120; x += k * 1.25) s += `<path d="M${n(x)},${n(top + k)} L${n(x)},${n(top)} L${n(x + k)},${n(top)} L${n(x + k)},${n(top + k - a)} L${n(x + a * 1.6)},${n(top + k - a)} L${n(x + a * 1.6)},${n(top + a * 1.6)} L${n(x + k - a * 1.6)},${n(top + a * 1.6)}" fill="none" stroke="${col}" stroke-width="${n(a * 0.9)}"/><path d="M${n(x)},${n(top + k)} L${n(x + k * 1.25)},${n(top + k)}" stroke="${col}" stroke-width="${n(a * 0.9)}"/>`;
    return s;
  }
  function column(x, y0, y1, o = {}) {
    const c = o.col || '#e2d2b0', cs = o.colS || '#c4b08a', cap = o.cap || '#dcc89e';
    let s = `<rect x="${x - 46}" y="${y0}" width="92" height="${y1 - y0}" fill="${c}" stroke="${INK}" stroke-width="5"/>`;
    for (const dx of [-24, 0, 24]) s += `<path d="M${x + dx},${y0 + 30} L${x + dx},${y1 - 30}" stroke="${cs}" stroke-width="6"/>`;
    s += `<rect x="${x - 64}" y="${y0 - 26}" width="128" height="30" rx="6" fill="${cap}" stroke="${INK}" stroke-width="5"/><rect x="${x - 60}" y="${y1 - 6}" width="120" height="26" fill="${cap}" stroke="${INK}" stroke-width="5"/>`;
    return s;
  }
  function pines(x, y, s, col = '#4f7a46', colS = '#355a31') {
    return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-8" y="-40" width="16" height="44" fill="#4b3424" stroke="${INK}" stroke-width="4"/>
      <path d="M0,-260 L70,-130 L40,-130 L90,-40 L-90,-40 L-40,-130 L-70,-130 Z" fill="${col}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M0,-260 L-70,-130 L-40,-130 L-90,-40 L-20,-40 L-10,-140 Z" fill="${colS}" opacity="0.55"/></g>`;
  }
  function cypress(x, y, s, col = '#3f5f3a') {
    return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0,-300 Q40,-200 34,-60 Q30,0 0,0 Q-30,0 -34,-60 Q-40,-200 0,-300 Z" fill="${col}" stroke="${INK}" stroke-width="4"/><path d="M0,-280 Q-20,-180 -16,-40" fill="none" stroke="#2c4529" stroke-width="5" stroke-linecap="round"/></g>`;
  }
  function cloud(x, y, s, col = '#fde3c2', f = 0, speed = 0.25, op = 0.85) {
    return `<g transform="translate(${(x + f * speed).toFixed(1)} ${y}) scale(${s})" opacity="${op}"><ellipse cx="0" cy="0" rx="120" ry="34" fill="${col}"/><ellipse cx="-50" cy="-22" rx="60" ry="36" fill="${col}"/><ellipse cx="40" cy="-28" rx="70" ry="42" fill="${col}"/></g>`;
  }
  function rays(f, cx, cy, k, col, o = 0.25, spin = 0.004) {
    let s = '';
    for (let i = 0; i < k; i++) { const a0 = (i / k) * Math.PI * 2 + f * spin, a1 = a0 + Math.PI / k;
      s += `<path d="M${cx},${cy} L${(cx + Math.cos(a0) * 2600).toFixed(0)},${(cy + Math.sin(a0) * 2600).toFixed(0)} L${(cx + Math.cos(a1) * 2600).toFixed(0)},${(cy + Math.sin(a1) * 2600).toFixed(0)} Z" fill="${col}" opacity="${o}"/>`; }
    return s;
  }
  // a gag backdrop: gradient + rays + motes (violet = name gags, heroic = big moments, burst = shouts, gold = rewards)
  const gagBg = (f, id = 'violet', ray = '#fbe3ff', cx = 960, cy = 1000) => `${sky(id)}${rays(f, cx, cy, 22, ray, 0.16)}${motes(f, 20, { col: '#fff', seed: 23 })}`;
  const shadow = (x, y, w, op = 0.2) => `<ellipse cx="${x}" cy="${y + 6}" rx="${w}" ry="${Math.max(8, w * 0.12)}" fill="#000" opacity="${op}"/>`;
  function smoke(f, x, y, s = 1, col = '#5b4b52', seed = 0, op = 0.5) {
    let g = '';
    for (let i = 0; i < 7; i++) { const t = ((f * 0.008 + i / 7 + rnd(seed + i) * 0.1) % 1); g += `<circle cx="${(x + Math.sin(t * 6 + i) * 30 * s + t * 80 * s).toFixed(0)}" cy="${(y - t * 520 * s).toFixed(0)}" r="${((40 + 90 * t) * s).toFixed(0)}" fill="${col}" opacity="${(op * (1 - t)).toFixed(2)}"/>`; }
    return g;
  }
  function flame(f, x, y, s = 1, seed = 0) {
    const w = k => Math.sin(f / (2.3 + k * 0.4) + seed + k) * 10;
    return `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-60" r="120" fill="url(#lamp)"/>
      <path d="M-50,0 Q-62,-70 -20,-${110 + w(0)} Q-10,-60 0,-${140 + w(1) * 1.4} Q20,-70 30,-${100 + w(2)} Q62,-50 50,0 Z" fill="#f08a3c" stroke="${INK}" stroke-width="4"/>
      <path d="M-24,0 Q-24,-50 0,-${80 + w(3) * 0.8} Q24,-50 24,0 Z" fill="#ffd36b"/></g>`;
  }

  // ---------- ships, scrolls, vases (from chapter I) ----------
  function ship(x, y, s, o = {}) {
    const hull = o.hull || '#5a3a26', hullS = '#3f281a';
    let g = `<g transform="translate(${x} ${y}) scale(${s})">`;
    if (o.mast !== false) {
      g += `<rect x="-6" y="-520" width="14" height="440" fill="${C.wood}" stroke="${INK}" stroke-width="5"/>`;
      g += `<path d="M-230,-470 Q0,-500 230,-470 L220,-230 Q0,-250 -220,-230 Z" fill="${o.sail || '#efe2c4'}" stroke="${INK}" stroke-width="5"/>`;
      if (o.emblem) g += `<path d="M-70,-360 q17,-20 35,0 q17,20 35,0 q17,-20 35,0 q17,20 35,0" fill="none" stroke="${C.teal}" stroke-width="12" stroke-linecap="round"/>`;
    }
    g += `<path d="M-420,-80 Q-200,-40 0,-40 Q240,-40 400,-110 Q430,-150 410,-200 Q440,-170 450,-120 Q380,40 0,40 Q-300,40 -440,-40 Q-470,-90 -500,-130 Q-450,-110 -420,-80 Z" fill="${hull}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-400,-50 Q0,0 380,-80" fill="none" stroke="${C.bronze}" stroke-width="8"/>`;
    g += `<ellipse cx="330" cy="-60" rx="20" ry="12" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="334" cy="-60" r="7" fill="${INK}"/>`;
    for (let i = -6; i <= 5; i++) g += `<path d="M${i * 60},-10 l-30,90" stroke="${hullS}" stroke-width="7" stroke-linecap="round"/>`;
    g += `<path d="M-420,-84 Q0,-44 400,-112" fill="none" stroke="${INK}" stroke-width="5"/>`;
    return g + `</g>`;
  }
  // a ship pulled up on the sand (no oars, tilted a little), for the camp
  const beachedShip = (x, y, s, o = {}) => `<g transform="translate(${x} ${y}) rotate(${o.tilt ?? -4}) scale(${s})">${ship(0, 0, 1, { ...o })}</g>`;
  function scroll(x, y, w, h, u, title, content, o = {}) {
    const hh = Math.max(8, h * S.easeOut(u)), cid = 'sc' + Math.round(x) + '_' + Math.round(y);
    return `<g transform="translate(${x} ${y})" opacity="${o.dim ? 0.55 : 1}">
      <defs><clipPath id="${cid}"><rect x="${-w / 2}" y="${-hh / 2}" width="${w}" height="${hh}"/></clipPath></defs>
      <rect x="${-w / 2}" y="${-hh / 2}" width="${w}" height="${hh}" fill="${o.paper || '#f1e2bf'}" stroke="${INK}" stroke-width="5"/>
      <g clip-path="url(#${cid})">${title ? S.word(0, -h / 2 + 80, o.titleSize || 54, title, { fill: o.titleCol || '#fff', sw: 10 }) : ''}${content}</g>
      <rect x="${-w / 2 - 22}" y="${-hh / 2 - 26}" width="${w + 44}" height="34" rx="17" fill="#c9a46c" stroke="${INK}" stroke-width="5"/>
      <rect x="${-w / 2 - 22}" y="${hh / 2 - 8}" width="${w + 44}" height="34" rx="17" fill="#c9a46c" stroke="${INK}" stroke-width="5"/></g>`;
  }
  function vase(x, y, s) {
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <path d="M-40,-200 L40,-200 L34,-170 Q110,-130 100,-20 Q90,70 40,100 L50,130 L-50,130 L-40,100 Q-90,70 -100,-20 Q-110,-130 -34,-170 Z" fill="#c8662e" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M-34,-170 Q-90,-170 -96,-110 M34,-170 Q90,-170 96,-110" fill="none" stroke="${INK}" stroke-width="8"/>
      <rect x="-88" y="-60" width="176" height="10" fill="${INK}"/><rect x="-88" y="70" width="176" height="8" fill="${INK}"/>
      <g fill="${INK}"><circle cx="-10" cy="-30" r="16"/><path d="M-30,-26 Q-50,-60 -10,-58 Q30,-62 14,-30 Z"/><path d="M-26,-10 L8,-10 L16,40 L4,40 L-2,10 L-10,40 L-22,40 Z"/>
      <circle cx="-48" cy="0" r="24"/><path d="M28,-60 L36,60" stroke="${INK}" stroke-width="6"/><path d="M28,-74 l6,16 l-12,0 Z"/></g></g>`;
  }

  // ---------- places ----------
  // the black river Styx (hook): dark teal, mist, a faint glow; water = y of the surface
  function styx(f, water = 760, noWater) {
    let mist = '';
    for (let i = 0; i < 8; i++) { const a = rnd(i + 80); mist += `<ellipse cx="${((a * 2200 + f * (0.6 + a)) % 2400 - 240).toFixed(0)}" cy="${(water - 30 + a * 60).toFixed(0)}" rx="${(260 + a * 200).toFixed(0)}" ry="${(30 + a * 20).toFixed(0)}" fill="#cfe8e4" opacity="${(0.06 + a * 0.06).toFixed(2)}" filter="url(#soft)"/>`; }
    return `${sky('styxs')}<circle cx="960" cy="${water - 40}" r="420" fill="#2f8f8a" opacity="0.18" filter="url(#soft)"/>
      ${noWater ? '' : `<rect x="-200" y="${water}" width="2320" height="600" fill="url(#styxw)"/>${seaBand(water, 380, 'none', '#3f8f92', f, 61)}`}
      ${mist}${motes(f, 18, { col: '#bfe9e2', seed: 91 })}`;
  }
  // the hook's moonlit river bank with Thetis' rock (tx, ty = where Thetis stands)
  function styxBank(f, tx = 760, ty = 700) {
    return styx(f, 900) + `${sky('moonsky')}<circle cx="1180" cy="300" r="300" fill="#cfe0f2" opacity="0.18" filter="url(#soft)"/>${moon(1180, 300, 150)}
      ${seaBand(900, 180, '#123039', '#7fb8c4', f, 63)}<path d="M-60,1100 L-60,760 Q120,700 340,${ty - 4} Q560,${ty - 14} 700,${ty} Q820,${ty + 6} 860,${ty + 40} Q880,${ty + 120} 840,${ty + 240} L860,1100 Z" fill="#1d2a30" stroke="${INK}" stroke-width="5"/>
      <path d="M120,${ty + 40} Q260,${ty + 20} 420,${ty + 30}" fill="none" stroke="#2d3f46" stroke-width="10" stroke-linecap="round"/>`;
  }
  // Thetis' hand around the heel, the forearm coming in from the top of the frame (hook)
  function hangHand(x, y) {
    return `<path d="M${x + 150},-260 L${x + 26},${y + 30}" stroke="${INK}" stroke-width="44" stroke-linecap="round"/>
      <path d="M${x + 150},-260 L${x + 26},${y + 30}" stroke="${C.skin}" stroke-width="36" stroke-linecap="round"/>
      ${K.hand(x + 6, y + 36, 24)}<path d="M${x - 12},${y + 32} q8,10 20,8" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
  }
  // a palace hall. o.place: 'skyros' (chapter I) | 'phthia' (home: warmer, red-ochre) ; o.night: moonlit ; o.window:false hides the window
  function palace(f, o = {}) {
    const ph = o.place === 'phthia', nt = o.night;
    let tiles = '';
    for (let x = -200; x < 2120; x += 120) tiles += `<path d="M${x},860 L${x - 60},1080" stroke="${nt ? '#2c2232' : ph ? '#9a5d3c' : '#b78a5c'}" stroke-width="4"/>`;
    const glass = nt ? '#3a4a7a' : '#cfe6ee', hill = nt ? '#2f3b52' : '#9cc49a';
    const win = o.window === false ? '' : `<defs><clipPath id="win${ph ? 'P' : 'S'}"><path d="M820,670 L820,390 A140,140 0 0 1 1100,390 L1100,670 Z"/></clipPath></defs>
        <path d="M820,670 L820,390 A140,140 0 0 1 1100,390 L1100,670 Z" fill="${glass}"/>
        ${nt ? `<g clip-path="url(#win${ph ? 'P' : 'S'})">${moon(1010, 450, 46)}${stars(f, 12, 300, 140).replace(/cx="(\d+)"/g, (m, v) => `cx="${820 + (+v % 280)}"`).replace(/cy="(\d+)"/g, (m, v) => `cy="${300 + (+v % 260)}"`)}</g>` : ''}
        <path d="M820,520 Q960,470 1100,520 L1100,670 L820,670 Z" fill="${hill}" clip-path="url(#win${ph ? 'P' : 'S'})"/>
        <path d="M820,670 L820,390 A140,140 0 0 1 1100,390 L1100,670 Z" fill="none" stroke="${INK}" stroke-width="6"/>
        <rect x="800" y="664" width="320" height="18" rx="4" fill="#efe2c4" stroke="${INK}" stroke-width="5"/>
        ${nt ? `<path d="M820,670 L700,1080 L1300,1080 L1100,670 Z" fill="#b9c6ff" opacity="0.10"/>` : ''}`;
    const colO = ph ? { col: '#e8cfb0', colS: '#c9a585', cap: '#e0bf98' } : {};
    return `${sky(nt ? 'hallNight' : ph ? 'hallPhthia' : 'hall')}${meander(70, 50, nt ? '#8a86a8' : '#f4e5c6', nt ? '#2a3a5a' : ph ? '#8a3a2a' : C.teal)}${win}
      ${column(170, 150, 860, colO)}${column(1750, 150, 860, colO)}${o.mid ? column(560, 150, 860, colO) + column(1360, 150, 860, colO) : ''}
      <rect y="860" width="1920" height="220" fill="${nt ? '#3a2f3c' : ph ? '#9a5f3a' : '#a8743f'}"/><rect y="860" width="1920" height="10" fill="#000" opacity="0.15"/>${tiles}
      <rect x="-200" y="-200" width="2320" height="1480" fill="url(#hallshade)"/>
      ${nt ? `<rect x="-200" y="-200" width="2320" height="1480" fill="#0b0a1c" opacity="0.25"/>` : ''}
      ${motes(f, 18, { col: nt ? '#c9d4ff' : '#fff6dc', seed: o.seed || 5 })}`;
  }
  // night sea with the fleet (chapter I) – dark: darker for close-ups
  function night(f, dark) {
    let ships = '';
    for (let i = 0; i < 6; i++) ships += ship(260 + i * 300, 620, 0.14, { sail: '#2a3550' });
    return `${sky('night')}${stars(f)}${moon(1560, 200, 70)}
      ${seaBand(620, 460, '#1b2a44', '#8fa6c9', f, 55)}<g opacity="0.9">${ships}</g>
      <path d="M1500,630 L1620,630 L1600,900 L1520,900 Z" fill="#f4ecd0" opacity="0.08"/>
      ${dark ? `<rect width="1920" height="1080" fill="#0b0f1d" opacity="0.35"/>` : ''}`;
  }
  // a sunny or dusk beach; o.time 'day'|'dusk'|'dawn'; o.troy: the city on the horizon; o.sand y
  function beach(f, o = {}) {
    const t = o.time || 'day', sy = o.sand || 720;
    const skyId = t === 'dusk' ? 'dusk' : t === 'dawn' ? 'dawn' : 'beach';
    const sea = t === 'dusk' ? ['#27384a', '#f2a65e'] : t === 'dawn' ? ['#5d8fae', '#ffe2b8'] : ['#3f8fb0', '#bfe8f4'];
    const sand = t === 'dusk' ? '#8a6a52' : '#e5c690';
    return `${sky(skyId)}${t === 'dusk' ? sun(1480, sy - 90, 130) : t === 'dawn' ? sun(380, sy - 70, 110, '#ffe2a8', '#ffd08a') : ''}
      ${cloud(300, 220, 1.1, t === 'day' ? '#ffffff' : '#fde3c2', f, 0.2, 0.7)}${cloud(1500, 170, 0.9, t === 'day' ? '#ffffff' : '#fde3c2', f, 0.15, 0.6)}
      ${o.troy ? troySkyline(sy - 150, 0.55, t === 'day' ? '#b9a68a' : '#4a3040') : ''}
      ${seaBand(sy - 160, 160, sea[0], sea[1], f, 7)}
      <rect y="${sy}" width="1920" height="${1080 - sy + 200}" fill="${sand}"/><path d="M-50,${sy + 12} Q500,${sy - 10} 980,${sy + 12} Q1500,${sy + 34} 1980,${sy + 8}" fill="none" stroke="#f6f0dc" stroke-width="12" stroke-linecap="round" opacity="${t === 'dusk' ? 0.4 : 1}"/>
      ${motes(f, 14, { col: '#ffffff', seed: 9 })}`;
  }
  // Troy on the horizon: walls with towers and a gate; y = top of the wall, s = scale, col = colour
  function troySkyline(y, s = 1, col = '#2a1f2e') {
    const w = 1500 * s, x0 = 960 - w / 2, h = 260 * s;
    let g = `<rect x="${x0}" y="${y}" width="${w}" height="${h}" fill="${col}" stroke="${INK}" stroke-width="${3 * s + 1}"/>`;
    for (let x = x0; x < x0 + w - 10; x += 80 * s) g += `<rect x="${n(x)}" y="${n(y - 34 * s)}" width="${n(46 * s)}" height="${n(36 * s)}" fill="${col}" stroke="${INK}" stroke-width="${3 * s + 1}"/>`;
    for (const tx of [x0 + 120 * s, x0 + w - 300 * s, 960 - 260 * s, 960 + 120 * s]) g += `<rect x="${n(tx)}" y="${n(y - 120 * s)}" width="${n(150 * s)}" height="${n(h + 120 * s)}" fill="${col}" stroke="${INK}" stroke-width="${3 * s + 1}"/>`;
    // the citadel and a palace roof behind the walls
    // the citadel hill with a temple on top, behind the walls
    const tw = 300 * s, ty = y - 250 * s;
    g = `<path d="M${n(960 - 480 * s)},${n(y + 10)} Q${n(960 - 300 * s)},${n(y - 200 * s)} ${n(960)},${n(y - 210 * s)} Q${n(960 + 300 * s)},${n(y - 200 * s)} ${n(960 + 480 * s)},${n(y + 10)} Z" fill="${col}" stroke="${INK}" stroke-width="${3 * s + 1}"/>
      <rect x="${n(960 - tw / 2)}" y="${n(ty)}" width="${n(tw)}" height="${n(60 * s)}" fill="${col}" stroke="${INK}" stroke-width="${3 * s + 1}"/>
      ${[0, 1, 2, 3, 4].map(k => `<path d="M${n(960 - tw / 2 + 30 * s + k * (tw - 60 * s) / 4)},${n(ty + 8 * s)} l0,${n(46 * s)}" stroke="${INK}" stroke-width="${3 * s + 1}" opacity="0.6"/>`).join('')}
      <path d="M${n(960 - tw / 2 - 14 * s)},${n(ty)} L960,${n(ty - 60 * s)} L${n(960 + tw / 2 + 14 * s)},${n(ty)} Z" fill="${col}" stroke="${INK}" stroke-width="${3 * s + 1}"/>` + g;
    g += `<path d="M${n(960 - 70 * s)},${n(y + h)} L${n(960 - 70 * s)},${n(y + 110 * s)} Q960,${n(y + 50 * s)} ${n(960 + 70 * s)},${n(y + 110 * s)} L${n(960 + 70 * s)},${n(y + h)} Z" fill="#170f1a"/>`;
    return g;
  }
  // the walls of Troy at dusk as a silhouette, sun behind (hook shot 4); o.gate: draw the gate opening big in the middle
  function troyDusk(f, o = {}) {
    const c = o.col || '#2a1f2e';
    let walls = `<rect x="-100" y="560" width="2120" height="520" fill="${c}"/>`;
    for (let x = -100; x < 2020; x += 80) walls += `<rect x="${x}" y="530" width="48" height="40" fill="${c}"/>`;
    walls += `<rect x="560" y="430" width="200" height="200" fill="${c}"/><rect x="1160" y="430" width="200" height="200" fill="${c}"/>
      ${[560, 1160].map(x => [0, 1, 2, 3].map(k => `<rect x="${x + k * 52}" y="404" width="34" height="30" fill="${c}"/>`).join('')).join('')}
      <path d="M860,1080 L860,700 Q960,600 1060,700 L1060,1080 Z" fill="#170f1a"/>`;
    return `${sky(o.sky || 'troy')}${sun(960, 520, 230, '#ffd59a', '#ffb26b')}${walls}<rect y="960" width="1920" height="120" fill="#1b131d"/>
      ${motes(f, 30, { col: '#ffb070', seed: 21 })}`;
  }
  // the wall seen up close in daylight (hook shot 5) – back(f) = sky + towers, front(y) = the battlement row in front of a figure
  function troyWallBack(f, o = {}) {
    return `${sky(o.sky || 'warm')}${cloud(300, 260, 1.2, '#fde3c2', f)}${cloud(1500, 200, 1, '#fde3c2', f)}${cloud(1700, 420, 0.7, '#fde3c2', f)}
      <g fill="#c98f6a" stroke="${INK}" stroke-width="4"><rect x="180" y="420" width="150" height="360"/><rect x="1560" y="380" width="170" height="400"/></g>
      <g fill="#c98f6a" stroke="${INK}" stroke-width="4">${[180, 220, 260, 300].map(x => `<rect x="${x}" y="396" width="26" height="28"/>`).join('')}${[1560, 1604, 1648, 1692].map(x => `<rect x="${x}" y="356" width="30" height="28"/>`).join('')}</g>
      <path d="M1640,380 L1640,250" stroke="${INK}" stroke-width="6"/><path d="M1640,252 Q1700,262 1750,250 Q1720,280 1752,300 Q1700,290 1640,300 Z" fill="#7a3f8a" stroke="${INK}" stroke-width="4"/>
      ${motes(f, 20, { col: '#fff3d6', seed: 33 })}`;
  }
  function troyWallFront(y = 760, col = '#b9a68a', colS = '#8e7c62') {
    let wall = `<rect x="-60" y="${y}" width="2040" height="${1100 - y}" fill="${col}" stroke="${INK}" stroke-width="5"/>`;
    for (let x = -60; x < 1980; x += 200) wall += `<rect x="${x}" y="${y - 60}" width="130" height="70" fill="${col}" stroke="${INK}" stroke-width="5"/>`;
    for (let r = 0; r < 3; r++) for (let x = -60 + (r % 2) * 90; x < 1980; x += 180) wall += `<path d="M${x},${y + 30 + r * 90} l0,90 M${x - 60},${y + 120 + r * 90} l200,0" stroke="${colS}" stroke-width="4"/>`;
    return wall;
  }
  // the Scaean gate from the plain: big stone walls, the gate in the middle; o.time 'day'|'dusk'|'dawn'
  function troyGate(f, o = {}) {
    const t = o.time || 'day';
    const skyId = t === 'dusk' ? 'troy' : t === 'dawn' ? 'dawn' : 'warm';
    const stone = t === 'dusk' ? '#6a4a52' : '#c9a77e', stoneS = t === 'dusk' ? '#523640' : '#a8855e', ground = t === 'dusk' ? '#5a3a34' : '#c9a06a';
    let g = `${sky(skyId)}${t === 'dusk' ? sun(1500, 330, 120, '#ffd59a', '#ffb26b') : ''}${cloud(380, 180, 1, '#fde3c2', f, 0.2, 0.7)}`;
    g += `<rect x="-100" y="250" width="2120" height="600" fill="${stone}" stroke="${INK}" stroke-width="6"/>`;
    for (let x = -100; x < 2020; x += 110) g += `<rect x="${x}" y="206" width="66" height="50" fill="${stone}" stroke="${INK}" stroke-width="5"/>`;
    for (let r = 0; r < 6; r++) for (let x = -100 + (r % 2) * 70; x < 2020; x += 140) g += `<path d="M${x},${300 + r * 90} l0,90 M${x - 70},${390 + r * 90} l140,0" stroke="${stoneS}" stroke-width="4"/>`;
    for (const tx of [520, 1240]) g += `<rect x="${tx}" y="120" width="160" height="740" fill="${stone}" stroke="${INK}" stroke-width="6"/>${[0, 1, 2].map(k => `<rect x="${tx + 6 + k * 54}" y="86" width="40" height="40" fill="${stone}" stroke="${INK}" stroke-width="5"/>`).join('')}`;
    g += `<path d="M720,860 L720,520 Q960,360 1200,520 L1200,860 Z" fill="#2a1a1a" stroke="${INK}" stroke-width="8"/>
      <path d="M760,860 L760,540 Q960,410 1160,540 L1160,860" fill="none" stroke="#6b4a32" stroke-width="16"/>
      ${o.open ? '' : `<path d="M760,860 L760,540 Q960,410 1160,540 L1160,860 Z" fill="#7a4e2e" stroke="${INK}" stroke-width="6"/><path d="M960,450 L960,860" stroke="${INK}" stroke-width="6"/>${[600, 700, 800].map(y => `<path d="M770,${y} L1150,${y}" stroke="#5a3820" stroke-width="10"/>`).join('')}`}
      <rect y="850" width="1920" height="260" fill="${ground}"/><rect y="850" width="1920" height="12" fill="#000" opacity="0.15"/>
      ${motes(f, 22, { col: t === 'dusk' ? '#ffb070' : '#fff3d6', seed: 37 })}`;
    return g;
  }
  // the Greek camp on the beach: tents, ships pulled up, fires; o.time 'dusk'|'night'|'dawn'|'day'
  function camp(f, o = {}) {
    const t = o.time || 'dusk';
    const skyId = { dusk: 'dusk', night: 'night', dawn: 'dawn', day: 'beach' }[t];
    const sand = { dusk: '#7d5e48', night: '#2f2a33', dawn: '#c9a785', day: '#e0c08c' }[t];
    const canvas = { dusk: '#c99f72', night: '#5a4a48', dawn: '#e0c39a', day: '#efd9b4' }[t];
    const canvasS = { dusk: '#9c7650', night: '#3e3234', dawn: '#b99a72', day: '#cdb08a' }[t];
    let g = sky(skyId);
    if (t === 'night') g += stars(f) + moon(1600, 170, 60);
    if (t === 'dusk') g += sun(1520, 470, 120);
    if (t === 'dawn') g += sun(320, 480, 100, '#ffe2a8', '#ffd08a');
    g += seaBand(430, 160, t === 'night' ? '#1b2a44' : t === 'dusk' ? '#3a4058' : '#5d8fae', t === 'night' ? '#8fa6c9' : '#ffd2a0', f, 17);
    // the sand, then the ships pulled up on it in a row behind the tents
    g += `<rect y="580" width="1920" height="600" fill="${sand}"/><path d="M-50,586 Q960,570 1980,590" fill="none" stroke="#f6f0dc" stroke-width="8" opacity="${t === 'night' ? 0.15 : 0.45}"/>`;
    for (let i = 0; i < 7; i++) g += beachedShip(120 + i * 290, 640 + (i % 2) * 14, 0.28, { sail: t === 'night' ? '#3a3f58' : '#e8d2b0', emblem: i % 3 === 1, tilt: -3 + (i % 3) * 2 });
    const tent = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-150,0 L0,-170 L150,0 Z" fill="${canvas}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M0,-170 L150,0 L60,0 Z" fill="${canvasS}"/><path d="M-36,0 L0,-120 L36,0 Z" fill="${t === 'night' ? '#ffb85c' : '#3a2418'}" opacity="${t === 'night' ? 0.85 : 1}"/>
      <path d="M0,-170 L0,-200" stroke="${INK}" stroke-width="6"/><path d="M0,-200 L34,-190 L0,-180 Z" fill="${C.teal}" stroke="${INK}" stroke-width="3"/></g>`;
    for (let i = 0; i < 6; i++) { const a = rnd(i + 300); g += tent(150 + i * 330 + a * 60, 760 + a * 40, 0.75 + a * 0.3); }
    if (t !== 'day') for (let i = 0; i < 4; i++) g += flame(f, 330 + i * 450, 900, 0.45, i);
    g += motes(f, 18, { col: t === 'night' ? '#ffcf8a' : '#fff1d6', seed: 61 });
    return g;
  }
  // inside Achilles' tent: canvas walls, centre pole, a hanging lamp; o.night (darker, lamp glow) ; o.door: open flap on the right
  function tentInside(f, o = {}) {
    const nt = o.night !== false;
    const flick = 1 + Math.sin(f / 3.1) * 0.04 + Math.sin(f / 1.7) * 0.02;
    return `${sky(nt ? 'canvasNight' : 'canvas')}
      <path d="M-100,120 L960,-40 L2020,120 L2020,260 L-100,260 Z" fill="${nt ? '#2c1d1b' : '#8c6a44'}" opacity="0.6"/>
      ${[260, 640, 1280, 1660].map(x => `<path d="M${x},40 L${x + (x < 960 ? -40 : 40)},900" stroke="${nt ? '#2a1a18' : '#7a5a38'}" stroke-width="10" opacity="0.5"/>`).join('')}
      ${o.door ? `<path d="M1500,900 L1560,160 L1760,170 L1800,900 Z" fill="${nt ? '#10142a' : '#cfe6ee'}" stroke="${INK}" stroke-width="6"/>${nt ? stars(f, 8, 600, 200).replace(/cx="(\d+)"/g, (m, v) => `cx="${1580 + (+v % 180)}"`).replace(/cy="(\d+)"/g, (m, v) => `cy="${220 + (+v % 500)}"`) : ''}<path d="M1500,900 L1560,160 Q1520,500 1420,900 Z" fill="${nt ? '#4a3330' : '#b08a5e'}" stroke="${INK}" stroke-width="5"/>` : ''}
      <rect x="940" y="-20" width="40" height="940" fill="${C.wood}" stroke="${INK}" stroke-width="6"/>
      <rect y="900" width="1920" height="300" fill="${nt ? '#3a2722' : '#9c7650'}"/><rect y="900" width="1920" height="10" fill="#000" opacity="0.2"/>
      <path d="M380,1000 L1540,1000 L1640,1080 L280,1080 Z" fill="${nt ? '#6a2a2a' : '#a8463a'}" stroke="${INK}" stroke-width="5"/>
      ${meander(1010, 40, '#e8c27a', nt ? '#4a1e1e' : '#7a2e26')}
      <path d="M720,0 L720,250" stroke="${INK}" stroke-width="4"/>
      <g transform="translate(720 270)"><circle r="${(260 * flick).toFixed(0)}" fill="url(#lamp)" opacity="${nt ? 0.9 : 0.5}"/>
        <path d="M-40,0 Q0,40 40,0 Z" fill="${C.bronze}" stroke="${INK}" stroke-width="4"/><path d="M-6,-2 Q0,-${(30 * flick).toFixed(0)} 6,-2 Z" fill="#ffd36b"/></g>
      ${nt ? `<rect x="-200" y="-200" width="2320" height="1480" fill="url(#hallshade)"/>` : ''}
      ${motes(f, 14, { col: '#ffcf8a', seed: 71 })}`;
  }
  // Chiron's cave on Mount Pelion: mountains, pines, the cave mouth on the left; o.time 'day'|'dusk'
  function cave(f, o = {}) {
    const dusk = o.time === 'dusk';
    return `${sky(dusk ? 'dusk' : 'day')}${dusk ? sun(1500, 520, 110) : ''}${cloud(1300, 200, 1, dusk ? '#fde3c2' : '#ffffff', f, 0.15, 0.7)}
      <path d="M-100,640 L260,420 L520,600 L820,380 L1180,620 L1500,430 L2020,640 Z" fill="url(#mountain)" opacity="0.85"/>
      ${pines(1620, 760, 1.1)}${pines(1820, 780, 0.9)}${pines(1420, 740, 0.7)}
      <path d="M-80,780 Q120,380 460,410 Q700,440 760,800 Z" fill="${dusk ? '#5e5048' : '#7a6a5c'}" stroke="${INK}" stroke-width="5"/>
      <path d="M150,800 Q220,560 400,570 Q560,590 580,800 Z" fill="#231a16"/>
      <path d="M200,800 Q240,640 380,640" fill="none" stroke="#3a2c25" stroke-width="10" stroke-linecap="round"/>
      <rect y="770" width="1920" height="330" fill="url(#grass)"/><rect y="770" width="1920" height="10" fill="#000" opacity="0.12"/>
      ${[[700, 860], [1000, 900], [1300, 870], [1700, 930]].map(([x, y], i) => `<path d="M${x},${y} q10,-26 20,0 q10,-20 20,0" fill="none" stroke="#5a7030" stroke-width="5" stroke-linecap="round"/>`).join('')}
      ${dusk ? `<rect x="-200" y="-200" width="2320" height="1480" fill="#2a1430" opacity="0.18"/>` : ''}
      ${motes(f, 18, { col: '#fffbe6', seed: 3 })}`;
  }
  // a green meadow with hills (run, deer, the farmer's field); o.time 'day'|'gold'
  function meadow(f, o = {}) {
    const gold = o.time === 'gold';
    return `${sky(gold ? 'warm' : 'day')}${gold ? sun(1500, 380, 120, '#fff1c2', '#ffd08a') : ''}${cloud(400, 200, 1.1, '#ffffff', f, 0.25, 0.8)}${cloud(1450, 260, 0.8, '#ffffff', f, 0.2, 0.7)}
      <path d="M-100,700 Q400,520 900,640 Q1400,740 2020,560 L2020,1100 L-100,1100 Z" fill="${gold ? '#a8b05a' : '#8fb05a'}" stroke="${INK}" stroke-width="5"/>
      <path d="M-100,820 Q600,700 1200,800 Q1600,860 2020,780 L2020,1100 L-100,1100 Z" fill="${gold ? '#94983e' : '#7a9a46'}" stroke="${INK}" stroke-width="5"/>
      ${cypress(1650, 640, 0.8)}${cypress(1740, 620, 0.6)}
      ${Array.from({ length: 16 }, (_, i) => { const a = rnd(i + 500), b = rnd(i + 600); return `<circle cx="${(a * 1920).toFixed(0)}" cy="${(860 + b * 200).toFixed(0)}" r="7" fill="${i % 3 ? '#f6e27a' : '#f2a6b8'}" stroke="${INK}" stroke-width="2.5"/>`; }).join('')}
      ${motes(f, 16, { col: '#fffbe6', seed: 7 })}`;
  }
  // Olympus: golden clouds and the tops of columns; o.dark for a storm (Zeus angry)
  function olympus(f, o = {}) {
    let c = '';
    for (let i = 0; i < 9; i++) { const a = rnd(i + 700); c += cloud(-200 + i * 280 + a * 80, 820 + a * 120, 1.6 + a, o.dark ? '#c9b8c8' : '#fff6e2', f, 0.12 + a * 0.1, 0.95); }
    return `${sky('olympus')}${rays(f, 960, 300, 18, '#fff3c4', 0.22, 0.002)}
      ${[300, 560, 1360, 1620].map(x => column(x, 260, 860, { col: '#f4ead2', colS: '#d9c9a4', cap: '#efe2c0' })).join('')}
      <rect x="180" y="200" width="1560" height="60" fill="#efe2c0" stroke="${INK}" stroke-width="5"/>${meander(206, 48, '#c99230', '#efe2c0').replace('x="-200"', 'x="180"').replace('width="2320"', 'width="1560"')}
      ${c}${o.dark ? `<rect x="-200" y="-200" width="2320" height="1480" fill="#2a2040" opacity="0.35"/>` : ''}
      ${motes(f, 22, { col: '#fff8dc', seed: 77 })}`;
  }
  // the forge of the god of blacksmiths: dark stone, a glowing furnace mouth, sparks
  function forge(f, o = {}) {
    const fl = 1 + Math.sin(f / 2.7) * 0.06;
    let sparks = '';
    for (let i = 0; i < 26; i++) { const a = rnd(i + 800), t = ((f * (0.01 + a * 0.012) + a) % 1);
      sparks += `<circle cx="${(1240 + (a - 0.5) * 500 + Math.sin(t * 9 + i) * 40).toFixed(0)}" cy="${(760 - t * 700).toFixed(0)}" r="${(2 + a * 3).toFixed(1)}" fill="#ffd36b" opacity="${(1 - t).toFixed(2)}"/>`; }
    return `${sky('forge')}
      ${Array.from({ length: 6 }, (_, r) => Array.from({ length: 9 }, (_, k) => `<rect x="${k * 240 - (r % 2) * 120}" y="${r * 150}" width="236" height="146" rx="10" fill="#2a1a14" stroke="#120a08" stroke-width="5"/>`).join('')).join('')}
      <circle cx="1240" cy="640" r="${(520 * fl).toFixed(0)}" fill="url(#glowRed)"/>
      <path d="M1040,900 L1040,560 Q1240,380 1440,560 L1440,900 Z" fill="#ff8a3a" stroke="${INK}" stroke-width="8"/>
      <path d="M1090,900 L1090,590 Q1240,450 1390,590 L1390,900 Z" fill="#ffd36b"/>
      ${flame(f, 1240, 880, 1.4, 3)}${sparks}
      <rect y="900" width="1920" height="300" fill="#1c120e"/><rect y="900" width="1920" height="10" fill="#ff8a3a" opacity="0.25"/>`;
  }
  // the land of the dead: the field of asphodel – grey-lilac, mist, pale flowers (the only cool palette)
  function underworld(f, o = {}) {
    let flowers = '';
    for (let i = 0; i < 70; i++) { const a = rnd(i + 900), b = rnd(i * 1.7 + 950); const x = a * 2000 - 40, y = 720 + b * 380, s = 0.5 + b * 0.9;
      flowers += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${s.toFixed(2)})"><path d="M0,0 L0,-60" stroke="#6f6a7e" stroke-width="5"/>${[0, 1, 2, 3, 4].map(k => `<ellipse cx="${(Math.cos(k * 1.26) * 10).toFixed(0)}" cy="${(-64 + Math.sin(k * 1.26) * 10).toFixed(0)}" rx="8" ry="5" transform="rotate(${k * 72} ${(Math.cos(k * 1.26) * 10).toFixed(0)} ${(-64 + Math.sin(k * 1.26) * 10).toFixed(0)})" fill="#dcd6e6"/>`).join('')}<circle cx="0" cy="-64" r="4" fill="#a89cc0"/></g>`; }
    let mist = '';
    for (let i = 0; i < 8; i++) { const a = rnd(i + 990); mist += `<ellipse cx="${((a * 2200 + f * (0.4 + a * 0.5)) % 2400 - 240).toFixed(0)}" cy="${(640 + a * 320).toFixed(0)}" rx="${(300 + a * 200).toFixed(0)}" ry="${(40 + a * 30).toFixed(0)}" fill="#e6e2f0" opacity="${(0.08 + a * 0.08).toFixed(2)}" filter="url(#soft)"/>`; }
    const tree = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" opacity="0.8"><path d="M0,0 L-6,-160 Q-40,-220 -90,-240 M-6,-160 Q30,-230 70,-250 M-4,-110 Q-50,-130 -80,-120" fill="none" stroke="#3e3a4c" stroke-width="12" stroke-linecap="round"/></g>`;
    return `${sky('under')}<circle cx="960" cy="420" r="380" fill="#b9b2cc" opacity="0.18" filter="url(#soft)"/>
      <path d="M-100,620 Q300,560 700,600 Q1200,650 2020,580 L2020,1100 L-100,1100 Z" fill="#5f5a72"/>
      ${tree(300, 640, 1)}${tree(1600, 620, 0.8)}
      <path d="M-100,700 Q600,660 1200,700 Q1600,730 2020,690 L2020,1100 L-100,1100 Z" fill="#706a84"/>
      ${flowers}${mist}${motes(f, 22, { col: '#e9e4f6', seed: 93 })}`;
  }
  // a dusty battlefield: distant walls, smoke columns, dropped spears; o.time 'day'|'dusk'
  function battlefield(f, o = {}) {
    const dusk = o.time === 'dusk';
    let spears = '';
    for (let i = 0; i < 9; i++) { const a = rnd(i + 400); spears += `<path d="M${(a * 1900).toFixed(0)},${(900 + a * 120).toFixed(0)} l${(40 - a * 80).toFixed(0)},-${(120 + a * 60).toFixed(0)}" stroke="#3a2a22" stroke-width="7" stroke-linecap="round"/>`; }
    return `${sky(dusk ? 'troy' : 'battle')}${dusk ? sun(1400, 420, 120, '#ffd59a', '#ffb26b') : ''}
      ${troySkyline(470, 0.5, dusk ? '#3a2434' : '#8a6a62')}
      ${smoke(f, 300, 560, 1.2, dusk ? '#3a2a34' : '#6a5a5e', 1, 0.45)}${smoke(f, 1600, 580, 1, dusk ? '#3a2a34' : '#6a5a5e', 4, 0.4)}
      <path d="M-100,600 Q500,560 1000,600 Q1500,640 2020,590 L2020,1100 L-100,1100 Z" fill="${dusk ? '#5a3a34' : '#b98a5e'}"/>
      <path d="M-100,760 Q700,700 1300,770 Q1700,800 2020,750 L2020,1100 L-100,1100 Z" fill="${dusk ? '#4a2e2a' : '#a8784e'}"/>
      ${spears}${motes(f, 26, { col: dusk ? '#ffb070' : '#f6e0c0', seed: 41 })}`;
  }
  // the trench at the edge of the camp, looking out over the plain at dusk (VI)
  function trench(f, o = {}) {
    let stakes = '';
    for (let x = -60; x < 1980; x += 70) stakes += `<path d="M${x},860 L${x + 26},740 L${x + 52},860 Z" fill="#5a3a26" stroke="${INK}" stroke-width="4"/>`;
    return `${sky('troy')}${sun(1500, 520, 120, '#ffd59a', '#ffb26b')}${troySkyline(430, 0.45, '#3a2434')}
      <path d="M-100,600 Q600,560 1300,600 Q1700,620 2020,590 L2020,1100 L-100,1100 Z" fill="#5a3a34"/>
      ${Array.from({ length: 10 }, (_, i) => { const a = rnd(i + 420); return flame(f, 200 + a * 1600, 640 + a * 60, 0.18 + a * 0.1, i); }).join('')}
      <path d="M-100,880 Q960,840 2020,880 L2020,1100 L-100,1100 Z" fill="#2a1c1a"/>${stakes}
      <rect y="860" width="1920" height="240" fill="#3a2622"/>${motes(f, 24, { col: '#ffb070', seed: 43 })}`;
  }
  // a grave mound with a stone at dawn (VIII)
  function grave(f, o = {}) {
    return `${sky('dawn')}${sun(1500, 560, 110, '#ffe2a8', '#ffd08a')}${seaBand(560, 120, '#5d8fae', '#ffe2b8', f, 21)}
      <rect y="660" width="1920" height="500" fill="#b89a78"/>
      <path d="M560,800 Q960,520 1360,800 Z" fill="#8a7a5a" stroke="${INK}" stroke-width="6"/><path d="M640,790 Q960,600 1280,790" fill="none" stroke="#a49170" stroke-width="12" stroke-linecap="round"/>
      <path d="M920,640 L920,520 Q960,480 1000,520 L1000,640 Z" fill="#cfc4b0" stroke="${INK}" stroke-width="5"/>
      ${[0, 1].map(k => `<ellipse cx="960" cy="${820 + k * 30}" rx="${560 + k * 90}" ry="${90 + k * 20}" fill="none" stroke="#7a6248" stroke-width="7" stroke-dasharray="40 26" opacity="0.7"/>`).join('')}
      ${motes(f, 16, { col: '#fff1d6', seed: 51 })}`;
  }
  // a dark wooden table with a parchment sheet (maps, documents, the comment call, the end card); returns the paper rect too
  function parchmentTable(f, o = {}) {
    const x = o.x ?? 360, y = o.y ?? 140, w = o.w ?? 1200, h = o.h ?? 800;
    return `${sky('wood')}${Array.from({ length: 9 }, (_, i) => `<path d="M-100,${i * 130 + 40} Q960,${i * 130 + 20 + Math.sin(i) * 20} 2020,${i * 130 + 50}" stroke="#2e1d13" stroke-width="5" fill="none" opacity="0.7"/>`).join('')}
      <circle cx="960" cy="540" r="700" fill="#ffcf8a" opacity="0.10" filter="url(#soft)"/>
      <g transform="rotate(${o.rot ?? -1.5} 960 540)"><rect x="${x + 14}" y="${y + 18}" width="${w}" height="${h}" rx="10" fill="#000" opacity="0.35"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="url(#parch)" stroke="${INK}" stroke-width="6"/>
      <rect x="${x + 24}" y="${y + 24}" width="${w - 48}" height="${h - 48}" rx="6" fill="none" stroke="#c9a46c" stroke-width="4"/></g>
      ${motes(f, 14, { col: '#ffe9c0', seed: 97 })}`;
  }

  window.SETS = { defs, grad, radial, sky, sun, moon, stars, seaBand, meander, column, pines, cypress, cloud, rays, gagBg, shadow, smoke, flame,
    ship, beachedShip, scroll, vase, styx, styxBank, hangHand, palace, night, beach, troySkyline, troyDusk, troyWallBack, troyWallFront, troyGate,
    camp, tentInside, cave, meadow, olympus, forge, underworld, battlefield, trench, grave, parchmentTable };
})();
