// cast2.js – the rest of the cast for the whole Achilles episode (prologue to chapter IX), drawn entirely in code.
// Load AFTER lib/cast.js. Same rules as cast.js (STYLE_BIBLE.md §3): flat vector, one cel-shade tone per
// colour, thin dark-brown outline, chibi heads, dot eyes with a white highlight, rosy cheeks. Our own designs only.
// Every character draws with the feet at (0,0) (riders: the saddle point, busts: the bottom edge), facing the viewer,
// and returns an SVG string. Common options: expr, blink 0..1, look -1..1, breathe (px), P (palette overrides).
//
// Extra expressions on top of cast.js: cry (tears), shocked, smug, disgust, determined, stern, hurt, tired; tears:true adds
// tears to any face. Poses for adults (man and all presets built on it): stand · walk · run · kneel · sit · lunge · scream · ride.
(function () {
  const K = window.CAST;
  const { C, INK, SW, cel, limb, tousled, helmet } = K;
  let uid = 0;
  const nid = p => `${p}q${++uid}`;
  const n = v => Math.round(v * 10) / 10;
  const ink = (w = SW) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const lerp = (a, b, t) => a + (b - a) * t;
  // a stroke with an ink outline (for thin props: strings, handles, bows)
  const line2 = (d, col, w) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + SW * 2}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const handC = (x, y, r = 16, skin = C.skin) => `<circle cx="${n(x)}" cy="${n(y)}" r="${r}" fill="${skin}" ${ink()}/>`;

  // ---------- faces (cast.js face + new expressions) ----------
  const TEAR = '#9fd8ee';
  function face2(r, o = {}) {
    const e = o.expr || 'smile';
    const blink = Math.max(0, Math.min(1, o.blink || 0));
    const lx = (o.look || 0) * r * 0.07;
    const ex = 0.33 * r, ey = 0.12 * r, erx = 0.083 * r, ery = 0.108 * r;
    const skin = o.skin || C.skin;
    let s = '';
    if (!o.noCheeks) s += `<ellipse cx="${n(-0.55 * r)}" cy="${n(0.36 * r)}" rx="${n(0.15 * r)}" ry="${n(0.085 * r)}" fill="${o.cheek || C.cheek}"/>
      <ellipse cx="${n(0.55 * r)}" cy="${n(0.36 * r)}" rx="${n(0.15 * r)}" ry="${n(0.085 * r)}" fill="${o.cheek || C.cheek}"/>`;
    for (const sd of [-1, 1]) {
      const cx = sd * ex + lx, cy = ey;
      if (e === 'ko') {
        s += `<path d="M${n(cx - erx)},${n(cy - ery * 0.8)} L${n(cx + erx)},${n(cy + ery * 0.8)} M${n(cx + erx)},${n(cy - ery * 0.8)} L${n(cx - erx)},${n(cy + ery * 0.8)}" fill="none" ${ink(SW * 1.2)}/>`;
      } else if (e === 'scream' || (e === 'disgust' && sd === 1)) {
        const k = e === 'disgust' ? 0.8 : 1;
        s += `<path d="M${n(cx - sd * erx * 1.2 * k)},${n(cy - ery * 0.85 * k)} L${n(cx + sd * erx * k)},${n(cy)} L${n(cx - sd * erx * 1.2 * k)},${n(cy + ery * 0.85 * k)}" fill="none" ${ink(SW * 1.25)}/>`;
      } else if (e === 'happy') {
        s += `<path d="M${n(cx - erx * 1.15)},${n(cy + ery * 0.3)} Q${n(cx)},${n(cy - ery * 1.1)} ${n(cx + erx * 1.15)},${n(cy + ery * 0.3)}" fill="none" ${ink(SW * 1.2)}/>`;
      } else if (blink > 0.85) {
        s += `<path d="M${n(cx - erx * 1.1)},${n(cy)} Q${n(cx)},${n(cy + ery * 0.7)} ${n(cx + erx * 1.1)},${n(cy)}" fill="none" ${ink(SW * 1.1)}/>`;
      } else if (e === 'shocked') {
        s += `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(erx * 1.45)}" ry="${n(ery * 1.35)}" fill="#fff" ${ink(SW * 0.9)}/><circle cx="${n(cx)}" cy="${n(cy)}" r="${n(erx * 0.5)}" fill="${INK}"/>`;
      } else {
        const ry = ery * (1 - blink);
        s += `<ellipse cx="${n(cx)}" cy="${n(cy + (ery - ry) * 0.5)}" rx="${n(erx)}" ry="${n(ry)}" fill="${INK}"/>`;
        if (ry > ery * 0.55) s += `<circle cx="${n(cx - erx * 0.32)}" cy="${n(cy - ery * 0.38)}" r="${n(erx * 0.36)}" fill="#fff"/>`;
        if (e === 'cry' && ry > ery * 0.55) s += `<circle cx="${n(cx + erx * 0.3)}" cy="${n(cy + ery * 0.3)}" r="${n(erx * 0.2)}" fill="#fff"/>`;
        if (e === 'smug' || e === 'tired') {
          // heavy lids: skin over the top half of the eye + a lid line
          s += `<path d="M${n(cx - erx * 1.5)},${n(cy - ery * 1.4)} L${n(cx + erx * 1.5)},${n(cy - ery * 1.4)} L${n(cx + erx * 1.5)},${n(cy - ery * 0.05)} Q${n(cx)},${n(cy + ery * 0.12)} ${n(cx - erx * 1.5)},${n(cy - ery * 0.05)} Z" fill="${skin}"/>
            <path d="M${n(cx - erx * 1.3)},${n(cy - ery * 0.02)} Q${n(cx)},${n(cy + ery * 0.14)} ${n(cx + erx * 1.3)},${n(cy - ery * 0.02)}" fill="none" ${ink(SW * 1.1)}/>`;
        }
      }
      if (o.tears || e === 'cry') {
        const tx = cx + sd * erx * 0.2, d = `M${n(tx)},${n(cy + ery * 1.05)} Q${n(tx + sd * 0.05 * r)},${n(cy + 0.3 * r)} ${n(tx + sd * 0.03 * r)},${n(cy + 0.52 * r)}`;
        s += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${n(0.075 * r)}" stroke-linecap="round" opacity="0.55"/><path d="${d}" fill="none" stroke="${TEAR}" stroke-width="${n(0.05 * r)}" stroke-linecap="round"/>
          <ellipse cx="${n(tx + sd * 0.03 * r)}" cy="${n(cy + 0.58 * r)}" rx="${n(0.035 * r)}" ry="${n(0.05 * r)}" fill="${TEAR}" ${ink(2)}/>`;
      }
    }
    const B = { smile: [0, 0], neutral: [0, 0], happy: [-0.02, 0], proud: [-0.03, -0.03], angry: [0.08, -0.03], grumpy: [0.06, -0.01],
      sad: [-0.07, 0.03], worried: [-0.07, 0.02], surprised: [-0.09, -0.06], scream: [0.07, -0.02], smirk: [0, 0], calm: [0, 0.01],
      cry: [-0.09, 0.04], shocked: [-0.13, -0.1], smug: [-0.02, -0.04], disgust: [0.07, -0.03], determined: [0.07, -0.02], stern: [0.05, -0.01],
      hurt: [-0.06, 0.02], tired: [0.02, 0.03] }[e] || [0, 0];
    const by = ey - 0.29 * r, bl = 0.16 * r;
    for (const sd of [-1, 1]) {
      let bi = B[0], bo = B[1];
      if ((e === 'smirk' || e === 'smug') && sd === 1) { bi = -0.09; bo = -0.07; }
      const xi = sd * (ex - bl * 0.55) + lx, xo = sd * (ex + bl * 0.55) + lx;
      s += `<path d="M${n(xi)},${n(by + bi * r)} Q${n((xi + xo) / 2)},${n(by - 0.03 * r + (bi + bo) * r / 2)} ${n(xo)},${n(by + bo * r)}" fill="none" stroke="${o.browCol || INK}" stroke-width="${n((o.browW || 0.05) * r)}" stroke-linecap="round"/>`;
    }
    if (!o.noNose) s += `<path d="M${n(-0.035 * r)},${n(0.25 * r)} q${n(0.035 * r)},${n(0.04 * r)} ${n(0.07 * r)},0" fill="none" stroke="${INK}" stroke-width="${SW * 0.8}" stroke-linecap="round" opacity="0.55"/>`;
    const my = 0.4 * r;
    const M = {
      smile: `<path d="M${n(-0.1 * r)},${n(my - 0.03 * r)} Q0,${n(my + 0.08 * r)} ${n(0.1 * r)},${n(my - 0.03 * r)}" fill="none" ${ink()}/>`,
      calm: `<path d="M${n(-0.07 * r)},${n(my - 0.01 * r)} Q0,${n(my + 0.04 * r)} ${n(0.07 * r)},${n(my - 0.01 * r)}" fill="none" ${ink()}/>`,
      neutral: `<path d="M${n(-0.07 * r)},${n(my)} L${n(0.07 * r)},${n(my)}" ${ink()}/>`,
      grumpy: `<path d="M${n(-0.09 * r)},${n(my + 0.04 * r)} Q0,${n(my - 0.03 * r)} ${n(0.09 * r)},${n(my + 0.04 * r)}" fill="none" ${ink()}/>`,
      sad: `<path d="M${n(-0.09 * r)},${n(my + 0.05 * r)} Q0,${n(my - 0.05 * r)} ${n(0.09 * r)},${n(my + 0.05 * r)}" fill="none" ${ink()}/>`,
      smirk: `<path d="M${n(-0.09 * r)},${n(my + 0.01 * r)} Q${n(0.03 * r)},${n(my + 0.05 * r)} ${n(0.13 * r)},${n(my - 0.07 * r)}" fill="none" ${ink()}/>`,
      surprised: `<ellipse cx="0" cy="${n(my + 0.02 * r)}" rx="${n(0.05 * r)}" ry="${n(0.065 * r)}" fill="${C.mouth}" ${ink(SW * 0.9)}/>`,
      shocked: `<ellipse cx="0" cy="${n(my + 0.05 * r)}" rx="${n(0.085 * r)}" ry="${n(0.12 * r)}" fill="${C.mouth}" ${ink(SW * 0.9)}/>`,
      determined: `<path d="M${n(-0.09 * r)},${n(my + 0.01 * r)} Q0,${n(my - 0.01 * r)} ${n(0.09 * r)},${n(my + 0.01 * r)}" fill="none" ${ink(SW * 1.15)}/>`,
      disgust: `<ellipse cx="${n(0.04 * r)}" cy="${n(my + 0.05 * r)}" rx="${n(0.045 * r)}" ry="${n(0.05 * r)}" fill="${C.tongue}" ${ink(SW * 0.8)}/>
        <path d="M${n(-0.12 * r)},${n(my + 0.01 * r)} Q${n(-0.06 * r)},${n(my - 0.04 * r)} 0,${n(my + 0.01 * r)} Q${n(0.06 * r)},${n(my + 0.05 * r)} ${n(0.12 * r)},${n(my)}" fill="none" ${ink()}/>`,
      cry: `<path d="M${n(-0.11 * r)},${n(my + 0.07 * r)} Q0,${n(my - 0.05 * r)} ${n(0.11 * r)},${n(my + 0.07 * r)} Q${n(0.05 * r)},${n(my + 0.11 * r)} 0,${n(my + 0.09 * r)} Q${n(-0.05 * r)},${n(my + 0.11 * r)} ${n(-0.11 * r)},${n(my + 0.07 * r)} Z" fill="${C.mouth}" ${ink(SW * 0.9)}/>`,
    };
    const open = (w, h, y0) => `<path d="M${n(-w)},${n(y0)} Q0,${n(y0 - h * 0.25)} ${n(w)},${n(y0)} Q${n(w * 0.9)},${n(y0 + h)} 0,${n(y0 + h)} Q${n(-w * 0.9)},${n(y0 + h)} ${n(-w)},${n(y0)} Z" fill="${C.mouth}" ${ink()}/>
      <ellipse cx="0" cy="${n(y0 + h * 0.78)}" rx="${n(w * 0.55)}" ry="${n(h * 0.2)}" fill="${C.tongue}"/>`;
    M.happy = open(0.15 * r, 0.17 * r, my - 0.05 * r);
    M.proud = open(0.13 * r, 0.12 * r, my - 0.04 * r);
    M.ko = `<path d="M${n(-0.12 * r)},${n(my)} q${n(0.04 * r)},${n(-0.05 * r)} ${n(0.08 * r)},0 q${n(0.04 * r)},${n(0.05 * r)} ${n(0.08 * r)},0" fill="none" ${ink()}/>`;
    M.angry = M.grumpy; M.worried = M.sad; M.hurt = M.neutral; M.stern = M.neutral; M.tired = M.neutral; M.smug = M.smirk;
    M.scream = open(0.17 * r, 0.3 * r, my - 0.1 * r);
    s += M[e] || M.smile;
    return s;
  }

  function head2(r, o = {}) {
    const skin = o.skin || C.skin, skinS = o.skinS || C.skinS;
    let s = o.back || '';
    if (o.ears !== false) for (const sd of [-1, 1]) {
      s += `<circle cx="${n(sd * r * 0.96)}" cy="${n(r * 0.14)}" r="${n(r * 0.17)}" fill="${sd < 0 ? skin : skinS}" ${ink()}/>
        <path d="M${n(sd * r * 0.98)},${n(r * 0.06)} q${n(sd * r * 0.07)},${n(r * 0.08)} 0,${n(r * 0.16)}" fill="none" stroke="${INK}" stroke-width="${SW * 0.7}" stroke-linecap="round" opacity="0.6"/>`;
    }
    s += cel(a => `<circle r="${r}" ${a}/>`, skin, skinS, -0.11, -0.11, r);
    s += o.beardBack || '';
    s += face2(r, { ...o, skin });
    s += o.beard || '';
    s += o.front || '';
    return s;
  }

  // ---------- hair, beards, headwear ----------
  function curls(r, col, sh) {
    const cap = a => `<path d="M${n(-1.02 * r)},${n(0.05 * r)} C${n(-1.12 * r)},${n(-0.8 * r)} ${n(-0.6 * r)},${n(-1.18 * r)} 0,${n(-1.18 * r)} C${n(0.6 * r)},${n(-1.18 * r)} ${n(1.12 * r)},${n(-0.8 * r)} ${n(1.02 * r)},${n(0.05 * r)} Q${n(0.92 * r)},${n(-0.36 * r)} 0,${n(-0.4 * r)} Q${n(-0.92 * r)},${n(-0.36 * r)} ${n(-1.02 * r)},${n(0.05 * r)} Z" ${a}/>`;
    let s = cel(cap, col, sh, 0.07, 0.08, r);
    for (let i = 0; i <= 9; i++) {
      const t = Math.PI * (1.06 + 0.88 * i / 9);
      s += `<circle cx="${n(Math.cos(t) * 0.97 * r)}" cy="${n(Math.sin(t) * 0.98 * r - 0.12 * r)}" r="${n(0.25 * r)}" fill="${i % 2 ? sh : col}" ${ink()}/>`;
    }
    for (const [x, y, rr] of [[-0.66, -0.36, 0.2], [-0.34, -0.46, 0.21], [0.0, -0.5, 0.21], [0.34, -0.47, 0.2], [0.66, -0.37, 0.19]]) {
      s += `<circle cx="${n(x * r)}" cy="${n(y * r)}" r="${n(rr * r)}" fill="${col}" ${ink()}/>
        <path d="M${n((x - 0.07) * r)},${n((y + 0.02) * r)} q${n(0.06 * r)},${n(-0.1 * r)} ${n(0.12 * r)},${n(-0.02 * r)}" fill="none" stroke="${sh}" stroke-width="${SW * 0.9}" stroke-linecap="round"/>`;
    }
    return s;
  }
  function curlsBack(r, col, sh) {
    let s = '';
    for (const sd of [-1, 1]) for (const [x, y] of [[0.98, 0.12], [0.9, 0.42], [0.72, 0.62]]) s += `<circle cx="${n(sd * x * r)}" cy="${n(y * r)}" r="${n(0.24 * r)}" fill="${sh}" ${ink()}/>`;
    return s;
  }
  // neck-length hair behind the head (the adult hero's)
  const heroBack = (r, sh) => `<path d="M${n(-0.9 * r)},${n(0.1 * r)} Q${n(-1.05 * r)},${n(0.75 * r)} ${n(-0.6 * r)},${n(0.95 * r)} L${n(0.6 * r)},${n(0.95 * r)} Q${n(1.05 * r)},${n(0.75 * r)} ${n(0.9 * r)},${n(0.1 * r)} Z" fill="${sh}" ${ink()}/>`;
  // long hair behind the head down to the shoulders (women, old men, Chiron)
  const longBack = (r, col, sh, len = 1.6) => cel(a => `<path d="M${n(-0.95 * r)},${n(-0.2 * r)} C${n(-1.25 * r)},${n(0.5 * r)} ${n(-1.2 * r)},${n(len * 0.8 * r)} ${n(-0.9 * r)},${n(len * r)} Q0,${n((len + 0.15) * r)} ${n(0.9 * r)},${n(len * r)} C${n(1.2 * r)},${n(len * 0.8 * r)} ${n(1.25 * r)},${n(0.5 * r)} ${n(0.95 * r)},${n(-0.2 * r)} Z" ${a}/>`, col, sh, 0.08, 0, r);

  function beard(r, style, col, sh) {
    if (!style || style === 'none') return { back: '', front: '' };
    const mou = `<path d="M${n(-0.26 * r)},${n(0.34 * r)} Q0,${n(0.22 * r)} ${n(0.26 * r)},${n(0.34 * r)} Q${n(0.12 * r)},${n(0.38 * r)} 0,${n(0.3 * r)} Q${n(-0.12 * r)},${n(0.38 * r)} ${n(-0.26 * r)},${n(0.34 * r)} Z" fill="${sh}" ${ink(SW * 0.8)}/>`;
    const inner = `Q${n(0.78 * r)},${n(0.42 * r)} ${n(0.36 * r)},${n(0.5 * r)} Q0,${n(0.38 * r)} ${n(-0.36 * r)},${n(0.5 * r)} Q${n(-0.78 * r)},${n(0.42 * r)} ${n(-0.95 * r)},${n(0.05 * r)} Z`;
    let d;
    if (style === 'short') d = `M${n(-0.95 * r)},${n(0.05 * r)} Q${n(-1.0 * r)},${n(0.66 * r)} ${n(-0.42 * r)},${n(0.9 * r)} Q0,${n(1.05 * r)} ${n(0.42 * r)},${n(0.9 * r)} Q${n(1.0 * r)},${n(0.66 * r)} ${n(0.95 * r)},${n(0.05 * r)} `;
    else if (style === 'full') d = `M${n(-0.97 * r)},${n(0.0 * r)} Q${n(-1.12 * r)},${n(0.95 * r)} ${n(-0.62 * r)},${n(1.28 * r)} Q${n(-0.46 * r)},${n(1.44 * r)} ${n(-0.3 * r)},${n(1.36 * r)} Q${n(-0.16 * r)},${n(1.56 * r)} 0,${n(1.46 * r)} Q${n(0.16 * r)},${n(1.56 * r)} ${n(0.3 * r)},${n(1.36 * r)} Q${n(0.46 * r)},${n(1.44 * r)} ${n(0.62 * r)},${n(1.28 * r)} Q${n(1.12 * r)},${n(0.95 * r)} ${n(0.97 * r)},${n(0.0 * r)} `;
    else if (style === 'long') d = `M${n(-0.95 * r)},${n(0.05 * r)} Q${n(-1.0 * r)},${n(1.2 * r)} 0,${n(1.95 * r)} Q${n(1.0 * r)},${n(1.2 * r)} ${n(0.95 * r)},${n(0.05 * r)} `;
    else if (style === 'cloud') {
      // Zeus: a beard made of cloud puffs
      let p = '';
      const pts = [[-0.92, 0.2, 0.3], [-0.98, 0.62, 0.34], [-0.72, 1.0, 0.36], [-0.34, 1.26, 0.38], [0.05, 1.34, 0.38], [0.42, 1.22, 0.37], [0.76, 0.98, 0.35], [0.98, 0.6, 0.33], [0.92, 0.2, 0.3]];
      for (const [x, y, rr] of pts) p += `<circle cx="${n(x * r)}" cy="${n(y * r)}" r="${n(rr * r)}" fill="${col}" ${ink()}/>`;
      p += `<path d="M${n(-0.95 * r)},${n(0.05 * r)} Q${n(-0.9 * r)},${n(1.1 * r)} 0,${n(1.2 * r)} Q${n(0.9 * r)},${n(1.1 * r)} ${n(0.95 * r)},${n(0.05 * r)} ${inner.replace(/^Q/, 'Q')}" fill="${col}"/>`;
      return { back: p, front: mou.replace(`fill="${sh}"`, `fill="${col}"`) };
    }
    let lines = '';
    if (style !== 'short') lines = `<path d="M${n(-0.3 * r)},${n(0.85 * r)} q${n(0.08 * r)},${n(0.3 * r)} ${n(0.16 * r)},${n(0.45 * r)} M${n(0.26 * r)},${n(0.84 * r)} q${n(0.03 * r)},${n(0.3 * r)} ${n(-0.06 * r)},${n(0.45 * r)}" fill="none" stroke="${sh}" stroke-width="${SW}" stroke-linecap="round"/>`;
    else lines = `<path d="M${n(-0.3 * r)},${n(0.72 * r)} q${n(0.06 * r)},${n(0.12 * r)} ${n(0.12 * r)},${n(0.16 * r)} M${n(0.22 * r)},${n(0.72 * r)} q${n(0.04 * r)},${n(0.12 * r)} ${n(0.1 * r)},${n(0.16 * r)}" fill="none" stroke="${sh}" stroke-width="${SW}" stroke-linecap="round"/>`;
    return { back: `<path d="${d}${inner}" fill="${col}" ${ink()}/>${lines}`, front: mou };
  }
  const circlet = (r, col = C.gold) => `${line2(`M${n(-0.97 * r)},${n(-0.46 * r)} Q0,${n(-0.74 * r)} ${n(0.97 * r)},${n(-0.46 * r)}`, col, n(0.08 * r))}
    <circle cx="0" cy="${n(-0.62 * r)}" r="${n(0.08 * r)}" fill="#c8302a" ${ink(2.5)}/>`;
  const headband = (r, col) => `${line2(`M${n(-0.99 * r)},${n(-0.4 * r)} Q0,${n(-0.66 * r)} ${n(0.99 * r)},${n(-0.4 * r)}`, col, n(0.1 * r))}
    <path d="M${n(0.95 * r)},${n(-0.42 * r)} q${n(0.22 * r)},${n(0.1 * r)} ${n(0.26 * r)},${n(0.4 * r)} M${n(0.95 * r)},${n(-0.42 * r)} q${n(0.28 * r)},${n(-0.02 * r)} ${n(0.38 * r)},${n(0.24 * r)}" fill="none" stroke="${INK}" stroke-width="${n(0.07 * r)}" stroke-linecap="round"/>
    <path d="M${n(0.95 * r)},${n(-0.42 * r)} q${n(0.22 * r)},${n(0.1 * r)} ${n(0.26 * r)},${n(0.4 * r)} M${n(0.95 * r)},${n(-0.42 * r)} q${n(0.28 * r)},${n(-0.02 * r)} ${n(0.38 * r)},${n(0.24 * r)}" fill="none" stroke="${col}" stroke-width="${n(0.04 * r)}" stroke-linecap="round"/>`;
  function laurel(r) {
    let s = line2(`M${n(-0.98 * r)},${n(-0.36 * r)} Q0,${n(-0.72 * r)} ${n(0.98 * r)},${n(-0.36 * r)}`, '#6f8f3a', n(0.035 * r));
    for (let i = 0; i < 9; i++) {
      const t = i / 8, x = lerp(-0.92, 0.92, t) * r, y = (-0.4 - 0.26 * Math.sin(Math.PI * t)) * r, a = lerp(-60, 60, t);
      for (const sd of [-1, 1]) s += `<ellipse cx="${n(x)}" cy="${n(y + sd * 0.07 * r)}" rx="${n(0.11 * r)}" ry="${n(0.05 * r)}" transform="rotate(${n(a + sd * 25)} ${n(x)} ${n(y + sd * 0.07 * r)})" fill="${sd < 0 ? '#8cb14a' : '#6f8f3a'}" ${ink(2.4)}/>`;
    }
    return s;
  }
  // soft pointed cap with the tip folding forward (Paris, the Amazon queen)
  function pointCap(r, col, sh, o = {}) {
    const cap = a => `<path d="M${n(-1.02 * r)},${n(-0.25 * r)} C${n(-1.1 * r)},${n(-1.0 * r)} ${n(-0.6 * r)},${n(-1.4 * r)} ${n(0.0 * r)},${n(-1.42 * r)}
      C${n(0.66 * r)},${n(-1.4 * r)} ${n(1.12 * r)},${n(-0.9 * r)} ${n(1.02 * r)},${n(-0.25 * r)} Q0,${n(-0.5 * r)} ${n(-1.02 * r)},${n(-0.25 * r)} Z" ${a}/>`;
    let s = cel(cap, col, sh, -0.1, -0.05, r);
    // the soft tip flops over to one side
    s += cel(a => `<path d="M${n(-0.34 * r)},${n(-1.3 * r)} C${n(-0.2 * r)},${n(-1.78 * r)} ${n(0.5 * r)},${n(-1.86 * r)} ${n(0.62 * r)},${n(-1.38 * r)} C${n(0.66 * r)},${n(-1.2 * r)} ${n(0.56 * r)},${n(-1.08 * r)} ${n(0.48 * r)},${n(-1.12 * r)} C${n(0.48 * r)},${n(-1.42 * r)} ${n(0.1 * r)},${n(-1.5 * r)} ${n(0.02 * r)},${n(-1.16 * r)} Z" ${a}/>`, col, sh, -0.1, -0.1, r);
    s += `<path d="M${n(-1.02 * r)},${n(-0.25 * r)} Q0,${n(-0.52 * r)} ${n(1.02 * r)},${n(-0.25 * r)} L${n(1.04 * r)},${n(-0.1 * r)} Q0,${n(-0.36 * r)} ${n(-1.04 * r)},${n(-0.1 * r)} Z" fill="${o.band || sh}" ${ink()}/>`;
    if (o.flaps) for (const sd of [-1, 1]) s += `<path d="M${n(sd * 1.0 * r)},${n(-0.14 * r)} Q${n(sd * 1.12 * r)},${n(0.4 * r)} ${n(sd * 0.98 * r)},${n(0.74 * r)} L${n(sd * 0.82 * r)},${n(0.7 * r)} Q${n(sd * 0.9 * r)},${n(0.3 * r)} ${n(sd * 0.84 * r)},${n(-0.12 * r)} Z" fill="${sd < 0 ? col : sh}" ${ink()}/>`;
    return s;
  }

  // ---------- props ----------
  // a spear through the hand at (x,y); a = degrees from vertical (90 = pointing right); below = shaft length behind the hand
  function spear(x, y, a, P, len = 1, below = 222) {
    const top = -(600 * len - below);
    return `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(a)})"><rect x="-5.5" y="${n(top)}" width="11" height="${n(600 * len)}" rx="4" fill="${C.wood}" ${ink(SW * 0.8)}/>
      <path d="M0,${n(top - 80)} Q18.5,${n(top - 30)} 6.5,${n(top + 4)} L-6.5,${n(top + 4)} Q-18.5,${n(top - 30)} 0,${n(top - 80)} Z" fill="${P.metal || C.bronze}" ${ink()}/>
      <path d="M0,${n(top - 70)} L0,${n(top - 2)}" stroke="${P.metalS || C.bronzeS}" stroke-width="3"/></g>`;
  }
  function sword(x, y, a, P = {}) {
    return `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(a)})">
      <path d="M-10,-16 L-10,-128 L0,-152 L10,-128 L10,-16 Z" fill="#e3e7ea" ${ink()}/><path d="M0,-20 L0,-136" stroke="#b9c1c7" stroke-width="4"/>
      <rect x="-30" y="-24" width="60" height="13" rx="5" fill="${P.metal || C.bronze}" ${ink(SW * 0.9)}/>
      <rect x="-7" y="-12" width="14" height="34" rx="4" fill="${C.leather}" ${ink(SW * 0.8)}/><circle cx="0" cy="26" r="9" fill="${P.metal || C.bronze}" ${ink(SW * 0.8)}/></g>`;
  }
  // a small lyre (tortoise-shell sound box, two curved arms, a crossbar, strings); origin = middle of the sound box
  function lyre(x, y, s = 1, o = {}) {
    let g = `<g transform="translate(${n(x)} ${n(y)}) scale(${s}) rotate(${o.rot || 0})">`;
    g += line2('M-30,0 C-70,-40 -64,-104 -40,-126', C.wood, 10) + line2('M30,0 C70,-40 64,-104 40,-126', C.wood, 10);
    g += line2('M-48,-114 L48,-114', C.woodS, 9);
    for (let i = -2; i <= 2; i++) g += `<path d="M${i * 9},-6 L${i * 9},-112" stroke="#f3e6c8" stroke-width="2.4"/>`;
    g += cel(a => `<ellipse cx="0" cy="8" rx="44" ry="28" ${a}/>`, '#a8743f', '#82552b', -0.1, -0.15, 44);
    g += `<path d="M-24,0 L0,-12 L24,0 L0,14 Z M-36,10 L-24,0 M36,10 L24,0" fill="none" stroke="#6b4426" stroke-width="3"/>`;
    g += `<circle cx="-40" cy="-126" r="6" fill="${C.goldL}" ${ink(2)}/><circle cx="40" cy="-126" r="6" fill="${C.goldL}" ${ink(2)}/>`;
    return g + '</g>';
  }
  function goldenApple(x, y, R = 30, o = {}) {
    return `<g transform="translate(${n(x)} ${n(y)})">${cel(a => `<path d="M0,${n(-R * 0.78)} C${n(R * 0.6)},${n(-R * 1.12)} ${n(R * 1.18)},${n(-R * 0.5)} ${n(R * 0.92)},${n(R * 0.3)} C${n(R * 0.7)},${n(R * 0.98)} ${n(R * 0.2)},${n(R * 1.02)} 0,${n(R * 0.82)} C${n(-R * 0.2)},${n(R * 1.02)} ${n(-R * 0.7)},${n(R * 0.98)} ${n(-R * 0.92)},${n(R * 0.3)} C${n(-R * 1.18)},${n(-R * 0.5)} ${n(-R * 0.6)},${n(-R * 1.12)} 0,${n(-R * 0.78)} Z" ${a}/>`, '#f2c94c', '#cf9a26', -0.18, -0.12, R)}
      <path d="M0,${n(-R * 0.72)} q${n(R * 0.04)},${n(-R * 0.3)} ${n(R * 0.14)},${n(-R * 0.42)}" fill="none" ${ink(SW * 1.1)}/>
      <path d="M${n(R * 0.1)},${n(-R * 0.98)} q${n(R * 0.42)},${n(-R * 0.3)} ${n(R * 0.7)},${n(-R * 0.06)} q${n(-R * 0.4)},${n(R * 0.24)} ${n(-R * 0.7)},${n(R * 0.06)} Z" fill="#8cb14a" ${ink(2.5)}/>
      <ellipse cx="${n(-R * 0.42)}" cy="${n(-R * 0.22)}" rx="${n(R * 0.14)}" ry="${n(R * 0.26)}" transform="rotate(25 ${n(-R * 0.42)} ${n(-R * 0.22)})" fill="#fff6c8" opacity="0.85"/>
      ${o.text ? `<text x="0" y="${n(R * 0.22)}" font-family="Constantia, Palatino Linotype, Georgia, serif" font-size="${n(R * 0.3)}" font-style="italic" text-anchor="middle" fill="#8a5a12">${o.text}</text>` : ''}</g>`;
  }
  function bowArc(x, y, h = 260, o = {}) {
    // vertical bow, belly to the left (−x); string pulled to (o.pullX, y) or straight
    const top = y - h / 2, bot = y + h / 2, bx = x - h * 0.22;
    let s = line2(`M${n(x)},${n(top)} Q${n(bx - h * 0.18)},${n(y)} ${n(x)},${n(bot)}`, C.woodS, 9);
    s += `<path d="M${n(x)},${n(top)} L${n(o.pullX ?? x)},${n(y)} L${n(x)},${n(bot)}" fill="none" stroke="#f3e6c8" stroke-width="2.5"/>`;
    return s;
  }
  function quiver(x, y, a = -28) {
    let s = `<g transform="translate(${x} ${y}) rotate(${a})">`;
    for (const [dx, col] of [[-10, '#e2433a'], [2, '#f3e6c8'], [13, '#e2433a']]) s += `<path d="M${dx},-86 l-8,-22 l8,6 l8,-6 Z" fill="${col}" ${ink(2.5)}/><path d="M${dx},-86 L${dx},-60" stroke="${C.woodS}" stroke-width="4"/>`;
    s += cel(a2 => `<rect x="-22" y="-70" width="44" height="150" rx="14" ${a2}/>`, '#8a5a36', '#6b4226', -0.2, 0, 44);
    s += `<path d="M-22,-48 L22,-48 M-22,56 L22,56" stroke="${C.bronze}" stroke-width="7"/></g>`;
    return s;
  }

  // ---------- shields ----------
  function shield2(x, y, R, P = {}) {
    const em = P.emblem || 'waves';
    if (em === 'waves' || em === 'trident') return K.shield(x, y, R, { face: P.metal || C.bronze, faceS: P.metalS || C.bronzeS, rim: P.rim || C.teal, mark: P.mark || C.tealS, emblem: em });
    if (em === 'pelta') {
      // crescent shield of the Amazons
      const d = `M${n(x - 0.98 * R)},${n(y - 0.32 * R)} A${R} ${R} 0 1 0 ${n(x + 0.98 * R)},${n(y - 0.32 * R)} Q${n(x)},${n(y + 0.32 * R)} ${n(x - 0.98 * R)},${n(y - 0.32 * R)} Z`;
      return cel(a => `<path d="${d}" ${a}/>`, P.metal, P.metalS, -0.1, -0.08, R)
        + `<path d="${d}" fill="none" stroke="${P.mark}" stroke-width="${n(R * 0.07)}" transform="translate(${n(x * 0.16)} ${n((y + 0.15 * R) * 0.16)}) scale(0.84)" opacity="0.8"/>`
        + `<path d="M${n(x - 0.6 * R)},${n(y + 0.34 * R)} Q${n(x)},${n(y + 0.82 * R)} ${n(x + 0.6 * R)},${n(y + 0.34 * R)}" fill="none" stroke="${P.mark}" stroke-width="${n(R * 0.08)}" stroke-linecap="round"/>
          <circle cx="${n(x)}" cy="${n(y + 0.5 * R)}" r="${n(R * 0.1)}" fill="${P.mark}" ${ink(2)}/>`;
    }
    let s = cel(a => `<circle cx="${x}" cy="${y}" r="${R}" ${a}/>`, P.metal, P.metalS, -0.1, -0.1, R);
    s += `<circle cx="${x}" cy="${y}" r="${n(R * 0.82)}" fill="none" stroke="${P.rim}" stroke-width="${n(R * 0.1)}"/><circle cx="${x}" cy="${y}" r="${n(R * 0.82)}" fill="none" ${ink(2)} opacity="0.5"/>`;
    const m = P.mark, u = R;
    if (em === 'horse') {
      s += `<path d="M${n(x - 0.22 * u)},${n(y + 0.5 * u)} L${n(x - 0.2 * u)},${n(y - 0.05 * u)} Q${n(x - 0.16 * u)},${n(y - 0.42 * u)} ${n(x + 0.08 * u)},${n(y - 0.5 * u)} L${n(x + 0.12 * u)},${n(y - 0.62 * u)} L${n(x + 0.2 * u)},${n(y - 0.48 * u)}
        Q${n(x + 0.36 * u)},${n(y - 0.36 * u)} ${n(x + 0.48 * u)},${n(y - 0.18 * u)} Q${n(x + 0.52 * u)},${n(y - 0.06 * u)} ${n(x + 0.4 * u)},${n(y - 0.04 * u)} L${n(x + 0.18 * u)},${n(y - 0.1 * u)} Q${n(x + 0.1 * u)},${n(y + 0.2 * u)} ${n(x + 0.22 * u)},${n(y + 0.5 * u)} Z" fill="${m}"/>
        <path d="M${n(x - 0.2 * u)},${n(y - 0.05 * u)} Q${n(x - 0.34 * u)},${n(y - 0.3 * u)} ${n(x - 0.1 * u)},${n(y - 0.5 * u)}" fill="none" stroke="${m}" stroke-width="${n(u * 0.08)}" stroke-linecap="round"/>`;
    } else if (em === 'sun') {
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; s += `<path d="M${n(x + Math.cos(a) * 0.3 * u)},${n(y + Math.sin(a) * 0.3 * u)} L${n(x + Math.cos(a) * 0.55 * u)},${n(y + Math.sin(a) * 0.55 * u)}" stroke="${m}" stroke-width="${n(u * 0.08)}" stroke-linecap="round"/>`; }
      s += `<circle cx="${x}" cy="${y}" r="${n(u * 0.2)}" fill="${m}"/>`;
    } else if (em === 'star') {
      let d = '';
      for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8 - Math.PI / 2, rr = (i % 2 ? 0.2 : 0.5) * u; d += `${i ? 'L' : 'M'}${n(x + Math.cos(a) * rr)},${n(y + Math.sin(a) * rr)} `; }
      s += `<path d="${d}Z" fill="${m}"/>`;
    } else if (em === 'eye') {
      s += `<path d="M${n(x - 0.5 * u)},${n(y)} Q${n(x)},${n(y - 0.36 * u)} ${n(x + 0.5 * u)},${n(y)} Q${n(x)},${n(y + 0.36 * u)} ${n(x - 0.5 * u)},${n(y)} Z" fill="none" stroke="${m}" stroke-width="${n(u * 0.07)}"/><circle cx="${x}" cy="${y}" r="${n(u * 0.13)}" fill="${m}"/>`;
    }
    s += `<path d="M${n(x - R * 0.55)},${n(y - R * 0.6)} Q${n(x - R * 0.2)},${n(y - R * 0.85)} ${n(x + R * 0.15)},${n(y - R * 0.8)}" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="${n(R * 0.07)}" stroke-linecap="round"/>`;
    return s;
  }

  // ---------- body parts ----------
  function leg(h, k, a, P, armor) {
    let s = limb(h[0], h[1], k[0], k[1], 32, P.skin, P.skinS) + limb(k[0], k[1], a[0], a[1], 30, P.skin, P.skinS);
    if (armor) {
      const dx = a[0] - k[0], dy = a[1] - k[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, px = -uy, py = ux;
      const p1 = [k[0] + ux * L * 0.12, k[1] + uy * L * 0.12], p2 = [a[0] - ux * L * 0.04, a[1] - uy * L * 0.04];
      const q = (p, w) => [p[0] + px * w, p[1] + py * w];
      const A = q(p1, -21), B = q(p1, 21), Cc = q(p2, 18), D = q(p2, -18), top = [p1[0] - ux * 9, p1[1] - uy * 9];
      s += cel(at => `<path d="M${n(A[0])},${n(A[1])} Q${n(top[0])},${n(top[1])} ${n(B[0])},${n(B[1])} L${n(Cc[0])},${n(Cc[1])} Q${n(p2[0] + ux * 6)},${n(p2[1] + uy * 6)} ${n(D[0])},${n(D[1])} Z" ${at}/>`, P.metal, P.metalS, -0.25, 0, 20);
    }
    return s;
  }
  function foot(x, y, side, P, rot = 0) {
    const col = P.shoe || C.leather;
    if (P.boots) {
      if (!side) return `<path d="M${n(x - 23)},${n(y - 50)} L${n(x + 23)},${n(y - 50)} L${n(x + 25)},${n(y)} Q${n(x)},${n(y + 8)} ${n(x - 28)},${n(y)} Z" fill="${col}" ${ink()}/>`;
      return `<g transform="translate(${n(x)} ${n(y)}) rotate(${rot}) scale(${side} 1)"><path d="M-20,-50 L20,-50 L18,-14 L44,-10 Q52,6 36,8 L-22,8 Z" fill="${col}" ${ink()}/></g>`;
    }
    if (!side) return `<path d="M${n(x - 24)},${n(y)} Q${n(x)},${n(y - 24)} ${n(x + 24)},${n(y)} Z" fill="${col}" ${ink()}/>`;
    return `<g transform="translate(${n(x)} ${n(y)}) rotate(${rot}) scale(${side} 1)"><path d="M-16,-14 Q6,-22 32,-8 Q42,0 34,8 L-16,8 Q-24,-4 -16,-14 Z" fill="${col}" ${ink()}/>
      <path d="M-6,-14 L4,6" stroke="${C.leatherS}" stroke-width="4" stroke-linecap="round"/></g>`;
  }
  // legs for each pose; H = the hip point in the figure's coordinates, lean = degrees the upper body tilts round the hip
  function legsFor(pose, P, armor) {
    const Lg = (h, k, a, f) => leg(h, k, a, P, armor) + f;
    switch (pose) {
      case 'walk': return { H: [0, -192], lean: 0, svg: Lg([-30, -192], [-36, -108], [-42, -24], foot(-42, -2, 0, P)) + Lg([30, -192], [44, -116], [38, -52], foot(38, -30, 0, P)) };
      case 'run': return { H: [0, -184], lean: 12, cape: 'flow', svg:
        Lg([-18, -184], [-50, -106], [-122, -88], foot(-130, -80, -1, P, -38)) + Lg([18, -184], [88, -138], [82, -46], foot(86, -26, 1, P, 8)) };
      case 'kneel': return { H: [0, -120], lean: 0, cape: 'short', svg:
        Lg([28, -120], [38, -20], [118, -24], foot(134, -14, 1, P, 64)) + Lg([-28, -120], [-98, -124], [-104, -26], foot(-104, -4, 0, P)) };
      case 'sit': {
        let s = '', knees = '';
        for (const sd of [-1, 1]) s += leg([sd * 44, -140], [sd * 44, -140], [sd * 46, -26], P, armor) + foot(sd * 46, -4, 0, P);
        for (const sd of [-1, 1]) knees += cel(a => `<circle cx="${sd * 44}" cy="-142" r="21" ${a}/>`, P.skin, P.skinS, -0.15, -0.15, 21);
        // with armour the knees come forward over the leather strips; otherwise the lap covers them
        return { H: [0, -150], lean: 0, cape: 'short', svg: armor ? s : s + knees, knees: armor ? knees : '' };
      }
      case 'lunge': return { H: [0, -160], lean: 8, cape: 'flow', svg:
        Lg([-20, -160], [-84, -98], [-154, -34], foot(-162, -16, -1, P, 12)) + Lg([20, -160], [114, -130], [122, -30], foot(128, -10, 1, P, 0)) };
      case 'scream': return { H: [0, -196], lean: 0, svg: Lg([-30, -196], [-54, -112], [-70, -26], foot(-70, -4, 0, P)) + Lg([30, -196], [54, -112], [70, -26], foot(70, -4, 0, P)) };
      case 'ride': return { H: [0, -6], lean: 0, cape: 'short', svg: Lg([-26, -6], [-80, 58], [-74, 146], foot(-78, 162, -1, P, 0)) + Lg([26, -6], [80, 58], [74, 146], foot(78, 162, 1, P, 0)) };
      default: return { H: [0, -196], lean: 0, svg: Lg([-30, -196], [-31, -110], [-33, -24], foot(-33, -2, 0, P)) + Lg([30, -196], [31, -110], [33, -24], foot(33, -2, 0, P)) };
    }
  }

  // arm layouts in the upper-body frame (hip at (0,-196), shoulders at (±sx,-384)); layer: back (behind the torso),
  // front (in front of the torso), top (after the head: hands on the head or face)
  function armsFor(key, pose, sx, b, o) {
    const A = (e, h, layer = 'back', hand = 'fist') => ({ e, h, layer, hand });
    const down = { L: A([-sx - 18, -300 + b], [-sx - 24, -236 + b]), R: A([sx + 18, -300 + b], [sx + 24, -236 + b]) };
    const items = [];
    let L = down.L, R = down.R;
    switch (key) {
      case 'spear':
        R = A([sx + 18, -300 + b], [sx + 26, -232 + b]);
        items.push({ t: 'spear', x: sx + 26, y: -232 + b, a: 0 });
        if (pose === 'run' || pose === 'lunge') { R = A([sx + 40, -320 + b], [sx + 70, -300 + b]); Object.assign(items[0], { x: sx + 70, y: -300 + b, a: pose === 'run' ? 74 : 84, below: 70 }); }
        break;
      case 'sword':
        if (pose === 'lunge') { R = A([sx + 66, -372 + b], [sx + 132, -360 + b], 'front'); items.push({ t: 'sword', x: sx + 132, y: -360 + b, a: 84 }); }
        else { R = A([sx + 20, -300 + b], [sx + 30, -236 + b]); items.push({ t: 'sword', x: sx + 30, y: -236 + b, a: 158 }); }
        break;
      case 'swordUp': R = A([sx + 40, -420 + b], [sx + 20, -500 + b]); items.push({ t: 'sword', x: sx + 20, y: -500 + b, a: 10 }); break;
      case 'lyre':
        L = A([-sx - 20, -306 + b], [-40, -318 + b], 'front'); R = A([sx + 12, -296 + b], [30, -276 + b], 'front');
        items.push({ t: 'lyre', x: -6, y: -258 + b, s: 0.95, rot: -8 });
        break;
      case 'finger': R = A([sx + 34, -330 + b], [sx + 20, -420 + b], 'back', 'finger'); break;
      case 'point': R = A([sx + 56, -400 + b], [sx + 116, -446 + b], 'back', 'point'); break;
      case 'reach': R = A([sx + 56, -380 + b], [sx + 120, -400 + b], 'back', 'open'); break;
      case 'hold': L = A([-sx - 12, -306 + b], [-36, -286 + b], 'front', 'open'); R = A([sx + 12, -306 + b], [36, -286 + b], 'front', 'open'); break;
      case 'handsHead': L = A([-sx - 54, -440 + b], [-62, -522 + b], 'top', 'open'); R = A([sx + 54, -440 + b], [62, -522 + b], 'top', 'open'); break;
      case 'dirt': L = A([-sx - 40, -470 + b], [-50, -588 + b], 'front', 'open'); R = A([sx + 40, -470 + b], [50, -588 + b], 'front', 'open'); break;
      case 'face': L = A([-sx - 14, -344 + b], [-48, -440 + b], 'top', 'open'); R = A([sx + 14, -344 + b], [48, -440 + b], 'top', 'open'); break;
      case 'cheer': L = A([-sx - 44, -466 + b], [-sx - 70, -546 + b]); R = A([sx + 44, -466 + b], [sx + 70, -546 + b]); break;
      case 'out': L = A([-sx - 64, -350 + b], [-sx - 120, -300 + b]); R = A([sx + 64, -350 + b], [sx + 120, -300 + b]); break;
      case 'pump': L = A([-sx - 30, -322 + b], [-sx - 70, -282 + b]); R = A([sx + 42, -336 + b], [sx + 70, -390 + b], 'front'); break;
      case 'lift': L = A([-sx - 10, -480 + b], [-6, -576 + b], 'front', 'open'); R = A([sx + 30, -480 + b], [70, -590 + b], 'front', 'open'); break;
      case 'chin': L = A([-sx - 14, -300 + b], [-60, -248 + b], 'front'); R = A([sx + 20, -318 + b], [26, -418 + b], 'top', 'open'); break;
      case 'plead': L = A([-sx - 6, -322 + b], [-22, -334 + b], 'front', 'open'); R = A([sx + 6, -322 + b], [22, -334 + b], 'front', 'open'); break;
      case 'towel': L = A([-sx - 18, -300 + b], [-50, -282 + b], 'front'); items.push({ t: 'towel', x: -sx + 2, y: -292 + b }); break;
      case 'candle': R = A([sx + 34, -318 + b], [sx + 36, -384 + b]); items.push({ t: 'candle', x: sx + 36, y: -384 + b }); break;
      case 'plate': L = A([-sx - 20, -298 + b], [-92, -262 + b], 'front'); R = A([sx + 20, -298 + b], [92, -262 + b], 'front'); items.push({ t: 'plate', x: 0, y: -268 + b }); break;
      case 'goblet': R = A([sx + 34, -322 + b], [sx + 32, -394 + b]); items.push({ t: 'goblet', x: sx + 32, y: -394 + b }); break;
      case 'grapes': R = A([sx + 30, -330 + b], [70, -428 + b], 'front'); items.push({ t: 'grapes', x: 70, y: -428 + b }); break;
      case 'bow':
        L = A([-sx - 80, -392 + b], [-sx - 156, -392 + b]); R = A([sx - 10, -404 + b], [-30, -396 + b], 'front');
        items.push({ t: 'bow', x: -sx - 156, y: -392 + b, pull: -30 }); break;
      case 'bowSide': L = A([-sx - 18, -300 + b], [-sx - 24, -236 + b]); items.push({ t: 'bowside', x: -sx - 24, y: -236 + b }); break;
      case 'apple': R = A([sx + 40, -334 + b], [sx + 94, -360 + b], 'back', 'open'); items.push({ t: 'apple', x: sx + 100, y: -384 + b }); break;
      case 'hammer': {
        const u = o.hammerUp ?? 1;
        R = A([sx + lerp(46, 60, u), lerp(-320, -446, u) + b], [lerp(sx + 66, sx + 20, u), lerp(-262, -534, u) + b]);
        items.push({ t: 'hammer', x: lerp(sx + 66, sx + 20, u), y: lerp(-262, -534, u) + b, a: lerp(80, -20, u) });
        L = A([-sx - 10, -300 + b], [-10, -270 + b], 'front'); items.push({ t: 'tongs', x: -10, y: -270 + b });
        break;
      }
      case 'ladle': R = A([sx + 20, -320 + b], [sx + 40, -380 + b]); items.push({ t: 'ladle', x: sx + 40, y: -380 + b }); break;
      case 'down': default: break;
    }
    if (o.shieldOn && key !== 'bow') L = { ...L, hidden: true };
    return { L, R, items };
  }
  function drawArm(s, a, P, armor) {
    let g = limb(s[0], s[1], a.e[0], a.e[1], 30, P.skin, P.skinS) + limb(a.e[0], a.e[1], a.h[0], a.h[1], 27, P.skin, P.skinS);
    if (armor) {
      const p = t => [lerp(a.e[0], a.h[0], t), lerp(a.e[1], a.h[1], t)], p1 = p(0.5), p2 = p(0.84);
      const d = `M${n(p1[0])},${n(p1[1])} L${n(p2[0])},${n(p2[1])}`;
      g += `<path d="${d}" stroke="${INK}" stroke-width="40" stroke-linecap="butt"/><path d="${d}" stroke="${P.metal}" stroke-width="32" stroke-linecap="butt"/>`;
    }
    return g;
  }
  function drawHand(a, P) {
    const [x, y] = a.h;
    let s = handC(x, y, 16, P.skin);
    if (a.hand === 'finger') s += `<rect x="${n(x - 6)}" y="${n(y - 40)}" width="12" height="30" rx="6" fill="${P.skin}" ${ink(SW * 0.9)}/>` + handC(x, y, 16, P.skin).replace('r="16"', 'r="15"');
    if (a.hand === 'point') s += `<g transform="translate(${n(x)} ${n(y)}) rotate(-35)"><rect x="6" y="-6" width="34" height="12" rx="6" fill="${P.skin}" ${ink(SW * 0.9)}/></g>` + handC(x, y, 15, P.skin);
    if (a.hand === 'open') s = `<ellipse cx="${n(x)}" cy="${n(y)}" rx="17" ry="16" fill="${P.skin}" ${ink()}/><path d="M${n(x - 6)},${n(y - 4)} l0,8 M${n(x + 2)},${n(y - 6)} l0,9" stroke="${P.skinS}" stroke-width="3" stroke-linecap="round"/>`;
    return s;
  }
  function drawItem(it, P) {
    switch (it.t) {
      case 'spear': return spear(it.x, it.y, it.a, P, 1, it.below ?? 222);
      case 'sword': return sword(it.x, it.y, it.a, P);
      case 'lyre': return lyre(it.x, it.y, it.s, { rot: it.rot });
      case 'towel': return `<path d="M${n(it.x - 30)},${n(it.y)} Q${n(it.x + 4)},${n(it.y - 10)} ${n(it.x + 34)},${n(it.y + 4)} L${n(it.x + 40)},${n(it.y + 96)} Q${n(it.x + 6)},${n(it.y + 88)} ${n(it.x - 26)},${n(it.y + 100)} Z" fill="#f4efe2" ${ink()}/>
        <path d="M${n(it.x - 27)},${n(it.y + 80)} Q${n(it.x + 6)},${n(it.y + 70)} ${n(it.x + 38)},${n(it.y + 78)} M${n(it.x - 28)},${n(it.y + 66)} Q${n(it.x + 6)},${n(it.y + 56)} ${n(it.x + 37)},${n(it.y + 64)}" fill="none" stroke="#5aa8ae" stroke-width="5"/>`;
      case 'candle': return `<rect x="${n(it.x - 9)}" y="${n(it.y - 66)}" width="18" height="54" rx="4" fill="#f4efe2" ${ink(SW * 0.9)}/>
        <path d="M${n(it.x)},${n(it.y - 104)} Q${n(it.x + 14)},${n(it.y - 80)} ${n(it.x)},${n(it.y - 68)} Q${n(it.x - 14)},${n(it.y - 80)} ${n(it.x)},${n(it.y - 104)} Z" fill="#ffd36b" ${ink(2.5)}/>
        <ellipse cx="${n(it.x)}" cy="${n(it.y - 10)}" rx="30" ry="9" fill="${C.bronze}" ${ink(SW * 0.9)}/>`;
      case 'plate': {
        let s = `<ellipse cx="${it.x}" cy="${n(it.y + 6)}" rx="150" ry="34" fill="#d9b25c" ${ink()}/><ellipse cx="${it.x}" cy="${n(it.y)}" rx="128" ry="24" fill="#efd28a"/>`;
        // a roast leg, a bread, grapes, an apple pile
        s += `<path d="M${it.x - 96},${it.y - 2} Q${it.x - 100},${it.y - 64} ${it.x - 44},${it.y - 60} Q${it.x - 10},${it.y - 40} ${it.x - 30},${it.y - 4} Z" fill="#b8622e" ${ink()}/>
          <path d="M${it.x - 40},${it.y - 52} l22,-30" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M${it.x - 40},${it.y - 52} l22,-30" stroke="#f4efe2" stroke-width="8" stroke-linecap="round"/>
          <ellipse cx="${it.x + 20}" cy="${it.y - 18}" rx="40" ry="24" fill="#d9a05a" ${ink()}/><path d="M${it.x + 2},${it.y - 30} l10,14 M${it.x + 20},${it.y - 36} l10,14 M${it.x + 38},${it.y - 32} l8,12" stroke="#a8743f" stroke-width="4" stroke-linecap="round"/>`;
        for (const [dx, dy] of [[70, -14], [86, -26], [100, -12], [80, -2], [94, -38], [110, -26]]) s += `<circle cx="${it.x + dx}" cy="${it.y + dy}" r="11" fill="#7b4a8f" ${ink(2.5)}/>`;
        return s;
      }
      case 'goblet': return `<path d="M${it.x - 26},${it.y - 52} L${it.x + 26},${it.y - 52} Q${it.x + 24},${it.y - 14} ${it.x},${it.y - 8} Q${it.x - 24},${it.y - 14} ${it.x - 26},${it.y - 52} Z" fill="#e8bd55" ${ink()}/>
        <ellipse cx="${it.x}" cy="${it.y - 52}" rx="26" ry="7" fill="#8a2433" ${ink(2.5)}/><rect x="${it.x - 5}" y="${it.y - 10}" width="10" height="26" fill="#c99230" ${ink(2.5)}/><ellipse cx="${it.x}" cy="${it.y + 18}" rx="20" ry="6" fill="#c99230" ${ink(2.5)}/>`;
      case 'grapes': {
        let s = `<path d="M${it.x},${it.y - 14} q6,-18 18,-22" fill="none" stroke="${C.woodS}" stroke-width="5" stroke-linecap="round"/>`;
        for (const [dx, dy] of [[0, 14], [-14, 26], [14, 26], [-7, 40], [9, 40], [0, 54]]) s += `<circle cx="${it.x + dx}" cy="${it.y + dy}" r="11" fill="#7b4a8f" ${ink(2.5)}/>`;
        return s;
      }
      case 'bow': return bowArc(it.x, it.y, 270, { pullX: it.pull }) + `<path d="M${it.pull},${it.y} L${it.x - 80},${it.y}" stroke="${C.woodS}" stroke-width="5"/><path d="M${it.x - 92},${it.y} l16,-9 l0,18 Z" fill="${C.bronze}" ${ink(2)}/>`;
      case 'bowside': return bowArc(it.x + 4, it.y - 20, 240, {});
      case 'apple': return goldenApple(it.x, it.y, 26);
      case 'hammer': return `<g transform="translate(${n(it.x)} ${n(it.y)}) rotate(${n(it.a)})"><rect x="-7" y="-110" width="14" height="128" rx="5" fill="${C.wood}" ${ink(SW * 0.9)}/>
        <rect x="-40" y="-146" width="80" height="44" rx="8" fill="#5b5f66" ${ink()}/><rect x="-36" y="-142" width="72" height="12" fill="#7d838b"/></g>`;
      case 'tongs': return `${line2(`M${it.x},${it.y} L${it.x + 120},${it.y + 22}`, '#4a4d52', 7)}${line2(`M${it.x},${it.y + 8} L${it.x + 118},${it.y + 30}`, '#4a4d52', 7)}
        <rect x="${it.x + 112}" y="${it.y + 14}" width="60" height="22" rx="6" fill="#ff9a3c" ${ink(2.5)}/><rect x="${it.x + 118}" y="${it.y + 18}" width="46" height="8" rx="4" fill="#ffe08a"/>`;
      case 'ladle': return `${line2(`M${it.x},${it.y} L${it.x - 70},${it.y + 96}`, C.wood, 9)}<ellipse cx="${it.x - 82}" cy="${it.y + 108}" rx="26" ry="16" fill="${C.woodS}" ${ink()}/>`;
      default: return '';
    }
  }

  // ---------- the adult figure ----------
  const DEF = { skin: C.skin, skinS: C.skinS, hair: C.gold, hairS: C.goldS, tunic: C.teal, tunicS: C.tealS, hem: C.bronze,
    cape: C.teal, capeS: C.tealS, metal: C.bronze, metalS: C.bronzeS, metalL: C.bronzeL, crest: '#b8352c', emblem: 'waves', rim: C.teal, mark: C.tealS };

  // man(o): pose 'stand'|'walk'|'run'|'kneel'|'sit'|'lunge'|'scream'|'ride'; arms (see armsFor); armor, helmet, cape, shieldOn;
  // robe (long garment to the ankles); build 'normal'|'heavy'|'stocky'; dir -1 mirrors run/lunge (moving left);
  // head: { hair: 'tousled'|'curls'|'short'|'long'|'bald'|'none', back, beard: 'none'|'short'|'full'|'long'|'cloud', wear (extra svg on the head),
  //         lashes, noCheeks, front (replaces the hair) }
  function man(o = {}) {
    const P = { ...DEF, ...(o.P || {}) };
    const pose = o.pose || 'stand', b = o.breathe || 0, r = o.r || 72;
    const armor = !!o.armor, robe = !!o.robe, heavy = o.build === 'heavy', stocky = o.build === 'stocky';
    const sx = heavy ? 96 : stocky ? 92 : 84;
    const Lg = legsFor(pose, P, armor && !robe);
    const H = Lg.H, shift = H[1] + 196;
    const T = `translate(${H[0]} ${n(H[1] + 196)}) rotate(${Lg.lean} 0 -196)`;
    // cape behind everything
    let capeG = '';
    if (o.cape) {
      const top = -392 + b;
      const shape = Lg.cape === 'flow'
        ? a => `<path d="M-74,${top} Q-160,-300 -246,-150 Q-196,-158 -160,-128 Q-120,-176 -64,-150 Q-10,-240 74,${top} Z" ${a}/>`
        : Lg.cape === 'short'
          ? a => `<path d="M-74,${top} Q-122,-260 -112,-150 Q-40,-136 0,-156 Q40,-136 112,-150 Q122,-260 74,${top} Z" ${a}/>`
          : a => `<path d="M-74,${top} Q-130,-200 -118,-70 Q-40,-50 0,-80 Q40,-50 118,-70 Q130,-200 74,${top} Z" ${a}/>`;
      capeG = `<g transform="${T}">${cel(shape, P.cape, P.capeS, 0.1, 0, 120)}</g>`;
    }
    // lower garment
    let low = '';
    const wHem = heavy ? 130 : 94;
    if (armor && !robe) {
      low += `<path d="M-70,-226 Q0,-220 70,-226 L80,-158 Q0,-150 -80,-158 Z" fill="${P.tunic}" ${ink()}/>`;
      for (let i = 0; i < 7; i++) low += `<rect x="${-66 + i * 22 - 9}" y="-232" width="19" height="62" rx="6" fill="${i % 2 ? C.leather : C.leatherS}" ${ink(SW * 0.8)}/>`;
    } else if (pose === 'sit') {
      low += cel(a => `<path d="M-${wHem - 20},-232 Q0,-222 ${wHem - 20},-232 Q${wHem},-196 ${wHem - 6},-170 Q${wHem - 26},-154 46,-160 Q0,-148 -46,-160 Q-${wHem - 26},-154 -${wHem - 6},-170 Q-${wHem},-196 -${wHem - 20},-232 Z" ${a}/>`, P.tunic, P.tunicS, -0.14, 0, 90);
      low += `<path d="M-${wHem - 8},-176 Q-${wHem - 28},-162 -46,-166 Q0,-154 46,-166 Q${wHem - 28},-162 ${wHem - 8},-176" fill="none" stroke="${P.hem}" stroke-width="9" stroke-linecap="round"/>`;
    } else if (robe || pose === 'kneel' && robe) {
      const hemL = pose === 'kneel' ? -8 - shift : -14 - shift, w = pose === 'kneel' ? wHem + 56 : wHem + 18;
      low += cel(a => `<path d="M-${wHem - 22},-232 Q0,-222 ${wHem - 22},-232 Q${w - 6},-130 ${w},${hemL} Q0,${hemL + 12} -${w},${hemL} Q-${w - 6},-130 -${wHem - 22},-232 Z" ${a}/>`, P.tunic, P.tunicS, -0.14, 0, 110);
      low += `<path d="M-${w - 4},${hemL - 12} Q0,${hemL} ${w - 4},${hemL - 12}" fill="none" stroke="${P.hem}" stroke-width="10" stroke-linecap="round"/>
        <path d="M-30,-200 Q-40,${hemL / 2 - 60} -54,${hemL - 20} M26,-196 Q36,${hemL / 2 - 60} 48,${hemL - 20}" fill="none" stroke="${P.tunicS}" stroke-width="4" stroke-linecap="round"/>`;
    } else {
      // a short chiton: flared skirt to above the knee, bronze hem with a small key pattern (like the kid's)
      const hemY = pose === 'kneel' ? -136 : -126, w = wHem + 8;
      low += cel(a => `<path d="M-${wHem - 24},-236 Q0,-226 ${wHem - 24},-236 Q${w - 14},-180 ${w},${hemY} Q0,${hemY + 14} -${w},${hemY} Q-${w - 14},-180 -${wHem - 24},-236 Z" ${a}/>`, P.tunic, P.tunicS, -0.14, 0, 90);
      low += `<path d="M-${w - 3},${hemY - 13} Q0,${hemY + 1} ${w - 3},${hemY - 13} L${w},${hemY} Q0,${hemY + 14} -${w},${hemY} Z" fill="${P.hem}" ${ink(SW * 0.8)}/>`;
      for (let x = -w + 16; x <= w - 24; x += 19) { const yy = hemY + 3 + 10 * (1 - Math.pow(x / w, 2)); low += `<path d="M${x},${n(yy)} l0,-7 l9,0 l0,4" fill="none" stroke="${P.tunicS}" stroke-width="2.6"/>`; }
      low += `<path d="M-34,-212 Q-44,-176 -60,${hemY - 12} M28,-208 Q36,-176 50,${hemY - 12} M-4,-206 L-6,${hemY - 6}" fill="none" stroke="${P.tunicS}" stroke-width="4" stroke-linecap="round"/>`;
    }
    // arms
    const arms = armsFor(o.arms || (o.spear ? 'spear' : 'down'), pose, sx, b, { ...o });
    const SL = [-sx, -384 + b], SR = [sx, -384 + b];
    const armSvg = layer => [['L', SL], ['R', SR]].filter(([k]) => arms[k].layer === layer && !arms[k].hidden).map(([k, s]) => drawArm(s, arms[k], P, armor)).join('');
    const handSvg = layer => [['L'], ['R']].filter(([k]) => arms[k].layer === layer && !arms[k].hidden).map(([k]) => drawHand(arms[k], P)).join('');
    // torso
    let torso = '';
    if (armor) {
      const cu = a => `<path d="M-80,${-398 + b} Q0,${-414 + b} 80,${-398 + b} Q96,-310 68,-222 Q0,-212 -68,-222 Q-96,-310 -80,${-398 + b} Z" ${a}/>`;
      torso += cel(cu, P.metal, P.metalS, -0.14, -0.04, 90);
      torso += `<path d="M-50,-330 Q-26,-306 0,-326 Q26,-306 50,-330" fill="none" stroke="${P.metalS}" stroke-width="5" stroke-linecap="round"/>
        <path d="M0,-318 L0,-236 M-30,-282 Q0,-274 30,-282 M-28,-254 Q0,-246 28,-254" fill="none" stroke="${P.metalS}" stroke-width="4" stroke-linecap="round"/>
        <path d="M-58,-382 Q-66,-330 -56,-300" fill="none" stroke="${P.metalL}" stroke-width="6" stroke-linecap="round"/>`;
      if (o.cape) torso += `<circle cx="-62" cy="${-392 + b}" r="10" fill="${C.goldL}" ${ink(SW * 0.8)}/><circle cx="62" cy="${-392 + b}" r="10" fill="${C.goldL}" ${ink(SW * 0.8)}/>`;
    } else {
      const wS = heavy ? 88 : stocky ? 84 : 74, wB = heavy ? 124 : stocky ? 96 : 90, wW = heavy ? 108 : stocky ? 86 : 72;
      const top = a => `<path d="M-${wS},${-396 + b} Q0,${-408 + b} ${wS},${-396 + b} Q${wB},-310 ${wW + 6},-234 Q0,-222 -${wW + 6},-234 Q-${wB},-310 -${wS},${-396 + b} Z" ${a}/>`;
      torso += cel(top, P.tunic, P.tunicS, -0.14, 0, 100);
      torso += `<path d="M-24,${-402 + b} Q0,${-378 + b} 24,${-402 + b}" fill="none" stroke="${P.tunicS}" stroke-width="5" stroke-linecap="round"/>
        <path d="M-${wW + 2},-252 Q-${wW / 2},-240 0,-246 Q${wW / 2},-240 ${wW + 2},-252" fill="none" stroke="${P.tunicS}" stroke-width="4" stroke-linecap="round"/>
        <path d="M-40,-380 Q-46,-330 -38,-280 M36,-378 Q44,-330 36,-282" fill="none" stroke="${P.tunicS}" stroke-width="3.5" stroke-linecap="round" opacity="0.8"/>`;
      if (heavy) torso += `<path d="M-70,-268 Q0,-236 70,-268" fill="none" stroke="${P.tunicS}" stroke-width="5" stroke-linecap="round"/>`;
      if (o.sash) torso += `<path d="M-${wS - 10},${-394 + b} L${wW - 4},-232 L${wW + 8},-252 L-${wS - 26},${-404 + b} Z" fill="${o.sash}" ${ink(SW * 0.8)}/>`;
      if (o.apron) torso += `<path d="M-${wW - 10},-300 Q0,-312 ${wW - 10},-300 L${wW + 10},-120 Q0,-108 -${wW + 10},-120 Z" fill="${C.leather}" ${ink()}/><path d="M-${wS - 20},${-392 + b} L-${wW - 14},-300 M${wS - 20},${-392 + b} L${wW - 14},-300" stroke="${C.leatherS}" stroke-width="8"/>`;
      torso += `<path d="M-${wW},-232 Q0,-222 ${wW},-232" fill="none" stroke="${o.belt || C.leather}" stroke-width="12" stroke-linecap="round"/><path d="M-${wW},-232 Q0,-222 ${wW},-232" fill="none" ${ink(2)} opacity="0.5"/>`;
      if (o.trim) torso += `<path d="M-${wS - 4},${-392 + b} Q-${wB - 8},-310 -${wW - 2},-236 M${wS - 4},${-392 + b} Q${wB - 8},-310 ${wW - 2},-236" fill="none" stroke="${o.trim}" stroke-width="7" stroke-linecap="round"/>`;
    }
    // head
    const hd = o.head || {};
    let front = hd.front, back = hd.back ?? '';
    if (front === undefined) {
      if (o.helmet) front = helmet(r, P);
      else if (hd.hair === 'curls') { front = curls(r, P.hair, P.hairS); back = back || curlsBack(r, P.hair, P.hairS); }
      else if (hd.hair === 'short') front = tousled(r, { tufts: 4, depth: 0.15, top: 1.1, cowlick: false, col: P.hair, shade: P.hairS });
      else if (hd.hair === 'none' || hd.hair === 'bald') front = '';
      else { front = tousled(r, { tufts: 6, depth: 0.28, col: P.hair, shade: P.hairS }); back = back || heroBack(r, P.hairS); }
    }
    const bd = beard(r, hd.beard, P.beard || P.hair, P.beardS || P.hairS);
    const lashes = hd.lashes ? [-1, 1].map(sd => `<path d="M${n(sd * 0.42 * r)},${n(0.04 * r)} l${n(sd * 0.08 * r)},${n(-0.06 * r)}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`).join('') : '';
    const headTilt = pose === 'scream' ? -7 : (o.headTilt || 0), headDy = pose === 'scream' ? -6 : 0;
    const headSvg = `<g transform="translate(0 ${n(-470 + b + headDy)}) rotate(${headTilt})">${head2(r, {
      expr: 'smile', ...o, skin: P.skin, skinS: P.skinS, noCheeks: hd.noCheeks ?? !!(hd.beard && hd.beard !== 'none'),
      back, front: (front || '') + lashes + (hd.wear || ''), beardBack: bd.back, beard: bd.front })}</g>`;
    // short cap sleeves over the shoulders (cloth only)
    const wSl = heavy ? 88 : stocky ? 84 : 74;
    const sleeves = armor ? '' : [-1, 1].map(sd => { const y0 = -400 + b;
      return cel(a => `<path d="M${sd * (wSl - 22)},${y0} Q${sd * (wSl + 26)},${y0 - 8} ${sd * (wSl + 32)},${y0 + 40} Q${sd * (wSl + 26)},${y0 + 58} ${sd * (wSl + 4)},${y0 + 54} Q${sd * (wSl - 8)},${y0 + 30} ${sd * (wSl - 22)},${y0} Z" ${a}/>`,
        sd < 0 ? P.tunic : P.tunicS, P.tunicS, -0.12, 0, 40); }).join('');
    const hasTop = arms.L.layer === 'top' || arms.R.layer === 'top';
    // assemble the upper body
    let up = (o.behind || '') + low + armSvg('back') + handSvg('back') + torso + armSvg('front') + (hasTop ? '' : sleeves);
    up += arms.items.map(it => drawItem(it, P)).join('');
    up += handSvg('front');
    up += `<rect x="-20" y="${-428 + b}" width="40" height="34" fill="${P.skinS}" ${ink()}/>`;
    up += headSvg;
    if (o.shieldOn) {
      const sp = pose === 'run' ? [-sx - 34, -312 + b, 90] : pose === 'lunge' ? [-sx - 40, -330 + b, 90] : [-sx - 28, -300 + b, 94];
      up += shield2(sp[0], sp[1], sp[2], P);
    }
    up += armSvg('top') + (hasTop ? sleeves : '') + handSvg('top');
    // sit + robe: the robe falls over the shins
    let robeFall = '';
    if (pose === 'sit' && robe) robeFall = cel(a => `<path d="M-${wHem - 4},-150 L${wHem - 4},-150 L${wHem + 14},-18 Q0,-6 -${wHem + 14},-18 Z" ${a}/>`, P.tunic, P.tunicS, -0.14, 0, 100)
      + `<path d="M-${wHem + 10},-30 Q0,-18 ${wHem + 10},-30" fill="none" stroke="${P.hem}" stroke-width="9" stroke-linecap="round"/>`;
    const legSvg = robe && pose === 'kneel' ? '' : Lg.svg;   // a kneeling robe covers both legs
    let s = capeG + legSvg + robeFall + `<g transform="${T}">${up}</g>` + (Lg.knees || '');
    if (o.dir === -1) s = `<g transform="scale(-1 1)">${s}</g>`;
    return s;
  }

  // ---------- presets: adults ----------
  // Achilles: identical to hero() when standing in armour with the spear; otherwise the same design in any pose.
  function achilles(o = {}) {
    const pose = o.pose || 'stand', armor = o.armor !== false;
    if (pose === 'stand' && armor && (!o.arms || o.arms === 'spear') && !o.head && !o.P) return K.hero({ expr: 'proud', ...o });
    return man({ expr: 'proud', cape: armor, shieldOn: armor && o.shieldOn !== false && !['lyre', 'hold', 'dirt', 'handsHead', 'plead', 'face', 'cheer', 'bow', 'lift'].includes(o.arms), helmet: false,
      spear: armor, ...o, armor, P: { ...(armor ? {} : { tunic: C.teal, tunicS: C.tealS, hem: C.bronze }), ...(o.P || {}) } });
  }
  const PATRO = { hair: '#3b2618', hairS: '#24170e', tunic: '#9a3a2e', tunicS: '#74291f', hem: C.bronze };
  function patroclus(o = {}) {
    const armored = !!o.armor;
    return man({ expr: 'calm', cape: armored, shieldOn: armored, spear: armored, ...o, head: { hair: 'curls', ...(o.head || {}) },
      P: armored ? { hair: PATRO.hair, hairS: PATRO.hairS, ...(o.P || {}) } : { ...PATRO, ...(o.P || {}) } });
  }
  const HECTOR = { hair: '#4a2f1f', hairS: '#33200f', beard: '#4a2f1f', beardS: '#33200f', tunic: '#7a2e2e', tunicS: '#5c2020', hem: '#d6a04a',
    cape: '#7a2e2e', capeS: '#5c2020', metal: '#c99a52', metalS: '#9c7234', metalL: '#e6c486', crest: '#3a2a22', emblem: 'horse', rim: '#5c2020', mark: '#5c2020' };
  function hector(o = {}) {
    const P = o.inAchillesArmor ? { ...DEF, hair: HECTOR.hair, hairS: HECTOR.hairS, beard: HECTOR.beard, beardS: HECTOR.beardS } : HECTOR;
    return man({ expr: 'calm', armor: true, cape: true, shieldOn: true, spear: true, ...o, head: { hair: 'short', beard: 'short', ...(o.head || {}) }, P: { ...P, ...(o.P || {}) } });
  }
  const SOLDIERS = {
    greek: [
      { tunic: C.teal, tunicS: C.tealS, crest: C.tealS, emblem: 'waves', rim: C.teal, mark: C.tealS },                // Myrmidon
      { tunic: '#6f7f3a', tunicS: '#55622b', crest: '#e2b04e', emblem: 'star', rim: '#55622b', mark: '#55622b' },
      { tunic: '#3e6f9e', tunicS: '#2c537a', crest: '#f4efe2', emblem: 'eye', rim: '#2c537a', mark: '#2c537a' },
    ],
    trojan: [
      { tunic: '#7a2e2e', tunicS: '#5c2020', crest: '#2a1f1b', emblem: 'horse', rim: '#5c2020', mark: '#5c2020', metal: '#c99a52', metalS: '#9c7234', metalL: '#e6c486' },
      { tunic: '#8a5a2a', tunicS: '#6b431d', crest: '#e2b04e', emblem: 'sun', rim: '#6b431d', mark: '#6b431d', metal: '#c99a52', metalS: '#9c7234', metalL: '#e6c486' },
      { tunic: '#5b3a5c', tunicS: '#432a44', crest: '#b8352c', emblem: 'none', rim: '#432a44', mark: '#432a44', metal: '#c99a52', metalS: '#9c7234', metalL: '#e6c486' },
    ],
  };
  function soldier(o = {}) {
    const side = o.side || 'greek', k = (o.k || 0) % 3;
    const hair = side === 'greek' ? ['#6b3f26', '#2e2420', '#a64b2a'][k] : ['#2e2420', '#4a2f1f', '#3f2a1e'][k];
    return man({ expr: 'stern', armor: true, helmet: true, cape: false, shieldOn: true, spear: true, ...o,
      P: { ...DEF, hair, hairS: hair, ...SOLDIERS[side][k], ...(o.P || {}) } });
  }
  function memnon(o = {}) {
    return man({ expr: 'determined', armor: true, cape: true, shieldOn: true, spear: true, ...o, head: { hair: 'curls', ...(o.head || {}) },
      P: { skin: '#8d5a3b', skinS: '#6e4229', hair: '#1f1612', hairS: '#120c09', tunic: '#c26b7a', tunicS: '#9c5060', cape: '#e89aa6', capeS: '#c77885',
        metal: '#ecc35a', metalS: '#c3922e', metalL: '#fbe29a', crest: '#f08aa0', emblem: 'sun', rim: '#c77885', mark: '#9c5060', ...(o.P || {}) } });
  }
  const PELEUS = { hair: '#8a7a6a', hairS: '#6b5d50', beard: '#8a7a6a', beardS: '#6b5d50', tunic: '#8c3b3b', tunicS: '#6b2a2a', hem: '#e2b04e' };
  function peleus(o = {}) {
    let P = { ...PELEUS };
    if (o.old) Object.assign(P, { hair: '#e9e4da', hairS: '#c9c2b6', beard: '#e9e4da', beardS: '#c9c2b6' });
    if (o.nightshirt) Object.assign(P, { tunic: '#f1e8d6', tunicS: '#d9ccb2', hem: '#d9ccb2' });
    const wear = o.nightshirt ? '' : circlet(72);
    return man({ expr: 'smile', robe: true, trim: o.nightshirt ? null : '#e2b04e', ...o,
      head: { hair: 'short', beard: 'short', wear, ...(o.head || {}) }, P: { ...P, ...(o.P || {}) } });
  }
  function agamemnon(o = {}) {
    const r = 72;
    const crown = `<path d="M${n(-0.95 * r)},${n(-0.5 * r)} L${n(-1.08 * r)},${n(-1.5 * r)} L${n(-0.62 * r)},${n(-1.1 * r)} L${n(-0.32 * r)},${n(-1.75 * r)} L0,${n(-1.15 * r)} L${n(0.32 * r)},${n(-1.75 * r)} L${n(0.62 * r)},${n(-1.1 * r)} L${n(1.08 * r)},${n(-1.5 * r)} L${n(0.95 * r)},${n(-0.5 * r)} Q0,${n(-0.72 * r)} ${n(-0.95 * r)},${n(-0.5 * r)} Z" fill="#efc24a" ${ink()}/>
      <path d="M${n(-0.95 * r)},${n(-0.62 * r)} Q0,${n(-0.84 * r)} ${n(0.95 * r)},${n(-0.62 * r)}" fill="none" stroke="#c99230" stroke-width="7"/>
      ${[[-0.62, -0.78, '#c8302a'], [0, -0.86, '#2f7f88'], [0.62, -0.78, '#c8302a']].map(([x, y, c]) => `<circle cx="${n(x * r)}" cy="${n(y * r)}" r="${n(0.09 * r)}" fill="${c}" ${ink(2.5)}/>`).join('')}
      ${[-1.08, -0.32, 0.32, 1.08].map(x => `<circle cx="${n(x * r)}" cy="${n((Math.abs(x) > 1 ? -1.5 : -1.75) * r)}" r="${n(0.07 * r)}" fill="#fff6c8" ${ink(2)}/>`).join('')}`;
    return man({ expr: 'smug', robe: true, build: 'heavy', trim: '#e2b04e', belt: '#e2b04e', ...o,
      head: { hair: 'short', beard: 'full', wear: crown, ...(o.head || {}) },
      P: { hair: '#231a18', hairS: '#120c0b', beard: '#231a18', beardS: '#120c0b', tunic: '#a3202f', tunicS: '#7d1622', hem: '#e2b04e', ...(o.P || {}) } });
  }
  function priam(o = {}) {
    const r = 72;
    const crown = o.crown ? `<path d="M${n(-0.82 * r)},${n(-0.6 * r)} L${n(-0.82 * r)},${n(-1.12 * r)} L${n(-0.5 * r)},${n(-0.86 * r)} L${n(-0.2 * r)},${n(-1.22 * r)} L${n(0.1 * r)},${n(-0.88 * r)} L${n(0.42 * r)},${n(-1.2 * r)} L${n(0.82 * r)},${n(-1.1 * r)} L${n(0.82 * r)},${n(-0.6 * r)} Q0,${n(-0.75 * r)} ${n(-0.82 * r)},${n(-0.6 * r)} Z" fill="#e8bd55" ${ink()}/>` : '';
    const hair = `<path d="M${n(-1.0 * r)},${n(0.1 * r)} Q${n(-1.06 * r)},${n(-0.5 * r)} ${n(-0.8 * r)},${n(-0.66 * r)} L${n(0.8 * r)},${n(-0.66 * r)} Q${n(1.06 * r)},${n(-0.5 * r)} ${n(1.0 * r)},${n(0.1 * r)} Q${n(0.86 * r)},${n(-0.3 * r)} ${n(0.6 * r)},${n(-0.5 * r)} Q0,${n(-0.6 * r)} ${n(-0.6 * r)},${n(-0.5 * r)} Q${n(-0.86 * r)},${n(-0.3 * r)} ${n(-1.0 * r)},${n(0.1 * r)} Z" fill="#e9e4da" ${ink()}/>`;
    const arms = o.arms || 'down';
    const pose = o.pose === 'kneel' ? 'kneel' : o.pose === 'walk' ? 'walk' : 'stand';
    return man({ expr: 'worried', robe: true, trim: '#c9a46c', ...o, pose, arms,
      head: { hair: 'none', beard: 'long', back: longBack(r, '#e9e4da', '#c9c2b6', 1.1), front: hair + crown, ...(o.head || {}) },
      P: { hair: '#e9e4da', hairS: '#c9c2b6', beard: '#f1ede4', beardS: '#c9c2b6', tunic: '#4b2d5c', tunicS: '#37203f', hem: '#c9a46c', ...(o.P || {}) } });
  }
  function paris(o = {}) {
    const r = 72, sh = !!o.shepherd;
    const cap = pointCap(r, '#d0602e', '#a8461f', { band: '#e2b04e' });
    const locks = [-1, 1].map(sd => `<circle cx="${n(sd * 0.9 * r)}" cy="${n(0.0 * r)}" r="${n(0.2 * r)}" fill="#7a4a2a" ${ink()}/><circle cx="${n(sd * 0.86 * r)}" cy="${n(0.26 * r)}" r="${n(0.17 * r)}" fill="#5e3820" ${ink()}/>`).join('');
    return man({ expr: 'smirk', arms: sh ? 'apple' : 'bow', ...o, behind: sh ? '' : quiver(-40, -330),
      head: { hair: 'none', front: locks + cap + [-1, 1].map(sd => `<path d="M${n(sd * 0.42 * r)},${n(0.04 * r)} l${n(sd * 0.08 * r)},${n(-0.06 * r)}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`).join(''), ...(o.head || {}) },
      P: sh ? { tunic: '#b08a5a', tunicS: '#8c6a40', hem: '#8c6a40', ...(o.P || {}) } : { tunic: '#efe0b0', tunicS: '#d6c48d', hem: '#d0602e', ...(o.P || {}) } });
  }
  function apollo(o = {}) {
    const r = 72;
    const glow = o.glow ? `<circle cx="0" cy="-330" r="330" fill="#ffd36b" opacity="0.35" filter="url(#soft)"/><circle cx="0" cy="-330" r="220" fill="#fff2b8" opacity="0.3"/>` : '';
    return glow + man({ expr: 'calm', arms: 'bowSide', ...o, sash: '#e2b04e',
      head: { hair: 'tousled', wear: laurel(r), ...(o.head || {}) },
      P: { hair: '#f6d36a', hairS: '#d9a83a', tunic: '#fbf6ea', tunicS: '#e6dcc4', hem: '#e2b04e', ...(o.P || {}) } });
  }
  function hephaestus(o = {}) {
    const r = 72;
    const soot = `<ellipse cx="${n(-0.52 * r)}" cy="${n(-0.2 * r)}" rx="${n(0.14 * r)}" ry="${n(0.07 * r)}" fill="#3a3330" opacity="0.35"/><ellipse cx="${n(0.5 * r)}" cy="${n(0.22 * r)}" rx="${n(0.12 * r)}" ry="${n(0.06 * r)}" fill="#3a3330" opacity="0.3"/>`;
    return man({ expr: 'determined', arms: 'hammer', build: 'stocky', apron: true, ...o,
      head: { hair: 'short', beard: 'full', wear: soot, ...(o.head || {}) },
      P: { skin: '#e9b78e', skinS: '#c99068', hair: '#2e2420', hairS: '#1b1512', beard: '#2e2420', beardS: '#1b1512', tunic: '#4b5563', tunicS: '#363d48', hem: '#363d48', ...(o.P || {}) } });
  }
  function penthesilea(o = {}) {
    const r = 72;
    const cap = pointCap(r, '#b8352c', '#8a2620', { band: C.bronze, flaps: true });
    return man({ expr: 'determined', pose: 'ride', arms: 'spear', shieldOn: true, ...o,
      head: { hair: 'none', back: longBack(r, '#2b1d17', '#1a110c', 1.5), front: cap, lashes: true, ...(o.head || {}) },
      P: { tunic: '#2a2224', tunicS: '#1a1416', hem: '#b8352c', metal: '#b8352c', metalS: '#8a2620', emblem: 'pelta', mark: '#2a1f1b', boots: true, shoe: '#3a2a22', ...(o.P || {}) } });
  }

  // ---------- Chiron, the centaur ----------
  // three-quarter view: horse body to the right (+x), the old teacher's torso rises from the horse's chest (left), facing you.
  // origin = ground under the middle of the horse body; the human head sits at about (-150, -612); hands for 'lift' at
  // about (-330,-470) and (-282,-452).
  function chiron(o = {}) {
    const coat = '#a0643a', coatS = '#7d4a28', coatL = '#c98d5c', mane = '#dcd8d0', maneS = '#b3ada2';
    const b = o.breathe || 0, r = 80, arms = o.arms || 'down';
    const hoof = (x, near) => `<path d="M${x - 22},-2 L${x - 16},-34 L${x + 20},-34 L${x + 26},-2 Z" fill="#2e2420" ${ink()}/>` + (near ? `<path d="M${x - 19},-28 L${x + 21},-28" stroke="${mane}" stroke-width="7"/>` : '');
    // a horse leg: upper (thick) → joint → cannon → fetlock → hoof
    const hleg = (top, j, f, col, colS, w, near) => limb(top[0], top[1], j[0], j[1], w, col, colS) + limb(j[0], j[1], f[0], f[1], w * 0.72, col, colS) + limb(f[0], f[1], f[0] + 2, -30, w * 0.66, col, colS) + hoof(f[0] + 2, near);
    let s = '';
    // tail
    s += cel(a => `<path d="M214,-318 C292,-320 318,-230 302,-130 C296,-88 272,-66 258,-78 C276,-128 262,-212 208,-276 Z" ${a}/>`, mane, maneS, -0.1, 0, 80);
    s += `<path d="M236,-300 C276,-270 286,-200 276,-120" fill="none" stroke="${maneS}" stroke-width="5" stroke-linecap="round"/>`;
    // far legs (in shadow)
    s += hleg([-92, -232], [-98, -142], [-92, -70], coatS, coatS, 36, false);
    s += hleg([178, -244], [208, -150], [184, -72], coatS, coatS, 38, false);
    // horse body: chest at the front (left), round rump at the back
    s += cel(a => `<path d="M-176,-296 C-180,-352 -120,-376 -40,-370 C80,-364 196,-372 238,-318 C266,-280 252,-214 210,-202 C150,-188 60,-196 -40,-196 C-120,-196 -172,-226 -176,-296 Z" ${a}/>`, coat, coatS, -0.03, -0.16, 220);
    s += `<path d="M-120,-214 Q40,-190 200,-214" fill="none" stroke="${coatL}" stroke-width="12" stroke-linecap="round" opacity="0.5"/>
      <path d="M150,-350 Q200,-330 220,-290" fill="none" stroke="${coatL}" stroke-width="8" stroke-linecap="round" opacity="0.6"/>`;
    // near legs
    s += hleg([-138, -236], [-146, -138], [-136, -66], coat, coatS, 42, true);
    s += hleg([140, -240], [178, -140], [150, -68], coat, coatS, 44, true);
    // the human part
    const tx = -150, wy = -330;   // waist on the horse's chest
    let up = '';
    up += quiver(tx + 70, -540 + b, 30) + line2(`M${tx - 82},${-610 + b} Q${tx - 168},${-490 + b} ${tx - 84},${-370 + b}`, C.woodS, 10)
      + `<path d="M${tx - 82},${-610 + b} L${tx - 84},${-370 + b}" stroke="#f3e6c8" stroke-width="2.5"/>`;
    const sxL = tx - 84, sxR = tx + 84, sy = -526 + b;
    const A = (e, h, layer = 'back', hand = 'fist') => ({ e, h, layer, hand });
    let L = A([sxL - 22, -440 + b], [sxL - 16, -366 + b]), R = A([sxR + 22, -440 + b], [sxR + 16, -366 + b]);
    const items = [];
    if (arms === 'ladle') { R = A([sxR + 24, -450 + b], [sxR - 6, -408 + b], 'front'); items.push({ t: 'ladle', x: sxR - 6, y: -408 + b }); }
    if (arms === 'staff') { R = A([sxR + 30, -460 + b], [sxR - 30, -440 + b], 'front'); items.push({ t: 'staff', x: sxR - 30, y: -440 + b }); }
    if (arms === 'offer') { L = A([sxL - 64, -484 + b], [sxL - 136, -480 + b]); items.push({ t: 'lyre', x: sxL - 158, y: -436 + b, s: 0.72, rot: -10 }); }
    if (arms === 'lift') { L = A([sxL - 60, -470 + b], [sxL - 96, -470 + b], 'back', 'open'); R = A([sxR - 40, -436 + b], [sxL - 48, -452 + b], 'front', 'open'); }
    const skinP = { skin: C.skin, skinS: C.skinS };
    const drawA = (sP, a) => limb(sP[0], sP[1], a.e[0], a.e[1], 32, C.skin, C.skinS) + limb(a.e[0], a.e[1], a.h[0], a.h[1], 29, C.skin, C.skinS);
    const both = [['L', [sxL, sy], L], ['R', [sxR, sy], R]];
    up += both.filter(x => x[2].layer === 'back').map(([, sp, a]) => drawA(sp, a) + drawHand(a, skinP)).join('');
    // torso, an old man's chest under a cream wrap with a teal edge
    up += cel(a => `<path d="M${tx - 84},${-534 + b} Q${tx},${-548 + b} ${tx + 84},${-534 + b} Q${tx + 100},-430 ${tx + 72},${wy} Q${tx},${wy + 14} ${tx - 72},${wy} Q${tx - 100},-430 ${tx - 84},${-534 + b} Z" ${a}/>`, C.skin, C.skinS, -0.14, 0, 100);
    up += cel(a => `<path d="M${tx - 88},${-526 + b} L${tx - 52},${-546 + b} L${tx + 80},${wy - 30} L${tx + 74},${wy + 8} Q${tx + 20},${wy + 16} ${tx - 34},${wy + 8} Q${tx - 84},${wy - 40} ${tx - 94},-440 Z" ${a}/>`, '#f2e8d4', '#d8c9ab', -0.1, 0, 100);
    up += `<path d="M${tx - 52},${-546 + b} L${tx + 80},${wy - 30}" fill="none" stroke="${C.teal}" stroke-width="9" stroke-linecap="round"/>`;
    // fur where the man becomes horse
    up += `<path d="M${tx - 80},${wy - 2} Q${tx - 60},${wy + 30} ${tx - 40},${wy + 2} Q${tx - 20},${wy + 34} ${tx},${wy + 4} Q${tx + 20},${wy + 34} ${tx + 40},${wy + 2} Q${tx + 60},${wy + 30} ${tx + 82},${wy - 2} Q${tx},${wy - 22} ${tx - 80},${wy - 2} Z" fill="${coatS}" ${ink()}/>`;
    up += both.filter(x => x[2].layer === 'front').map(([, sp, a]) => drawA(sp, a)).join('');
    for (const it of items) {
      if (it.t === 'staff') up += line2(`M${it.x - 250},${it.y + 240} L${it.x + 110},${it.y - 120}`, C.wood, 13);
      else up += drawItem(it, C);
    }
    up += both.filter(x => x[2].layer === 'front').map(([, , a]) => drawHand(a, skinP)).join('');
    up += `<rect x="${tx - 21}" y="${-562 + b}" width="42" height="34" fill="${C.skinS}" ${ink()}/>`;
    // head: bald on top, grey tufts over the ears, a teal headband, long grey hair behind, a long beard
    const bd = beard(r, 'full', '#e4e0d8', '#bdb7ac');
    let tufts = '';
    for (const sd of [-1, 1]) for (const [x, y, rr] of [[0.9, -0.36, 0.24], [1.02, -0.08, 0.22], [0.72, -0.62, 0.2]]) tufts += `<circle cx="${n(sd * x * r)}" cy="${n(y * r)}" r="${n(rr * r)}" fill="${sd < 0 ? mane : maneS}" ${ink()}/>`;
    const wisp = `<path d="M${n(-0.1 * r)},${n(-0.98 * r)} q${n(0.08 * r)},${n(-0.22 * r)} ${n(0.26 * r)},${n(-0.16 * r)}" fill="none" stroke="${maneS}" stroke-width="${SW * 1.2}" stroke-linecap="round"/>`;
    const browsG = `<path d="M${n(-0.46 * r)},${n(-0.2 * r)} q${n(0.12 * r)},${n(-0.08 * r)} ${n(0.24 * r)},0 M${n(0.22 * r)},${n(-0.2 * r)} q${n(0.12 * r)},${n(-0.08 * r)} ${n(0.24 * r)},0" fill="none" stroke="${mane}" stroke-width="${n(0.07 * r)}" stroke-linecap="round" opacity="0.9"/>`;
    up += `<g transform="translate(${tx} ${-612 + b})">${head2(r, { expr: 'calm', ...o, noCheeks: true, ears: true, back: longBack(r, mane, maneS, 1.25), beardBack: bd.back, beard: bd.front, front: tufts + wisp + headband(r, C.teal) + browsG })}</g>`;
    return s + up;
  }
  // ---------- kids ----------
  const KID = {
    achilles: { hair: C.gold, hairS: C.goldS, tunic: C.teal, tunicS: C.tealS },
    patroclus: { hair: '#3b2618', hairS: '#24170e', tunic: '#a5462e', tunicS: '#7e3320' },
  };
  // kid(o): who 'achilles'|'patroclus'; age 'six' (default) | 'teen' (Neoptolemus, longer legs); pose 'stand'|'run';
  // arms 'down'|'hips'|'drag'|'sword'|'lyre'|'bundle'|'shoulder'|'bandage'|'pump'; steam: true (angry steam puffs).
  // drag: he walks to the right and pulls with the LEFT hand behind him (to the left, like the hook: the lion lies to his
  // left with its tail towards him). KID_DRAG_HAND = that hand in figure coordinates incl. the forward lean (breathe 0).
  const DRAG_H = [-128, -118], DRAG_LEAN = 6;
  const KID_DRAG_HAND = (() => { const a = DRAG_LEAN * Math.PI / 180, x = DRAG_H[0], y = DRAG_H[1] + 80;
    return [n(x * Math.cos(a) - y * Math.sin(a)), n(x * Math.sin(a) + y * Math.cos(a) - 80)]; })();
  function kid(o = {}) {
    const who = o.who || 'achilles', pose = o.pose || 'stand', arms = o.arms || 'down';
    if (who === 'achilles' && pose === 'stand' && arms === 'down' && !o.age && !o.steam) return K.kidAchilles(o);
    const P = { ...KID[who], ...(o.P || {}) };
    const r = 95, b = o.breathe || 0;
    const tall = (who === 'patroclus' ? 14 : 0) + (o.age === 'teen' ? 70 : 0);
    let s = '';
    // legs
    if (pose === 'run') {
      s += limb(-20, -80, -44, -46, 26, C.skin, C.skinS) + limb(-44, -46, -84, -40, 24, C.skin, C.skinS) + foot(-92, -34, -1, {}, -30);
      s += limb(20, -80, 50, -50, 26, C.skin, C.skinS) + limb(50, -50, 46, -14, 24, C.skin, C.skinS) + foot(50, -2, 1, {}, 0);
    } else {
      for (const sd of [-1, 1]) {
        s += limb(sd * 24, -80 - tall, sd * 26, -16, 26, C.skin, C.skinS);
        s += `<path d="M${sd * 26 - 20},-4 Q${sd * 26},-22 ${sd * 26 + 20},-4 Z" fill="${C.leather}" ${ink()}/><path d="M${sd * 26 - 13},-22 L${sd * 26 + 13},-14" stroke="${C.leatherS}" stroke-width="5" stroke-linecap="round"/>`;
      }
    }
    const lean = pose === 'run' ? 10 : arms === 'drag' ? DRAG_LEAN : 0;
    let up = '';
    const Y = v => v - tall;
    const sh = [[-50, Y(-196) + b], [50, Y(-196) + b]];
    const A = (e, h, layer = 'back', hand = 'fist') => ({ e, h, layer, hand });
    let L = A([-78, Y(-150) + b], [-80, Y(-110) + b]), R = A([78, Y(-150) + b], [80, Y(-110) + b]);
    const items = [];
    if (arms === 'hips') { L = A([-96, Y(-168) + b], [-62, Y(-140) + b]); R = A([96, Y(-168) + b], [62, Y(-140) + b]); }
    if (arms === 'drag') { L = A([-98, Y(-150) + b], [DRAG_H[0], DRAG_H[1] - tall + b]); R = A([86, Y(-160) + b], [104, Y(-196) + b]); }
    if (arms === 'sword') { R = A([100, Y(-200) + b], [96, Y(-260) + b]); items.push(['wsword', 96, Y(-260) + b]); }
    if (arms === 'lyre') { L = A([-80, Y(-170) + b], [-30, Y(-160) + b], 'front'); R = A([80, Y(-160) + b], [34, Y(-140) + b], 'front'); items.push(['lyre', 0, Y(-122) + b]); }
    if (arms === 'bundle') { R = A([96, Y(-186) + b], [70, Y(-226) + b], 'front'); }
    if (arms === 'shoulder') { R = A([110, Y(-200) + b], [160, Y(-214) + b], 'back', 'open'); }
    if (arms === 'bandage') { L = A([-70, Y(-140) + b], [-24, Y(-120) + b], 'front', 'open'); R = A([70, Y(-140) + b], [24, Y(-120) + b], 'front', 'open'); }
    if (arms === 'pump') { L = A([-80, Y(-160) + b], [-104, Y(-124) + b]); R = A([84, Y(-190) + b], [100, Y(-240) + b], 'front'); }
    const drawA = (sp, a) => limb(sp[0], sp[1], a.e[0], a.e[1], 25, C.skin, C.skinS) + limb(a.e[0], a.e[1], a.h[0], a.h[1], 23, C.skin, C.skinS);
    const hnd = a => a.hand === 'open' ? `<ellipse cx="${n(a.h[0])}" cy="${n(a.h[1])}" rx="16" ry="15" fill="${C.skin}" ${ink()}/>` : handC(a.h[0], a.h[1], 15);
    // the bundle on a stick: over the right shoulder, hanging behind the left one (drawn behind the body and head)
    if (arms === 'bundle') up += line2(`M70,${Y(-222) + b} L-118,${Y(-384) + b}`, C.wood, 8)
      + cel(a => `<path d="M-160,${Y(-380) + b} Q-120,${Y(-410) + b} -92,${Y(-372) + b} Q-80,${Y(-310) + b} -128,${Y(-300) + b} Q-178,${Y(-306) + b} -160,${Y(-380) + b} Z" ${a}/>`, '#e3d2b0', '#c4b08a', -0.15, -0.1, 50)
      + `<path d="M-142,${Y(-388) + b} q14,10 30,-2" fill="none" ${ink(3)}/>`;
    for (const [a, sp] of [[L, sh[0]], [R, sh[1]]]) if (a.layer === 'back') up += drawA(sp, a) + hnd(a);
    // tunic (a teenager's ends higher on the longer legs)
    const hem = -66 - (o.age === 'teen' ? 44 : 0);
    const tun = a => `<path d="M-46,${Y(-206) + b} Q0,${Y(-214) + b} 46,${Y(-206) + b} Q58,${Y(-140)} 72,${hem} Q0,${hem + 10} -72,${hem} Q-58,${Y(-140)} -46,${Y(-206) + b} Z" ${a}/>`;
    up += cel(tun, P.tunic, P.tunicS, -0.14, 0, 72);
    up += `<path d="M-70,${hem - 12} Q0,${hem - 2} 70,${hem - 12} L72,${hem} Q0,${hem + 10} -72,${hem} Z" fill="${C.bronze}" ${ink(SW * 0.8)}/>`;
    for (let x = -56; x <= 50; x += 18) up += `<path d="M${x},${hem} l0,-7 l9,0 l0,4" fill="none" stroke="${P.tunicS}" stroke-width="2.6"/>`;
    up += `<path d="M-56,${Y(-142) + b} Q0,${Y(-132) + b} 56,${Y(-142) + b}" fill="none" stroke="${C.leather}" stroke-width="11" stroke-linecap="round"/>
      <path d="M-18,${Y(-208) + b} Q0,${Y(-190) + b} 18,${Y(-208) + b}" fill="none" stroke="${P.tunicS}" stroke-width="5" stroke-linecap="round"/>`;
    for (const [a, sp] of [[L, sh[0]], [R, sh[1]]]) if (a.layer === 'front') up += drawA(sp, a);
    for (const [t, x, y] of items) {
      if (t === 'wsword') up += `<g transform="translate(${x} ${y}) rotate(18)"><rect x="-9" y="-130" width="18" height="120" rx="6" fill="#c9a06a" ${ink()}/><rect x="-26" y="-14" width="52" height="12" rx="5" fill="${C.woodS}" ${ink(SW * 0.8)}/><rect x="-6" y="-4" width="12" height="28" rx="4" fill="${C.woodS}" ${ink(SW * 0.8)}/></g>`;
      if (t === 'lyre') up += lyre(x, y, 0.62);
      if (t === 'bundle') up += line2(`M${x - 10},${y + 14} L${x - 130},${y + 70}`, C.wood, 8) + cel(a => `<circle cx="${x - 150}" cy="${y + 96}" r="44" ${a}/>`, '#e3d2b0', '#c4b08a', -0.15, -0.15, 44) + `<path d="M${x - 172},${y + 60} q22,14 44,0" fill="none" stroke="${INK}" stroke-width="4"/>`;
    }
    for (const a of [L, R]) if (a.layer === 'front') up += hnd(a);
    // head
    const front = who === 'patroclus' ? curls(r, P.hair, P.hairS) : tousled(r, { tufts: 5, col: P.hair, shade: P.hairS });
    const back = who === 'patroclus' ? curlsBack(r, P.hair, P.hairS) : '';
    up += `<g transform="translate(0 ${Y(-284) + b})">${head2(r, { expr: who === 'patroclus' ? 'calm' : 'proud', ...o, back, front })}</g>`;
    // steam puffs rising from the sides of the head (angry)
    if (o.steam) { const t = o.steamT || 0; for (const sd of [-1, 1]) for (const [x, y, rr] of [[104, -70, 21], [128, -108, 16], [146, -140, 11]]) up += `<circle cx="${sd * (x + t * 6)}" cy="${n(Y(-284) + b + y - t * 10)}" r="${rr}" fill="#fff" opacity="0.94" ${ink(3)}/>`; }
    s += `<g transform="rotate(${lean} 0 -80)">${up}</g>`;
    return s;
  }
  const neoptolemus = o => kid({ who: 'achilles', age: 'teen', expr: 'proud', ...o });

  // ---------- women (gown-based, from cast.js) ----------
  const GOWN_HEAD_Y = -388, GR = 88;
  function gownArms(o, b, front) {
    // arms that cast.js gown() does not have; drawn behind (grab) or in front (roll)
    const A = (sx, e, h) => limb(sx, -296 + b, e[0], e[1] + b, 24, C.skin, C.skinS) + limb(e[0], e[1] + b, h[0], h[1] + b, 22, C.skin, C.skinS) + handC(h[0], h[1] + b, 14);
    if (o.arms === 'grab' && !front) return A(-52, [-112, -380], [-128, -462]) + A(52, [112, -380], [128, -462]);
    if (o.arms === 'roll' && front) return A(-52, [-70, -244], [-72, -192]) + A(52, [104, -236], [150, -170]);
    if (o.arms === 'veil' && front) return '';
    return '';
  }
  function goddess(o, P, extraFront, extraBack = '') {
    const b = o.breathe || 0;
    const custom = ['grab', 'roll'].includes(o.arms);
    let s = extraBack + gownArms(o, b, false);
    s += K.gown({ lashes: true, ...o, arms: custom ? 'none' : (o.arms || 'down'), P });
    s += gownArms(o, b, true);
    s += `<g transform="translate(0 ${GOWN_HEAD_Y + b})">${extraFront}</g>`;
    return s;
  }
  function hera(o = {}) {
    const r = GR;
    // a tall tiara: five points, the middle one highest, peacock-blue gems
    const crown = cel(a => `<path d="M${n(-0.66 * r)},${n(-1.0 * r)} L${n(-0.62 * r)},${n(-1.42 * r)} L${n(-0.4 * r)},${n(-1.2 * r)} L${n(-0.22 * r)},${n(-1.58 * r)} L0,${n(-1.82 * r)} L${n(0.22 * r)},${n(-1.58 * r)} L${n(0.4 * r)},${n(-1.2 * r)} L${n(0.62 * r)},${n(-1.42 * r)} L${n(0.66 * r)},${n(-1.0 * r)} Q0,${n(-1.14 * r)} ${n(-0.66 * r)},${n(-1.0 * r)} Z" ${a}/>`, '#efc24a', '#c99230', -0.1, 0, r)
      + `<path d="M${n(-0.64 * r)},${n(-1.08 * r)} Q0,${n(-1.22 * r)} ${n(0.64 * r)},${n(-1.08 * r)}" fill="none" stroke="#c99230" stroke-width="6"/>`
      + [[-0.36, -1.16, 0.06], [0, -1.3, 0.1], [0.36, -1.16, 0.06]].map(([x, y, rr]) => `<circle cx="${n(x * r)}" cy="${n(y * r)}" r="${n(rr * r)}" fill="#2f9fa8" ${ink(2.5)}/>`).join('');
    return goddess({ expr: 'proud', hair: 'bun', ...o }, { hair: '#3a2418', hairS: '#24160e', dress: '#3f7fa8', dressS: '#2e6185', dressL: '#7fb5d6', ribbon: '#efc24a', ...(o.P || {}) }, crown);
  }
  function athena(o = {}) {
    const r = GR;
    const helm = `<g transform="translate(${n(0.06 * r)} ${n(-0.62 * r)}) rotate(-14) scale(0.92)">${helmet(r, { metal: '#b9c0c4', metalS: '#8e979c', crest: '#2f7f88' })}</g>`;
    const sp = (!o.arms || o.arms === 'down') ? spear(96, -200, 0, { metal: '#b9c0c4', metalS: '#8e979c' }, 1.05) : '';
    return goddess({ expr: 'stern', hair: 'long', ...o }, { hair: '#5a3a24', hairS: '#3f2818', dress: '#9aa3a8', dressS: '#7a8388', dressL: '#c4cbcf', ribbon: '#2f7f88', ...(o.P || {}) }, helm, sp);
  }
  function aphrodite(o = {}) {
    const r = GR;
    const flower = `<g transform="translate(${n(-0.7 * r)} ${n(-0.72 * r)})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-13" rx="10" ry="15" transform="rotate(${a})" fill="#f7c6d4" ${ink(2.5)}/>`).join('')}<circle r="8" fill="#efc24a" ${ink(2.5)}/></g>`;
    let curlsS = '';
    for (const [x, y] of [[-1.05, 1.2], [-0.82, 1.42], [1.05, 1.2], [0.82, 1.42], [-1.18, 0.9], [1.18, 0.9]]) curlsS += `<circle cx="${n(x * r)}" cy="${n(y * r)}" r="${n(0.17 * r)}" fill="#f6d36a" ${ink()}/>`;
    return goddess({ expr: 'happy', hair: 'long', ...o }, { hair: '#f6d36a', hairS: '#d9a83a', dress: '#f2a7bd', dressS: '#d4859e', dressL: '#f9cfdc', ribbon: '#e05f86', ...(o.P || {}) }, flower, `<g transform="translate(0 ${GOWN_HEAD_Y + (o.breathe || 0)})">${curlsS}</g>`);
  }
  function strife(o = {}) {
    const r = GR, b = o.breathe || 0;
    let spikes = '';
    for (let i = 0; i < 11; i++) {
      const t = Math.PI * (0.95 + 1.1 * i / 10), a0 = t - 0.16, a1 = t + 0.16, R1 = 0.95 * r, R2 = (1.42 + (i % 2) * 0.22) * r;
      spikes += `<path d="M${n(Math.cos(a0) * R1)},${n(Math.sin(a0) * R1)} L${n(Math.cos(t) * R2)},${n(Math.sin(t) * R2)} L${n(Math.cos(a1) * R1)},${n(Math.sin(a1) * R1)} Z" fill="${i % 2 ? '#2a1d30' : '#1d1520'}" ${ink()}/>`;
    }
    let wings = '';
    // small dark feathered wings
    for (const sd of [-1, 1]) {
      wings += cel(a => `<path d="M${sd * 30},-284 C${sd * 80},-344 ${sd * 140},-346 ${sd * 156},-310 C${sd * 136},-308 ${sd * 142},-284 ${sd * 122},-276 C${sd * 110},-284 ${sd * 108},-262 ${sd * 88},-258 C${sd * 74},-270 ${sd * 56},-266 ${sd * 30},-252 Z" ${a}/>`, '#3d2a4a', '#2a1d33', 0, -0.1, 80);
      wings += `<path d="M${sd * 60},-300 Q${sd * 96},-318 ${sd * 128},-312" fill="none" stroke="#5b4270" stroke-width="4" stroke-linecap="round"/>`;
    }
    const back = `${wings}<g transform="translate(0 ${GOWN_HEAD_Y + b})">${spikes}</g>`;
    return goddess({ expr: 'smirk', hair: 'long', ...o }, { hair: '#1d1520', hairS: '#120c14', dress: '#5b3a78', dressS: '#43285b', dressL: '#7a55a0', ribbon: '#9be36a', ...(o.P || {}) }, '', back);
  }
  function briseis(o = {}) {
    const r = GR;
    const expr = ['calm', 'sad', 'worried', 'neutral'].includes(o.expr) ? o.expr : 'calm';
    const veil = o.veil ? `<path d="M${n(-1.08 * r)},${n(-0.1 * r)} C${n(-1.2 * r)},${n(-1.0 * r)} ${n(-0.6 * r)},${n(-1.42 * r)} 0,${n(-1.42 * r)} C${n(0.6 * r)},${n(-1.42 * r)} ${n(1.2 * r)},${n(-1.0 * r)} ${n(1.08 * r)},${n(-0.1 * r)}
        C${n(1.2 * r)},${n(0.6 * r)} ${n(1.3 * r)},${n(1.1 * r)} ${n(1.32 * r)},${n(1.6 * r)} L${n(1.02 * r)},${n(1.5 * r)} C${n(0.98 * r)},${n(0.8 * r)} ${n(0.96 * r)},${n(0.2 * r)} ${n(0.9 * r)},${n(-0.2 * r)}
        C${n(0.7 * r)},${n(-0.95 * r)} ${n(-0.7 * r)},${n(-0.95 * r)} ${n(-0.9 * r)},${n(-0.2 * r)} C${n(-0.96 * r)},${n(0.2 * r)} ${n(-0.98 * r)},${n(0.8 * r)} ${n(-1.02 * r)},${n(1.5 * r)} L${n(-1.32 * r)},${n(1.6 * r)} C${n(-1.3 * r)},${n(1.1 * r)} ${n(-1.2 * r)},${n(0.6 * r)} ${n(-1.08 * r)},${n(-0.1 * r)} Z"
        fill="#f4efe2" opacity="0.93" ${ink()}/>` : '';
    return goddess({ hair: 'long', arms: 'down', ...o, expr, lashes: true }, { hair: '#2b1d17', hairS: '#1a110c', dress: '#33507a', dressS: '#253c5e', dressL: '#5a78a3', ribbon: '#efe4cc', ...(o.P || {}) }, veil);
  }

  // ---------- Zeus (a bust above the clouds) ----------
  // origin = the bottom middle of the bust; the scene puts clouds over the bottom edge.
  function zeus(o = {}) {
    const r = 110, b = o.breathe || 0;
    let s = '';
    // the raised arm with the bolt (behind the shoulder)
    s += limb(176, -236 + b, 262, -330 + b, 58, C.skin, C.skinS) + limb(262, -330 + b, 270, -446 + b, 52, C.skin, C.skinS);
    s += `<path d="M300,-640 L236,-520 L278,-514 L222,-392 L326,-540 L282,-546 L338,-640 Z" fill="#ffe066" ${ink(SW * 1.2)}/>
      <path d="M306,-628 L258,-532" stroke="#fff6c8" stroke-width="6" stroke-linecap="round"/>` + handC(272, -462 + b, 32);
    s += cel(a => `<path d="M-250,0 Q-262,-210 -140,-262 Q0,${-292 + b} 140,-262 Q262,-210 250,0 Z" ${a}/>`, '#f4efe2', '#d9d0bd', -0.1, 0, 240);
    s += `<path d="M-160,-256 Q-20,-130 140,0" fill="none" stroke="#3f7fa8" stroke-width="30"/><path d="M-160,-256 Q-20,-130 140,0" fill="none" ${ink(2)} opacity="0.5"/>
      <path d="M-200,-120 Q-190,-60 -196,0 M190,-140 Q200,-70 194,0" fill="none" stroke="#d9d0bd" stroke-width="6" stroke-linecap="round"/>`;
    s += `<rect x="-34" y="${-300 + b}" width="68" height="50" fill="${C.skinS}" ${ink()}/>`;
    const bd = beard(r, 'cloud', '#f6f4ef', '#d8d4cc');
    let hair = '';
    for (const [x, y, rr] of [[-0.9, -0.5, 0.32], [-0.62, -0.92, 0.34], [-0.2, -1.1, 0.36], [0.24, -1.1, 0.36], [0.64, -0.9, 0.34], [0.92, -0.48, 0.32]]) hair += `<circle cx="${n(x * r)}" cy="${n(y * r)}" r="${n(rr * r)}" fill="#f6f4ef" ${ink()}/>`;
    let crown = '';
    // a crown of little lightning bolts
    for (const [x, h] of [[-0.62, 0.8], [-0.31, 0.95], [0, 1.1], [0.31, 0.95], [0.62, 0.8]]) {
      const X = x * r, y0 = -1.16 * r, H = h * 0.62 * r;
      crown += `<path d="M${n(X - 14)},${n(y0)} L${n(X + 4)},${n(y0 - H * 0.55)} L${n(X - 6)},${n(y0 - H * 0.5)} L${n(X + 12)},${n(y0 - H)} L${n(X + 4)},${n(y0 - H * 0.42)} L${n(X + 14)},${n(y0 - H * 0.46)} L${n(X + 4)},${n(y0)} Z" fill="#ffd34a" ${ink(3)}/>`;
    }
    s += `<g transform="translate(0 ${-372 + b})">${head2(r, { expr: 'stern', browW: 0.075, ...o, noCheeks: true, beardBack: bd.back, beard: bd.front, front: hair + crown })}</g>`;
    return s;
  }

  // the underworld look: grey-lilac and a little see-through. Put in <defs>, then <g filter="url(#shade)">…</g>
  const SHADE_DEFS = `<filter id="shade" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
    <feColorMatrix type="matrix" values="0.26 0.44 0.12 0 0.09  0.22 0.42 0.12 0 0.07  0.28 0.44 0.2 0 0.14  0 0 0 0.8 0"/></filter>`;

  window.CAST2 = { face2, head2, curls, curlsBack, beard, circlet, headband, laurel, pointCap, spear, sword, lyre, goldenApple, bowArc, quiver, shield2,
    man, achilles, patroclus, hector, soldier, memnon, neoptolemus, peleus, chiron, kid, KID_DRAG_HAND, agamemnon, briseis, priam, paris, apollo, strife,
    hera, athena, aphrodite, zeus, hephaestus, penthesilea, SHADE_DEFS };
})();
