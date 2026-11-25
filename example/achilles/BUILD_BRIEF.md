# How a chapter of the Achilles episode is built

Every chapter scene of "What If You Were Born as Achilles?" is built the same way, so the whole episode looks like one film.
Hook and chapter I (`scenes/hook.html`, `scenes/chapter1.html`) are finished and are the quality bar: look at them first.

## Read first
1. `EPISODE.md` – the running order and the shot list (one row per line: narration, picture, text, sound) + the rules on top.
2. `../../STYLE_BIBLE.md` (in the skill) – the measured style.
3. `scenes/chapter1.html` – the reference scene: how shots, camera, labels, light and acting are written.
4. `scenes/_template.html` and `lib/runner.js` – the frame loop every new chapter uses (card, word cues, fades).
5. The building blocks (grep the function list, read only what you use):
   - `lib/cast.js` (finished: baby, kid, Pyrrha, adult Achilles = `hero`, Thetis, Odysseus, princesses, seer, Cycnus, Priam bust, lionKO)
   - `lib/cast2.js` (`window.CAST2`: `man` with poses stand/walk/run/kneel/sit/lunge/scream and arms, presets `achilles`,
     `patroclus`, `hector`, `soldier`, `memnon`, `neoptolemus`, `peleus`, `chiron`, `kid`, `agamemnon`, `briseis`, `priam`,
     `paris`, `apollo`, `strife`, `hera`, `athena`, `aphrodite`, `zeus`, `hephaestus`, `penthesilea`, `SHADE_DEFS`, expressions
     incl. cry/shocked/smug/disgust/determined/stern/hurt/tired). Sheet: `design/out_cast2/0000[0-6].png`.
   - `lib/props.js` (`window.PROPS`: horses, chariot(Team), armorStand, lyre, goldenApple, worldShield, shears/thread, maps,
     scrollDoc, banner, tallies, fight cloud, dust, speed lines, bubbles …). Sheet: `design/out_props/0000[0-3].png`.
   - `lib/sets.js` (`window.SETS`: styx, styxBank, palace (skyros/phthia/night), night, beach, troyDusk, troyWallBack/Front,
     troyGate, camp, tentInside, cave, meadow, olympus, forge, underworld, battlefield, trench, grave, parchmentTable, gagBg,
     rays, sun, moon, stars, smoke, flame, ship …). Sheet: `design/out_sets0|1/00000.png`. All gradients/filters come from
     `SETS.defs()` (added by the runner): e.g. url(#night), url(#heroic), filter url(#sil), url(#silRed), url(#sepiaF),
     url(#greyF), url(#ghost), url(#glowF).
   - `lib/scene.js` (`window.SCENE`: camera, popLabel, arrow, strike, stamp, word, motes, blink, ease…).

## The voice
The real narrator takes exist. Word timings: `voice/<piece>/words.json` (aligned to the script's own words). The page gets them
with `?words=../voice/<piece>/words.json`. `TEXT` in the page must be the voice text file word for word
(`voice/0_prologue.txt`, `3_ch2.txt` … `10_ch9.txt`). Cue every shot on its first words; every pop on the word it names
(`R.at('word', n)`); never on fixed times – the timings must survive a new take.

## Picture rules (measured on Born in Lore + learned on chapter I)
- One idea per shot, cut on the narration. 20–28 cuts per minute. A cut inside the same set needs its own framing AND its own
  light/backdrop, or the measuring tool (and the eye) does not see it.
- Nothing ever stands still: camera drift on every shot (`S.camera`, keys from 0 to d), breathing (`breathe`), blinks
  (`blink(f, [frames])`), motes, water, flames. Characters act inside the shot (expression changes on the word).
- Text devices with the measured timing: pop 3–4 frames with overshoot (`popLabel`), arrow draws in 10 frames after the word
  (`arrow`), strike 3 frames (`strike`), joke pause 13 frames between strike and reveal, stamp 3 frames (`stamp`).
  Name labels = bold white with dark outline, small italic line under it. Labels never cut off at the frame edge.
- Gags get their own gag backdrop (`SETS.gagBg` with violet / heroic / burst / gold). From chapter V on: no gags, no gag
  devices, only plain name labels where someone new appears.
- Look: mean brightness 0.23–0.36 (moody), saturation 0.44–0.62. Dusk, night, fire, backlit silhouettes for big moments.
  The colour grade is applied by the runner (same as chapter I) – do not fight it with washed-out colours.
- Our own designs only. No blood, no wounds, no gore: deaths happen in silhouette, as cut-aways, with dust, flashes, light.
  Briseis is never a joke. Nothing from films, games or the novel; no Born-in-Lore designs (no "(that's you)", no blackletter
  card, no lightning-flash opening, no wax-seal subscribe).
- Every shot draws the full 1920x1080 stage (the camera clamps inside it). Keep important things inside x 160–1760, y 90–990.

## Sound: `tools/score/<piece>.mjs`
Export `score(X, total)` and `sfx(X, total)` (see `tools/score/common.mjs` for the helpers and `tools/sound_piece.mjs`
`ch1Score`/`ch1Sfx` for the reference). Our score in D dorian / 80 BPM with lyre plucks, pads, frame drum, drone, hall reverb,
changing mood by section on the shot starts (`X.shot(k).start`) and words (`X.cue('word').s`). Chapter card: `card(X, T, F)`.
About 12 effects per minute, each on something that happens on screen (your effects kit in `sfx/*.wav`, see SKILL.md; names used: whoosh_in,
boom, thud, whip, swish0–2, rswish0–7, rwhoosh0–6, impact_big, ding_land, crash; synthesised: splash, snip, plink, rustle,
hornCall). Low points (V–IX) get thin pads, no comedy stings. Mix and loudness are done by sound_piece.mjs.

## Check before you call it done
1. Build the piece at quarter size with the real voice and sound (frames, mix, mov):
   `powershell -File tools\build_episode.ps1 -Pieces <piece> -Scale 0.5 -NoJoin`
   (output `out/ep/<piece>/` and `out/ep/<piece>.mov` in the episode folder).
2. Contact sheet, one frame every 0.5 s, and LOOK at it (Read the jpg); fix every shot that is wrong, cheap, cut off, too
   bright, static or does not show exactly what the words say:
   `ffmpeg -v error -y -i out\ep\<piece>\%05d.jpg -vf "select=not(mod(n\,15)),scale=384:-1,tile=5x7" -frames:v 9 out\ep\<piece>_sheet%02d.jpg`
   For details render single frames big: `node tools/render.mjs scenes/<file>.html --out out/ep/<piece>_check --frames 120,240 --fmt jpg --query "words=../voice/<piece>/words.json"` (in the episode folder).
3. Measure: `python ..\..\tools\measure_video.py out\ep\<piece>.mov out\ep\measure --name <piece>`
   (needs numpy; ffmpeg on the PATH or `$env:FFMPEG`).
   Targets: 20–28 cuts/min, static shots ≤ 25 %, luma 0.23–0.36, saturation 0.44–0.62.
4. Sound log: `out/ep/<piece>_mix_stems/timeline.md` – effects per minute and what they sit on.
