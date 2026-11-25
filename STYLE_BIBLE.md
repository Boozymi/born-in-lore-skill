# STYLE BIBLE – "What if you were born as …?"

Measured on all 6 videos of @Borninlore (16–17 Nov 2026) – 3,611 s of video = 108,334 frames, every frame at 30 fps,
plus captions, chapters and descriptions. The three episodes uploaded after that (Ghost, John Marston, Tommy Vercetti) were
measured on 24 Nov 2026 with the same tools; what changed is marked "newest". Every number below is measured; the files
that prove it:

| what | file in this skill |
|---|---|
| transcripts in numbers | `study/transcripts.md` (made with `tools/study_transcripts.py`) |
| script formula, joke counts, arc | `SCRIPT_FORMULA.md` |
| cuts, shots, motion, light, palette | `study/<name>.measure.md` (made with `tools/measure_video.py`; it also writes a shot table and a shot sheet for your own runs) |
| animation timing in frames | `study/animation_timing.md` (counted on frame sheets made with `tools/frame_sheets.ps1`) |
| music and effects | `study/sfx_kratos.md` (every effect of the Kratos video with its time and what is on screen) |

Not included on purpose: the reference videos and any frames from them (study material only). To check a number yourself,
download the video (§1 in `SKILL.md`) and run the same tool.

**OUR RULE: original characters only.** The format works without a game character: a newborn, one core trait, a whole life.

---

## 1. Format (measured)

| | Kratos | CJ | Arthur | Master Chief | Ezio | Geralt |
|---|---|---|---|---|---|---|
| views / per day (16 Nov 2026) | 823K / 46K | 287K / 59K | 200K / 13K | 158K / 16K | 137K / 10K | 12K / 0.6K |
| views (23 Nov 2026) | 1.24M | 1.73M | 456K | 1.06M | 399K | 35K |
| length | 8:06 | 11:13 | 9:18 | 12:54 | 11:49 | 6:52 |
| words / words per s | 1199 / 2.53 | 1774 / 2.71 | 1411 / 2.58 | 1987 / 2.60 | 1818 / 2.63 | 1049 / 2.63 |
| chapters (prologue + I–IX), median | 10, 39 s | 10, 63 s | 10, 53 s | 10, 68 s | 10, 64 s | 8, 60 s |
| cuts per minute | 22.2 | 18.6 | 16.9 | 27.6 | 15.8 | 15.9 |
| median shot | 1.8 s | 2.3 s | 2.45 s | 1.4 s | 2.5 s | 2.7 s |

**The three newest (uploaded 18–22 Nov 2026 and measured 24 Nov with the same tools):**

| | Ghost | John Marston | Tommy Vercetti |
|---|---|---|---|
| views (24 Nov 2026) | 4.11M (6 days) | 259K (4 days) | 317K (2 days) |
| length | 13:18 | 13:52 | 14:17 |
| words / words per s | 2077 / 2.66 | 2182 / 2.68 | 2197 / 2.62 |
| chapters (prologue + I–IX), median | 10, 65 s | 10, 71 s | 10, 92 s |
| cuts per minute | **19.9** | 14.2 | 14.7 |
| median shot | 2.0 s | 2.75 s | 3.0 s |
| prologue: cuts per minute / static shots | **29.5 / 3 %** | 18.6 / 0 % | 21.4 / 0 % |
| slowest chapter (cuts per minute) | 15.9 | 9.8 | 9.6 |

**No fixed length. The story decides.** The channel runs from 6:52 to 14:17 (1,049–2,197 words), and the three newest
are all 13–14 minutes. The biggest hit by far is a long one (Ghost, 13:18, 4.1M in six days). What stays the same at every
length: ~2.5–2.7 words per second, prologue + chapters I–IX, a hook in the first 15 s, and the picture density.
**The density has to hold in every part.** Ghost keeps every chapter at 16+ cuts per minute (prologue 29.5, median shot
0.8 s). Marston and Tommy are cut just as fast in the prologue but drop to ~10 in their long chapters, and they have
a tenth of the views. Measure each chapter on its own, not only the whole video (`study/ghost.measure.md`).

## 2. Script (details and template: `SCRIPT_FORMULA.md` §8)

1. **Hook, 0:00–0:13, 30–38 words:** `If you were born as [NAME], you'd [deed 1], then [bigger deed], then [biggest deed].` + one turn sentence (origin / betrayal / death / mercy) + `But right now, you're a baby [place], and [one trait].` Speech starts at 0.0–0.8 s, no intro, no channel name.
   Proof: the one video without this hook (Geralt, "Okay, picture this…") has 12K views; every video after it uses the hook.
2. **Prologue = birth to adulthood, 1–2 min:** parents one line each → sibling/friend → "At [age], …" childhood scene showing the trait → first loss → `Years pass, and the cute kid? Gone.` → adult status quo. Plant 3 things ("Remember that.").
3. **Chapters I–IX:** one chapter = one life phase around one iconic moment, titled in 1–4 words. Start with "Then …", an age, a place or the next action – never a recap. End on a 2–6 word button (reveal, new title, "You're home.", cliffhanger).
4. **Comment call in chapter II at ~38 %:** "Quick pause." + who should be born next + most-liked name wins (6–10 s), right after a punchline.
5. **Voice:** second person, present tense; "you'd" only in the hook, past tense only in the ending. Average 9 words per sentence, ≥ 30 % of sentences ≤ 5 words. "This time" exactly twice (the repeated situation, outcome flipped). "Long story." skips whole arcs.
6. **Jokes ~2.3 per minute** (prologue ~3.7), deadpan after hard facts, understatement, list of three with the gag last. **No jokes at the low points and in the last 45–60 s.** (The jokiest video is the weakest.)
7. **Arc:** first catastrophe at 14–33 %, twist at 43–60 %, biggest loss at 74–92 %, quiet last image. Payoffs land at 54–74 %.
8. **Ending, 11–14 s:** `Not bad for a [baby image].` → `You [greatest deed], [greatest loss], and still [human choice].` (past tense) → `So, tell me, would you still [the life-defining decision]?` Then 11–18 s of end card without voice.
9. **Newest (Ghost, Marston, Tommy):**
   - The hook (39–43 words, 13.5–15.5 s) sits inside a "Prologue" chapter that starts at 0:00 and lasts 60–70 s.
   - The turn sentence is now "And the man who finally [kills / comes for] you …". The baby sentence lists what the hero
     doesn't have yet: "No …, no …, not even …".
   - Where the source has no childhood, the narrator says so plainly before telling what is known.
   - "Remember …" plants 3–9× (Ghost, the hit: 3). "This time" once.
   - The comment call at 31–45 %. Tommy's also asks for channel memberships.
   - A few real-world facts about the work: what the studio confirmed later, who voiced the hero.
   - The ending drops "Not bad for …": a short summary of the life in the past tense → "So tell me, …?" (the decision, or a
     question the source never answers) → "Who should be born next? Tell me in the comments." Then ~18 s of end card.

## 3. Picture

- **Style:** flat 2D vector, one cel-shade tone per colour, thin dark-brown outline (#2a1f1b-ish, ~3 px at 1080p), no textures except soft paper grain on props. Soft vignette, floating dust/spark dots in the air.
- **Characters:** baby and kid = chibi (head ≈ half the height), dot eyes with a white highlight, rosy cheeks, tiny mouth, expressive brows. Adults keep the big head but get a real body. The character ages on screen: baby → kid → teen → adult → old.
- **Acting never stops inside a shot:** blinks (3 frames down, 3 up), expression changes mid-shot (sad → angry), breathing, ambient motion.
- **Sets:** warm parchment walls with a border pattern, wooden floors, dusk skies (violet → orange glow), night scenes with moon, fire and silhouettes against bright backlight for big moments.
- **Light and colour (measured):** mean luma 0.23–0.36 (moody, 2–8 % near-black frames), saturation 0.44–0.62. Palette (Kratos, k-means): near-black #0e080c 27 %, dusk navy #2d2c3b 12 %, dark umber #512714 12 %, lavender grey #5f596f 9 %, warm brown #79543a 8 %, tan #ab8664 8 %, parchment #dabf98 8 %, cool grey-blue #8f96ab 7 %, off-white #d1d2cf 7 %, ember orange #b64f18 3 %.

## 4. Text on screen = the jokes (most frequent device)

| device | look | example (Kratos) |
|---|---|---|
| name label | bold white sans, dark outline, "(that's you)" small below | 0:01 name label |
| pointer label | one word + hand-drawn curved arrow to the detail | 1:11 "SCAR" |
| strike-through | white word, red line through it, replacement pops in yellow, tilted | 1:25 "FASHION" → "A PROMISE" |
| document prop | parchment contract / list / cork board, handwritten lines, stamps | 2:21 the deal + "NO REFUNDS" stamp, magnifier on "Forever." |
| counter | tally marks on a stone, "YEAR 2/5/8/10", "DEATHS: 2" | 3:00 |
| chapter card | black, small emblem, letter-spaced gold "CHAPTER V", title in a blackletter face | 4:53 |
| book title card (newest) | the prologue's title as a book cover: "The Life of [Name]", "Prologue", the place | Tommy 0:16 |
| close-up insert (newest) | a hand, a tool or an object fills the frame for 2–4 s between wide shots | Tommy 0:34–0:38 (hands on a printing roller) |
| photo with a red circle (newest) | an old black-and-white photo, a red hand-drawn circle around one face | Tommy 0:14 |
| end card | open book: the final question, "Which character should be born next? Tell me in the comments.", wax-seal subscribe, the baby, an empty frame "the next life"; disclaimer line at the bottom | 8:00 |

## 5. Animation timing (measured frame by frame, 30 fps)

- Text pops in **3–4 frames** with overshoot, settles in ~6 frames. Never a plain fade.
- Pointer arrows **draw on in ~10 frames** after the word has landed.
- Joke beat: action (strike line, 3–4 frames) → **13-frame pause (0.43 s)** → reveal pop. One sound on each hit.
- Chapter change: fade to black → card fades in 10 frames, holds 25, fades out 6 → scene fades in 5 (≈ 1.7 s).
- Video start: 2 black frames, 3-frame fade-in, name label at frames 36–42 after a lightning flash.

## 6. Camera and editing (measured)

- **~22 cuts per minute, median shot 1.8 s** (all six: 15.8–27.6 per minute, 1.4–2.7 s); p90 shot 5–8 s; longest single shot 17–38 s (a slow scene).
- Inside shots: **16–24 % static, 45–64 % slow drift (push-ins, ambient motion), 15–39 % moving.** 59–71 % of all frames change.
- Hard cuts between shots; fades only around chapter cards and at the start; very short flashes (p10 shot 0.3 s) for impacts and montage.
- One idea per shot, the narration line decides the cut.

## 7. Sound (measured on Kratos)

- Loudness **−14.0 LUFS, LRA 4.1, true peak −1.1 dB**.
- Music bed all the way through, with a steady low pulse (126 low hits in 8 min = drum pattern), stereo.
- **94 effects in 8:06 (~12 per minute):** a hit or whoosh on almost every text gag (strike, stamp, label pop, counter), whoosh + boom under chapter cards and big reveals. Far busier than a talking video – it is a cartoon.

## 8. Packaging

- Title: `What If You Were Born as [Name]? | [World]`. Tags: none.
- Description (fixed order): "You're a baby [place]. …" + preview → "This is the whole life of [Name] … told as if it were yours." → 8–11 keywords ending in a feeling → the final question + "Tell me in the comments." → chapter list → channel line "Subscribe for the next life." → sources + "All illustrations, animation and music are original." + fan-work disclaimer → 3 hashtags.
- Thumbnail: baby version (in a crib or bassinet, "AGE 0") next to the grown-up version, one big word for what they became.
  **Newest three: no text at all.** Only the baby in the crib next to the grown-up (Tommy: a name card on the crib).
- Viewers in other languages see the titles and the older thumbnails' words translated (German: "ALTER 0", "VERRATEN").
  The channel uses translated titles and thumbnails.

## 9. Why the best ones are the best

**Ghost (newest, 4.1M in six days, 13:18):** the length is not the reason. Marston and Tommy are just as long and have a tenth of
the views. The difference is measurable: Ghost holds the picture density in every chapter (19.9 cuts per minute overall,
prologue 29.5 with a median shot of 0.8 s, no chapter under 15.9), against 14.2 and 14.7 with chapters down to ~10. Its hook
has three concrete deeds a stranger can picture at once and a turn that lands ("the man who finally kills you" is someone
you call sir). It uses the fewest "Remember" plants of the three (3).

**Kratos (the hit of the first study, 823K then):**

Most compressed (8:06 for a whole saga, 2.53 words/s), cleanest 32-word hook that loops into the final question, 3 plants paid off at 54 / 60 / 74 %, short even chapters (median 39 s), almost no lore numbers, the funniest prologue and joke-free low points, the second-fastest cutting (22 cuts/min, only Master Chief cuts faster). CJ (59K views per day right now) is the second model: many setup/payoff pairs.
