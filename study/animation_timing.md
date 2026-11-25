# Born in Lore – Animation timing, measured frame by frame (30 fps)

Source: `tools/frame_sheets.ps1` on the Kratos video (cB5AnPSKXr8), sheets in
the frame sheets of the reference video (not included – make your own) (frame numbers burned into every tile).

## 1. Character label "KRATOS (that's you)" – opening (sheet `frame_sheets\s01.jpg`, frames 0–59)
- frames 0–1 black, 2–4 fade-in from black (3 frames)
- frame 35: lightning flash (whole frame brighter for 1 frame)
- frames 36–42: label pops in (small → overshoot → settle, about 7 frames), then holds to the end of the shot
- the name sits top left of the character, "(that's you)" small underneath

## 2. Pointer label "SCAR" (sheet `frame_sheets\label_scar\s01.jpg`, frames 2109–2168, 70.3–72.3 s)
- 2109–2115: the boy blinks (lid closes 3 frames, opens 3 frames) – acting never stops inside a shot
- 2126 → 2129: the word pops in (3 frames, tiny → full size)
- 2130 → 2140: the curved arrow draws itself from the word to the scar (≈ 10 frames, stroke-on)
- 2141 onward: label holds; 2159: brows drop, the sad face turns angry (expression change inside the same shot)

## 3. Strike-through joke "FASHION → A PROMISE" (sheet `frame_sheets\strike_promise\s01.jpg`, frames 2547–2606, 84.9–86.9 s)
- 2547–2549: "FASHION" stands alone (white, bold, dark outline)
- 2550 → 2553: red strike line wipes left to right (3–4 frames)
- 2553–2565: hold – a 13-frame (0.43 s) comedic pause
- 2566 → 2570: "A PROMISE" pops in yellow, tilted, small → overshoot (4 frames)
- 2570 → 2576: it settles (about 6 frames); then both hold
- sound: a hit lands on the strike and on the pop (see `sfx_kratos.md`, 85.56 s)

## 4. Chapter card "CHAPTER V · The Fall of Olympus" (sheet `frame_sheets\chapter_card\s01.jpg`, frames 8757–8816, 291.9–293.9 s)
- 8757–8764: black (the scene before has faded out)
- 8765 → 8775: card fades in (10 frames): small emblem, letter-spaced "CHAPTER V" in gold, title in a blackletter-style face
- 8775–8800: hold (25 frames)
- 8800 → 8806: card fades out (6 frames), 8806–8807 black
- 8808 → 8813: the next scene fades in from black (5 frames)
- whole card ≈ 51 frames (1.7 s); a whoosh + boom under it (sfx.md 292–293 s)

## Rules derived
- Text never just appears: pop in 3–4 frames with overshoot, settle in ~6 frames.
- Pointer arrows draw on in ~10 frames, after the word has popped.
- Jokes have a beat: action (strike) → 0.4 s pause → reveal (pop). One sound on each hit.
- Characters keep acting inside a shot (blink, expression change) – no frozen drawings.
- Chapter change = fade to black, card 1.7 s, fade from black.
