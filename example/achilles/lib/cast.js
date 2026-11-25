// cast.js – the characters of "What If You Were Born as Achilles?", drawn entirely in code (SVG strings).
// Our own designs. Style rules from STYLE_BIBLE.md §3: flat vector, one cel-shade tone per colour,
// thin dark-brown outline, chibi heads, dot eyes with a white highlight, rosy cheeks, tiny mouth, expressive brows.
// Every character function draws with the feet at (0,0), facing the viewer, and returns an SVG string.
// Common options: expr (face), blink 0..1, look -1..1, breathe (px, idle bob).
(function () {
  const INK = '#2a1f1b';
  const SW = 4;
  const C = {
    skin: '#f4c9a0', skinS: '#dea57c', cheek: 'rgba(235,110,95,0.42)', mouth: '#6b2b23', tongue: '#e57f73',
    gold: '#efbf4f', goldS: '#c99230', goldL: '#f8dc8c',
    teal: '#2f7f88', tealS: '#225f67', tealL: '#5aa8ae',
    cloth: '#f2e8d4', clothS: '#d8c9ab',
    bronze: '#d6a04a', bronzeS: '#a9742e', bronzeL: '#f3cf83',
    leather: '#7b4a2d', leatherS: '#5a3520',
    lilac: '#dba7bb', lilacS: '#bb859c', lilacL: '#f0cdd9',
    sea: '#4fa3ad', seaS: '#2f7a86', seaL: '#a4d9d5', gown: '#c3e6de', gownS: '#93c8c0', foam: '#f2fbf8',
    ginger: '#bd5d2e', gingerS: '#8f4220',
    felt: '#8b5b3a', feltS: '#6a4128',
    olive: '#857f4b', oliveS: '#655f35',
    wood: '#c08a52', woodS: '#94673a',
    white: '#fffaf0',
  };
  let uid = 0;
  const nid = p => `${p}${++uid}`;
  const n = v => Math.round(v * 10) / 10;
  const ink = (w = SW) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

  // cel shade: fill a shape with the shade colour, then the lit colour shifted up-left, clipped to the shape
  function cel(shape, lit, shade, dx = -0.12, dy = -0.1, size = 1) {
    const cid = nid('c');
    const [w, h] = size instanceof Array ? size : [size, size];
    return `<defs><clipPath id="${cid}">${shape('')}</clipPath></defs>${shape(`fill="${shade}"`)}
      <g clip-path="url(#${cid})"><g transform="translate(${n(dx * w)} ${n(dy * h)})">${shape(`fill="${lit}"`)}</g></g>${shape(`fill="none" ${ink()}`)}`;
  }

  // a limb: rounded capsule from (x1,y1) to (x2,y2)
  function limb(x1, y1, x2, y2, w, fill, shade) {
    const shape = a => `<path d="M${n(x1)},${n(y1)} L${n(x2)},${n(y2)}" ${a.includes('none') ? a.replace('fill="none"', '') + ` stroke-width="${w + SW * 2}" stroke="${INK}"` : ''} fill="none"/>`;
    return `<path d="M${n(x1)},${n(y1)} L${n(x2)},${n(y2)}" stroke="${INK}" stroke-width="${w + SW * 2}" stroke-linecap="round" fill="none"/>
      <path d="M${n(x1)},${n(y1)} L${n(x2)},${n(y2)}" stroke="${shade || fill}" stroke-width="${w}" stroke-linecap="round" fill="none"/>
      <path d="M${n(x1 - w * 0.12)},${n(y1 - w * 0.06)} L${n(x2 - w * 0.12)},${n(y2 - w * 0.06)}" stroke="${fill}" stroke-width="${w * 0.72}" stroke-linecap="round" fill="none"/>`;
  }
  const hand = (x, y, r = 15) => `<circle cx="${n(x)}" cy="${n(y)}" r="${r}" fill="${C.skin}" ${ink()}/>`;

  // ---------- faces ----------
  function face(r, o = {}) {
    const e = o.expr || 'smile';
    const blink = Math.max(0, Math.min(1, o.blink || 0));
    const lx = (o.look || 0) * r * 0.07;
    const ex = 0.33 * r, ey = 0.12 * r, erx = 0.083 * r, ery = 0.108 * r;
    let s = '';
    if (!o.noCheeks) s += `<ellipse cx="${n(-0.55 * r)}" cy="${n(0.36 * r)}" rx="${n(0.15 * r)}" ry="${n(0.085 * r)}" fill="${C.cheek}"/>
      <ellipse cx="${n(0.55 * r)}" cy="${n(0.36 * r)}" rx="${n(0.15 * r)}" ry="${n(0.085 * r)}" fill="${C.cheek}"/>`;
    // eyes
    for (const sd of [-1, 1]) {
      const cx = sd * ex + lx, cy = ey;
      if (e === 'ko') {
        s += `<path d="M${n(cx - erx)},${n(cy - ery * 0.8)} L${n(cx + erx)},${n(cy + ery * 0.8)} M${n(cx + erx)},${n(cy - ery * 0.8)} L${n(cx - erx)},${n(cy + ery * 0.8)}" fill="none" ${ink(SW * 1.2)}/>`;
      } else if (e === 'scream') {
        s += `<path d="M${n(cx - sd * erx * 1.2)},${n(cy - ery * 0.85)} L${n(cx + sd * erx)},${n(cy)} L${n(cx - sd * erx * 1.2)},${n(cy + ery * 0.85)}" fill="none" ${ink(SW * 1.25)}/>`;
      } else if (e === 'happy') {
        s += `<path d="M${n(cx - erx * 1.15)},${n(cy + ery * 0.3)} Q${n(cx)},${n(cy - ery * 1.1)} ${n(cx + erx * 1.15)},${n(cy + ery * 0.3)}" fill="none" ${ink(SW * 1.2)}/>`;
      } else if (blink > 0.85) {
        s += `<path d="M${n(cx - erx * 1.1)},${n(cy)} Q${n(cx)},${n(cy + ery * 0.7)} ${n(cx + erx * 1.1)},${n(cy)}" fill="none" ${ink(SW * 1.1)}/>`;
      } else {
        const ry = ery * (1 - blink);
        s += `<ellipse cx="${n(cx)}" cy="${n(cy + (ery - ry) * 0.5)}" rx="${n(erx)}" ry="${n(ry)}" fill="${INK}"/>`;
        if (ry > ery * 0.55) s += `<circle cx="${n(cx - erx * 0.32)}" cy="${n(cy - ery * 0.38)}" r="${n(erx * 0.36)}" fill="#fff"/>`;
      }
    }
    // brows: [inner dy, outer dy] in r units (+ = lower)
    const B = { smile: [0, 0], neutral: [0, 0], happy: [-0.02, 0], proud: [-0.03, -0.03], angry: [0.08, -0.03], grumpy: [0.06, -0.01],
      sad: [-0.07, 0.03], worried: [-0.07, 0.02], surprised: [-0.09, -0.06], scream: [0.07, -0.02], smirk: [0, 0], calm: [0, 0.01] }[e] || [0, 0];
    const by = ey - 0.29 * r, bl = 0.16 * r;
    for (const sd of [-1, 1]) {
      let bi = B[0], bo = B[1];
      if (e === 'smirk' && sd === 1) { bi = -0.09; bo = -0.07; }
      const xi = sd * (ex - bl * 0.55) + lx, xo = sd * (ex + bl * 0.55) + lx;
      s += `<path d="M${n(xi)},${n(by + bi * r)} Q${n((xi + xo) / 2)},${n(by - 0.03 * r + (bi + bo) * r / 2)} ${n(xo)},${n(by + bo * r)}" fill="none" stroke="${INK}" stroke-width="${n(0.05 * r)}" stroke-linecap="round"/>`;
    }
    // nose
    if (!o.noNose) s += `<path d="M${n(-0.035 * r)},${n(0.25 * r)} q${n(0.035 * r)},${n(0.04 * r)} ${n(0.07 * r)},0" fill="none" stroke="${INK}" stroke-width="${SW * 0.8}" stroke-linecap="round" opacity="0.55"/>`;
    // mouth
    const my = 0.4 * r;
    const M = {
      smile: `<path d="M${n(-0.1 * r)},${n(my - 0.03 * r)} Q0,${n(my + 0.08 * r)} ${n(0.1 * r)},${n(my - 0.03 * r)}" fill="none" ${ink()}/>`,
      calm: `<path d="M${n(-0.07 * r)},${n(my - 0.01 * r)} Q0,${n(my + 0.04 * r)} ${n(0.07 * r)},${n(my - 0.01 * r)}" fill="none" ${ink()}/>`,
      neutral: `<path d="M${n(-0.07 * r)},${n(my)} L${n(0.07 * r)},${n(my)}" ${ink()}/>`,
      grumpy: `<path d="M${n(-0.09 * r)},${n(my + 0.04 * r)} Q0,${n(my - 0.03 * r)} ${n(0.09 * r)},${n(my + 0.04 * r)}" fill="none" ${ink()}/>`,
      sad: `<path d="M${n(-0.09 * r)},${n(my + 0.05 * r)} Q0,${n(my - 0.05 * r)} ${n(0.09 * r)},${n(my + 0.05 * r)}" fill="none" ${ink()}/>`,
      smirk: `<path d="M${n(-0.09 * r)},${n(my + 0.01 * r)} Q${n(0.03 * r)},${n(my + 0.05 * r)} ${n(0.13 * r)},${n(my - 0.07 * r)}" fill="none" ${ink()}/>`,
      surprised: `<ellipse cx="0" cy="${n(my + 0.02 * r)}" rx="${n(0.05 * r)}" ry="${n(0.065 * r)}" fill="${C.mouth}" ${ink(SW * 0.9)}/>`,
    };
    const open = (w, h, y0) => `<path d="M${n(-w)},${n(y0)} Q0,${n(y0 - h * 0.25)} ${n(w)},${n(y0)} Q${n(w * 0.9)},${n(y0 + h)} 0,${n(y0 + h)} Q${n(-w * 0.9)},${n(y0 + h)} ${n(-w)},${n(y0)} Z" fill="${C.mouth}" ${ink()}/>
      <ellipse cx="0" cy="${n(y0 + h * 0.78)}" rx="${n(w * 0.55)}" ry="${n(h * 0.2)}" fill="${C.tongue}"/>`;
    M.happy = open(0.15 * r, 0.17 * r, my - 0.05 * r);
    M.proud = open(0.13 * r, 0.12 * r, my - 0.04 * r);
    M.ko = `<path d="M${n(-0.12 * r)},${n(my)} q${n(0.04 * r)},${n(-0.05 * r)} ${n(0.08 * r)},0 q${n(0.04 * r)},${n(0.05 * r)} ${n(0.08 * r)},0" fill="none" ${ink()}/>`;
    M.angry = M.grumpy;
    M.worried = M.sad;
    M.scream = open(0.17 * r, 0.3 * r, my - 0.1 * r);
    s += M[e] || M.smile;
    return s;
  }

  function head(r, o = {}) {
    const skin = o.skin || C.skin, skinS = o.skinS || C.skinS;
    let s = o.back || '';
    if (o.ears !== false) for (const sd of [-1, 1]) {
      s += `<circle cx="${n(sd * r * 0.96)}" cy="${n(r * 0.14)}" r="${n(r * 0.17)}" fill="${sd < 0 ? skin : skinS}" ${ink()}/>
        <path d="M${n(sd * r * 0.98)},${n(r * 0.06)} q${n(sd * r * 0.07)},${n(r * 0.08)} 0,${n(r * 0.16)}" fill="none" stroke="${INK}" stroke-width="${SW * 0.7}" stroke-linecap="round" opacity="0.6"/>`;
    }
    s += cel(a => `<circle r="${r}" ${a}/>`, skin, skinS, -0.11, -0.11, r);
    s += o.beardBack || '';
    s += face(r, o);
    s += o.beard || '';
    s += o.front || '';
    return s;
  }

  // ---------- hair ----------
  // tousled cap with pointed locks over the forehead
  function tousled(r, o = {}) {
    const col = o.col || C.gold, sh = o.shade || C.goldS;
    const tufts = o.tufts || 5, yb = (o.base ?? -0.36) * r, depth = (o.depth ?? 0.24) * r, top = (o.top ?? 1.17) * r;
    const xl = -0.86 * r, xr = 0.86 * r;
    let d = `M${n(-1.0 * r)},${n((o.side ?? 0.02) * r)} C${n(-1.12 * r)},${n(-0.72 * r)} ${n(-0.62 * r)},${n(-top)} ${n(0.02 * r)},${n(-top)}
      C${n(0.66 * r)},${n(-top)} ${n(1.14 * r)},${n(-0.72 * r)} ${n(1.0 * r)},${n((o.side ?? 0.02) * r)}
      C${n(0.97 * r)},${n(-0.12 * r)} ${n(0.93 * r)},${n(yb)} ${n(xr)},${n(yb)} `;
    for (let i = 0; i < tufts; i++) {
      const a = xr - (i * (xr - xl)) / tufts, b = xr - ((i + 1) * (xr - xl)) / tufts;
      const tx = (a + b) / 2 + (o.slant ?? 0.09) * r, ty = yb + depth * (i % 2 ? 0.75 : 1);
      d += `Q${n(a - 0.02 * r)},${n(ty - 0.02 * r)} ${n(tx)},${n(ty)} Q${n(b + 0.03 * r)},${n((yb + ty) / 2)} ${n(b)},${n(yb)} `;
    }
    d += `C${n(-0.93 * r)},${n(yb)} ${n(-0.97 * r)},${n(-0.12 * r)} ${n(-1.0 * r)},${n((o.side ?? 0.02) * r)} Z`;
    let s = cel(a => `<path d="${d}" ${a}/>`, col, sh, 0.07, 0.08, r);
    // strand lines + cowlick
    s += `<path d="M${n(-0.25 * r)},${n(-0.95 * r)} Q${n(-0.45 * r)},${n(-0.7 * r)} ${n(-0.5 * r)},${n(-0.45 * r)}" fill="none" stroke="${sh}" stroke-width="${SW * 1.2}" stroke-linecap="round"/>
      <path d="M${n(0.35 * r)},${n(-0.98 * r)} Q${n(0.5 * r)},${n(-0.75 * r)} ${n(0.55 * r)},${n(-0.5 * r)}" fill="none" stroke="${sh}" stroke-width="${SW * 1.2}" stroke-linecap="round"/>`;
    if (o.cowlick !== false) s += `<path d="M${n(-0.08 * r)},${n(-top + 0.04 * r)} C${n(-0.12 * r)},${n(-top - 0.3 * r)} ${n(0.28 * r)},${n(-top - 0.32 * r)} ${n(0.3 * r)},${n(-top - 0.1 * r)}
      C${n(0.18 * r)},${n(-top - 0.2 * r)} ${n(0.06 * r)},${n(-top - 0.1 * r)} ${n(0.1 * r)},${n(-top + 0.04 * r)} Z" fill="${col}" ${ink()}/>`;
    return s;
  }

  function babyHair(r) {
    return `<path d="M${n(-0.05 * r)},${n(-0.98 * r)} C${n(-0.12 * r)},${n(-1.32 * r)} ${n(0.3 * r)},${n(-1.38 * r)} ${n(0.32 * r)},${n(-1.12 * r)}
      C${n(0.22 * r)},${n(-1.22 * r)} ${n(0.08 * r)},${n(-1.14 * r)} ${n(0.12 * r)},${n(-0.98 * r)} Z" fill="${C.gold}" ${ink()}/>
      <path d="M${n(-0.42 * r)},${n(-0.88 * r)} q${n(0.06 * r)},${n(-0.14 * r)} ${n(0.16 * r)},${n(-0.1 * r)}" fill="none" stroke="${C.goldS}" stroke-width="${SW * 1.1}" stroke-linecap="round"/>
      <path d="M${n(0.4 * r)},${n(-0.86 * r)} q${n(0.08 * r)},${n(-0.1 * r)} ${n(0.17 * r)},${n(-0.03 * r)}" fill="none" stroke="${C.goldS}" stroke-width="${SW * 1.1}" stroke-linecap="round"/>`;
  }

  // ---------- characters ----------
  function babyAchilles(o = {}) {
    const r = 100, hy = -232 + (o.breathe || 0);
    let s = `<g class="baby">`;
    // legs (sitting, feet forward)
    for (const sd of [-1, 1]) s += cel(a => `<ellipse cx="${sd * 50}" cy="-26" rx="40" ry="27" ${a}/>`, C.skin, C.skinS, -0.15, -0.2, 40)
      + `<ellipse cx="${sd * 74}" cy="-14" rx="18" ry="14" fill="${C.skin}" ${ink()}/>`;
    // torso
    s += cel(a => `<ellipse cx="0" cy="-96" rx="70" ry="74" ${a}/>`, C.skin, C.skinS, -0.12, -0.1, 70);
    // swaddle cloth (cream, knotted)
    s += cel(a => `<path d="M-68,-82 Q0,-52 68,-82 Q72,-36 40,-22 Q0,-10 -40,-22 Q-72,-36 -68,-82 Z" ${a}/>`, C.cloth, C.clothS, 0, -0.15, 70)
      + `<path d="M-6,-62 q8,10 16,0" fill="none" ${ink(SW * 0.8)}/>`;
    s += `<path d="M-6,-112 q6,6 12,0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" opacity="0.6"/>`;
    // arms
    const up = o.armsUp ? -1 : 1;
    s += limb(-58, -128, -84, -128 + 46 * up, 28, C.skin, C.skinS) + hand(-86, -128 + 52 * up, 17);
    s += limb(58, -128, 84, -128 + 46 * up, 28, C.skin, C.skinS) + hand(86, -128 + 52 * up, 17);
    s += `<g transform="translate(0 ${hy})">${head(r, { ...o, front: babyHair(r) })}</g>`;
    return s + '</g>';
  }

  function kidAchilles(o = {}) {
    const r = 95, b = o.breathe || 0;
    let s = '';
    // legs + sandals
    for (const sd of [-1, 1]) {
      s += limb(sd * 24, -80, sd * 26, -16, 26, C.skin, C.skinS);
      s += `<path d="M${sd * 26 - 20},-4 Q${sd * 26},-22 ${sd * 26 + 20 * 1},-4 Z" fill="${C.leather}" ${ink()}/>
        <path d="M${sd * 26 - 13},-22 L${sd * 26 + 13},-14" stroke="${C.leatherS}" stroke-width="5" stroke-linecap="round"/>`;
    }
    // arms behind the tunic edge
    s += limb(-50, -196 + b, -78, -118 + b, 25, C.skin, C.skinS) + hand(-80, -110 + b, 15);
    s += limb(50, -196 + b, 78, -118 + b, 25, C.skin, C.skinS) + hand(80, -110 + b, 15);
    // tunic
    const tun = a => `<path d="M-46,${-206 + b} Q0,${-214 + b} 46,${-206 + b} Q58,-140 72,-66 Q0,-56 -72,-66 Q-58,-140 -46,${-206 + b} Z" ${a}/>`;
    s += cel(tun, C.teal, C.tealS, -0.14, 0, 72);
    // gold hem with a small key pattern
    s += `<path d="M-70,-78 Q0,-68 70,-78 L72,-66 Q0,-56 -72,-66 Z" fill="${C.bronze}" ${ink(SW * 0.8)}/>`;
    for (let x = -56; x <= 50; x += 18) s += `<path d="M${x},-66 l0,-7 l9,0 l0,4" fill="none" stroke="${C.tealS}" stroke-width="2.6"/>`;
    // belt + neckline
    s += `<path d="M-56,${-142 + b} Q0,${-132 + b} 56,${-142 + b}" fill="none" stroke="${C.leather}" stroke-width="11" stroke-linecap="round"/>
      <path d="M-56,${-142 + b} Q0,${-132 + b} 56,${-142 + b}" fill="none" ${ink(2)} opacity="0.5"/>
      <path d="M-18,${-208 + b} Q0,${-190 + b} 18,${-208 + b}" fill="none" stroke="${C.tealS}" stroke-width="5" stroke-linecap="round"/>`;
    s += `<g transform="translate(0 ${-284 + b})">${head(r, { ...o, front: tousled(r, { tufts: 5 }) })}</g>`;
    return s;
  }

  // a girl in a peplos. Default = Achilles as "Pyrrha". Options: P (hair, hairS, dress, dressS, dressL, ribbon),
  // arms: 'crossed' | 'down' | 'armed' (spear + shield) | 'run' · hair: 'bun' | 'long' · lashes: true
  function gown(o = {}) {
    const P = { hair: C.gold, hairS: C.goldS, dress: C.lilac, dressS: C.lilacS, dressL: C.lilacL, ribbon: C.lilacS, ...(o.P || {}) };
    const r = 88, b = o.breathe || 0, arms = o.arms || 'crossed';
    let s = '';
    for (const sd of [-1, 1]) s += `<path d="M${sd * 26 - 22},-2 Q${sd * 26},-26 ${sd * 26 + 22},-2 Z" fill="${C.leather}" ${ink()}/>`;
    if (o.hair === 'long') s += cel(a => `<path d="M-74,${-430 + b} C-120,-400 -112,-330 -96,-268 Q-60,-250 0,-262 Q60,-250 96,-268 C112,-330 120,-400 74,${-430 + b} Z" ${a}/>`, P.hair, P.hairS, 0.08, 0, 110);
    const dress = a => `<path d="M-50,${-306 + b} Q0,${-316 + b} 50,${-306 + b} C62,-210 92,-90 104,-16 Q0,-2 -104,-16 C-92,-90 -62,-210 -50,${-306 + b} Z" ${a}/>`;
    s += cel(dress, P.dress, P.dressS, -0.16, 0, 104);
    s += `<path d="M-30,-250 Q-40,-140 -60,-30 M20,-240 Q30,-140 44,-24" fill="none" stroke="${P.dressS}" stroke-width="4" stroke-linecap="round"/>`;
    s += `<path d="M-56,${-262 + b} Q0,${-252 + b} 56,${-262 + b} L64,-206 Q48,-196 32,-206 Q16,-196 0,-206 Q-16,-196 -32,-206 Q-48,-196 -64,-206 Z" fill="${P.dressL}" ${ink(SW * 0.9)}/>`;
    s += `<path d="M-54,${-252 + b} Q0,${-242 + b} 54,${-252 + b}" fill="none" stroke="${C.bronze}" stroke-width="9" stroke-linecap="round"/>`;
    if (arms === 'crossed') {
      s += limb(52, -296 + b, 68, -246 + b, 25, C.skin, C.skinS) + limb(68, -246 + b, -26, -262 + b, 24, C.skin, C.skinS);
      s += limb(-52, -296 + b, -68, -244 + b, 25, C.skin, C.skinS) + limb(-68, -244 + b, 30, -250 + b, 24, C.skin, C.skinS);
      s += hand(36, -252 + b, 14);
    } else if (arms === 'down') {
      for (const sd of [-1, 1]) s += limb(sd * 52, -296 + b, sd * 70, -200 + b, 24, C.skin, C.skinS) + hand(sd * 72, -192 + b, 14);
    } else if (arms === 'run') {
      s += limb(-52, -296 + b, -96, -330 + b, 24, C.skin, C.skinS) + hand(-100, -336 + b, 14);
      s += limb(52, -296 + b, 100, -250 + b, 24, C.skin, C.skinS) + hand(104, -246 + b, 14);
    } else if (arms === 'armed') {
      s += `<rect x="96" y="-560" width="10" height="560" rx="4" fill="${C.wood}" ${ink(SW * 0.8)}/>
        <path d="M101,-636 Q118,-590 107,-556 L95,-556 Q84,-590 101,-636 Z" fill="${C.bronze}" ${ink()}/>`;
      s += limb(52, -296 + b, 98, -250 + b, 24, C.skin, C.skinS) + hand(101, -246 + b, 15);
      s += limb(-52, -296 + b, -84, -238 + b, 24, C.skin, C.skinS);
    }
    s += `<path d="M-40,${-306 + b} L-34,${-286 + b} M40,${-306 + b} L34,${-286 + b}" stroke="${C.bronze}" stroke-width="7" stroke-linecap="round"/>`;
    const back = (o.hair === 'long' ? '' : `<circle cx="${n(0.1 * r)}" cy="${n(-1.12 * r)}" r="${n(0.34 * r)}" fill="${P.hair}" ${ink()}/>
      <path d="M${n(0.1 * r)},${n(-1.12 * r)} m-24,-6 q12,-8 22,2" fill="none" stroke="${P.hairS}" stroke-width="5" stroke-linecap="round"/>`) +
      `<ellipse cx="${n(0.5 * r)}" cy="${n(-0.98 * r)}" rx="17" ry="11" transform="rotate(-35 ${n(0.5 * r)} ${n(-0.98 * r)})" fill="${P.ribbon}" ${ink(SW * 0.9)}/>
      <ellipse cx="${n(0.5 * r)}" cy="${n(-0.7 * r)}" rx="17" ry="11" transform="rotate(30 ${n(0.5 * r)} ${n(-0.7 * r)})" fill="${P.ribbon}" ${ink(SW * 0.9)}/>
      <circle cx="${n(0.38 * r)}" cy="${n(-0.84 * r)}" r="9" fill="${P.ribbon}" ${ink(SW * 0.9)}/>`;
    const locks = `<path d="M${n(-0.98 * r)},${n(-0.1 * r)} Q${n(-1.1 * r)},${n(0.4 * r)} ${n(-0.86 * r)},${n(0.62 * r)} Q${n(-0.84 * r)},${n(0.3 * r)} ${n(-0.78 * r)},${n(-0.05 * r)} Z" fill="${P.hair}" ${ink()}/>
      <path d="M${n(0.98 * r)},${n(-0.1 * r)} Q${n(1.1 * r)},${n(0.4 * r)} ${n(0.86 * r)},${n(0.62 * r)} Q${n(0.84 * r)},${n(0.3 * r)} ${n(0.78 * r)},${n(-0.05 * r)} Z" fill="${P.hairS}" ${ink()}/>`;
    const lashes = o.lashes ? [-1, 1].map(sd => `<path d="M${n(sd * 0.42 * r)},${n(0.04 * r)} l${n(sd * 0.08 * r)},${n(-0.06 * r)}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`).join('') : '';
    const front = tousled(r, { tufts: 4, top: 1.1, base: -0.4, cowlick: false, col: P.hair, shade: P.hairS }) + locks + lashes;
    s += `<g transform="translate(0 ${-388 + b})">${head(r, { expr: 'grumpy', ...o, back, ears: false, front })}</g>`;
    if (arms === 'armed') s += shield(-96, -232 + b, 78);
    return s;
  }
  const teenPyrrha = o => gown(o);
  const PRINCESS = [
    { hair: '#6b3f26', hairS: '#4e2c1a', dress: '#a9c79a', dressS: '#86a877', dressL: '#cfe2c4', ribbon: '#e2b04e' },
    { hair: '#2e2420', hairS: '#1b1512', dress: '#9cc3e0', dressS: '#78a3c4', dressL: '#c9e0f0', ribbon: '#d9a5b9' },
    { hair: '#a64b2a', hairS: '#7e3519', dress: '#f2c29b', dressS: '#d8a077', dressL: '#f8dcc3', ribbon: '#2f7f88' },
    { hair: '#3f2a1e', hairS: '#2a1b12', dress: '#efe4cc', dressS: '#d3c4a3', dressL: '#f9f3e4', ribbon: '#b5553a' },
    { hair: '#7a5230', hairS: '#5a3b20', dress: '#e7a9a0', dressS: '#c98a80', dressL: '#f4cdc6', ribbon: '#efbf4f' },
  ];
  const princess = (k, o = {}) => gown({ expr: 'happy', lashes: true, hair: k % 2 ? 'long' : 'bun', arms: 'down', ...o, P: PRINCESS[k % PRINCESS.length] });

  // the seer: hooded, long grey beard, staff, pointing at you
  function seer(o = {}) {
    const r = 80, robe = '#4a3a5c', robeS = '#352a43';
    let s = '';
    s += `<rect x="-150" y="-560" width="12" height="560" rx="4" fill="${C.wood}" ${ink(SW * 0.8)}/><circle cx="-144" cy="-566" r="18" fill="#9fe0dc" ${ink()}/>`;
    s += cel(a => `<path d="M-70,-360 Q-120,-180 -118,-10 Q0,6 118,-10 Q120,-180 70,-360 Q0,-380 -70,-360 Z" ${a}/>`, robe, robeS, -0.15, 0, 120);
    s += limb(-66, -330, -140, -300, 26, robe, robeS) + hand(-146, -300, 16);
    // pointing arm, coming forward
    s += limb(60, -330, 70, -230, 30, robe, robeS) + hand(70, -214, 22) + `<ellipse cx="70" cy="-188" rx="9" ry="16" fill="${C.skin}" ${ink()}/>`;
    const hood = `<path d="M${n(-1.22 * r)},${n(0.9 * r)} C${n(-1.4 * r)},${n(-0.6 * r)} ${n(-0.7 * r)},${n(-1.45 * r)} 0,${n(-1.42 * r)} C${n(0.7 * r)},${n(-1.45 * r)} ${n(1.4 * r)},${n(-0.6 * r)} ${n(1.22 * r)},${n(0.9 * r)} L${n(0.96 * r)},${n(0.8 * r)} C${n(1.08 * r)},${n(-0.4 * r)} ${n(0.6 * r)},${n(-1.1 * r)} 0,${n(-1.1 * r)} C${n(-0.6 * r)},${n(-1.1 * r)} ${n(-1.08 * r)},${n(-0.4 * r)} ${n(-0.96 * r)},${n(0.8 * r)} Z" fill="${robe}" ${ink()}/>`;
    const beard = `<path d="M${n(-0.9 * r)},${n(0.05 * r)} Q${n(-0.95 * r)},${n(1.2 * r)} 0,${n(1.9 * r)} Q${n(0.95 * r)},${n(1.2 * r)} ${n(0.9 * r)},${n(0.05 * r)} Q${n(0.6 * r)},${n(0.48 * r)} 0,${n(0.44 * r)} Q${n(-0.6 * r)},${n(0.48 * r)} ${n(-0.9 * r)},${n(0.05 * r)} Z" fill="#dcd8d0" ${ink()}/>
      <path d="M${n(-0.3 * r)},${n(0.9 * r)} q${n(0.1 * r)},${n(0.4 * r)} ${n(0.2 * r)},${n(0.6 * r)} M${n(0.25 * r)},${n(0.9 * r)} q${n(0.02 * r)},${n(0.4 * r)} ${n(-0.08 * r)},${n(0.6 * r)}" fill="none" stroke="#b5afa4" stroke-width="4" stroke-linecap="round"/>`;
    s += `<g transform="translate(0 -440)">${head(r, { expr: 'angry', ...o, noCheeks: true, ears: false, beardBack: beard, front: hood })}</g>`;
    return s;
  }

  function shield(x, y, R, o = {}) {
    const P = { face: C.bronze, faceS: C.bronzeS, rim: C.teal, mark: C.tealS, ...o };
    let s = cel(a => `<circle cx="${x}" cy="${y}" r="${R}" ${a}/>`, P.face, P.faceS, -0.1, -0.1, R);
    s += `<circle cx="${x}" cy="${y}" r="${n(R * 0.82)}" fill="none" stroke="${P.rim}" stroke-width="${n(R * 0.1)}"/>
      <circle cx="${x}" cy="${y}" r="${n(R * 0.82)}" fill="none" ${ink(2)} opacity="0.5"/>`;
    const w = R * 0.5;
    if (P.emblem === 'trident') {
      // Cycnus, son of Poseidon
      s += `<path d="M${x},${n(y + R * 0.55)} L${x},${n(y - R * 0.38)} M${n(x - R * 0.3)},${n(y - R * 0.5)} L${n(x - R * 0.3)},${n(y - R * 0.18)} Q${x},${n(y + R * 0.02)} ${n(x + R * 0.3)},${n(y - R * 0.18)} L${n(x + R * 0.3)},${n(y - R * 0.5)}"
        fill="none" stroke="${P.mark}" stroke-width="${n(R * 0.09)}" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M${x},${n(y - R * 0.58)} l${n(-R * 0.08)},${n(R * 0.14)} l${n(R * 0.16)},0 Z" fill="${P.mark}"/>`;
    } else {
      // Achilles: three sea waves (his mother)
      for (const dy of [-0.22, 0.05, 0.32]) {
        const yy = y + dy * R;
        s += `<path d="M${n(x - w)},${n(yy)} q${n(w * 0.25)},${n(-w * 0.32)} ${n(w * 0.5)},0 q${n(w * 0.25)},${n(w * 0.32)} ${n(w * 0.5)},0 q${n(w * 0.25)},${n(-w * 0.32)} ${n(w * 0.5)},0 q${n(w * 0.25)},${n(w * 0.32)} ${n(w * 0.5)},0"
          fill="none" stroke="${P.mark}" stroke-width="${n(R * 0.07)}" stroke-linecap="round"/>`;
      }
    }
    s += `<path d="M${n(x - R * 0.55)},${n(y - R * 0.6)} Q${n(x - R * 0.2)},${n(y - R * 0.85)} ${n(x + R * 0.15)},${n(y - R * 0.8)}" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="${n(R * 0.07)}" stroke-linecap="round"/>`;
    return s;
  }

  // crested helmet (Corinthian-style, our shapes), drawn over a head of radius r
  function helmet(r, P) {
    return cel(a => `<path d="M${n(-1.08 * r)},${n(0.55 * r)} C${n(-1.2 * r)},${n(-0.7 * r)} ${n(-0.6 * r)},${n(-1.2 * r)} 0,${n(-1.18 * r)} C${n(0.6 * r)},${n(-1.2 * r)} ${n(1.2 * r)},${n(-0.7 * r)} ${n(1.08 * r)},${n(0.55 * r)}
        L${n(0.72 * r)},${n(0.6 * r)} L${n(0.7 * r)},${n(-0.12 * r)} Q0,${n(-0.36 * r)} ${n(-0.7 * r)},${n(-0.12 * r)} L${n(-0.72 * r)},${n(0.6 * r)} Z" ${a}/>`, P.metal, P.metalS, -0.1, -0.08, r)
      + `<path d="M${n(-0.62 * r)},${n(-1.08 * r)} C${n(-0.4 * r)},${n(-1.9 * r)} ${n(0.5 * r)},${n(-1.95 * r)} ${n(0.9 * r)},${n(-1.2 * r)} C${n(0.5 * r)},${n(-1.45 * r)} ${n(-0.2 * r)},${n(-1.5 * r)} ${n(-0.62 * r)},${n(-1.08 * r)} Z" fill="${P.crest}" ${ink()}/>`;
  }

  // a Greek warrior. Default palette = adult Achilles. Options: palette overrides, cape, helmet, spear, shieldOn
  function hero(o = {}) {
    const P = { tunic: C.teal, tunicS: C.tealS, cape: C.teal, capeS: C.tealS, metal: C.bronze, metalS: C.bronzeS, metalL: C.bronzeL,
      hair: C.gold, hairS: C.goldS, crest: '#b8352c', emblem: 'waves', rim: C.teal, mark: C.tealS, ...(o.P || {}) };
    const r = 72, b = o.breathe || 0;
    let s = '';
    if (o.cape !== false) s += cel(a => `<path d="M-74,${-392 + b} Q-130,-200 -118,-70 Q-40,-50 0,-80 Q40,-50 118,-70 Q130,-200 74,${-392 + b} Z" ${a}/>`, P.cape, P.capeS, 0.1, 0, 120);
    for (const sd of [-1, 1]) {
      s += limb(sd * 30, -196, sd * 33, -24, 32, C.skin, C.skinS);
      s += cel(a => `<path d="M${sd * 33 - 21},-118 Q${sd * 33},-128 ${sd * 33 + 21},-118 L${sd * 33 + 18},-30 Q${sd * 33},-24 ${sd * 33 - 18},-30 Z" ${a}/>`, P.metal, P.metalS, -0.25, 0, 20);
      s += `<path d="M${sd * 33 - 24},-2 Q${sd * 33},-26 ${sd * 33 + 24},-2 Z" fill="${C.leather}" ${ink()}/>`;
    }
    s += `<path d="M-70,-226 Q0,-220 70,-226 L80,-158 Q0,-150 -80,-158 Z" fill="${P.tunic}" ${ink()}/>`;
    for (let i = 0; i < 7; i++) s += `<rect x="${-66 + i * 22 - 9}" y="-232" width="19" height="62" rx="6" fill="${i % 2 ? C.leather : C.leatherS}" ${ink(SW * 0.8)}/>`;
    s += limb(84, -384 + b, 102, -300 + b, 30, C.skin, C.skinS) + limb(102, -300 + b, 108, -236 + b, 27, C.skin, C.skinS);
    s += `<path d="M95,-282 L118,-282 L116,-246 L96,-246 Z" fill="${P.metal}" ${ink(SW * 0.9)}/>`;
    s += limb(-84, -384 + b, -104, -306 + b, 30, C.skin, C.skinS);
    const cu = a => `<path d="M-80,${-398 + b} Q0,${-414 + b} 80,${-398 + b} Q96,-310 68,-222 Q0,-212 -68,-222 Q-96,-310 -80,${-398 + b} Z" ${a}/>`;
    s += cel(cu, P.metal, P.metalS, -0.14, -0.04, 90);
    s += `<path d="M-50,-330 Q-26,-306 0,-326 Q26,-306 50,-330" fill="none" stroke="${P.metalS}" stroke-width="5" stroke-linecap="round"/>
      <path d="M0,-318 L0,-236 M-30,-282 Q0,-274 30,-282 M-28,-254 Q0,-246 28,-254" fill="none" stroke="${P.metalS}" stroke-width="4" stroke-linecap="round"/>
      <path d="M-58,-382 Q-66,-330 -56,-300" fill="none" stroke="${P.metalL}" stroke-width="6" stroke-linecap="round"/>`;
    if (o.cape !== false) s += `<circle cx="-62" cy="${-392 + b}" r="10" fill="${C.goldL}" ${ink(SW * 0.8)}/><circle cx="62" cy="${-392 + b}" r="10" fill="${C.goldL}" ${ink(SW * 0.8)}/>`;
    if (o.spear !== false) s += `<rect x="104" y="-610" width="11" height="600" rx="4" fill="${C.wood}" ${ink(SW * 0.8)}/>
      <path d="M109.5,-690 Q128,-640 116,-606 L103,-606 Q91,-640 109.5,-690 Z" fill="${P.metal}" ${ink()}/>
      <path d="M109.5,-680 L109.5,-612" stroke="${P.metalS}" stroke-width="3"/>`;
    s += hand(110, -232 + b, 16);
    s += `<rect x="-20" y="${-428 + b}" width="40" height="34" fill="${C.skinS}" ${ink()}/>`;
    const back = `<path d="M${n(-0.9 * r)},${n(0.1 * r)} Q${n(-1.05 * r)},${n(0.75 * r)} ${n(-0.6 * r)},${n(0.95 * r)} L${n(0.6 * r)},${n(0.95 * r)} Q${n(1.05 * r)},${n(0.75 * r)} ${n(0.9 * r)},${n(0.1 * r)} Z" fill="${P.hairS}" ${ink()}/>`;
    const front = o.helmet ? helmet(r, P) : tousled(r, { tufts: 6, depth: 0.28, col: P.hair, shade: P.hairS });
    s += `<g transform="translate(0 ${-470 + b})">${head(r, { expr: 'proud', ...o, back, front })}</g>`;
    if (o.shieldOn !== false) s += shield(-112, -300 + b, 94, { rim: P.rim, mark: P.mark, emblem: P.emblem, face: P.metal, faceS: P.metalS });
    return s;
  }
  const adultAchilles = o => hero(o);
  // Cycnus, son of Poseidon: white (swan) hair, sea-blue armour, trident on the shield
  const cycnus = o => hero({ ...o, cape: false, P: { tunic: '#3e6f9e', tunicS: '#2c537a', metal: '#7fb2c9', metalS: '#4f86a1', metalL: '#c4e3ee',
    hair: '#f4f1ea', hairS: '#cfc8bb', emblem: 'trident', rim: '#2c537a', mark: '#1f3f60' } });

  // the baby hanging upside down: the held foot is at (0,0), the body hangs down (+y), the head is upside down
  function babyHang(o = {}) {
    const r = 100, sw = o.swing || 0; // swing: small sideways sway of the free limbs
    let s = '';
    // free leg, kicking
    s += limb(26, 96, 66 + sw * 6, 48, 30, C.skin, C.skinS) + limb(66 + sw * 6, 48, 92 + sw * 8, 82, 28, C.skin, C.skinS);
    s += `<ellipse cx="${96 + sw * 8}" cy="88" rx="18" ry="14" fill="${C.skin}" ${ink()}/>`;
    // held leg (straight up) + foot
    s += limb(-4, 10, -10, 104, 32, C.skin, C.skinS);
    s += `<ellipse cx="-2" cy="2" rx="16" ry="20" fill="${o.wet ? C.skin : C.skin}" ${ink()}/>`;
    // torso + cloth at the hips
    s += cel(a => `<ellipse cx="0" cy="176" rx="68" ry="74" ${a}/>`, C.skin, C.skinS, -0.12, 0.1, 70);
    s += cel(a => `<path d="M-66,150 Q0,124 66,150 Q70,110 40,100 Q0,92 -40,100 Q-70,110 -66,150 Z" ${a}/>`, C.cloth, C.clothS, 0, 0.15, 70);
    s += `<path d="M-6,226 q6,-6 12,0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" opacity="0.6"/>`;
    // arms dangling down
    s += limb(-56, 214, -118 + sw * 10, 326, 28, C.skin, C.skinS) + hand(-122 + sw * 10, 334, 17);
    s += limb(56, 214, 118 + sw * 10, 326, 28, C.skin, C.skinS) + hand(122 + sw * 10, 334, 17);
    // head, upside down
    s += `<g transform="translate(0 ${336}) rotate(180)">${head(r, { ...o, front: babyHair(r) })}</g>`;
    return s;
  }

  // a lion that lost the fight: lying on its back, legs up, X eyes, tongue out. origin = middle of the body on the ground
  function lionKO(o = {}) {
    const fur = '#dca660', furS = '#b7813f', mane = '#a3562b', maneS = '#7f3f1e';
    let s = '';
    // tail towards +x (to the kid's hand)
    s += `<path d="M120,-40 Q190,-30 ${o.tailX ?? 250},${o.tailY ?? -90}" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>
      <path d="M120,-40 Q190,-30 ${o.tailX ?? 250},${o.tailY ?? -90}" fill="none" stroke="${fur}" stroke-width="9" stroke-linecap="round"/>
      <ellipse cx="${o.tailX ?? 250}" cy="${o.tailY ?? -90}" rx="18" ry="14" fill="${mane}" ${ink()}/>`;
    // legs up
    for (const x of [-70, -30, 40, 80]) s += limb(x, -60, x + (x > 0 ? 10 : -10), -150, 30, fur, furS)
      + `<ellipse cx="${x + (x > 0 ? 10 : -10)}" cy="-156" rx="20" ry="15" fill="${fur}" ${ink()}/>`;
    s += cel(a => `<ellipse cx="0" cy="-48" rx="138" ry="62" ${a}/>`, fur, furS, -0.05, -0.2, 140);
    s += `<ellipse cx="10" cy="-30" rx="80" ry="26" fill="#f0d29a" opacity="0.8"/>`;
    // head on the left with mane
    let m = '';
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; m += `<circle cx="${n(-170 + Math.cos(a) * 62)}" cy="${n(-62 + Math.sin(a) * 62)}" r="30" fill="${i % 2 ? mane : maneS}" ${ink()}/>`; }
    s += m;
    s += cel(a => `<circle cx="-170" cy="-62" r="58" ${a}/>`, fur, furS, -0.1, -0.1, 58);
    for (const dx of [-22, 16]) s += `<path d="M${-170 + dx - 9},-80 l18,18 M${-170 + dx + 9},-80 l-18,18" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
    s += `<ellipse cx="-172" cy="-44" rx="16" ry="10" fill="#5a3220" ${ink(3)}/>
      <path d="M-178,-28 q-4,22 10,24 q10,-2 6,-22 Z" fill="#e57f73" ${ink(3)}/>`;
    return s;
  }

  // two horse legs + hooves (Chiron at the edge of the frame); origin = ground between the hooves
  function centaurLegs() {
    const h = '#8a5a36', hS = '#6b4226';
    let s = '';
    for (const x of [-34, 34]) s += limb(x, -260, x + 4, -40, 36, h, hS) + `<path d="M${x - 24},-4 L${x - 18},-42 L${x + 26},-42 L${x + 30},-4 Z" fill="#2e2420" ${ink()}/>`;
    s += cel(a => `<ellipse cx="0" cy="-300" rx="120" ry="80" ${a}/>`, h, hS, 0, -0.15, 120);
    return s;
  }

  // Priam on the wall: bust (hidden below by the battlement), white beard, crown, hands to his face
  function priamBust(o = {}) {
    const r = 76;
    let s = '';
    s += cel(a => `<path d="M-120,40 Q-110,-60 -60,-80 Q0,-96 60,-80 Q110,-60 120,40 Z" ${a}/>`, '#6d3f8a', '#53306b', -0.1, 0, 120);
    s += `<path d="M-40,-82 L-30,40 M40,-82 L30,40" stroke="#d6a04a" stroke-width="10"/>`;
    const beard = `<path d="M${n(-0.92 * r)},${n(0.0 * r)} Q${n(-1.0 * r)},${n(0.9 * r)} ${n(-0.3 * r)},${n(1.25 * r)} Q0,${n(1.5 * r)} ${n(0.3 * r)},${n(1.25 * r)} Q${n(1.0 * r)},${n(0.9 * r)} ${n(0.92 * r)},${n(0.0 * r)}
        Q${n(0.7 * r)},${n(0.42 * r)} ${n(0.32 * r)},${n(0.5 * r)} Q0,${n(0.4 * r)} ${n(-0.32 * r)},${n(0.5 * r)} Q${n(-0.7 * r)},${n(0.42 * r)} ${n(-0.92 * r)},${n(0.0 * r)} Z" fill="#f1ede4" ${ink()}/>`;
    const tache = `<path d="M${n(-0.3 * r)},${n(0.36 * r)} Q0,${n(0.22 * r)} ${n(0.3 * r)},${n(0.36 * r)} Q${n(0.12 * r)},${n(0.42 * r)} 0,${n(0.32 * r)} Q${n(-0.12 * r)},${n(0.42 * r)} ${n(-0.3 * r)},${n(0.36 * r)} Z" fill="#dcd6ca" ${ink(SW * 0.8)}/>`;
    const crown = `<path d="M${n(-0.82 * r)},${n(-0.6 * r)} L${n(-0.82 * r)},${n(-1.12 * r)} L${n(-0.5 * r)},${n(-0.86 * r)} L${n(-0.2 * r)},${n(-1.22 * r)} L${n(0.1 * r)},${n(-0.88 * r)} L${n(0.42 * r)},${n(-1.2 * r)} L${n(0.82 * r)},${n(-1.1 * r)} L${n(0.82 * r)},${n(-0.6 * r)} Q0,${n(-0.75 * r)} ${n(-0.82 * r)},${n(-0.6 * r)} Z" fill="#e8bd55" ${ink()}/>`;
    const hair = `<path d="M${n(-1.0 * r)},${n(0.1 * r)} Q${n(-1.06 * r)},${n(-0.5 * r)} ${n(-0.8 * r)},${n(-0.66 * r)} L${n(0.8 * r)},${n(-0.66 * r)} Q${n(1.06 * r)},${n(-0.5 * r)} ${n(1.0 * r)},${n(0.1 * r)} Q${n(0.86 * r)},${n(-0.3 * r)} ${n(0.6 * r)},${n(-0.5 * r)} Q0,${n(-0.6 * r)} ${n(-0.6 * r)},${n(-0.5 * r)} Q${n(-0.86 * r)},${n(-0.3 * r)} ${n(-1.0 * r)},${n(0.1 * r)} Z" fill="#e9e4da" ${ink()}/>`;
    s += `<g transform="translate(0 -170)">${head(r, { expr: 'worried', ...o, noCheeks: true, beardBack: beard, beard: tache, front: hair + crown })}
      ${hand(-0.78 * r, 0.62 * r, 17)}${hand(0.78 * r, 0.62 * r, 17)}</g>`;
    return s;
  }

  function thetis(o = {}) {
    const r = 80, b = o.breathe || 0;
    let s = '';
    // long sea hair behind, ending in wave curls
    const hairBack = a => `<path d="M-60,${-500 + b} C-128,-470 -150,-380 -132,-300 C-120,-250 -146,-220 -134,-180
      q-6,26 16,30 q20,4 22,-16 q14,22 34,10 q14,-10 6,-28 L74,-196 q-8,18 6,28 q20,12 34,-10 q2,20 22,16 q22,-4 16,-30
      C146,-220 120,-250 132,-300 C150,-380 128,-470 60,${-500 + b} Z" ${a}/>`;
    s += cel(hairBack, C.sea, C.seaS, 0.08, 0, 140);
    s += `<path d="M-108,-420 C-124,-360 -110,-300 -118,-240 M110,-420 C124,-360 110,-300 118,-240" fill="none" stroke="${C.seaL}" stroke-width="6" stroke-linecap="round" opacity="0.8"/>`;
    // gown flaring into waves
    const gown = a => `<path d="M-46,${-372 + b} Q0,${-382 + b} 46,${-372 + b} C60,-270 96,-130 120,-34 Q100,-14 80,-30 Q60,-12 40,-28 Q20,-10 0,-26 Q-20,-10 -40,-28 Q-60,-12 -80,-30 Q-100,-14 -120,-34 C-96,-130 -60,-270 -46,${-372 + b} Z" ${a}/>`;
    s += cel(gown, C.gown, C.gownS, -0.16, 0, 120);
    s += `<path d="M-20,-300 Q-34,-170 -56,-50 M18,-300 Q30,-170 50,-48" fill="none" stroke="${C.gownS}" stroke-width="4" stroke-linecap="round"/>`;
    // foam at the hem
    for (let i = -3; i <= 3; i++) s += `<path d="M${i * 38 - 18},-14 q9,-16 20,-4 q8,-12 18,0" fill="${C.foam}" ${ink(SW * 0.7)}/>`;
    // sash
    s += `<path d="M-48,${-318 + b} Q0,${-306 + b} 48,${-318 + b}" fill="none" stroke="${C.seaS}" stroke-width="10" stroke-linecap="round"/>`;
    // arms: one relaxed, one raised, palm open
    s += limb(-46, -360 + b, -70, -282 + b, 22, C.skin, C.skinS) + limb(-70, -282 + b, -60, -212 + b, 20, C.skin, C.skinS) + hand(-58, -204 + b, 13);
    if (o.holdOut) s += limb(46, -360 + b, 118, -318 + b, 22, C.skin, C.skinS) + limb(118, -318 + b, 170, -262 + b, 20, C.skin, C.skinS); // hand drawn by the scene, around the baby's foot
    else s += limb(46, -360 + b, 84, -300 + b, 22, C.skin, C.skinS) + limb(84, -300 + b, 112, -350 + b, 20, C.skin, C.skinS) + hand(115, -358 + b, 14);
    s += `<rect x="-15" y="${-398 + b}" width="30" height="30" fill="${C.skinS}" ${ink()}/>`;
    // head: two locks parted in the middle, forehead free, curls at the ends, pearl circlet
    const lock = sd => {
      const x = v => n(sd * v * r), y = v => n(v * r);
      return `<path d="M${x(0.02)},${y(-1.18)} C${x(0.62)},${y(-1.22)} ${x(1.16)},${y(-0.8)} ${x(1.1)},${y(0.0)}
        C${x(1.08)},${y(0.4)} ${x(1.02)},${y(0.64)} ${x(0.86)},${y(0.74)} q${x(-0.16)},${y(0.04)} ${x(-0.14)},${y(-0.12)} q${x(0.06)},${y(-0.08)} ${x(0.12)},${y(-0.02)}
        C${x(0.86)},${y(0.24)} ${x(0.9)},${y(-0.12)} ${x(0.78)},${y(-0.36)} C${x(0.62)},${y(-0.3)} ${x(0.46)},${y(-0.36)} ${x(0.36)},${y(-0.5)}
        C${x(0.26)},${y(-0.44)} ${x(0.12)},${y(-0.5)} ${x(0.04)},${y(-0.66)} Z" fill="${sd < 0 ? C.sea : C.seaS}" ${ink()}/>
        <path d="M${x(0.3)},${y(-1.08)} Q${x(0.82)},${y(-0.9)} ${x(0.96)},${y(-0.2)}" fill="none" stroke="${C.seaL}" stroke-width="5" stroke-linecap="round" opacity="0.85"/>`;
    };
    const front = lock(-1) + lock(1) +
      [-0.56, -0.28, 0, 0.28, 0.56].map(t => `<circle cx="${n(t * r)}" cy="${n((-0.84 - 0.22 * (1 - Math.abs(t) * 1.3)) * r)}" r="${n(0.06 * r)}" fill="${C.white}" ${ink(2.5)}/>`).join('');
    s += `<g transform="translate(0 ${-452 + b})">${head(r, { expr: 'calm', ...o, ears: false, front })}</g>`;
    return s;
  }

  function odysseus(o = {}) {
    const r = 78, b = o.breathe || 0;
    let s = '';
    // legs + boots
    for (const sd of [-1, 1]) {
      s += limb(sd * 28, -150, sd * 30, -40, 32, C.skin, C.skinS);
      s += `<path d="M${sd * 30 - 22},-70 L${sd * 30 + 22},-70 L${sd * 30 + 24},-4 Q${sd * 30},6 ${sd * 30 - 28},-4 Z" fill="${C.leather}" ${ink()}/>`;
    }
    // tunic
    s += cel(a => `<path d="M-64,${-330 + b} Q0,${-342 + b} 64,${-330 + b} Q86,-230 90,-136 Q0,-122 -90,-136 Q-86,-230 -64,${-330 + b} Z" ${a}/>`, C.olive, C.oliveS, -0.14, 0, 90);
    s += `<path d="M-74,-200 Q0,-188 74,-200" fill="none" stroke="${C.leather}" stroke-width="12" stroke-linecap="round"/>`;
    // cloak over the left shoulder
    s += cel(a => `<path d="M-70,${-334 + b} Q-20,${-344 + b} 30,${-318 + b} Q-30,-260 -60,-150 Q-96,-160 -98,-200 Q-96,-300 -70,${-334 + b} Z" ${a}/>`, C.felt, C.feltS, 0, -0.1, 90);
    s += `<circle cx="22" cy="${-318 + b}" r="9" fill="${C.goldL}" ${ink(SW * 0.8)}/>`;
    // arms: right holds a gift box up, left hangs
    s += limb(60, -318 + b, 92, -258 + b, 28, C.skin, C.skinS) + limb(92, -258 + b, 70, -226 + b, 26, C.skin, C.skinS);
    s += cel(a => `<rect x="30" y="${-300 + b}" width="70" height="58" rx="5" ${a}/>`, C.cloth, C.clothS, -0.15, -0.1, 60);
    s += `<path d="M65,${-300 + b} L65,${-242 + b} M30,${-271 + b} L100,${-271 + b}" stroke="${C.ginger}" stroke-width="7"/>
      <path d="M65,${-300 + b} q-18,-22 -24,-4 q12,6 24,4 q18,-22 24,-4 q-12,6 -24,4" fill="${C.ginger}" ${ink(SW * 0.7)}/>`;
    s += hand(66, -236 + b, 15);
    s += limb(-66, -316 + b, -88, -200 + b, 26, C.skin, C.skinS) + hand(-90, -190 + b, 15);
    s += `<rect x="-18" y="${-356 + b}" width="36" height="30" fill="${C.skinS}" ${ink()}/>`;
    // head: pilos cap, ginger curls, beard + moustache
    const curls = [-1, 1].map(sd => [0, 1, 2].map(i => `<circle cx="${n(sd * (0.95 - i * 0.04) * r)}" cy="${n((-0.3 + i * 0.22) * r)}" r="${n(0.16 * r)}" fill="${i % 2 ? C.gingerS : C.ginger}" ${ink(SW * 0.8)}/>`).join('')).join('');
    const cap = cel(a => `<path d="M${n(-0.98 * r)},${n(-0.42 * r)} Q${n(-0.66 * r)},${n(-1.55 * r)} ${n(0.04 * r)},${n(-1.66 * r)} Q${n(0.7 * r)},${n(-1.5 * r)} ${n(0.98 * r)},${n(-0.42 * r)} Q0,${n(-0.56 * r)} ${n(-0.98 * r)},${n(-0.42 * r)} Z" ${a}/>`, C.felt, C.feltS, -0.12, -0.05, r)
      + `<path d="M${n(-0.98 * r)},${n(-0.42 * r)} Q0,${n(-0.6 * r)} ${n(0.98 * r)},${n(-0.42 * r)} L${n(1.0 * r)},${n(-0.3 * r)} Q0,${n(-0.46 * r)} ${n(-1.0 * r)},${n(-0.3 * r)} Z" fill="${C.feltS}" ${ink()}/>`;
    const beard = `<path d="M${n(-0.95 * r)},${n(0.05 * r)} Q${n(-1.02 * r)},${n(0.78 * r)} ${n(-0.42 * r)},${n(1.04 * r)} Q0,${n(1.24 * r)} ${n(0.42 * r)},${n(1.04 * r)} Q${n(1.02 * r)},${n(0.78 * r)} ${n(0.95 * r)},${n(0.05 * r)}
        Q${n(0.78 * r)},${n(0.42 * r)} ${n(0.36 * r)},${n(0.5 * r)} Q0,${n(0.36 * r)} ${n(-0.36 * r)},${n(0.5 * r)} Q${n(-0.78 * r)},${n(0.42 * r)} ${n(-0.95 * r)},${n(0.05 * r)} Z" fill="${C.ginger}" ${ink()}/>
      <path d="M${n(-0.3 * r)},${n(0.75 * r)} q${n(0.06 * r)},${n(0.16 * r)} ${n(0.12 * r)},${n(0.2 * r)} M${n(0.22 * r)},${n(0.74 * r)} q${n(0.04 * r)},${n(0.16 * r)} ${n(0.1 * r)},${n(0.2 * r)}" fill="none" stroke="${C.gingerS}" stroke-width="4" stroke-linecap="round"/>`;
    const moustache = `<path d="M${n(-0.26 * r)},${n(0.34 * r)} Q0,${n(0.22 * r)} ${n(0.26 * r)},${n(0.34 * r)} Q${n(0.12 * r)},${n(0.38 * r)} 0,${n(0.3 * r)} Q${n(-0.12 * r)},${n(0.38 * r)} ${n(-0.26 * r)},${n(0.34 * r)} Z" fill="${C.gingerS}" ${ink(SW * 0.8)}/>`;
    s += `<g transform="translate(0 ${-420 + b})">${head(r, { expr: 'smirk', ...o, noCheeks: true, back: curls, beardBack: beard, beard: moustache, front: cap })}</g>`;
    return s;
  }

  window.CAST = { C, INK, SW, face, head, tousled, babyAchilles, babyHang, kidAchilles, teenPyrrha, gown, princess, seer, adultAchilles, hero, cycnus, thetis, odysseus,
    priamBust, lionKO, centaurLegs, shield, helmet, limb, hand, cel };
})();
