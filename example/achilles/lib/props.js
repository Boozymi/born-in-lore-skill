// props.js – animals, vehicles, furniture and objects for "What If You Were Born as Achilles?", drawn in code (SVG strings).
// Load after lib/cast.js (uses its primitives). Our own designs, same rules as cast.js (STYLE_BIBLE §3): flat vector,
// one cel-shade tone per colour, thin dark-brown outline, cute chibi proportions.
// Every function returns an SVG string drawn around its own origin – usually the ground contact point (stated per function).
// Animals face RIGHT (+x); flip with <g transform="scale(-1 1)">. Animated ones take a phase 0..1 or a frame f.
(function () {
  const K = window.CAST;
  const { C, INK, SW, cel, limb } = K;
  const TAU = Math.PI * 2, D2R = Math.PI / 180;
  let uid = 0;
  const nid = p => `pr${p}${++uid}`;
  const n = v => Math.round(v * 10) / 10;
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = t => 1 - Math.pow(1 - clamp(t), 3);
  const rnd = i => { const a = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return a - Math.floor(a); };
  const ink = (w = SW) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const FONT = `font-family="Segoe UI Black, Arial Black, sans-serif" font-weight="900"`;
  const HAND = `font-family="Segoe Print, Ink Free, Comic Sans MS, cursive" font-weight="700"`;
  const SERIF = `font-family="Constantia, Palatino Linotype, Georgia, serif"`;
  const word = (x, y, size, str, o = {}) => `<text x="${n(x)}" y="${n(y)}" ${o.font || FONT} font-size="${size}" text-anchor="${o.anchor || 'middle'}" fill="${o.fill || '#fff'}"
    stroke="${o.stroke || INK}" stroke-width="${o.sw ?? size * 0.16}" stroke-linejoin="round" paint-order="stroke" ${o.extra || ''}>${str}</text>`;
  const hand = (x, y, r = 15) => `<circle cx="${n(x)}" cy="${n(y)}" r="${r}" fill="${C.skin}" ${ink()}/>`;
  const eye = (x, y, r = 10) => `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(r * 0.85)}" ry="${n(r * 1.1)}" fill="${INK}"/><circle cx="${n(x - r * 0.3)}" cy="${n(y - r * 0.42)}" r="${n(r * 0.36)}" fill="#fff"/>`;
  // a ring of round puffs with one shared ink outline (clouds, dust, fight cloud)
  function puffs(list, fill, w = SW * 1.2) {
    return list.map(([x, y, r]) => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r + w)}" fill="${INK}"/>`).join('') +
      list.map(([x, y, r]) => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="${fill}"/>`).join('');
  }

  // =====================================================================================================
  // ANIMALS
  // =====================================================================================================

  // shared four-legged walk/gallop rig. phase 0..1 = one stride. Hips/shoulders at hipY, legs fold at the knee while
  // they swing forward. Far legs are drawn darker, behind the body.
  function legsRig(o, spec, near) {
    const gait = o.gait || spec.gait || 'walk', ph = o.phase || 0;
    const amp = { stand: 0, walk: 17, trot: 24, gallop: 38 }[gait] ?? 17;
    const fold = { stand: 0, walk: 34, trot: 50, gallop: 70 }[gait] ?? 34;
    const offs = gait === 'gallop' ? { bf: 0.0, bn: 0.1, ff: 0.5, fn: 0.6 } : gait === 'trot' ? { bf: 0.5, bn: 0.0, ff: 0.0, fn: 0.5 } : { bf: 0.5, bn: 0.0, ff: 0.75, fn: 0.25 };
    const bob = spec.bob ?? 0;
    let s = '';
    const legs = near ? [['bn', spec.back, false], ['fn', spec.front, true]] : [['bf', spec.back + 14, false], ['ff', spec.front + 14, true]];
    for (const [k, hx, front] of legs) {
      const a = (ph + offs[k]) * TAU;
      let th = amp * Math.sin(a) * D2R;
      const lift = Math.max(0, Math.cos(a));
      let kb = -fold * lift * D2R * (front ? 1 : 0.8);
      if (gait === 'gallop') {
        // cartoon gallop: s = 1 flying (front legs reach forward, back legs push back), s = -1 gathered (front legs tucked)
        const sN = Math.sin((ph + (near ? 0 : 0.08)) * TAU);
        th = (front ? 10 + 32 * sN : -10 - 32 * sN) * D2R;
        kb = -(front ? 82 : 30) * Math.max(0, -sN) * D2R;
      }
      const hy = spec.hipY + bob;
      const kx = hx + Math.sin(th) * spec.upper, ky = hy + Math.cos(th) * spec.upper;
      const fx = kx + Math.sin(th + kb) * spec.lower, fy = ky + Math.cos(th + kb) * spec.lower;
      const col = near ? spec.coat : spec.coatS, colS = near ? spec.coatS : spec.coatD;
      s += limb(hx, hy, kx, ky, spec.wU, col, colS) + limb(kx, ky, fx, fy, spec.wL, col, colS);
      const deg = -(th + kb) / D2R;
      s += `<g transform="translate(${n(fx)} ${n(fy)}) rotate(${n(deg)})">${spec.foot(near)}</g>`;
    }
    return s;
  }

  // horse – side view, facing right. Origin: ground under the belly. o: gait 'stand'|'walk'|'trot'|'gallop', phase 0..1,
  // coat/coatS/coatD/muzzle/mane/maneS colours, harness (yoke pad + bridle), blanket (teal saddle cloth), expr 'calm'|'wild'.
  // riderPoint: PROPS.HORSE_RIDER = {x: 0, y: -392} (top of the back, before bob).
  function horse(o = {}) {
    const coat = o.coat || '#b8784a', coatS = o.coatS || '#935a36', coatD = o.coatD || '#6f4126', muz = o.muzzle || '#dcae84';
    const mane = o.mane || '#4a2c1e', maneS = o.maneS || '#2e1a11';
    const gait = o.gait || 'walk', ph = o.phase || 0;
    const bob = gait === 'gallop' ? -Math.max(0, Math.sin(ph * TAU)) * 20 : gait === 'trot' ? -Math.abs(Math.sin(ph * TAU * 2)) * 9 : gait === 'walk' ? -Math.abs(Math.sin(ph * TAU * 2)) * 4 : 0;
    const tilt = gait === 'gallop' ? Math.sin(ph * TAU) * 4 : 0;
    const sway = Math.sin(ph * TAU + 1) * (gait === 'gallop' ? 26 : 10);
    const spec = { gait, bob, hipY: -246, upper: 118, lower: 122, wU: 38, wL: 26, back: -112, front: 92, coat, coatS, coatD,
      foot: near => `<path d="M-19,-6 L19,-6 L23,14 Q0,20 -23,14 Z" fill="${near ? '#3a2a22' : '#2a1d17'}" ${ink(SW * 0.9)}/>` };
    let s = legsRig(o, spec, false);
    // tail
    s += `<path d="M-150,${-330 + bob} C-218,${-328 + bob} ${-246 + sway * 0.3},${-262 + bob} ${-232 + sway},${-150 + bob} C${-222 + sway},${-178 + bob} -205,${-222 + bob} -196,${-246 + bob}
      C-192,${-196 + bob} ${-182 + sway * 0.6},${-160 + bob} ${-170 + sway * 0.8},${-140 + bob} C-150,${-206 + bob} -152,${-282 + bob} -138,${-304 + bob} Z" fill="${mane}" ${ink()}/>
      <path d="M-168,${-312 + bob} C-206,${-292 + bob} ${-214 + sway * 0.5},${-232 + bob} ${-210 + sway * 0.8},${-182 + bob}" fill="none" stroke="${maneS}" stroke-width="6" stroke-linecap="round"/>`;
    // body + neck (tilt for the gallop)
    let b = '';
    b += cel(a => `<path d="M90,-342 Q118,-452 196,-500 L268,-436 Q204,-392 166,-282 Z" ${a}/>`, coat, coatS, -0.1, 0, 120);
    b += cel(a => `<ellipse cx="0" cy="-300" rx="164" ry="90" ${a}/>`, coat, coatS, -0.06, -0.14, 164);
    b += `<path d="M-120,-262 Q-20,-238 90,-258" fill="none" stroke="${coatS}" stroke-width="6" stroke-linecap="round" opacity="0.7"/>`;
    if (o.blanket || o.harness) b += `<path d="M-70,-388 Q0,-398 70,-386 L80,-300 Q0,-290 -80,-302 Z" fill="${o.blanketCol || C.teal}" ${ink()}/>
      <path d="M-80,-302 Q0,-290 80,-300" fill="none" stroke="${C.gold}" stroke-width="9" stroke-linecap="round"/>
      ${[-60, -30, 0, 30, 60].map(x => `<circle cx="${x}" cy="${-296 + Math.abs(x) * 0.04}" r="6" fill="${C.goldL}" ${ink(2)}/>`).join('')}`;
    if (o.harness) b += `<path d="M150,-300 Q190,-350 212,-420" fill="none" stroke="${C.leather}" stroke-width="16" stroke-linecap="round"/><path d="M150,-300 Q190,-350 212,-420" fill="none" ${ink(2)} opacity="0.5"/>
      <circle cx="176" cy="-344" r="9" fill="${C.goldL}" ${ink(2.5)}/>`;
    // mane on the neck
    b += `<path d="M196,-516 Q150,-524 140,-484 Q108,-484 110,-444 Q78,-432 84,-396 Q54,-386 60,-350 L96,-342 Q120,-446 196,-498 Z" fill="${mane}" ${ink()}/>
      <path d="M170,-500 Q136,-488 128,-456 M118,-440 Q96,-420 100,-392" fill="none" stroke="${maneS}" stroke-width="5" stroke-linecap="round"/>`;
    // head (rotated, nose down-forward)
    const wild = o.expr === 'wild';
    let h = '';
    h += `<path d="M-46,-46 L-30,-104 L-8,-50 Z" fill="${coat}" ${ink()}/><path d="M-36,-56 L-28,-88 L-16,-58 Z" fill="${muz}"/>`;
    h += cel(a => `<ellipse cx="0" cy="0" rx="72" ry="54" ${a}/>`, coat, coatS, -0.08, -0.1, 72);
    h += cel(a => `<ellipse cx="64" cy="8" rx="46" ry="42" ${a}/>`, muz, '#c08f66', -0.1, -0.1, 46);
    h += `<path d="M90,-6 q8,4 6,14" fill="none" ${ink(SW * 0.9)}/><path d="M74,34 Q90,40 102,30" fill="none" ${ink(SW * 0.8)}/>`;
    h += eye(-8, -14, wild ? 9 : 11);
    if (wild) h += `<circle cx="-8" cy="-14" r="16" fill="none" stroke="#fff" stroke-width="5" opacity="0.9"/>`;
    h += `<path d="M-26,-38 Q-8,-${wild ? 50 : 44} 10,-36" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
    h += `<path d="M-60,-40 Q-30,-74 -2,-52 Q-24,-40 -40,-22 Z" fill="${mane}" ${ink()}/>`;
    if (o.harness || o.bridle) h += `<path d="M30,-44 Q52,0 34,46 M36,-40 Q90,-40 104,-6" fill="none" stroke="${C.leather}" stroke-width="7" stroke-linecap="round"/>
      <circle cx="36" cy="2" r="7" fill="${C.goldL}" ${ink(2)}/>`;
    b += `<g transform="translate(244 -474) rotate(30)">${h}</g>`;
    s += `<g transform="translate(0 ${n(bob)}) rotate(${n(tilt)} 0 -300)">${b}</g>`;
    s += legsRig(o, spec, true);
    return s;
  }

  // deer – a young stag running right. Origin: ground under the belly. o: phase, gait (default 'gallop'), antlers, spots
  function deer(o = {}) {
    const coat = o.coat || '#c98a55', coatS = o.coatS || '#a8683a', coatD = '#7e4c28', belly = '#f2e2c8';
    const gait = o.gait || 'gallop', ph = o.phase || 0;
    const bob = gait === 'gallop' ? -Math.max(0, Math.sin(ph * TAU)) * 24 : 0;
    const tilt = gait === 'gallop' ? Math.sin(ph * TAU) * 6 : 0;
    const spec = { gait, bob, hipY: -200, upper: 96, lower: 104, wU: 24, wL: 15, back: -84, front: 74, coat, coatS, coatD,
      foot: near => `<path d="M-10,-4 L10,-4 L12,10 L0,6 L-12,10 Z" fill="${near ? '#3a2a22' : '#2a1d17'}" ${ink(SW * 0.8)}/>` };
    let s = legsRig({ ...o, gait }, spec, false);
    let b = '';
    b += `<path d="M-118,-262 q-30,-30 -10,-52 q16,16 22,40 Z" fill="${belly}" ${ink()}/>`; // white tail up
    b += cel(a => `<path d="M64,-262 Q80,-330 120,-372 L170,-338 Q124,-300 116,-226 Z" ${a}/>`, coat, coatS, -0.1, 0, 80);
    b += cel(a => `<ellipse cx="0" cy="-238" rx="122" ry="56" ${a}/>`, coat, coatS, -0.05, -0.15, 122);
    b += `<path d="M-80,-202 Q0,-186 80,-202 Q60,-192 0,-190 Q-60,-190 -80,-202 Z" fill="${belly}"/>`;
    if (o.spots !== false) for (const [x, y] of [[-60, -262], [-30, -270], [0, -262], [-46, -244], [-14, -246], [24, -252]]) b += `<ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="${belly}" opacity="0.9"/>`;
    let h = '';
    if (o.antlers !== false) h += `<path d="M-14,-38 Q-24,-80 -6,-104 M-18,-70 Q-38,-78 -44,-96 M6,-40 Q8,-84 30,-100 M10,-72 Q24,-74 36,-84" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/>
      <path d="M-14,-38 Q-24,-80 -6,-104 M-18,-70 Q-38,-78 -44,-96 M6,-40 Q8,-84 30,-100 M10,-72 Q24,-74 36,-84" fill="none" stroke="#e8d6b4" stroke-width="5" stroke-linecap="round"/>`;
    h += `<ellipse cx="-34" cy="-30" rx="30" ry="14" transform="rotate(-34 -34 -30)" fill="${coat}" ${ink()}/><ellipse cx="-34" cy="-30" rx="18" ry="7" transform="rotate(-34 -34 -30)" fill="#e8b9a0"/>`;
    h += cel(a => `<path d="M-34,-10 Q-30,-44 6,-40 Q48,-34 66,2 Q56,24 20,22 Q-30,24 -34,-10 Z" ${a}/>`, coat, coatS, -0.08, -0.1, 50);
    h += `<ellipse cx="64" cy="4" rx="9" ry="7" fill="${INK}"/>` + eye(4, -12, 9) + `<path d="M36,14 Q48,20 58,16" fill="none" ${ink(SW * 0.7)}/>`;
    b += `<g transform="translate(146 -362) rotate(18)">${h}</g>`;
    s += `<g transform="translate(0 ${n(bob)}) rotate(${n(tilt)} 0 -240)">${b}</g>`;
    s += legsRig({ ...o, gait }, spec, true);
    return s;
  }

  // lion on its back is in cast.js (lionKO). boarKO: a wild boar that lost the fight – on its back, legs up, X eyes, tongue out.
  // Origin: middle of the body on the ground. The curly tail points to +x (tailX/tailY move its tip, for dragging).
  function boarKO(o = {}) {
    const fur = '#7a5a48', furS = '#5c4234', bristle = '#3e2c22', snout = '#d89a8a';
    let s = '';
    const tx = o.tailX ?? 210, ty = o.tailY ?? -70;
    s += `<path d="M120,-40 Q160,-30 ${tx - 30},${ty + 20} q20,-26 30,-6 q-6,18 ${-12},10" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/>
      <path d="M120,-40 Q160,-30 ${tx - 30},${ty + 20} q20,-26 30,-6 q-6,18 ${-12},10" fill="none" stroke="${furS}" stroke-width="6" stroke-linecap="round"/>`;
    for (const [x, dx] of [[-70, -36], [-30, -18], [40, 20], [80, 38]]) {
      const tx = x + dx, ty = -138;
      s += limb(x, -84, tx, ty, 21, fur, furS);
      s += `<g transform="translate(${tx} ${ty}) rotate(${n(Math.atan2(dx, 70) / D2R)})"><path d="M-12,4 Q-14,-18 -2,-20 L-1,2 Z M12,4 Q14,-18 2,-20 L1,2 Z" fill="#2e2420" ${ink(SW * 0.7)}/></g>`;
    }
    s += `<path d="M-118,-30 Q0,10 118,-32 Q100,-2 0,8 Q-100,-2 -118,-30 Z" fill="${bristle}" ${ink(SW * 0.8)}/>`;
    s += cel(a => `<ellipse cx="0" cy="-50" rx="128" ry="56" ${a}/>`, fur, furS, -0.05, -0.2, 130);
    s += `<ellipse cx="6" cy="-68" rx="76" ry="24" fill="#a6826a" opacity="0.7"/>`;
    for (let i = 0; i < 4; i++) s += `<path d="M${-40 + i * 26},-70 q6,-8 12,0" fill="none" stroke="#8a6a56" stroke-width="3" stroke-linecap="round"/>`;
    // head at the left, upside down-ish
    s += cel(a => `<path d="M-120,-96 Q-190,-110 -214,-60 Q-220,-20 -186,-4 Q-140,4 -112,-30 Z" ${a}/>`, fur, furS, -0.08, -0.1, 60);
    s += `<path d="M-150,-104 L-138,-138 L-124,-100 Z M-118,-96 L-98,-122 L-96,-84 Z" fill="${fur}" ${ink()}/>`;
    s += `<ellipse cx="-222" cy="-44" rx="22" ry="26" fill="${snout}" ${ink()}/><ellipse cx="-228" cy="-52" rx="4" ry="6" fill="${INK}"/><ellipse cx="-226" cy="-34" rx="4" ry="6" fill="${INK}"/>`;
    s += `<path d="M-196,-16 Q-214,6 -230,2 Q-210,-6 -204,-24 Z M-196,-72 Q-214,-96 -230,-92 Q-212,-84 -204,-66 Z" fill="#f4ecd8" ${ink(SW * 0.8)}/>`;
    for (const [x, y] of [[-170, -70], [-160, -36]]) s += `<path d="M${x - 9},${y - 9} l18,18 M${x + 9},${y - 9} l-18,18" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
    s += `<path d="M-186,-6 q-2,22 12,22 q8,-6 2,-22 Z" fill="#e57f73" ${ink(3)}/>`;
    return s;
  }

  // dog – sitting, facing the viewer, watching. Origin: ground between the paws. o: expr 'watch'|'sad'|'happy', tongue, wag (px), look -1..1
  function dog(o = {}) {
    const coat = o.coat || '#d9a868', coatS = o.coatS || '#b5834a', light = '#f6e3bd', ear = o.ear || '#8a5a36';
    const lx = (o.look || 0) * 8, wag = o.wag || 0;
    let s = '';
    s += `<path d="M60,-40 Q${110 + wag},${-50} ${112 + wag * 1.4},${-110}" fill="none" stroke="${INK}" stroke-width="30" stroke-linecap="round"/>
      <path d="M60,-40 Q${110 + wag},${-50} ${112 + wag * 1.4},${-110}" fill="none" stroke="${coatS}" stroke-width="20" stroke-linecap="round"/>`;
    s += cel(a => `<ellipse cx="0" cy="-58" rx="84" ry="58" ${a}/>`, coat, coatS, -0.1, -0.1, 84);
    s += cel(a => `<ellipse cx="0" cy="-138" rx="60" ry="80" ${a}/>`, coat, coatS, -0.12, -0.05, 60);
    s += `<path d="M-30,-190 Q0,-150 30,-190 Q36,-110 0,-84 Q-36,-110 -30,-190 Z" fill="${light}"/>`;
    for (const sd of [-1, 1]) s += limb(sd * 28, -130, sd * 30, -18, 28, coat, coatS) + `<ellipse cx="${sd * 32}" cy="-10" rx="22" ry="13" fill="${light}" ${ink()}/>`;
    const hy = -246;
    s += `<g transform="translate(0 ${hy})">`;
    s += cel(a => `<circle r="68" ${a}/>`, coat, coatS, -0.1, -0.1, 68);
    for (const sd of [-1, 1]) s += `<path d="M${sd * 44},-50 Q${sd * 96},-46 ${sd * 86},${o.expr === 'sad' ? 56 : 34} Q${sd * 70},${o.expr === 'sad' ? 64 : 44} ${sd * 56},${o.expr === 'sad' ? 40 : 20} Q${sd * 50},-14 ${sd * 30},-40 Z" fill="${ear}" ${ink()}/>`;
    s += `<ellipse cx="0" cy="26" rx="40" ry="30" fill="${light}" ${ink(SW * 0.8)}/>`;
    s += `<path d="M-12,8 Q0,2 12,8 Q8,22 0,24 Q-8,22 -12,8 Z" fill="${INK}"/><circle cx="-4" cy="9" r="3" fill="#fff" opacity="0.8"/>`;
    s += `<path d="M0,24 L0,34 M-14,36 Q-7,44 0,34 Q7,44 14,36" fill="none" ${ink(SW * 0.8)}/>`;
    if (o.tongue) s += `<path d="M-8,40 Q-10,62 0,64 Q10,62 8,40 Z" fill="#e57f73" ${ink(SW * 0.7)}/>`;
    s += eye(-26 + lx, -10, 10) + eye(26 + lx, -10, 10);
    const sad = o.expr === 'sad';
    s += `<path d="M-38,${sad ? -36 : -32} Q-26,${sad ? -40 : -38} -14,${sad ? -30 : -34} M38,${sad ? -36 : -32} Q26,${sad ? -40 : -38} 14,${sad ? -30 : -34}" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
    s += `<ellipse cx="-44" cy="12" rx="10" ry="6" fill="${C.cheek}"/><ellipse cx="44" cy="12" rx="10" ry="6" fill="${C.cheek}"/></g>`;
    return s;
  }

  // rabbit – sitting, facing the viewer. Origin: ground. o: bandage (white wrap + herb leaf on its right paw), ear (droop 0..1)
  function rabbit(o = {}) {
    const fur = '#c4b4a0', furS = '#9f8d78', light = '#f1e9dd', pink = '#e9a6a6';
    let s = '';
    s += cel(a => `<ellipse cx="0" cy="-70" rx="58" ry="70" ${a}/>`, fur, furS, -0.1, -0.1, 60);
    s += `<ellipse cx="0" cy="-58" rx="34" ry="46" fill="${light}"/>`;
    for (const sd of [-1, 1]) s += `<ellipse cx="${sd * 40}" cy="-10" rx="30" ry="14" fill="${fur}" ${ink()}/>`;
    const dr = o.ear || 0;
    s += `<g transform="translate(0 -160)">`;
    for (const sd of [-1, 1]) s += `<g transform="rotate(${sd * (10 + dr * 50)} ${sd * 16} -30)"><ellipse cx="${sd * 18}" cy="-86" rx="17" ry="58" fill="${fur}" ${ink()}/><ellipse cx="${sd * 18}" cy="-82" rx="8" ry="42" fill="${pink}"/></g>`;
    s += cel(a => `<circle r="50" ${a}/>`, fur, furS, -0.1, -0.1, 50);
    s += eye(-20, -6, 8) + eye(20, -6, 8);
    s += `<path d="M-6,12 L6,12 L0,20 Z" fill="${pink}" ${ink(2.5)}/><path d="M0,20 L0,26 M-10,30 Q-5,34 0,26 Q5,34 10,30" fill="none" ${ink(SW * 0.7)}/>`;
    s += `<path d="M-14,18 L-46,12 M-14,22 L-44,26 M14,18 L46,12 M14,22 L44,26" stroke="${INK}" stroke-width="2.5" opacity="0.6"/>`;
    s += `<ellipse cx="-34" cy="16" rx="9" ry="5" fill="${C.cheek}"/><ellipse cx="34" cy="16" rx="9" ry="5" fill="${C.cheek}"/></g>`;
    // front paws
    s += `<ellipse cx="-20" cy="-36" rx="15" ry="20" fill="${fur}" ${ink()}/><ellipse cx="22" cy="-36" rx="15" ry="20" fill="${o.bandage ? '#fbf7ee' : fur}" ${ink()}/>`;
    if (o.bandage) s += `<path d="M10,-48 L34,-40 M8,-36 L36,-30 M10,-24 L32,-20" stroke="#cfc6b4" stroke-width="3"/>
      <path d="M30,-52 Q58,-74 66,-46 Q50,-38 30,-52 Z" fill="#7fae5a" ${ink(SW * 0.8)}/><path d="M32,-51 Q50,-56 62,-48" fill="none" stroke="#4f7d36" stroke-width="2.5"/>`;
    return s;
  }

  // bird – small dark silhouette for skies. Origin: body. o: flap 0..1 (wing beat), col, s (scale)
  function bird(o = {}) {
    const fl = 0.25 + 0.75 * Math.abs(Math.sin((o.flap || 0) * Math.PI));
    const col = o.col || '#2a1f2e', sc = o.s || 1;
    return `<g transform="scale(${sc})"><path d="M-30,${n(-4 - 10 * fl)} Q-14,${n(-14 * fl)} 0,2 Q14,${n(-14 * fl)} 30,${n(-4 - 10 * fl)}" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="0" cy="3" rx="5" ry="4" fill="${col}"/></g>`;
  }

  // =====================================================================================================
  // VEHICLES AND FURNITURE
  // =====================================================================================================

  function wheel(R, spin, o = {}) {
    let s = `<circle r="${R}" fill="none" stroke="${INK}" stroke-width="${R * 0.2 + SW * 2}"/><circle r="${R}" fill="none" stroke="${o.rim || C.woodS}" stroke-width="${R * 0.2}"/>
      <circle r="${R}" fill="none" stroke="${o.rimL || C.wood}" stroke-width="${R * 0.08}" transform="translate(-2 -2)"/>`;
    for (let i = 0; i < 6; i++) {
      const a = spin + i * TAU / 6;
      s += `<path d="M0,0 L${n(Math.cos(a) * R * 0.92)},${n(Math.sin(a) * R * 0.92)}" stroke="${INK}" stroke-width="${R * 0.1 + 6}" stroke-linecap="round"/>
        <path d="M0,0 L${n(Math.cos(a) * R * 0.92)},${n(Math.sin(a) * R * 0.92)}" stroke="${C.wood}" stroke-width="${R * 0.1}" stroke-linecap="round"/>`;
    }
    return s + `<circle r="${R * 0.2}" fill="${C.bronze}" ${ink()}/><circle r="${R * 0.07}" fill="${INK}"/>`;
  }
  // chariot – two-wheeled war chariot, side view, facing right. Origin: ground under the wheel. o: spin (radians), body colour
  // (default Achilles teal + bronze), pole (true = shaft to the yoke at PROPS.CHARIOT_YOKE). Driver stands at PROPS.CHARIOT_FLOOR.
  function chariot(o = {}) {
    const R = 104, body = o.body || C.teal, bodyS = o.bodyS || C.tealS;
    let s = '';
    if (o.pole !== false) s += `<path d="M90,-128 Q260,-150 446,-334" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M90,-128 Q260,-150 446,-334" fill="none" stroke="${C.wood}" stroke-width="12" stroke-linecap="round"/>
      <path d="M410,-352 L486,-318" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M410,-352 L486,-318" stroke="${C.woodS}" stroke-width="11" stroke-linecap="round"/>`;
    s += `<rect x="-86" y="-132" width="214" height="22" rx="8" fill="${C.woodS}" ${ink()}/>`;
    s += cel(a => `<path d="M-76,-128 L118,-128 Q150,-214 104,-272 Q74,-252 34,-246 Q-30,-232 -60,-184 Q-74,-160 -76,-128 Z" ${a}/>`, body, bodyS, -0.1, -0.06, 120);
    s += `<path d="M-60,-184 Q-30,-232 34,-246 Q74,-252 104,-272" fill="none" stroke="${C.bronze}" stroke-width="12" stroke-linecap="round"/>
      <path d="M-40,-150 Q40,-176 100,-226" fill="none" stroke="${C.bronze}" stroke-width="7" stroke-linecap="round"/>
      <path d="M-14,-160 q12,-14 24,0 q12,14 24,0 q12,-14 24,0" fill="none" stroke="${C.goldL}" stroke-width="5" stroke-linecap="round"/>`;
    s += `<g transform="translate(0 ${-R})">${wheel(R, o.spin || 0)}</g>`;
    return s;
  }
  // chariotTeam – chariot + two horses (far one darker). Origin: ground under the wheel. o: phase (gallop 0..1), gait,
  // spin (else from phase), coats [near, far]. A driver stands at x 20, y -128 (scale ~0.72 for an adult).
  function chariotTeam(o = {}) {
    const ph = o.phase || 0, gait = o.gait || 'gallop';
    const far = horse({ gait, phase: ph + 0.08, coat: o.farCoat || '#9a6a46', coatS: '#7a4e32', coatD: '#5a3622', harness: true });
    const near = horse({ gait, phase: ph, coat: o.nearCoat || '#e9e1d3', coatS: '#c7bba6', coatD: '#9c9080', muzzle: '#f4ece0', mane: '#8a8178', maneS: '#6a625a', harness: true });
    const spin = o.spin ?? -ph * TAU * 1.6;
    return `<g transform="translate(420 -34) scale(0.94)">${far}</g>${chariot({ ...o, spin })}<g transform="translate(346 0)">${near}</g>`;
  }

  // throne – high-backed chair, front view. Origin: ground, centre. Sit a character at PROPS.THRONE_SEAT (feet hidden by the seat).
  // o: metal (gold), cloth (purple cushion), lion (paw feet)
  function throne(o = {}) {
    const metal = o.metal || C.gold, metalS = o.metalS || C.goldS, cloth = o.cloth || '#6d3f8a', clothS = o.clothS || '#53306b';
    let s = '';
    s += cel(a => `<path d="M-130,-200 L-130,-470 Q-130,-560 0,-580 Q130,-560 130,-470 L130,-200 Z" ${a}/>`, metal, metalS, -0.1, -0.06, 140);
    s += cel(a => `<path d="M-96,-210 L-96,-450 Q-96,-520 0,-534 Q96,-520 96,-450 L96,-210 Z" ${a}/>`, cloth, clothS, -0.12, -0.05, 100);
    s += `<circle cx="0" cy="-470" r="26" fill="${C.goldL}" ${ink()}/><circle cx="0" cy="-470" r="12" fill="#c8302a" ${ink(2.5)}/>`;
    for (const sd of [-1, 1]) s += `<rect x="${sd > 0 ? 96 : -150}" y="-300" width="54" height="26" rx="10" fill="${metal}" ${ink()}/><circle cx="${sd * 132}" cy="-287" r="12" fill="${C.goldL}" ${ink(2.5)}/>`;
    s += cel(a => `<path d="M-150,-214 Q0,-232 150,-214 L140,-176 Q0,-160 -140,-176 Z" ${a}/>`, cloth, clothS, 0, -0.2, 150);
    for (const sd of [-1, 1]) s += `<path d="M${sd * 120},-176 L${sd * 112},-30" stroke="${INK}" stroke-width="34" stroke-linecap="round"/><path d="M${sd * 120},-176 L${sd * 112},-30" stroke="${metalS}" stroke-width="24" stroke-linecap="round"/>
      <path d="M${sd * 112 - 30},0 Q${sd * 112 - 30},-34 ${sd * 112},-34 Q${sd * 112 + 30},-34 ${sd * 112 + 30},0 Z" fill="${metal}" ${ink()}/>
      <path d="M${sd * 112 - 14},-2 l0,-12 M${sd * 112},-2 l0,-14 M${sd * 112 + 14},-2 l0,-12" stroke="${INK}" stroke-width="3"/>`;
    return s;
  }
  // stool – a folding stool (diphros), front view. Origin: ground. Seat height PROPS.STOOL_SEAT.
  function stool(o = {}) {
    const w = o.w || 170;
    return `<path d="M${-w / 2 + 14},-130 L${w / 2 - 14},0 M${w / 2 - 14},-130 L${-w / 2 + 14},0" stroke="${INK}" stroke-width="22" stroke-linecap="round"/>
      <path d="M${-w / 2 + 14},-130 L${w / 2 - 14},0 M${w / 2 - 14},-130 L${-w / 2 + 14},0" stroke="${C.woodS}" stroke-width="12" stroke-linecap="round"/>
      <circle cx="0" cy="-65" r="10" fill="${C.bronze}" ${ink(3)}/>
      ${cel(a => `<rect x="${-w / 2}" y="-152" width="${w}" height="32" rx="14" ${a}/>`, o.cloth || '#b5553a', o.clothS || '#8f3f28', 0, -0.2, w / 2)}`;
  }

  // the helmet of Achilles without a head (crest, cheek guards), for "the helmet flies off", stands, hands. Origin: centre of
  // the head opening (same as a head of radius r at 0,0). o: r (72 = adult), P palette {metal, metalS, crest}, strap (leather chin strap)
  function helmetProp(o = {}) {
    const r = o.r || 72, P = { metal: C.bronze, metalS: C.bronzeS, crest: '#b8352c', ...(o.P || {}) };
    let s = `<path d="M${n(-0.72 * r)},${n(0.6 * r)} L${n(-0.7 * r)},${n(-0.12 * r)} Q0,${n(-0.36 * r)} ${n(0.7 * r)},${n(-0.12 * r)} L${n(0.72 * r)},${n(0.6 * r)} Q0,${n(0.7 * r)} ${n(-0.72 * r)},${n(0.6 * r)} Z" fill="#2c1d15"/>`;
    s += `<path d="M${n(-0.5 * r)},${n(0.1 * r)} Q0,${n(-0.05 * r)} ${n(0.5 * r)},${n(0.1 * r)}" fill="none" stroke="#4a3426" stroke-width="${n(0.08 * r)}" opacity="0.8"/>`;
    s += K.helmet(r, P);
    if (o.strap) s += `<path d="M${n(-0.66 * r)},${n(0.56 * r)} Q0,${n(1.25 * r)} ${n(0.66 * r)},${n(0.56 * r)}" fill="none" stroke="${INK}" stroke-width="${n(0.16 * r)}" stroke-linecap="round"/>
      <path d="M${n(-0.66 * r)},${n(0.56 * r)} Q0,${n(1.25 * r)} ${n(0.66 * r)},${n(0.56 * r)}" fill="none" stroke="${C.leather}" stroke-width="${n(0.09 * r)}" stroke-linecap="round"/>`;
    return s;
  }

  // armorStand – the armour of Achilles (wedding gift of the gods) on a wooden stand, at a man's height: helmet, cuirass,
  // leather strips, greaves at the foot, the wave shield leaning on it, a spear. Origin: ground, centre.
  // o: empty (only the stand), giftTag (swinging tag "FROM: THE GODS"), tagSwing (degrees), P palette (as hero()), spear
  function armorStand(o = {}) {
    const P = { metal: C.bronze, metalS: C.bronzeS, metalL: C.bronzeL, crest: '#b8352c', rim: C.teal, mark: C.tealS, ...(o.P || {}) };
    let s = '';
    // the stand: base feet, post, shoulder bar, head knob
    s += `<path d="M-120,-4 L120,-4 M-70,-4 L0,-60 L70,-4" fill="none" stroke="${INK}" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M-120,-4 L120,-4 M-70,-4 L0,-60 L70,-4" fill="none" stroke="${C.woodS}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="-12" y="-500" width="24" height="460" rx="6" fill="${C.wood}" ${ink()}/>
      <rect x="-96" y="-404" width="192" height="22" rx="8" fill="${C.wood}" ${ink()}/>
      <circle cx="0" cy="-506" r="26" fill="${C.woodS}" ${ink()}/>`;
    if (o.empty) return s + `<path d="M-90,-393 l0,16 M90,-393 l0,16" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
    // greaves standing at the foot
    for (const sd of [-1, 1]) s += cel(a => `<path d="M${sd * 52 - 22},-128 Q${sd * 52},-138 ${sd * 52 + 22},-128 L${sd * 52 + 18},-12 Q${sd * 52},-4 ${sd * 52 - 18},-12 Z" ${a}/>`, P.metal, P.metalS, -0.25, 0, 22)
      + `<path d="M${sd * 52 - 12},-108 Q${sd * 52},-90 ${sd * 52 + 12},-108" fill="none" stroke="${P.metalS}" stroke-width="4"/>`;
    // leather strips + cuirass (hero() shapes)
    for (let i = 0; i < 7; i++) s += `<rect x="${-66 + i * 22 - 9}" y="-232" width="19" height="62" rx="6" fill="${i % 2 ? C.leather : C.leatherS}" ${ink(SW * 0.8)}/>`;
    s += cel(a => `<path d="M-80,-398 Q0,-414 80,-398 Q96,-310 68,-222 Q0,-212 -68,-222 Q-96,-310 -80,-398 Z" ${a}/>`, P.metal, P.metalS, -0.14, -0.04, 90);
    s += `<path d="M-50,-330 Q-26,-306 0,-326 Q26,-306 50,-330" fill="none" stroke="${P.metalS}" stroke-width="5" stroke-linecap="round"/>
      <path d="M0,-318 L0,-236 M-30,-282 Q0,-274 30,-282 M-28,-254 Q0,-246 28,-254" fill="none" stroke="${P.metalS}" stroke-width="4" stroke-linecap="round"/>
      <path d="M-58,-382 Q-66,-330 -56,-300" fill="none" stroke="${P.metalL}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="-62" cy="-392" r="10" fill="${C.goldL}" ${ink(SW * 0.8)}/><circle cx="62" cy="-392" r="10" fill="${C.goldL}" ${ink(SW * 0.8)}/>`;
    s += `<g transform="translate(0 -486)">${helmetProp({ P })}</g>`;
    if (o.spear !== false) s += `<g transform="translate(150 0) rotate(8)"><rect x="-5" y="-640" width="11" height="640" rx="4" fill="${C.wood}" ${ink(SW * 0.8)}/>
      <path d="M0,-720 Q18,-670 7,-636 L-6,-636 Q-18,-670 0,-720 Z" fill="${P.metal}" ${ink()}/></g>`;
    s += `<g transform="rotate(-7 -120 -10)">${K.shield(-130, -170, 96, { rim: P.rim, mark: P.mark, face: P.metal, faceS: P.metalS })}</g>`;
    if (o.giftTag) {
      const sw = o.tagSwing || 0;
      s += `<g transform="translate(92 -388) rotate(${n(sw)})"><path d="M0,0 Q-6,40 4,78" fill="none" stroke="#c8302a" stroke-width="5" stroke-linecap="round"/>
        <g transform="translate(4 78) rotate(-6)"><path d="M-70,0 L60,0 L82,30 L60,60 L-70,60 Z" fill="#f4e5c6" ${ink()}/><circle cx="62" cy="30" r="7" fill="none" ${ink(3)}/>
        <text x="-58" y="24" ${HAND} font-size="20" fill="${INK}">FROM:</text><text x="-58" y="50" ${FONT} font-size="22" fill="${INK}">THE GODS</text></g></g>`;
    }
    return s;
  }

  // tent – canvas army tent, front view, with the door flap tied open. Origin: ground, centre.
  // o: w, h, open 0..1 (how far the flaps are tied back), lit (warm lamp glow inside), cloth/clothS/stripe colours
  function tent(o = {}) {
    const w = o.w || 620, h = o.h || 430, op = o.open ?? 0.8;
    const cloth = o.cloth || '#e9dcc0', clothS = o.clothS || '#c9b791', stripe = o.stripe || '#b5553a';
    const hw = w / 2, gid = nid('tl');
    let s = `<defs><radialGradient id="${gid}" cx="0.5" cy="0.75" r="0.7"><stop offset="0" stop-color="#ffd89a"/><stop offset="0.6" stop-color="#e08a3c"/><stop offset="1" stop-color="#5a2a16"/></radialGradient></defs>`;
    for (const sd of [-1, 1]) s += `<path d="M${sd * hw * 0.62},${-h * 0.78} L${sd * (hw + 70)},0" stroke="#8a7a5c" stroke-width="3"/><rect x="${sd * (hw + 70) - 5}" y="-16" width="10" height="20" fill="${C.woodS}" ${ink(2)}/>`;
    s += cel(a => `<path d="M${-hw},0 Q${-hw * 0.9},${-h * 0.55} 0,${-h} Q${hw * 0.9},${-h * 0.55} ${hw},0 Z" ${a}/>`, cloth, clothS, -0.08, 0, hw);
    for (const k of [-0.62, 0.62]) s += `<path d="M${k * hw * 0.5},${-h * 0.86} Q${k * hw * 0.85},${-h * 0.4} ${k * hw * 1.02},0" fill="none" stroke="${stripe}" stroke-width="16" opacity="0.85"/>`;
    // door: opening shape + flaps
    const dw = w * 0.17 + op * w * 0.07;
    s += `<path d="M${-dw},0 Q${-dw * 0.5},${-h * 0.5} 0,${-h * 0.78} Q${dw * 0.5},${-h * 0.5} ${dw},0 Z" fill="${o.lit ? `url(#${gid})` : '#3a2a22'}" ${ink()}/>`;
    if (o.lit) s += `<ellipse cx="0" cy="-20" rx="${dw * 0.9}" ry="26" fill="#ffe2a8" opacity="0.5"/>`;
    for (const sd of [-1, 1]) s += `<path d="M0,${-h * 0.78} Q${sd * dw * 0.4},${-h * 0.5} ${sd * dw},0 L${sd * (dw + 40 + op * 40)},0 Q${sd * (dw + 30)},${-h * 0.35} 0,${-h * 0.78} Z" fill="${clothS}" ${ink()}/>
      <path d="M${sd * (dw + 10)},${-h * 0.3} q${sd * 20},6 ${sd * 32},-4" fill="none" stroke="#7b4a2d" stroke-width="7" stroke-linecap="round"/>`;
    s += `<path d="M0,${-h} L0,${-h - 60}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M0,${-h} L0,${-h - 60}" stroke="${C.wood}" stroke-width="6" stroke-linecap="round"/>
      <path d="M2,${-h - 58} L60,${-h - 44} L2,${-h - 30} Z" fill="${o.flag || C.teal}" ${ink(3)}/>`;
    return s;
  }

  // =====================================================================================================
  // OBJECTS
  // =====================================================================================================

  // lyre – tortoise-shell lyre with horn arms and 7 strings. Origin: centre of the shell. ~190 px tall at s = 1.
  // o: s (scale), pluck (string index 0..6 that vibrates), amp (px)
  function lyre(o = {}) {
    const sc = o.s || 1;
    let s = '';
    for (const sd of [-1, 1]) s += `<path d="M${sd * 34},-26 C${sd * 82},-70 ${sd * 30},-110 ${sd * 66},-160" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/>
      <path d="M${sd * 34},-26 C${sd * 82},-70 ${sd * 30},-110 ${sd * 66},-160" fill="none" stroke="#e2c58e" stroke-width="13" stroke-linecap="round"/>
      <path d="M${sd * 66},-160 q${sd * 10},-10 ${sd * 2},-22" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>`;
    s += `<rect x="-78" y="-150" width="156" height="18" rx="8" fill="${C.woodS}" ${ink()}/>`;
    s += cel(a => `<ellipse cx="0" cy="0" rx="58" ry="46" ${a}/>`, '#8a5a36', '#6b4226', -0.1, -0.12, 58);
    s += `<path d="M-20,-30 L20,-30 L34,0 L20,30 L-20,30 L-34,0 Z M-20,-30 L-36,-38 M20,-30 L36,-38 M34,0 L56,0 M-34,0 L-56,0 M20,30 L36,38 M-20,30 L-36,38" fill="none" stroke="#c9a46c" stroke-width="4" stroke-linejoin="round"/>`;
    s += `<rect x="-30" y="8" width="60" height="9" rx="3" fill="${C.wood}" ${ink(2.5)}/>`;
    for (let i = 0; i < 7; i++) {
      const x = -24 + i * 8, v = o.pluck === i ? (o.amp ?? 4) : 0;
      s += `<path d="M${x},10 Q${x + v},-62 ${x * 1.2},-134" fill="none" stroke="#fff6d8" stroke-width="2.5" opacity="0.95"/>`;
    }
    for (let i = 0; i < 7; i++) s += `<circle cx="${-27 + i * 9}" cy="-141" r="3" fill="${C.goldL}"/>`;
    return `<g transform="scale(${sc})">${s}</g>`;
  }

  // goldenApple – the apple of Strife. Origin: centre. o: r (60), glow 0..1, text 0..1 (reveals "FOR THE FAIREST" on it), angle
  function goldenApple(o = {}) {
    const r = o.r || 60, gid = nid('ag');
    let s = '';
    if (o.glow) s += `<defs><radialGradient id="${gid}"><stop offset="0" stop-color="${o.glowCol || '#ffe08a'}" stop-opacity="${0.8 * o.glow}"/><stop offset="1" stop-color="${o.glowCol || '#ffe08a'}" stop-opacity="0"/></radialGradient></defs>
      <circle r="${r * 3.2}" fill="url(#${gid})"/>`;
    const shape = a => `<path d="M0,${n(-0.72 * r)} C${n(0.5 * r)},${n(-1.15 * r)} ${n(1.12 * r)},${n(-0.72 * r)} ${n(1.02 * r)},0 C${n(0.96 * r)},${n(0.74 * r)} ${n(0.46 * r)},${n(1.02 * r)} 0,${n(0.9 * r)} C${n(-0.46 * r)},${n(1.02 * r)} ${n(-0.96 * r)},${n(0.74 * r)} ${n(-1.02 * r)},0 C${n(-1.12 * r)},${n(-0.72 * r)} ${n(-0.5 * r)},${n(-1.15 * r)} 0,${n(-0.72 * r)} Z" ${a}/>`;
    s += `<g transform="rotate(${o.angle || 0})">`;
    s += `<path d="M0,${n(-0.7 * r)} Q${n(0.06 * r)},${n(-1.0 * r)} ${n(0.18 * r)},${n(-1.16 * r)}" fill="none" stroke="${INK}" stroke-width="${n(0.12 * r)}" stroke-linecap="round"/>
      <path d="M${n(0.1 * r)},${n(-0.98 * r)} Q${n(0.5 * r)},${n(-1.3 * r)} ${n(0.8 * r)},${n(-1.04 * r)} Q${n(0.46 * r)},${n(-0.82 * r)} ${n(0.1 * r)},${n(-0.98 * r)} Z" fill="#7fae5a" ${ink(SW * 0.9)}/>`;
    s += cel(shape, '#f4c94a', '#c98f1c', -0.12, -0.1, r);
    s += `<ellipse cx="${n(-0.42 * r)}" cy="${n(-0.36 * r)}" rx="${n(0.16 * r)}" ry="${n(0.28 * r)}" transform="rotate(25 ${n(-0.42 * r)} ${n(-0.36 * r)})" fill="#fff" opacity="0.55"/>
      <circle cx="${n(-0.2 * r)}" cy="${n(-0.6 * r)}" r="${n(0.06 * r)}" fill="#fff" opacity="0.8"/>`;
    if (o.text) s += `<g opacity="${clamp(o.text).toFixed(2)}"><text x="0" y="${n(0.02 * r)}" ${SERIF} font-style="italic" font-weight="700" font-size="${n(0.27 * r)}" text-anchor="middle" fill="#7a4a0c">for the</text>
      <text x="0" y="${n(0.34 * r)}" ${SERIF} font-style="italic" font-weight="700" font-size="${n(0.32 * r)}" text-anchor="middle" fill="#7a4a0c">fairest</text></g>`;
    return s + '</g>';
  }

  // dice – one knucklebone (the dice of the time). Origin: centre. o: size (60), rot (degrees), side 0..3 (which face shows)
  function dice(o = {}) {
    const z = (o.size || 60) / 60, side = (o.side || 0) % 4;
    let s = cel(a => `<path d="M-52,-20 Q-60,-36 -42,-40 Q-20,-30 0,-34 Q20,-30 42,-40 Q60,-36 52,-20 Q46,0 52,20 Q60,36 42,40 Q20,30 0,34 Q-20,30 -42,40 Q-60,36 -52,20 Q-46,0 -52,-20 Z" ${a}/>`, '#f1e8d4', '#cdbf9f', -0.1, -0.12, 56);
    s += [`<circle r="8" fill="${INK}" opacity="0.75"/>`, `<path d="M-18,0 Q0,-14 18,0 Q0,14 -18,0 Z" fill="none" ${ink(3)} opacity="0.7"/>`,
      `<circle cx="-14" r="6" fill="${INK}" opacity="0.75"/><circle cx="14" r="6" fill="${INK}" opacity="0.75"/>`, `<path d="M-20,-6 Q0,8 20,-6" fill="none" ${ink(4)} opacity="0.7"/>`][side];
    return `<g transform="rotate(${o.rot || 0}) scale(${z})">${s}</g>`;
  }

  // cauldron – bronze cauldron on a tripod. Origin: ground. o: s, legs (false = bowl only, for stacking; bowl height ~92)
  function cauldron(o = {}) {
    const sc = o.s || 1;
    let s = '';
    if (o.legs !== false) {
      for (const x of [-56, 0, 56]) s += `<path d="M${x * 0.7},-90 L${x * 1.1},0" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M${x * 0.7},-90 L${x * 1.1},0" stroke="${C.bronzeS}" stroke-width="8" stroke-linecap="round"/>`;
    }
    const y0 = o.legs === false ? 0 : -80;
    s += `<g transform="translate(0 ${y0})">`;
    for (const sd of [-1, 1]) s += `<circle cx="${sd * 60}" cy="-96" r="22" fill="none" stroke="${INK}" stroke-width="14"/><circle cx="${sd * 60}" cy="-96" r="22" fill="none" stroke="${C.bronze}" stroke-width="7"/>`;
    s += cel(a => `<path d="M-90,-84 Q-96,0 0,0 Q96,0 90,-84 Z" ${a}/>`, C.bronze, C.bronzeS, -0.12, -0.05, 90);
    s += `<ellipse cx="0" cy="-84" rx="92" ry="18" fill="${C.bronzeS}" ${ink()}/><ellipse cx="0" cy="-82" rx="74" ry="11" fill="#5a3a1e"/>
      <path d="M-62,-50 Q-60,-26 -40,-16" fill="none" stroke="${C.bronzeL}" stroke-width="6" stroke-linecap="round"/></g>`;
    return `<g transform="scale(${sc})">${s}</g>`;
  }
  // cauldronTower – n bowls stacked, each a little more tilted. Origin: ground. o: n (20), wobble (degrees at the top), s
  function cauldronTower(o = {}) {
    const N = o.n || 20, wob = o.wobble || 0;
    let s = '', y = 0, x = 0;
    for (let i = 0; i < N; i++) {
      const t = i / Math.max(1, N - 1), a = wob * t * t;
      x += Math.sin(a * D2R) * 30; s += `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(a)}) scale(0.62)">${cauldron({ legs: false })}</g>`;
      y -= 50;
    }
    return `<g transform="scale(${o.s || 1})">${cauldron({ s: 0.62 })}<g transform="translate(0 -60)">${s}</g></g>`;
  }
  // goldBars – a little pyramid of gold ingots. Origin: ground. o: n (rows, 3), s
  function goldBars(o = {}) {
    const rows = o.n || 3;
    let s = '';
    for (let r = 0; r < rows; r++) for (let i = 0; i < rows - r; i++) {
      const x = (i - (rows - r - 1) / 2) * 96, y = -r * 40;
      s += cel(a => `<path d="M${x - 46},${y} L${x + 46},${y} L${x + 34},${y - 38} L${x - 34},${y - 38} Z" ${a}/>`, '#f4c94a', '#c98f1c', 0, -0.25, 46)
        + `<path d="M${x - 26},${y - 30} L${x + 6},${y - 30}" stroke="#fff6c8" stroke-width="5" stroke-linecap="round"/>`;
    }
    return `<g transform="scale(${o.s || 1})">${s}</g>`;
  }
  // cityIcon – a tiny walled city. Origin: ground, centre. o: s, flag 0..1 (teal wave flag pops up on the tower), burn (smoke)
  function cityIcon(o = {}) {
    let s = '';
    s += `<path d="M-50,-60 L-30,-86 L-10,-60 Z M10,-66 L30,-96 L50,-66 Z" fill="#b5553a" ${ink(3)}/><rect x="-46" y="-62" width="34" height="26" fill="#efe2c4" ${ink(3)}/><rect x="14" y="-68" width="32" height="30" fill="#efe2c4" ${ink(3)}/>`;
    s += cel(a => `<path d="M-70,0 L-70,-46 L-60,-46 L-60,-38 L-48,-38 L-48,-46 L-36,-46 L-36,-38 L-24,-38 L-24,-46 L24,-46 L24,-38 L36,-38 L36,-46 L48,-46 L48,-38 L60,-38 L60,-46 L70,-46 L70,0 Z" ${a}/>`, '#dcc89e', '#bba57a', -0.1, -0.1, 70);
    s += `<rect x="-96" y="-74" width="30" height="74" fill="#d2bc90" ${ink(3)}/><rect x="66" y="-74" width="30" height="74" fill="#d2bc90" ${ink(3)}/>
      <path d="M-14,0 L-14,-22 Q0,-36 14,-22 L14,0 Z" fill="#5a3a26" ${ink(3)}/>`;
    if (o.flag) { const p = clamp(o.flag), sc = p < 1 ? Math.sin(p * Math.PI * 0.5) * 1.15 : 1;
      s += `<g transform="translate(81 -74) scale(${sc.toFixed(3)})"><path d="M0,0 L0,-64" stroke="${INK}" stroke-width="5"/><path d="M2,-64 L46,-54 L2,-40 Z" fill="${C.teal}" ${ink(3)}/>
        <path d="M8,-52 q5,-5 10,0 q5,5 10,0" fill="none" stroke="#fff" stroke-width="3"/></g>`; }
    if (o.burn) for (let i = 0; i < 3; i++) s += `<circle cx="${-30 + i * 30}" cy="${-110 - i * 18}" r="${20 + i * 8}" fill="#5a4a48" opacity="${0.5 - i * 0.12}"/>`;
    return `<g transform="scale(${o.s || 1})">${s}</g>`;
  }
  // tiara – a princess' gold diadem. Origin: centre of the band. o: s
  function tiara(o = {}) {
    const s = cel(a => `<path d="M-90,10 Q0,-14 90,10 L84,-14 L56,-30 L30,-26 L0,-70 L-30,-26 L-56,-30 L-84,-14 Z" ${a}/>`, '#f4c94a', '#c98f1c', -0.1, -0.1, 90)
      + `<circle cx="0" cy="-36" r="13" fill="#5aa8ae" ${ink(3)}/><circle cx="-50" cy="-12" r="8" fill="#e57f73" ${ink(2.5)}/><circle cx="50" cy="-12" r="8" fill="#e57f73" ${ink(2.5)}/>
      <circle cx="-4" cy="-40" r="4" fill="#fff" opacity="0.8"/>`;
    return `<g transform="scale(${o.s || 1})">${s}</g>`;
  }
  // goldenJar – golden urn with lid (the ashes of Achilles and Patroclus). Origin: ground. o: s, leaves (two small laurel sprays)
  function goldenJar(o = {}) {
    let s = '';
    for (const sd of [-1, 1]) s += `<path d="M${sd * 52},-250 Q${sd * 110},-250 ${sd * 96},-170" fill="none" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M${sd * 52},-250 Q${sd * 110},-250 ${sd * 96},-170" fill="none" stroke="${C.goldS}" stroke-width="10" stroke-linecap="round"/>`;
    s += cel(a => `<path d="M-48,-262 L48,-262 L40,-232 Q120,-180 104,-100 Q92,-30 46,-14 L56,0 L-56,0 L-46,-14 Q-92,-30 -104,-100 Q-120,-180 -40,-232 Z" ${a}/>`, '#f2c552', '#c48d22', -0.12, -0.06, 110);
    s += `<path d="M-92,-150 Q0,-130 92,-150 L96,-122 Q0,-102 -96,-122 Z" fill="#c48d22" ${ink(3)}/>`;
    for (let x = -84; x < 84; x += 24) s += `<path d="M${x},-118 l0,-20 l16,0 l0,10 l-8,0" fill="none" stroke="#fff1b8" stroke-width="3.5"/>`;
    s += `<path d="M-60,-236 Q-90,-190 -84,-150" fill="none" stroke="#fff6cf" stroke-width="8" stroke-linecap="round" opacity="0.8"/>`;
    s += cel(a => `<path d="M-56,-262 Q0,-300 56,-262 Z" ${a}/>`, '#f2c552', '#c48d22', 0, -0.2, 56) + `<circle cx="0" cy="-292" r="14" fill="#f2c552" ${ink()}/>`;
    // two laurel sprays crossing under the band (one for each of them)
    if (o.leaves) for (const sd of [-1, 1]) {
      s += `<path d="M${sd * 6},-40 Q${sd * 40},-56 ${sd * 70},-92" fill="none" stroke="#5d7f3c" stroke-width="4" stroke-linecap="round"/>`;
      for (let i = 0; i < 4; i++) { const t = 0.2 + i * 0.22, x = sd * lerp(6, 70, t), y = lerp(-40, -92, t * t) - 4 * t, side = i % 2 ? 1 : -1, ang = sd * -40 + side * 40;
        s += `<ellipse cx="${n(x + side * 7)}" cy="${n(y - 8)}" rx="13" ry="6" transform="rotate(${n(ang)} ${n(x + side * 7)} ${n(y - 8)})" fill="#7fae5a" ${ink(2)}/>`; }
    }
    return `<g transform="scale(${o.s || 1})">${s}</g>`;
  }

  // worldShield – the new shield the god of blacksmiths makes in one night: the whole world on it.
  // Centre: the sun · ring 1: night sky with moon and stars · ring 2: six scenes of the world (a city, ploughed fields, a harvest,
  // a vineyard, sheep in a pasture, a dance) · rim: the ocean, then the bronze edge. Origin: centre. o: R (220), rot (degrees,
  // turns everything inside the rim), glow 0..1
  function worldShield(o = {}) {
    const R = o.R || 220, rot = o.rot || 0, gid = nid('ws');
    const sector = (a0, a1, r0, r1) => { const p = (a, r) => `${n(Math.cos(a) * r)},${n(Math.sin(a) * r)}`; return `M${p(a0, r1)} A${r1},${r1} 0 0 1 ${p(a1, r1)} L${p(a1, r0)} A${r0},${r0} 0 0 0 ${p(a0, r0)} Z`; };
    let s = '';
    if (o.glow) s += `<defs><radialGradient id="${gid}"><stop offset="0.5" stop-color="#ffe7a8" stop-opacity="${0.7 * o.glow}"/><stop offset="1" stop-color="#ffe7a8" stop-opacity="0"/></radialGradient></defs><circle r="${R * 1.6}" fill="url(#${gid})"/>`;
    s += cel(a => `<circle r="${R}" ${a}/>`, '#e2ad55', '#b07a32', -0.08, -0.08, R);
    for (let i = 0; i < 20; i++) { const a = i / 20 * TAU; s += `<circle cx="${n(Math.cos(a) * R * 0.955)}" cy="${n(Math.sin(a) * R * 0.955)}" r="${n(R * 0.018)}" fill="#fff1c4" ${ink(1.5)}/>`; }
    let g = '';
    // ocean
    g += `<circle r="${n(R * 0.91)}" fill="#3e86a6" ${ink(3)}/>`;
    for (let i = 0; i < 22; i++) { const a = i / 22 * 360; g += `<g transform="rotate(${a}) translate(0 ${n(-R * 0.84)})"><path d="M${n(-R * 0.06)},0 q${n(R * 0.03)},${n(-R * 0.04)} ${n(R * 0.06)},0 q${n(R * 0.03)},${n(R * 0.04)} ${n(R * 0.06)},0" fill="none" stroke="#d4f0f4" stroke-width="${n(R * 0.014)}" stroke-linecap="round"/></g>`; }
    // six scenes
    const scenes = [
      ['#e9d6a8', (z) => `<rect x="${-22 * z}" y="${-10 * z}" width="${44 * z}" height="${22 * z}" fill="#f6ead0" ${ink(1.8)}/><path d="M${-26 * z},${-10 * z} L0,${-26 * z} L${26 * z},${-10 * z} Z" fill="#b5553a" ${ink(1.8)}/><rect x="${-34 * z}" y="${4 * z}" width="${68 * z}" height="${10 * z}" fill="#cdb889" ${ink(1.5)}/><path d="M${-6 * z},${12 * z} L${-6 * z},${0} L${6 * z},0 L${6 * z},${12 * z}" fill="#5a3a26"/>`], // city
      ['#c99a4e', (z) => [-14, -4, 6, 16].map(y => `<path d="M${-30 * z},${y * z} Q0,${(y - 6) * z} ${30 * z},${y * z}" fill="none" stroke="#6e4a20" stroke-width="${2.2 * z}"/>`).join('') + `<path d="M${-6 * z},${-16 * z} l${12 * z},${8 * z}" stroke="${INK}" stroke-width="${3 * z}"/>`], // ploughed field
      ['#efc65a', (z) => [-20, -7, 7, 20].map(x => `<path d="M${x * z},${14 * z} L${x * z},${-12 * z} M${x * z},${-12 * z} l${-5 * z},${-6 * z} M${x * z},${-12 * z} l${5 * z},${-6 * z} M${x * z},${-4 * z} l${-5 * z},${-6 * z} M${x * z},${-4 * z} l${5 * z},${-6 * z}" stroke="#8a5a14" stroke-width="${2.2 * z}" stroke-linecap="round"/>`).join('')], // harvest
      ['#8fb06a', (z) => [-18, 0, 18].map(x => `<path d="M${x * z},${16 * z} L${x * z},${-16 * z}" stroke="#5a3a26" stroke-width="${2.5 * z}"/>` + [[-4, -8], [4, -8], [0, -2], [-4, 4], [4, 4], [0, 10]].map(([dx, dy]) => `<circle cx="${(x + dx) * z}" cy="${dy * z}" r="${3.4 * z}" fill="#6d3f8a"/>`).join('')).join('')], // vineyard
      ['#a7c47e', (z) => [[-18, -4], [6, -10], [16, 8], [-6, 10]].map(([x, y]) => `<ellipse cx="${x * z}" cy="${y * z}" rx="${9 * z}" ry="${6 * z}" fill="#fbf5e8" ${ink(1.4)}/><circle cx="${(x + 9) * z}" cy="${(y - 2) * z}" r="${3.4 * z}" fill="${INK}"/>`).join('')], // sheep
      ['#ead7b8', (z) => [-24, -8, 8, 24].map(x => `<circle cx="${x * z}" cy="${-12 * z}" r="${5 * z}" fill="${INK}"/><path d="M${(x - 7) * z},${14 * z} L${x * z},${-6 * z} L${(x + 7) * z},${14 * z} Z" fill="${INK}"/>`).join('') + `<path d="M${-24 * z},${-2 * z} L${24 * z},${-2 * z}" stroke="${INK}" stroke-width="${2.4 * z}"/>`], // dance
    ];
    const r0 = R * 0.5, r1 = R * 0.77;
    scenes.forEach(([col, draw], i) => {
      const a0 = (i / 6) * TAU - Math.PI / 2 - TAU / 12, a1 = a0 + TAU / 6;
      g += `<path d="${sector(a0, a1, r0, r1)}" fill="${col}" ${ink(2.5)}/>`;
      const am = (a0 + a1) / 2;
      g += `<g transform="translate(${n(Math.cos(am) * R * 0.635)} ${n(Math.sin(am) * R * 0.635)}) rotate(${n(am / D2R + 90)})">${draw(R / 220 * 1.25)}</g>`;
    });
    // night sky, moon, stars
    g += `<circle r="${n(r0)}" fill="#22305a" ${ink(2.5)}/>`;
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + 0.3, rr = R * (0.38 + (i % 2) * 0.06); const x = Math.cos(a) * rr, y = Math.sin(a) * rr, z = R * (0.012 + (i % 3) * 0.004);
      g += `<path d="M${n(x)},${n(y - z * 2.4)} L${n(x + z * 0.7)},${n(y - z * 0.7)} L${n(x + z * 2.4)},${n(y)} L${n(x + z * 0.7)},${n(y + z * 0.7)} L${n(x)},${n(y + z * 2.4)} L${n(x - z * 0.7)},${n(y + z * 0.7)} L${n(x - z * 2.4)},${n(y)} L${n(x - z * 0.7)},${n(y - z * 0.7)} Z" fill="#fff4cf"/>`; }
    g += `<g transform="rotate(200) translate(0 ${n(-R * 0.4)})"><circle r="${n(R * 0.065)}" fill="#e9eef4" ${ink(2)}/><circle cx="${n(R * 0.03)}" cy="${n(-R * 0.02)}" r="${n(R * 0.055)}" fill="#22305a"/></g>`;
    // sun
    for (let i = 0; i < 12; i++) g += `<g transform="rotate(${i * 30})"><path d="M${n(-R * 0.04)},${n(-R * 0.25)} L0,${n(-R * 0.34)} L${n(R * 0.04)},${n(-R * 0.25)} Z" fill="#f6c64a" ${ink(1.8)}/></g>`;
    g += cel(a => `<circle r="${n(R * 0.24)}" ${a}/>`, '#f8d25c', '#d9a52c', -0.1, -0.1, R * 0.24);
    s += `<g transform="rotate(${n(rot)})">${g}</g>`;
    s += `<circle r="${n(R * 0.91)}" fill="none" ${ink(3)}/><path d="M${n(-R * 0.6)},${n(-R * 0.72)} A${n(R * 0.95)},${n(R * 0.95)} 0 0 1 ${n(R * 0.2)},${n(-R * 0.93)}" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="${n(R * 0.035)}" stroke-linecap="round"/>`;
    return s;
  }

  // shears – the Fates' bronze shears, same drawing as the hook (scenes/hook.html shot 7). Origin: the pivot; blades point +x.
  // o: open (degrees per blade, hook: 22 → 3), s (scale)
  function shears(o = {}) {
    const op = o.open ?? 22;
    const blade = sgn => `<g transform="rotate(${n(sgn * op)})">
      <path d="M0,0 L420,${-sgn * 14} Q450,${-sgn * 4} 420,${sgn * 16} Q200,${sgn * 30} 0,${sgn * 26} Z" fill="#d6a04a" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M40,${sgn * 6} L380,${-sgn * 6}" stroke="#f3cf83" stroke-width="5" stroke-linecap="round"/>
      <path d="M0,0 L-90,${sgn * 40}" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M0,0 L-90,${sgn * 40}" stroke="#a9742e" stroke-width="12" stroke-linecap="round"/>
      <ellipse cx="-160" cy="${sgn * 64}" rx="74" ry="46" fill="none" stroke="${INK}" stroke-width="24"/><ellipse cx="-160" cy="${sgn * 64}" rx="74" ry="46" fill="none" stroke="#a9742e" stroke-width="13"/></g>`;
    return `<g transform="scale(${o.s || 1})">${blade(1)}${blade(-1)}<circle r="14" fill="#f3cf83" stroke="${INK}" stroke-width="5"/></g>`;
  }
  // thread – a short golden life thread (hook: 70 px, ink 15 / gold 8). Origin: its middle. o: len (70), cut 0..1 (the two halves
  // spring apart and curl), col (gold; '#c9c3d6' = the grey of everyone else)
  function thread(o = {}) {
    const L = o.len || 70, col = o.col || '#f0c75c', c = clamp(o.cut || 0);
    const seg = d => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="15" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="8" stroke-linecap="round"/>`;
    if (!c) return seg(`M${-L / 2},0 L${L / 2},0`);
    const g = 10 + c * 26, cu = c * 14;
    return seg(`M${-L / 2 - c * 6},0 Q${-g / 2 - 6},0 ${-g / 2},${n(cu)}`) + seg(`M${L / 2 + c * 6},0 Q${g / 2 + 6},0 ${g / 2},${n(-cu)}`);
  }
  // threadBall – the big grey ball of "everyone else" (hook). Origin: centre. o: r (170)
  function threadBall(o = {}) {
    const r = o.r || 170, k = r / 170;
    let s = `<circle r="${r}" fill="#c9c3d6" stroke="${INK}" stroke-width="6"/>`;
    for (let i = 0; i < 7; i++) s += `<ellipse rx="${n((168 - Math.abs(i - 3) * 10) * k)}" ry="${n((60 + i * 14) * k)}" transform="rotate(${-70 + i * 22})" fill="none" stroke="#a49dba" stroke-width="5"/>`;
    return s;
  }

  // balanceScale – a bronze balance. Origin: ground. o: tilt (degrees, + = right pan down), left/right (SVG drawn in the pans,
  // origin = pan centre), s
  function balanceScale(o = {}) {
    const t = (o.tilt || 0) * D2R, L = 220, top = -400;
    const ex = sd => sd * Math.cos(t) * L, ey = sd => top + sd * Math.sin(t) * L;
    let s = `<path d="M-90,0 L90,0 L60,-36 L-60,-36 Z" fill="${C.bronzeS}" ${ink()}/><rect x="-11" y="${top}" width="22" height="${-top - 30}" fill="${C.bronze}" ${ink()}/>`;
    for (const sd of [-1, 1]) {
      const x = ex(sd), y = ey(sd), py = y + 170;
      s += `<path d="M${n(x)},${n(y)} L${n(x - 64)},${n(py - 6)} M${n(x)},${n(y)} L${n(x)},${n(py - 10)} M${n(x)},${n(y)} L${n(x + 64)},${n(py - 6)}" stroke="${INK}" stroke-width="3" stroke-dasharray="7 4"/>`;
      s += `<g transform="translate(${n(x)} ${n(py)})">${sd < 0 ? (o.left || '') : (o.right || '')}</g>`;
      s += cel(a => `<path d="M${n(x - 74)},${n(py - 6)} Q${n(x)},${n(py + 42)} ${n(x + 74)},${n(py - 6)} Z" ${a}/>`, C.bronze, C.bronzeS, 0, -0.2, 74);
    }
    s += `<path d="M${n(ex(-1))},${n(ey(-1))} L${n(ex(1))},${n(ey(1))}" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M${n(ex(-1))},${n(ey(-1))} L${n(ex(1))},${n(ey(1))}" stroke="${C.bronze}" stroke-width="11" stroke-linecap="round"/>`;
    s += `<circle cx="0" cy="${top}" r="18" fill="${C.goldL}" ${ink()}/><path d="M0,${top - 18} L0,${top - 50}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`;
    return `<g transform="scale(${o.s || 1})">${s}</g>`;
  }

  // anvil – dark iron anvil on a stump. Origin: ground. hammer – origin: the grip end, head points up (-y); o.angle rotates it.
  function anvil(o = {}) {
    return `<g transform="scale(${o.s || 1})">${cel(a => `<path d="M-60,0 L60,0 L50,-110 L-50,-110 Z" ${a}/>`, '#8a5a36', '#6b4226', -0.1, 0, 60)}
      <ellipse cx="0" cy="-110" rx="50" ry="12" fill="#a8743f" ${ink()}/>
      ${cel(a => `<path d="M-120,-150 Q-60,-150 -40,-178 L110,-178 L110,-140 L60,-140 L40,-112 L-40,-112 L-56,-138 Q-90,-136 -120,-150 Z" ${a}/>`, '#55505a', '#38343e', -0.06, -0.15, 120)}
      <path d="M-30,-172 L100,-172" stroke="#8d8896" stroke-width="5" stroke-linecap="round"/></g>`;
  }
  function hammer(o = {}) {
    return `<g transform="rotate(${o.angle || 0}) scale(${o.s || 1})"><path d="M0,0 L0,-150" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M0,0 L0,-150" stroke="${C.wood}" stroke-width="11" stroke-linecap="round"/>
      ${cel(a => `<rect x="-44" y="-186" width="88" height="44" rx="8" ${a}/>`, '#55505a', '#38343e', -0.1, -0.15, 44)}</g>`;
  }

  // flame – a flickering flame shape. Origin: its base. f = frame, size, magic (white-gold)
  function flame(f, size = 1, magic = false, seed = 0) {
    const w = 46 * size, h = 120 * size, j = k => Math.sin((f + seed * 17) / (2.3 + k * 0.7)) * 0.12;
    const outer = magic ? '#ffd76a' : '#f08a3c', mid = magic ? '#fff1b0' : '#ffb04a', core = magic ? '#ffffff' : '#ffe48a';
    const sh = (s, c) => `<path d="M${n(-w * s)},0 Q${n(-w * s * 1.2)},${n(-h * s * 0.5)} ${n(-w * s * 0.3)},${n(-h * s * (0.8 + j(1)))} Q${n(-w * s * 0.1)},${n(-h * s * 0.55)} 0,${n(-h * s * (1 + j(2)))} Q${n(w * s * 0.25)},${n(-h * s * 0.6)} ${n(w * s * 0.4)},${n(-h * s * (0.78 + j(3)))} Q${n(w * s * 1.2)},${n(-h * s * 0.45)} ${n(w * s)},0 Z" fill="${c}"/>`;
    return `<g>${sh(1, outer).replace('/>', ` ${ink(SW * 0.9)}/>`)}${sh(0.68, mid)}${sh(0.38, core)}</g>`;
  }
  // torch – wooden torch with a living flame. Origin: the bottom of the handle (hold it at y -40). o: f, s, angle
  function torch(o = {}) {
    const f = o.f || 0;
    return `<g transform="rotate(${o.angle || 0}) scale(${o.s || 1})"><path d="M0,0 L0,-170" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M0,0 L0,-170" stroke="${C.woodS}" stroke-width="11" stroke-linecap="round"/>
      <path d="M-16,-150 L16,-150 L20,-196 L-20,-196 Z" fill="#6b4a32" ${ink()}/><path d="M-18,-166 L18,-170 M-19,-182 L19,-186" stroke="#4a3022" stroke-width="4"/>
      <circle cx="0" cy="-250" r="60" fill="#ffb04a" opacity="0.18"/><g transform="translate(0 -192)">${flame(f, 0.7, false, o.seed || 1)}</g></g>`;
  }
  // fire – campfire / hearth fire with logs. Origin: ground, centre. o: f (frame), s, magic (golden fire with sparkles – Thetis'
  // trick on the baby), logs (true), glow (true)
  function fire(o = {}) {
    const f = o.f || 0, m = !!o.magic, gid = nid('fg');
    let s = '';
    if (o.glow !== false) s += `<defs><radialGradient id="${gid}"><stop offset="0" stop-color="${m ? '#fff0b0' : '#ffb04a'}" stop-opacity="0.55"/><stop offset="1" stop-color="${m ? '#fff0b0' : '#ffb04a'}" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="0" cy="-90" rx="${n(300 + Math.sin(f / 5) * 12)}" ry="${n(240 + Math.sin(f / 5) * 10)}" fill="url(#${gid})"/>`;
    if (o.logs !== false) s += `<g transform="rotate(-14)"><rect x="-110" y="-26" width="200" height="30" rx="14" fill="#6b4a32" ${ink()}/></g><g transform="rotate(14)"><rect x="-90" y="-26" width="200" height="30" rx="14" fill="#5a3a26" ${ink()}/></g>
      <circle cx="-100" cy="-14" r="10" fill="#c08a52" ${ink(2.5)}/><circle cx="104" cy="-14" r="10" fill="#c08a52" ${ink(2.5)}/>`;
    s += `<g transform="translate(-44 -12)">${flame(f, 0.75, m, 1)}</g><g transform="translate(46 -12)">${flame(f, 0.8, m, 2)}</g><g transform="translate(0 -10)">${flame(f, 1.15, m, 3)}</g>`;
    if (m) for (let i = 0; i < 9; i++) { const t = ((f / 40) + rnd(i)) % 1, x = (rnd(i + 3) - 0.5) * 220, y = -40 - t * 200, z = 5 + rnd(i + 5) * 6;
      s += `<path transform="translate(${n(x)} ${n(y)}) scale(${n((1 - t) * 1.2)})" d="M0,${-z * 2} L${z * 0.5},${-z * 0.5} L${z * 2},0 L${z * 0.5},${z * 0.5} L0,${z * 2} L${-z * 0.5},${z * 0.5} L${-z * 2},0 L${-z * 0.5},${-z * 0.5} Z" fill="#fffbe6" opacity="${n(1 - t)}"/>`; }
    else for (let i = 0; i < 6; i++) { const t = ((f / 30) + rnd(i)) % 1; s += `<circle cx="${n((rnd(i + 2) - 0.5) * 120 + Math.sin(f / 6 + i) * 10)}" cy="${n(-80 - t * 180)}" r="${n(4 * (1 - t) + 1)}" fill="#ffd36b" opacity="${n(1 - t)}"/>`; }
    return `<g transform="scale(${o.s || 1})">${s}</g>`;
  }
  // candle – a candle in a small holder (Peleus at night). Origin: bottom of the holder. o: f, s
  function candle(o = {}) {
    const f = o.f || 0;
    return `<g transform="scale(${o.s || 1})"><circle cx="0" cy="-110" r="70" fill="#ffd36b" opacity="0.18"/>
      <path d="M-40,0 Q0,12 40,0 L30,-14 L-30,-14 Z" fill="${C.bronze}" ${ink()}/><path d="M40,-6 q26,0 22,-24 q-4,-14 -16,-6" fill="none" ${ink(6)}/>
      <rect x="-14" y="-74" width="28" height="62" rx="5" fill="#f6eedd" ${ink()}/><path d="M0,-74 L0,-84" stroke="${INK}" stroke-width="3"/>
      <g transform="translate(0 -82)">${flame(f, 0.24, false, 4)}</g></g>`;
  }

  // vasePainting – a black-figure frieze (old heroes on a vase). Origin: centre. o: w (900), h (300), slots (4), empty (index of
  // an EMPTY slot: a dashed outline with "?"), kinds (list of 'lion'|'winged'|'spear'|'archer')
  function bfFigure(kind) {
    const k = INK, inc = '#c8662e';
    const legs = `<path d="M-6,-92 L-38,0 M6,-92 L34,0" stroke="${k}" stroke-width="16" stroke-linecap="round"/>`;
    const torso = `<path d="M-22,-96 L22,-96 L26,-160 L-26,-160 Z" fill="${k}"/><circle cx="4" cy="-182" r="20" fill="${k}"/>`;
    let s = legs + torso;
    if (kind === 'lion') s += `<path d="M-30,-200 Q-6,-214 18,-198 L22,-170 Q-10,-150 -52,-96 Q-44,-150 -30,-200 Z" fill="${k}"/><path d="M-20,-200 l-6,-12 l10,4 Z M6,-204 l2,-14 l8,10 Z" fill="${k}"/>
      <path d="M22,-150 L48,-128 L76,-214" stroke="${k}" stroke-width="12" stroke-linecap="round"/><path d="M70,-196 L84,-232" stroke="${k}" stroke-width="22" stroke-linecap="round"/>
      <path d="M-14,-140 L14,-140 M-12,-120 L12,-120" stroke="${inc}" stroke-width="2.5"/>`;
    if (kind === 'winged') s += `<path d="M-20,-198 L30,-198 L22,-188 L-14,-188 Z" fill="${k}"/><path d="M22,-150 L52,-176 M-22,-150 L-48,-120" stroke="${k}" stroke-width="12" stroke-linecap="round"/>
      <path d="M52,-176 Q74,-206 60,-222 Q58,-200 46,-190" fill="none" stroke="${k}" stroke-width="7"/>
      <path d="M-40,-8 l-20,-14 l18,2 l-14,-16 l22,12 Z M34,-8 l-22,-12 l18,0 l-12,-16 l22,12 Z" fill="${k}"/><circle cx="-56" cy="-114" r="13" fill="${k}"/>`;
    if (kind === 'spear') s += `<path d="M-14,-206 Q6,-232 30,-206 Q6,-214 -14,-206 Z" fill="${k}"/><circle cx="-30" cy="-128" r="40" fill="${k}"/><circle cx="-30" cy="-128" r="28" fill="none" stroke="${inc}" stroke-width="3"/>
      <path d="M20,-150 L38,-110 M58,-240 L30,20" stroke="${k}" stroke-width="10" stroke-linecap="round"/><path d="M58,-262 L66,-238 L50,-238 Z" fill="${k}"/>`;
    if (kind === 'archer') s += `<path d="M22,-150 L70,-150 M22,-140 L40,-148" stroke="${k}" stroke-width="10" stroke-linecap="round"/><path d="M70,-220 Q110,-150 70,-80" fill="none" stroke="${k}" stroke-width="7"/>
      <path d="M70,-220 L40,-150 L70,-80" fill="none" stroke="${k}" stroke-width="2"/><path d="M-18,-204 L-6,-226 L8,-204 Z" fill="${k}"/>`;
    return s;
  }
  function vasePainting(o = {}) {
    const w = o.w || 900, h = o.h || 300, N = o.slots || 4, kinds = o.kinds || ['lion', 'winged', 'spear', 'archer'];
    let s = `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="10" fill="#c8662e" ${ink(5)}/>`;
    s += `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="34" fill="${INK}"/><rect x="${-w / 2}" y="${h / 2 - 30}" width="${w}" height="30" fill="${INK}"/>`;
    for (let x = -w / 2 + 6; x < w / 2 - 20; x += 30) s += `<path d="M${x},${-h / 2 + 28} L${x},${-h / 2 + 8} L${x + 20},${-h / 2 + 8} L${x + 20},${-h / 2 + 22} L${x + 8},${-h / 2 + 22} L${x + 8},${-h / 2 + 16}" fill="none" stroke="#c8662e" stroke-width="3.5"/>`;
    for (let x = -w / 2 + 14; x < w / 2; x += 26) s += `<path d="M${x},${h / 2 - 30} q8,22 16,0" fill="#c8662e"/>`;
    const gy = h / 2 - 40, sc = (h - 90) / 250;
    for (let i = 0; i < N; i++) {
      const x = -w / 2 + (i + 0.5) * (w / N);
      if (o.empty === i) s += `<g transform="translate(${n(x)} ${gy}) scale(${n(sc)})"><path d="M-36,0 L-6,-92 L-26,-160 Q4,-176 26,-160 L6,-92 L34,0" fill="none" stroke="#f3dcb2" stroke-width="7" stroke-dasharray="14 10" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="4" cy="-188" r="24" fill="none" stroke="#f3dcb2" stroke-width="7" stroke-dasharray="12 9"/>${word(4, -70, 90, '?', { fill: '#f3dcb2', sw: 0 })}</g>`;
      else s += `<g transform="translate(${n(x)} ${gy}) scale(${n(sc)})">${bfFigure(kinds[i % kinds.length])}</g>`;
    }
    s += `<path d="M${-w / 2 + 20},${gy + 2} L${w / 2 - 20},${gy + 2}" stroke="${INK}" stroke-width="4"/>`;
    return s;
  }

  // scrollDoc – parchment document with rollers, a title and handwritten lines (the offer, the deal, names …). Origin: centre.
  // o: w (460), h (560), unroll 0..1, title, lines [...], reveal (lines shown; a fraction types the next line letter by letter),
  // size (line font size 34), titleCol, paper
  function scrollDoc(o = {}) {
    const w = o.w || 460, h = o.h || 560, u = o.unroll ?? 1, hh = Math.max(10, h * easeOut(u)), cid = nid('sd');
    const lines = o.lines || [], rv = o.reveal ?? lines.length, fs = o.size || 34, lh = fs * 1.55;
    let body = o.title ? `<text x="0" y="${n(-h / 2 + 82)}" ${SERIF} font-weight="700" font-size="${n(fs * 1.45)}" text-anchor="middle" fill="${o.titleCol || '#7a2f1e'}" letter-spacing="3">${o.title}</text>
      <path d="M${-w / 2 + 50},${n(-h / 2 + 104)} L${w / 2 - 50},${n(-h / 2 + 104)}" stroke="#a5865a" stroke-width="3"/>` : '';
    lines.forEach((L, i) => {
      if (i >= Math.ceil(rv)) return;
      const str = i < Math.floor(rv) ? L : L.slice(0, Math.round(L.length * (rv - Math.floor(rv))));
      body += `<text x="${-w / 2 + 50}" y="${n(-h / 2 + (o.title ? 160 : 80) + i * lh)}" ${HAND} font-size="${fs}" fill="#3a2a1e">${str}</text>`;
    });
    return `<defs><clipPath id="${cid}"><rect x="${-w / 2}" y="${n(-hh / 2)}" width="${w}" height="${n(hh)}"/></clipPath></defs>
      <rect x="${-w / 2}" y="${n(-hh / 2)}" width="${w}" height="${n(hh)}" fill="${o.paper || '#f1e2bf'}" ${ink(5)}/>
      <rect x="${-w / 2 + 14}" y="${n(-hh / 2 + 6)}" width="${w - 28}" height="${n(Math.max(0, hh - 12))}" fill="none" stroke="#d9c49a" stroke-width="3"/>
      <g clip-path="url(#${cid})">${body}</g>
      <rect x="${-w / 2 - 22}" y="${n(-hh / 2 - 26)}" width="${w + 44}" height="34" rx="17" fill="#c9a46c" ${ink(5)}/>
      <rect x="${-w / 2 - 22}" y="${n(hh / 2 - 8)}" width="${w + 44}" height="34" rx="17" fill="#c9a46c" ${ink(5)}/>`;
  }
  // quill – feather pen. Origin: the nib tip, feather goes up-right. o: angle, s
  function quill(o = {}) {
    return `<g transform="rotate(${o.angle || 0}) scale(${o.s || 1})">
      ${cel(a => `<path d="M14,-34 Q60,-150 170,-250 Q150,-150 74,-74 Q46,-48 14,-34 Z" ${a}/>`, '#fbf5e8', '#ddd2bd', -0.1, 0.05, 120)}
      <path d="M14,-34 Q90,-140 170,-250" fill="none" stroke="#b9ab92" stroke-width="4"/>
      ${[0.3, 0.45, 0.6, 0.75].map(t => `<path d="M${n(14 + t * 156)},${n(-34 - t * 216)} l${n(-22 + t * 8)},${n(18 - t * 4)}" stroke="#cfc3ad" stroke-width="3"/>`).join('')}
      <path d="M0,0 L22,-40 L6,-42 Z" fill="#3a2a22" ${ink(2.5)}/></g>`;
  }
  // laurel – a wreath, open at the top, tied at the bottom. Origin: centre. o: R (120), gold (golden leaves)
  function laurel(o = {}) {
    const R = o.R || 120, col = o.gold ? '#f2c552' : '#6f9a4a', colS = o.gold ? '#c48d22' : '#4f7a34';
    let s = '';
    for (const sd of [-1, 1]) {
      s += `<path d="M${n(sd * 6)},${n(R)} A${R},${R} 0 0 ${sd > 0 ? 0 : 1} ${n(sd * R * 0.5)},${n(-R * 0.86)}" fill="none" stroke="${colS}" stroke-width="6"/>`;
      for (let i = 0; i < 9; i++) { const a = Math.PI / 2 - sd * (i / 9) * Math.PI * 0.82 - sd * 0.12, x = Math.cos(a) * R, y = Math.sin(a) * R, deg = a / D2R + (sd > 0 ? -60 : 60);
        s += `<ellipse cx="${n(x + Math.cos(a) * 14)}" cy="${n(y + Math.sin(a) * 14)}" rx="22" ry="10" transform="rotate(${n(deg)} ${n(x + Math.cos(a) * 14)} ${n(y + Math.sin(a) * 14)})" fill="${col}" ${ink(2.5)}/>
          <ellipse cx="${n(x - Math.cos(a) * 12)}" cy="${n(y - Math.sin(a) * 12)}" rx="20" ry="9" transform="rotate(${n(deg + (sd > 0 ? 80 : -80))} ${n(x - Math.cos(a) * 12)} ${n(y - Math.sin(a) * 12)})" fill="${colS}" ${ink(2.5)}/>`; }
    }
    s += `<path d="M-20,${R + 6} Q0,${R - 10} 20,${R + 6} M0,${R} L-18,${R + 40} M0,${R} L18,${R + 40}" fill="none" stroke="#c8302a" stroke-width="9" stroke-linecap="round"/>`;
    return s;
  }
  // cradle – an empty wooden rocking cradle. Origin: ground. o: q (a big "?" above it), rock (degrees)
  function cradle(o = {}) {
    // side view: rockers, a tall head post, a lower foot post, a slatted box between them, a pillow and a blanket edge
    let s = `<path d="M-168,-30 Q0,22 168,-30" fill="none" stroke="${INK}" stroke-width="24" stroke-linecap="round"/><path d="M-168,-30 Q0,22 168,-30" fill="none" stroke="${C.woodS}" stroke-width="13" stroke-linecap="round"/>`;
    s += `<rect x="-142" y="-262" width="26" height="250" rx="10" fill="${C.wood}" ${ink()}/><circle cx="-129" cy="-270" r="18" fill="${C.wood}" ${ink()}/>`;
    s += `<rect x="116" y="-210" width="26" height="198" rx="10" fill="${C.wood}" ${ink()}/><circle cx="129" cy="-218" r="16" fill="${C.wood}" ${ink()}/>`;
    s += cel(a => `<path d="M-120,-196 L120,-180 L116,-58 Q0,-40 -116,-58 Z" ${a}/>`, C.wood, C.woodS, -0.08, -0.05, 120);
    for (let x = -90; x <= 90; x += 30) s += `<path d="M${x},${-190 + (x + 120) * 0.066} L${x},-56" stroke="${C.woodS}" stroke-width="6" stroke-linecap="round"/>`;
    s += `<path d="M-120,-196 L120,-180" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M-120,-196 L120,-180" stroke="${C.wood}" stroke-width="5" stroke-linecap="round"/>`;
    s += `<ellipse cx="-80" cy="-200" rx="40" ry="18" fill="#f6eedd" ${ink()}/>`;
    s += `<path d="M-36,-204 Q10,-220 60,-196 Q90,-188 112,-186 L112,-170 Q40,-176 -36,-186 Z" fill="#9cc3e0" ${ink()}/><path d="M-30,-196 Q30,-204 100,-182" fill="none" stroke="#78a3c4" stroke-width="4"/>`;
    s = `<g transform="rotate(${o.rock || 0} 0 0)">${s}</g>`;
    if (o.q) s += word(0, -250, 130, '?', { fill: '#fff', sw: 18 });
    return `<g transform="scale(${o.s || 1})">${s}</g>`;
  }
  // pauseIcon – white disc with two bars. Origin: centre. o: r (110)
  function pauseIcon(o = {}) {
    const r = o.r || 110;
    return `<circle r="${r}" fill="#fff" opacity="0.92" ${ink(8)}/><rect x="${n(-r * 0.36)}" y="${n(-r * 0.42)}" width="${n(r * 0.24)}" height="${n(r * 0.84)}" rx="${n(r * 0.06)}" fill="${INK}"/>
      <rect x="${n(r * 0.12)}" y="${n(-r * 0.42)}" width="${n(r * 0.24)}" height="${n(r * 0.84)}" rx="${n(r * 0.06)}" fill="${INK}"/>`;
  }

  // mapGreece – parchment map of the Aegean (Greece left, Asia right, Troy in the north-east). Origin: centre, 1100 x 720.
  // o: labels (true), wrongLabel (text at the wrong country). Anchors in map units: PROPS.MAP.aulis / troy / mysia.
  const MAP = { aulis: [-212, -46], troy: [388, -214], mysia: [398, 44] };
  function mapGreece(o = {}) {
    const cid = nid('mp');
    const edge = []; const W = 550, H = 360;
    for (let i = 0; i <= 24; i++) edge.push([-W + i * (2 * W / 24), -H + (rnd(i) - 0.5) * 10]);
    for (let i = 1; i <= 14; i++) edge.push([W + (rnd(i + 40) - 0.5) * 10, -H + i * (2 * H / 14)]);
    for (let i = 1; i <= 24; i++) edge.push([W - i * (2 * W / 24), H + (rnd(i + 80) - 0.5) * 10]);
    for (let i = 1; i < 14; i++) edge.push([-W + (rnd(i + 120) - 0.5) * 10, H - i * (2 * H / 14)]);
    const ep = 'M' + edge.map(([x, y]) => `${n(x)},${n(y)}`).join(' L') + ' Z';
    const land = '#ead3a0', landS = '#cfae76';
    const poly = pts => 'M' + pts.map(p => p.join(',')).join(' L') + ' Z';
    const north = poly([[-560, -370], [560, -370], [560, -318], [470, -300], [410, -282], [356, -266], [330, -258], [296, -270], [236, -250], [168, -262], [108, -238], [40, -250], [-20, -232], [-80, -250], [-120, -214], [-138, -168], [-160, -214], [-190, -176], [-206, -224], [-256, -218], [-300, -188], [-284, -128], [-252, -82], [-224, -44], [-244, 0], [-200, 40], [-232, 72], [-292, 62], [-332, 92], [-300, 120], [-262, 150], [-250, 212], [-292, 252], [-312, 306], [-352, 252], [-384, 304], [-424, 248], [-444, 180], [-474, 150], [-560, 140]]);
    const asia = poly([[560, -300], [430, -270], [384, -250], [362, -222], [342, -172], [352, -120], [322, -82], [346, -40], [330, 2], [362, 30], [342, 80], [372, 122], [350, 172], [382, 222], [360, 272], [400, 322], [560, 340]]);
    const euboea = poly([[-262, -112], [-204, -82], [-150, -42], [-128, -18], [-162, -24], [-212, -56], [-258, -92]]);
    const crete = poly([[-170, 330], [-60, 316], [60, 324], [150, 312], [172, 334], [60, 346], [-60, 342], [-170, 350]]);
    const isles = [[-120, 140, 22, 14], [-60, 172, 16, 11], [-30, 108, 18, 12], [20, 192, 20, 12], [-92, 232, 14, 10], [40, 244, 16, 10], [84, 150, 15, 11], [150, -168, 26, 16], [272, -36, 40, 28], [292, 62, 22, 30], [300, 168, 26, 14]];
    let s = `<defs><clipPath id="${cid}"><path d="${ep}"/></clipPath></defs>`;
    s += `<path d="${ep}" fill="#bcd3c6" ${ink(6)}/><g clip-path="url(#${cid})">`;
    for (let i = 0; i < 9; i++) s += `<path d="M${-500 + i * 120},${-40 + (i % 3) * 90} q14,-10 28,0 q14,10 28,0" fill="none" stroke="#9dbcae" stroke-width="3"/>`;
    for (const d of [north, asia, euboea, crete]) s += `<path d="${d}" fill="${land}" ${ink(4)}/><path d="${d}" fill="none" stroke="${landS}" stroke-width="10" opacity="0.55" transform="translate(4 5)"/>`;
    for (const [x, y, rx, ry] of isles) s += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${land}" ${ink(3)}/>`;
    // hills and a compass
    for (const [x, y] of [[-420, -250], [-380, -120], [-360, 190], [460, -120], [470, 80], [450, 230], [-90, -300], [200, -310]]) s += `<path d="M${x - 22},${y + 10} L${x},${y - 14} L${x + 22},${y + 10}" fill="none" stroke="#a5865a" stroke-width="4" stroke-linejoin="round"/>`;
    s += `<g transform="translate(-478 270)"><circle r="44" fill="none" stroke="#7a5a3a" stroke-width="3"/><path d="M0,-56 L10,0 L0,56 L-10,0 Z" fill="#7a5a3a"/><path d="M-56,0 L0,-8 L56,0 L0,8 Z" fill="#a5865a"/>
      <text y="-62" ${SERIF} font-size="22" font-weight="700" text-anchor="middle" fill="#7a5a3a">N</text></g>`;
    s += `<text x="40" y="40" ${SERIF} font-style="italic" font-size="30" text-anchor="middle" fill="#5f8576" letter-spacing="10">AEGEAN SEA</text>`;
    s += `<g transform="translate(${MAP.troy[0]} ${MAP.troy[1] + 26}) scale(0.62)">${cityIcon()}</g>`;
    if (o.labels !== false) s += `<text x="-420" y="-30" ${SERIF} font-weight="700" font-size="52" text-anchor="middle" fill="#5a3a26" letter-spacing="6">GREECE</text>
      <text x="${MAP.troy[0] + 20}" y="${MAP.troy[1] - 52}" ${SERIF} font-weight="700" font-size="46" text-anchor="middle" fill="#7a2f1e" letter-spacing="4">TROY</text>`;
    if (o.wrongLabel) s += `<text x="${MAP.mysia[0] - 46}" y="${MAP.mysia[1] + 76}" ${SERIF} font-weight="700" font-size="30" text-anchor="end" fill="#7a2f1e">${o.wrongLabel}</text>`;
    s += `</g><path d="${ep}" fill="none" ${ink(6)}/>`;
    return s;
  }
  // the route the fleet takes: a dotted line that draws itself (t 0..1) with a little ship at its head.
  // o: wrong (swerve down to the wrong country instead of Troy), t, col. routePoint(t, wrong) gives the head position.
  function routeBez(wrong) { return wrong ? [MAP.aulis, [60, -250], [470, -230], MAP.mysia] : [MAP.aulis, [0, -210], [250, -270], MAP.troy]; }
  function routePoint(t, wrong) {
    const [p0, p1, p2, p3] = routeBez(wrong), u = 1 - t;
    return [0, 1].map(k => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]);
  }
  function mapRoute(o = {}) {
    const t = clamp(o.t ?? 1), col = o.col || '#7a2f1e';
    let s = '', prev = routePoint(0, o.wrong), acc = 0;
    for (let i = 1; i <= 160; i++) {
      const q = i / 160; if (q > t) break;
      const p = routePoint(q, o.wrong); acc += Math.hypot(p[0] - prev[0], p[1] - prev[1]); prev = p;
      if (acc >= 20) { acc = 0; s += `<circle cx="${n(p[0])}" cy="${n(p[1])}" r="6" fill="${col}"/>`; }
    }
    if (t > 0 && t < 1 || o.ship) {
      const p = routePoint(t, o.wrong), p2 = routePoint(Math.max(0, t - 0.02), o.wrong), a = Math.atan2(p[1] - p2[1], p[0] - p2[0]) / D2R;
      s += `<g transform="translate(${n(p[0])} ${n(p[1])}) rotate(${n(a)})"><path d="M-22,0 Q0,16 24,0 L18,-4 L-18,-4 Z" fill="#6b4a32" ${ink(3)}/><path d="M0,-4 L0,-34 M-14,-30 L14,-30 L12,-10 L-12,-10 Z" fill="#f4e5c6" ${ink(3)}/></g>`;
    }
    return s;
  }
  // xMark – a red X that draws on (t 0..1). Origin: centre. o: size (60)
  function xMark(o = {}) {
    const z = o.size || 60, t = clamp(o.t ?? 1), a = clamp(t * 2), b = clamp(t * 2 - 1);
    const st = (x1, y1, x2, y2, p) => p <= 0 ? '' : `<path d="M${x1},${y1} L${n(lerp(x1, x2, p))},${n(lerp(y1, y2, p))}" stroke="${INK}" stroke-width="${z * 0.3 + 7}" stroke-linecap="round"/><path d="M${x1},${y1} L${n(lerp(x1, x2, p))},${n(lerp(y1, y2, p))}" stroke="#e2433a" stroke-width="${z * 0.3}" stroke-linecap="round"/>`;
    return st(-z / 2, -z / 2, z / 2, z / 2, a) + st(z / 2, -z / 2, -z / 2, z / 2, b);
  }

  // talliesStone – a stone slab with scratched tally marks. Origin: centre. o: count, grow 0..1 (the newest mark scratching in),
  // w (520), h (240), label (carved word above the marks, e.g. 'YEARS')
  function talliesStone(o = {}) {
    const w = o.w || 520, h = o.h || 240, N = o.count || 0, gr = o.grow ?? 1;
    let s = cel(a => `<path d="M${-w / 2 + 20},${-h / 2} Q0,${-h / 2 - 16} ${w / 2 - 16},${-h / 2 + 6} Q${w / 2 + 8},0 ${w / 2 - 10},${h / 2 - 8} Q0,${h / 2 + 12} ${-w / 2 + 12},${h / 2 - 4} Q${-w / 2 - 10},0 ${-w / 2 + 20},${-h / 2} Z" ${a}/>`, '#a39e98', '#827d78', -0.08, -0.12, w / 2);
    for (let i = 0; i < 14; i++) s += `<circle cx="${n((rnd(i) - 0.5) * w * 0.85)}" cy="${n((rnd(i + 9) - 0.5) * h * 0.8)}" r="${n(3 + rnd(i + 4) * 5)}" fill="#8f8a84" opacity="0.6"/>`;
    if (o.label) s += `<text x="0" y="${n(-h / 2 + 58)}" ${SERIF} font-weight="700" font-size="40" text-anchor="middle" fill="#5f5a55" letter-spacing="8">${o.label}</text>`;
    const y0 = o.label ? -h / 2 + 90 : -h / 2 + 50, y1 = h / 2 - 40;
    let x = -w / 2 + 60;
    for (let i = 0; i < N; i++) {
      const p = i === N - 1 ? clamp(gr) : 1, g = Math.floor(i / 5), k = i % 5;
      if (k === 4) { const xa = x - 4 * 26 - 12, xb = x + 6; s += `<path d="M${xa},${y1 - 10} L${n(lerp(xa, xb, p))},${n(lerp(y1 - 10, y0 + 14, p))}" stroke="#4e4a46" stroke-width="10" stroke-linecap="round"/><path d="M${xa},${y1 - 10} L${n(lerp(xa, xb, p))},${n(lerp(y1 - 10, y0 + 14, p))}" stroke="#f3eee2" stroke-width="6" stroke-linecap="round"/>`; x += 44; }
      else { s += `<path d="M${x},${y0} L${x + 3},${n(lerp(y0, y1, p))}" stroke="#4e4a46" stroke-width="10" stroke-linecap="round"/><path d="M${x},${y0} L${x + 3},${n(lerp(y0, y1, p))}" stroke="#f3eee2" stroke-width="6" stroke-linecap="round"/>`; x += 26; }
    }
    return s;
  }
  // banner – a cloth banner that unrolls from the left (u 0..1). Origin: centre. o: w (900), h (130), text, u, col, textCol, size
  function banner(o = {}) {
    const w = o.w || 900, h = o.h || 130, u = clamp(o.u ?? 1), cid = nid('bn'), col = o.col || C.teal, colS = o.colS || C.tealS;
    const x0 = -w / 2, x1 = x0 + w * easeOut(u);
    let s = `<defs><clipPath id="${cid}"><rect x="${x0 - 60}" y="${-h}" width="${n(x1 - x0 + 60)}" height="${h * 2}"/></clipPath></defs><g clip-path="url(#${cid})">`;
    s += `<path d="M${x0},${-h / 2} L${w / 2},${-h / 2} L${w / 2 + 50},0 L${w / 2},${h / 2} L${x0},${h / 2} L${x0 - 50},0 Z" fill="${col}" ${ink(5)}/>
      <path d="M${x0 + 10},${-h / 2 + 14} L${w / 2 - 10},${-h / 2 + 14} M${x0 + 10},${h / 2 - 14} L${w / 2 - 10},${h / 2 - 14}" stroke="${C.gold}" stroke-width="7"/>
      ${word(0, h * 0.17, o.size || h * 0.46, o.text || '', { fill: o.textCol || '#fff' })}</g>`;
    if (u < 1) s += `<rect x="${n(x1 - 16)}" y="${-h / 2 - 12}" width="32" height="${h + 24}" rx="14" fill="${colS}" ${ink(5)}/>`;
    return s;
  }

  // speedLines – horizontal motion streaks. Origin: top-left of the area. o: w, h, n (count), f (flicker), col, dir (1 = lines trail to the left)
  function speedLines(o = {}) {
    const w = o.w || 400, h = o.h || 200, N = o.n || 7, f = o.f || 0, col = o.col || '#fff';
    let s = '';
    for (let i = 0; i < N; i++) { const y = (i + 0.5) / N * h, L = w * (0.4 + 0.6 * rnd(i + Math.floor(f / 3) * 7)), x = (w - L) * rnd(i + 3);
      s += `<path d="M${n(x)},${n(y)} L${n(x + L)},${n(y)}" stroke="${col}" stroke-width="${n(5 + rnd(i) * 6)}" stroke-linecap="round" opacity="${n(0.45 + rnd(i + 1) * 0.4)}"/>`; }
    return s;
  }
  // dustCloud – puffs that spread and fade. Origin: ground centre. o: t 0..1 (life), w (spread), r (puff size), col, seed
  function dustCloud(o = {}) {
    const t = clamp(o.t ?? 0.4), w = o.w || 260, r0 = o.r || 40, col = o.col || '#eadcbf', sd = o.seed || 0;
    if (t >= 1) return '';
    let s = '';
    for (let i = 0; i < 9; i++) { const a = rnd(i + sd), b = rnd(i + 11 + sd);
      s += `<circle cx="${n((a - 0.5) * w * (0.5 + t))}" cy="${n(-r0 * 0.6 - b * r0 * 2.2 * (0.3 + t))}" r="${n(r0 * (0.5 + t * 0.9) * (0.6 + b * 0.6))}" fill="${col}" opacity="${n((1 - t) * 0.85)}"/>`; }
    return s;
  }
  // fightCloud – a cartoon scuffle: a big cloud with arms, feet, stars (and the apple) poking out. Origin: centre. o: R (260),
  // f (frame – jiggle), sleeves (colours of the arms poking out), apple (true: the golden apple pops out at the top)
  function fightCloud(o = {}) {
    const R = o.R || 260, f = o.f || 0, sleeves = o.sleeves || ['#5b7fc7', '#9a9fa8', '#f0a8bf'];
    const jit = i => Math.sin(f / 2.2 + i * 1.7);
    let s = '';
    const pokes = [];
    for (let i = 0; i < 9; i++) pokes.push({ a: (i / 9) * TAU + 0.3 + jit(i) * 0.18, k: i % 3, type: ['arm', 'star', 'foot', 'arm', 'arm', 'star', 'foot', 'arm', 'star'][i] });
    for (const p of pokes) {
      const x = Math.cos(p.a) * R * 0.9, y = Math.sin(p.a) * R * 0.68, deg = p.a / D2R, out = 70 + jit(p.k) * 18;
      const sl = sleeves[p.k % sleeves.length];
      if (p.type === 'arm') s += `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(deg)})">${limb(-40, 0, out, 0, 32, sl, sl)}${hand(out + 16, 0, 19)}</g>`;
      if (p.type === 'foot') s += `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(deg)})">${limb(-40, 0, out - 6, 0, 28, C.skin, C.skinS)}<path d="M${n(out - 8)},-20 Q${n(out + 30)},-18 ${n(out + 30)},6 Q${n(out + 14)},22 ${n(out - 8)},18 Z" fill="${C.leather}" ${ink()}/></g>`;
      if (p.type === 'star') { const z = 24 + 6 * jit(p.k); s += `<path transform="translate(${n(x * 1.22)} ${n(y * 1.3)}) rotate(${n(f * 3)})" d="M0,${-z} L${z * 0.3},${-z * 0.3} L${z},0 L${z * 0.3},${z * 0.3} L0,${z} L${-z * 0.3},${z * 0.3} L${-z},0 L${-z * 0.3},${-z * 0.3} Z" fill="#f6d35b" ${ink(3)}/>`; }
    }
    // motion scribbles round the edge
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + 0.6 + f * 0.05, x = Math.cos(a) * R * 1.12, y = Math.sin(a) * R * 0.86;
      s += `<path transform="translate(${n(x)} ${n(y)}) rotate(${n(a / D2R + 90)})" d="M-22,0 q11,-12 22,0 q11,12 22,0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" opacity="0.7"/>`; }
    if (o.apple) s += `<g transform="translate(${n(jit(5) * 12)} ${n(-R * 0.78)})">${goldenApple({ r: 36 })}</g>`;
    const list = [];
    for (let i = 0; i < 14; i++) { const a = i / 14 * TAU, rr = R * (0.26 + 0.05 * Math.sin(i * 2.1 + f / 3)); list.push([Math.cos(a) * R * 0.74, Math.sin(a) * R * 0.48, rr]); }
    list.push([0, 0, R * 0.62]);
    s += puffs(list, '#fbf4e6', SW * 1.4);
    for (let i = 0; i < 4; i++) s += `<path d="M${n(-R * 0.4 + i * R * 0.27)},${n(-R * 0.1 + (i % 2) * 30)} q14,-18 28,0" fill="none" stroke="#d9cdb4" stroke-width="6" stroke-linecap="round"/>`;
    return s;
  }
  // shockRing – an expanding ring (a scream, a stamp, a boom). Origin: centre. o: t 0..1, r0, r1, col, w
  function shockRing(o = {}) {
    const t = clamp(o.t ?? 0.5), r = lerp(o.r0 || 40, o.r1 || 600, easeOut(t)), w = (o.w || 22) * (1 - t * 0.7), col = o.col || '#fff4d6';
    if (t >= 1) return '';
    let s = `<circle r="${n(r)}" fill="none" stroke="${col}" stroke-width="${n(w)}" opacity="${n(1 - t)}"/>`;
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + 0.13; s += `<path d="M${n(Math.cos(a) * r * 1.06)},${n(Math.sin(a) * r * 1.06)} L${n(Math.cos(a) * r * 1.2)},${n(Math.sin(a) * r * 1.2)}" stroke="${col}" stroke-width="${n(w * 0.5)}" stroke-linecap="round" opacity="${n(1 - t)}"/>`; }
    return s;
  }
  // flameHalo – a flickering crown of light around a head (Athena's flame over Achilles at the trench). Origin: head centre.
  // o: r (head radius, 72), f, a (opacity 0..1)
  function flameHalo(o = {}) {
    const r = o.r || 72, f = o.f || 0, gid = nid('fh');
    let s = `<defs><radialGradient id="${gid}"><stop offset="0.4" stop-color="#fff3c4" stop-opacity="0.9"/><stop offset="1" stop-color="#ffb84a" stop-opacity="0"/></radialGradient></defs><circle r="${r * 2.4}" fill="url(#${gid})"/>`;
    for (let i = 0; i < 11; i++) { const a = -Math.PI / 2 + (i - 5) * 0.27, L = r * (0.7 + 0.35 * Math.abs(Math.sin(f / 3 + i * 1.3))), x = Math.cos(a) * r * 1.02, y = Math.sin(a) * r * 1.02;
      s += `<path transform="translate(${n(x)} ${n(y)}) rotate(${n(a / D2R + 90)})" d="M-12,0 Q-14,${n(-L * 0.5)} 0,${n(-L)} Q14,${n(-L * 0.5)} 12,0 Z" fill="#fff6d0" opacity="0.85"/>`; }
    return `<g opacity="${o.a ?? 1}">${s}</g>`;
  }

  // weapons -------------------------------------------------------------------------------------------
  // sword – a short Greek sword in its scabbard; drawn 0..1 slides the blade out. Origin: the mouth of the scabbard, blade
  // points down (+y) inside it. o: drawn, angle, s
  function sword(o = {}) {
    const d = clamp(o.drawn || 0) * 170;
    return `<g transform="rotate(${o.angle || 0}) scale(${o.s || 1})">
      <g transform="translate(0 ${n(-d)})"><path d="M-10,0 L10,0 L13,150 L0,190 L-13,150 Z" fill="#d8dde2" ${ink()}/><path d="M0,10 L0,170" stroke="#f6f8fa" stroke-width="3"/>
      <rect x="-38" y="-14" width="76" height="16" rx="6" fill="${C.bronze}" ${ink()}/><rect x="-9" y="-70" width="18" height="58" rx="6" fill="${C.leather}" ${ink()}/><circle cx="0" cy="-74" r="13" fill="${C.bronze}" ${ink()}/></g>
      <path d="M-18,0 L18,0 L16,160 Q0,190 -16,160 Z" fill="${C.leatherS}" ${ink()}/><path d="M-18,4 L18,4" stroke="${C.bronze}" stroke-width="8"/><path d="M-10,150 Q0,170 10,150" fill="${C.bronze}" ${ink(3)}/></g>`;
  }
  // spear – origin: the butt, point towards -y. o: len (620), angle, P {metal}
  function spear(o = {}) {
    const L = o.len || 620;
    return `<g transform="rotate(${o.angle || 0})"><rect x="-5" y="${-L}" width="11" height="${L}" rx="4" fill="${C.wood}" ${ink(SW * 0.8)}/>
      <path d="M0.5,${-L - 80} Q19,${-L - 30} 7,${-L + 4} L-6,${-L + 4} Q-18,${-L - 30} 0.5,${-L - 80} Z" fill="${(o.P && o.P.metal) || C.bronze}" ${ink()}/><path d="M0.5,${-L - 70} L0.5,${-L - 2}" stroke="${C.bronzeS}" stroke-width="3"/></g>`;
  }
  // arrowShaft – a flying arrow, origin at the tip, pointing +x. o: len (240), angle, s
  function arrowShaft(o = {}) {
    const L = o.len || 240;
    return `<g transform="rotate(${o.angle || 0}) scale(${o.s || 1})"><path d="M-6,0 L${-L},0" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="M-6,0 L${-L},0" stroke="${C.wood}" stroke-width="5" stroke-linecap="round"/>
      <path d="M0,0 L-30,-12 L-24,0 L-30,12 Z" fill="#d8dde2" ${ink(3)}/>
      <path d="M${-L + 4},0 L${-L - 22},-18 L${-L + 30},-2 Z M${-L + 4},0 L${-L - 22},18 L${-L + 30},2 Z" fill="#e8e0d0" ${ink(2.5)}/></g>`;
  }
  // bow – a recurve bow, vertical. Origin: the grip. o: draw 0..1 (string pulled back toward -x), arrow (nocked arrow), s, angle
  function bow(o = {}) {
    const dr = clamp(o.draw || 0) * 90;
    return `<g transform="rotate(${o.angle || 0}) scale(${o.s || 1})">
      <path d="M8,-170 Q-10,-182 -4,-196" fill="none" ${ink(6)}/><path d="M8,170 Q-10,182 -4,196" fill="none" ${ink(6)}/>
      <path d="M8,-170 L${n(-dr)},0 L8,170" fill="none" stroke="#f3eee2" stroke-width="3"/>
      <path d="M8,-170 Q70,-110 30,-30 Q20,0 30,30 Q70,110 8,170" fill="none" stroke="${INK}" stroke-width="20" stroke-linecap="round"/>
      <path d="M8,-170 Q70,-110 30,-30 Q20,0 30,30 Q70,110 8,170" fill="none" stroke="#9a6a3f" stroke-width="11" stroke-linecap="round"/>
      <rect x="18" y="-22" width="22" height="44" rx="6" fill="${C.leather}" ${ink(3)}/>
      ${o.arrow ? `<g transform="translate(${n(-dr + 230)} 0)">${arrowShaft({ len: 230 })}</g>` : ''}</g>`;
  }

  // food, loot, comfort --------------------------------------------------------------------------------
  // lootPile – a heap of spoils (coins, cups, an urn, gems). Origin: ground. o: big (true = huge heap, false = a sad little one), s
  function lootPile(o = {}) {
    const big = o.big !== false;
    let s = '';
    if (big) {
      s += cel(a => `<path d="M-260,0 Q-200,-170 0,-230 Q200,-170 260,0 Z" ${a}/>`, '#f4c94a', '#c98f1c', -0.1, -0.15, 260);
      for (let i = 0; i < 40; i++) { const a = rnd(i), b = rnd(i + 50), x = (a - 0.5) * 440, top = -230 * (1 - Math.pow(Math.abs(x) / 260, 1.6)), y = top * (0.2 + 0.75 * b);
        s += `<ellipse cx="${n(x)}" cy="${n(y)}" rx="16" ry="9" fill="#f8dc72" ${ink(2.5)}/>`; }
      s += `<g transform="translate(-120 -120) rotate(-14)">${goldenJar({ s: 0.36 })}</g><g transform="translate(110 -118) rotate(10)">${cauldron({ s: 0.42, legs: false })}</g>`;
      s += `<g transform="translate(-10 -214)"><path d="M-30,0 L30,0 L22,-50 L-22,-50 Z" fill="${C.goldL}" ${ink()}/><path d="M-22,-50 Q-50,-40 -30,-14" fill="none" ${ink(5)}/></g>`;
      for (const [x, y, c] of [[-40, -90, '#5aa8ae'], [60, -60, '#e2433a'], [20, -150, '#6d3f8a'], [-170, -30, '#5aa8ae']]) s += `<path d="M${x},${y - 14} L${x + 12},${y} L${x},${y + 14} L${x - 12},${y} Z" fill="${c}" ${ink(2.5)}/>`;
    } else {
      s += cel(a => `<path d="M-46,0 Q-30,-34 0,-40 Q30,-34 46,0 Z" ${a}/>`, '#f4c94a', '#c98f1c', -0.1, -0.15, 46);
      s += `<ellipse cx="-10" cy="-28" rx="12" ry="7" fill="#f8dc72" ${ink(2)}/><ellipse cx="14" cy="-16" rx="12" ry="7" fill="#f8dc72" ${ink(2)}/>`;
    }
    return `<g transform="scale(${o.s || 1})">${s}</g>`;
  }
  // parasol – a striped sunshade on a pole. Origin: ground. o: h (420), s
  function parasol(o = {}) {
    const h = o.h || 420;
    let s = `<path d="M0,0 L0,${-h}" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M0,0 L0,${-h}" stroke="${C.woodS}" stroke-width="7" stroke-linecap="round"/>`;
    s += `<path d="M-200,${-h + 40} Q0,${-h - 120} 200,${-h + 40} Q150,${-h + 20} 100,${-h + 40} Q50,${-h + 20} 0,${-h + 40} Q-50,${-h + 20} -100,${-h + 40} Q-150,${-h + 20} -200,${-h + 40} Z" fill="#c8302a" ${ink()}/>`;
    for (const x of [-100, 0, 100]) s += `<path d="M0,${-h - 76} Q${x * 0.5},${-h - 30} ${x - 50},${-h + 30} L${x + 50},${-h + 30} Q${x * 0.5 + 10},${-h - 30} 0,${-h - 76} Z" fill="#f4e5c6" opacity="${x === 0 ? 1 : 0.95}"/>`;
    s += `<path d="M-200,${-h + 40} Q0,${-h - 120} 200,${-h + 40}" fill="none" ${ink()}/><circle cx="0" cy="${-h - 78}" r="10" fill="${C.goldL}" ${ink(3)}/>`;
    return `<g transform="scale(${o.s || 1})">${s}</g>`;
  }
  // grapes – a bunch of grapes. Origin: stem top. o: s, col
  function grapes(o = {}) {
    const col = o.col || '#6d3f8a';
    let s = `<path d="M0,0 L0,-16" stroke="${C.woodS}" stroke-width="6" stroke-linecap="round"/><path d="M2,-8 Q24,-24 34,-6 Q18,0 2,-8 Z" fill="#7fae5a" ${ink(2.5)}/>`;
    const pts = [[0, 14], [-14, 22], [14, 22], [-20, 38], [0, 36], [20, 38], [-10, 52], [10, 52], [0, 66]];
    for (const [x, y] of pts) s += `<circle cx="${x}" cy="${y}" r="11" fill="${col}" ${ink(2.5)}/><circle cx="${x - 3}" cy="${y - 4}" r="3" fill="#fff" opacity="0.5"/>`;
    return `<g transform="scale(${o.s || 1})">${s}</g>`;
  }
  // plate – a huge bronze platter piled with food (Agamemnon). Origin: centre of the platter. o: s, empty
  function plate(o = {}) {
    let s = cel(a => `<ellipse cx="0" cy="0" rx="150" ry="40" ${a}/>`, C.bronze, C.bronzeS, 0, -0.2, 150) + `<ellipse cx="0" cy="-4" rx="120" ry="26" fill="${C.bronzeL}" opacity="0.6"/>`;
    if (!o.empty) {
      s += cel(a => `<ellipse cx="-10" cy="-40" rx="80" ry="46" ${a}/>`, '#c9773a', '#9a5525', -0.1, -0.15, 80);
      s += `<path d="M58,-56 L104,-90" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><path d="M58,-56 L104,-90" stroke="#f4ecd8" stroke-width="10" stroke-linecap="round"/><circle cx="108" cy="-94" r="12" fill="#f4ecd8" ${ink(3)}/>`;
      s += `<g transform="translate(-96 -36)">${grapes({ s: 0.8 })}</g><ellipse cx="70" cy="-20" rx="34" ry="20" fill="#e2b06a" ${ink(3)}/>`;
      s += `<path d="M-40,-66 Q-20,-80 0,-70" fill="none" stroke="#f3c48a" stroke-width="6" stroke-linecap="round"/>`;
    }
    return `<g transform="scale(${o.s || 1})">${s}</g>`;
  }
  // breakfastBowl – Chiron's breakfast: a wooden bowl of grim stew, a bone sticking out, green steam. Origin: ground. o: f, s
  function breakfastBowl(o = {}) {
    const f = o.f || 0;
    let s = '';
    for (let i = 0; i < 3; i++) { const t = ((f / 45) + i / 3) % 1; s += `<path d="M${-30 + i * 30},${n(-70 - t * 90)} q-14,-20 0,-40 q14,-20 0,-40" fill="none" stroke="#8fcf6a" stroke-width="9" stroke-linecap="round" opacity="${n((1 - t) * 0.8)}"/>`; }
    s += `<path d="M40,-70 L86,-150" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M40,-70 L86,-150" stroke="#f4ecd8" stroke-width="13" stroke-linecap="round"/>
      <circle cx="80" cy="-160" r="12" fill="#f4ecd8" ${ink(3)}/><circle cx="96" cy="-150" r="12" fill="#f4ecd8" ${ink(3)}/>`;
    s += `<ellipse cx="0" cy="-64" rx="96" ry="22" fill="#6f7a3a" ${ink()}/><circle cx="-30" cy="-66" r="8" fill="#8a9a48"/><circle cx="20" cy="-60" r="6" fill="#55602a"/>`;
    s += cel(a => `<path d="M-100,-64 Q-96,0 0,0 Q96,0 100,-64 Q0,-44 -100,-64 Z" ${a}/>`, C.wood, C.woodS, -0.12, -0.05, 100);
    return `<g transform="scale(${o.s || 1})">${s}</g>`;
  }

  // speech and thought bubbles -------------------------------------------------------------------------
  // speechBubble – white bubble with a tail. Origin: bubble centre. o: w, h, text, size, tail [x, y] (point the tail aims at, relative)
  function speechBubble(o = {}) {
    const w = o.w || 240, h = o.h || 130, [tx, ty] = o.tail || [-80, 140];
    const bx = Math.max(-w / 2 + 30, Math.min(w / 2 - 30, tx * 0.4));
    return `<path d="M${n(bx - 22)},${n(h / 2 - 10)} L${tx},${ty} L${n(bx + 24)},${n(h / 2 - 12)} Z" fill="#fff" ${ink(5)}/>
      <ellipse rx="${w / 2}" ry="${h / 2}" fill="#fff" ${ink(5)}/><path d="M${n(bx - 18)},${n(h / 2 - 14)} L${n(bx + 20)},${n(h / 2 - 16)}" stroke="#fff" stroke-width="12"/>
      ${o.text ? `<text x="0" y="${n((o.size || 54) * 0.35)}" ${o.hand ? HAND : FONT} font-size="${o.size || 54}" text-anchor="middle" fill="${INK}">${o.text}</text>` : ''}`;
  }
  // thoughtBubble – cloud bubble with small circles. Origin: bubble centre. o: w, h, text, size, tail [x, y]
  function thoughtBubble(o = {}) {
    const w = o.w || 300, h = o.h || 170, [tx, ty] = o.tail || [-120, 170];
    const list = []; for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; list.push([Math.cos(a) * w * 0.36, Math.sin(a) * h * 0.3, h * 0.28]); } list.push([0, 0, h * 0.38]);
    return `${puffs([[tx * 0.55, ty * 0.55, 16], [tx * 0.82, ty * 0.82, 10]], '#fff', 5)}${puffs(list, '#fff', 5)}
      ${o.text ? `<text x="0" y="${n((o.size || 54) * 0.35)}" ${FONT} font-size="${o.size || 54}" text-anchor="middle" fill="${INK}">${o.text}</text>` : ''}`;
  }

  window.PROPS = {
    horse, deer, boarKO, dog, rabbit, bird, wheel, chariot, chariotTeam, throne, stool, helmetProp, armorStand, tent,
    lyre, goldenApple, dice, cauldron, cauldronTower, goldBars, cityIcon, tiara, goldenJar, worldShield, shears, thread, threadBall,
    balanceScale, anvil, hammer, flame, torch, fire, candle, vasePainting, bfFigure, scrollDoc, quill, laurel, cradle, pauseIcon,
    mapGreece, mapRoute, routePoint, xMark, talliesStone, banner, speedLines, dustCloud, fightCloud, shockRing, flameHalo,
    sword, spear, arrowShaft, bow, lootPile, parasol, grapes, plate, breakfastBowl, speechBubble, thoughtBubble,
    MAP, HORSE_RIDER: { x: 0, y: -392 }, CHARIOT_FLOOR: { x: 20, y: -128 }, CHARIOT_YOKE: { x: 446, y: -334 }, THRONE_SEAT: -214, STOOL_SEAT: -150,
  };
})();
