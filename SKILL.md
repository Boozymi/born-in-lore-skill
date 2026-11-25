---
name: born-in-lore
description: Make complete "What if you were born as …?" life-story cartoons in the Born in Lore style (prologue + nine chapters, as long as the story needs – the channel runs 7–14 minutes) with Claude – from a character's name to a finished, measured video. Contains the measured style bible of nine Born in Lore videos, the script formula and template, every animation timing in frames, the measuring tools, and a complete working example episode (Achilles) whose characters, sets, scenes, score and build chain are all code. Use when someone wants a Born-in-Lore-style video (a whole episode, the hook or one chapter), a "life of X told as if it were yours" cartoon, asks to do the whole workflow from the video "How to Make 'What If You Were Born As…' Videos Using Claude", or wants to copy any video style by measuring it.
---

# Born in Lore style – from a name to a finished episode

Give Claude a life ("make one for Joan of Arc") and work through the steps below: **character → script → shot list → voice →
characters in code → scenes → sound → build → measure and fix → upload package.** Everything was built and used for a real,
complete episode, "What If You Were Born as Achilles?" (about 8½ minutes) – it is in `example/achilles/` as a working project.

## Start here – ask first, then build
This skill is the complete framework; the person decides everything that makes the video theirs. Before building, ask them
(a few questions at a time, with a sensible default for each – never decide for them):
1. **Whose life?** The character and the version of the story to follow (sources, era). It must be original or public domain
   (§0). If they name a game, film or book character, explain the rights problem and suggest public-domain alternatives.
2. **Language** of the narration (the formula is measured in English; other languages keep the same structure).
3. **The narrator's voice**: which voice and which provider (a voice library such as ElevenLabs, another TTS, or their own
   recording). Born in Lore uses a calm storyteller at ~2.5 words per second. If a voice tool is connected, offer to generate
   the takes and say what it costs first; otherwise give them the text files and the file names for their recordings.
4. **The look of their characters and places**: the hero's hair, skin, clothes and colours at every age, the symbol object,
   the key places – inside the measured style (flat cel-shaded chibi, dusk palette). Ask for any references they want.
5. **The project folder** where the episode is built (copy `example/achilles/` there as the starting framework; never build
   inside the skill folder).
6. **Sound**: their own effect files (only sounds they are allowed to use) – or none: every effect the scores ask for is also
   made in code (`tools/sfx_synth.mjs`), so the episode is complete without an effects library.
7. **Their channel** for the description and, if they want, the end card: channel name, their own tagline, the exact final
   question, the sources line. The example contains no channel name – it is always theirs to fill in.
8. **The machine**: check ffmpeg, Node (+ `npm install` in the episode folder), Chrome, Python with numpy and faster-whisper;
   install missing tools only with their OK. Windows, macOS and Linux all work (`tools/build_episode.mjs`).

Then build in the order below and **show the result and wait for their OK at every checkpoint**: the life plan (§2) → the
script with the `script_check.py` result (§3) → the cast sheet rendered as an image (§6) → one finished chapter at quarter size
(§7–9) → the rough cut of the whole episode with its measurement (§10) → the final render and the upload package (§11).
The Achilles episode is the reference for structure and quality – a new life gets its own story, characters and scenes; only
generic sets and props are reused.

## What is in this skill
| file | what it is |
|---|---|
| `STYLE_BIBLE.md` | the style in numbers, measured on all six Born in Lore videos (3,611 s, 108,334 frames): format, script, picture, text gags, animation timing, camera, sound, packaging |
| `SCRIPT_FORMULA.md` | the script formula of all six videos (hook, prologue, chapter engine, voice, jokes, arc, ending, description) + the fill-in template |
| `study/` | the measurements behind it: `animation_timing.md` (every device counted in frames), `<video>.measure.md` (cuts, motion, light, palette of each video), `transcripts.md`, `sfx_kratos.md` (94 effects, 126 low hits) |
| `templates/LIFE_TEMPLATE.md` | the life plan to fill in |
| `tools/` | the study tools: `measure_video.py`, `frame_sheets.ps1`, `frame_stats.py`, `study_transcripts.py`, `script_check.py` |
| `example/achilles/` | the whole episode as a project: `LIFE.md`, `EPISODE.md` (every line and shot), `voice/*.txt`, `lib/` (characters, props, sets, timing, runner), `scenes/` (one page per piece), `tools/` (voice, render, score, build), `design/sheets/` (what the characters and sets look like), `BUILD_BRIEF.md`, `COMPARE.md` |

## The reference: Born in Lore
Channel: https://www.youtube.com/@Borninlore. The nine videos measured for this skill (the first six on 16–17 Nov 2026 and the three newest
on 24 Nov 2026):

| video | id | views at the study (16 Nov) | views a week later (23 Nov) |
|---|---|---|---|
| What If You Were Born as Kratos? (the best one, the model) | `cB5AnPSKXr8` | 823K | 1.24M |
| … as CJ? | `vZ2eX-tIBDI` | 287K | 1.73M |
| … as Arthur Morgan? | `WKJKhnOD65o` | 200K | 456K |
| … as Master Chief? | `q8JM9uxkPFc` | 158K | 1.06M |
| … as Ezio Auditore? | `aX0dwYkdBjY` | 137K | 399K |
| … as Geralt of Rivia? (the first one, no hook yet) | `yLXdl9RUwPI` | 12K | 35K |
| … as Ghost? (newest, 18 Nov – the biggest hit) | `pVUgJt1sDmI` | – | 4.11M (24 Nov) |
| … as John Marston? (newest, 20 Nov) | `RjGLlOPy1hc` | – | 259K (24 Nov) |
| … as Tommy Vercetti? (newest, 22 Nov) | `3dN6qH2lQ-k` | – | 317K (24 Nov) |

The three newest are 13–14 minutes long and were measured on 24 Nov 2026 with the same tools (`study/ghost.measure.md`,
`study/marston.measure.md`, `study/tommy.measure.md`, rows in `study/transcripts.md`). What changed is in `STYLE_BIBLE.md`
§1, §2.9, §4, §8 and §9.

Claude can open the channel to watch for new uploads and measure them with the same tools (§1) – if the style changes, update
`STYLE_BIBLE.md`. The videos are study material only: never re-upload them or reuse their frames, audio or characters.

## The two rules behind everything
- **Never ask Claude what it thinks of a video. Ask it to count.** A style isn't magic – it's a list of numbers nobody bothered
  to count. Every number in this skill points to the file that proves it.
- **Measure your own video with the same tool you used on theirs.** Your eyes get used to your own work; the numbers don't.

## 0. Ground rules
- **Original or public-domain characters only** (myths, history, your own). Game and film characters belong to someone else –
  if you want to earn money with the channel, pick a life nobody owns. Use your own designs (nothing from films, games, novels).
- Never upload or publish the reference videos or frames you study. They are study material.
- Only download and study videos the person is allowed to: their own, with the owner's permission, or where the platform's terms
  and their local law allow it. Ask them to confirm this before §1; it is their decision and their responsibility.
- No gore: deaths happen in silhouette, as cut-aways, with dust and light.

## 1. Study (already done for Born in Lore – repeat it for any other style)
1. References with captions, chapters and view counts (only after the person confirmed they may download them, §0):
   `yt-dlp -f "bv*[height<=1080]+ba" --write-auto-subs --sub-langs en --write-info-json -o "research/%(id)s/%(id)s.%(ext)s" <urls>`
2. Claude can't watch a video, it looks at still images – and the style lives *between* them. `tools/frame_sheets.ps1 <video>
   <start s> <seconds> <out>` lays out every frame, 60 to a sheet, with the frame number burned in. Count the moments that
   matter (a name tag pops in over 6 frames and overshoots; a strike line takes 3; the joke waits 13).
3. `tools/measure_video.py <video> <out>` on every video (cuts per minute, shot lengths, motion inside shots, brightness,
   saturation, palette); `tools/study_transcripts.py` on the captions (words per second, chapters, openings and endings).
   One agent can read all scripts sentence by sentence while Claude measures the picture and the sound.
4. Write it into one file with sources for every number (ours: `STYLE_BIBLE.md` + `SCRIPT_FORMULA.md`).

## 2. The character and the life
1. Pick the life (rights first, see §0). It must be understandable without prior knowledge: the deeds in the hook have to work
   for someone who never heard the name.
2. Copy `templates/LIFE_TEMPLATE.md` and let Claude fill in the blanks: **one core trait, one symbol object that keeps coming
   back, one decision the whole life hangs on** (it becomes the final question), 3–4 plants in the prologue that pay off at
   50–75 %, two "This time" moments, a nickname that turns, the ages on screen (baby → kid → teen → adult …).
3. Plan every chapter with its share of the runtime, its button and its source; check the arc against the measured shape
   (first catastrophe 14–33 %, twist 43–60 %, biggest loss 74–92 %, quiet last image). Check every fact against the sources and
   say which version you follow. Example: `example/achilles/LIFE.md`.

## 3. The script
Write it with `SCRIPT_FORMULA.md` §8: hook (30–45 words) → prologue (the funniest part) → chapters I–IX (a button at every
end, the comment call at 30–45 %) → ending ("Not bad for a … / You …, …, and still … / So, tell me, would you still …?", or
the newest form: a short past-tense summary → "So tell me, …?" → who should be born next). **No fixed length: the story
decides.** Born in Lore runs 6:52–14:17 (1,049–2,197 words), the newest episodes 13–14 minutes; words ≈ seconds × 2.6. One text file per piece in `voice/`, exactly what the narrator reads.
Check it: `python tools/script_check.py voice/1_hook.txt voice/0_prologue.txt voice/2_chapter1.txt …` (all rules must say OK;
jokes and joke-free low points you mark by hand). Example: `example/achilles/voice/*.txt` (all OK).

## 4. The shot list
One row per line of narration: what we see, the text on screen, the sound (`example/achilles/EPISODE.md`). The rules:
one idea per shot, the narration decides the cut, ~22 cuts per minute; every gag gets a device with the measured timing
(name label, pointer + arrow, strike → 13-frame pause → reveal, stamp, counter, document); gags get their own backdrop;
from the low point on only plain labels; the symbol object and the plants are shown every time they are said.

## 5. The voice
A calm narrator, plain text without tags, one take per piece, 2.5–2.9 words per second (we used an ElevenLabs storyteller
voice). Then `tools/transcribe.py` → `tools/voice_prep.py` give `voice/<piece>/words.json` (the script's own words with real
timings – every cut and pop hangs on them), `tools/fix_word_ends.py` moves the word ends to where the sound really ends. A take
that came out too fast: `tools/pace_pauses.py` lengthens only the sentence pauses. (`tools/build_episode.mjs` runs all of this.)

## 6. Draw everything in code (`example/achilles/lib/`)
- **Characters** (`cast.js`, `cast2.js`): SVG functions in the measured look – flat vector, one cel-shade tone per colour,
  thin dark-brown outline, chibi heads, dot eyes with a white highlight, rosy cheeks, expressive brows; ages, poses (stand,
  walk, run, kneel, sit, lunge, scream), arms and expressions (incl. cry). Draw the hero once, then let him grow up on screen.
- **Props and sets** (`props.js`, `sets.js`): animals, chariot, armor stand, documents, maps, effects; every place with its own
  light (dusk, night, fire, backlit silhouettes, one cool palette for the land of the dead), all gradients and filters.
- **Timing and camera** (`scene.js`, `runner.js`): word cues, the camera that never fully stops, pop 3 frames with overshoot,
  arrow 10, strike 3, joke pause 13, stamp 3, chapter card 10 / 25 / 6 frames, the colour grade.
- **Look at your own render before you call it done**: render the cast sheet (`design/cast2.html` etc.) and read the image.
  Our first sheet had the mother wearing what looked like a hood and a hair bow that looked like cat ears – Claude saw both
  on the render and fixed them. For a new life, reuse what fits and add characters in the same style.

## 7. The scenes (`example/achilles/scenes/`)
One HTML page per piece, from `scenes/_template.html`: a list of shots, each cued on its first words, each drawing the full
1920×1080 stage. The step-by-step guide and the checks are in `example/achilles/BUILD_BRIEF.md`; the reference for quality
is `scenes/chapter1.html`.

## 8. Sound (`example/achilles/tools/sound_piece.mjs`, `tools/score/<piece>.mjs`)
The music is code too: a Karplus–Strong lyre (an algorithm from 1983), string pads, a frame drum, a drone, a hall reverb – one
score per piece whose mood changes on the shots and words, music under every second, a whoosh and a soft boom under every
chapter card. Effects on things that happen on screen (Born in Lore: 94 in 8 minutes – it's a cartoon, it's allowed to be
loud), music ducked under the voice, −14 LUFS / −1.5 dBTP. Effects: your own WAV files in `sfx/` if you have them (names used:
whoosh_in, whoosh_air, whoosh_air_short, boom, thud, whip, pop0–2, swish0–2, rswish0–7, rwhoosh0–6, impact_big, ding_land, crash –
only sounds you may use); every name without a file is made in code by `tools/sfx_synth.mjs` at the same length and level, and
the build says which ones it made.

## 9. Build
From the episode folder (needs ffmpeg, Node with `npm install`, Chrome, Python with numpy and faster-whisper), on Windows, macOS
or Linux:
- quick check of one piece: `node tools/build_episode.mjs --pieces ch2 --scale 0.5 --no-join`
- the whole episode: `node tools/build_episode.mjs --scale 1.3333334` (2560×1440) → `out/episode.mp4` and the YouTube chapter
  list `out/episode_chapters.txt`
- before recording: `--placeholder` builds with the computer's test voice (Windows speech, macOS `say`, Linux `espeak-ng`) so you
  can check the flow.
- Windows only, same steps: `powershell -File tools/build_episode.ps1 -Pieces ch2 -Scale 0.5 -NoJoin`.
- Narration in another language: set `WHISPER_LANG` (e.g. `de`) before building.

## 10. Measure and fix
`python tools/measure_video.py out/episode.mp4 out/measure` and compare with `study/ghost.measure.md` (the biggest hit) and
`study/kratos.measure.md`. Measure **every chapter on its own** too (`--chapters out/episode_chapters.txt` adds one row per chapter): the density has
to hold in every part (Ghost: no chapter
under ~16 cuts per minute; the two newest episodes that drop to ~10 in their long chapters have a tenth of its views).
Targets: 20–28 cuts per minute, static shots ≤ 25 %, mean brightness 0.23–0.36, saturation 0.44–0.62, −14 LUFS. What our first render got wrong and how
it was fixed (every same-room cut gets its own light, the camera never fully stops, a colour grade tuned on 218 frames until
the brightness matched Kratos): `example/achilles/COMPARE.md`.

## 11. Upload package (STYLE_BIBLE §8, SCRIPT_FORMULA §6)
Title `What If You Were Born as [Name]? | [World]`; the description in the fixed order (preview → "This is the whole life of …
told as if it were yours." → key moments → the final question + "Who should be born next? Tell me in the comments." →
chapters from the build → sources + "All illustrations, animation and music are original."); thumbnail: the baby ("AGE 0")
next to the grown-up, one big word – or, like the newest episodes, no text at all.

## Gotchas (real mistakes from building the Achilles episode – check every new episode for them)
- **Look at the render, not the code.** The first cast sheet had the mother in what read as a hood and a hair bow that read as
  cat ears. Only the rendered image showed it. Render `design/cast2.html` (and one still per new set) and read the picture.
- **A picture that does not match the sentence reads as a mistake.** When the narrator says "the heel", show the heel – not the
  baby screaming two shots earlier. One idea per shot, and it lands 0–3 frames before its word.
- **Whisper puts word ends too early.** Cut on its times and sentence ends get clipped ("Achilles." became "Akili."). Run
  `tools/fix_word_ends.py` before anything shortens pauses (the build does).
- **Shortening pauses also shortens the breath where a sentence was cut out of a take.** That joint then sounds chopped. Put a
  0.5–0.7 s pause back after the pause step, and better: write so that nothing has to be cut out.
- **A same-room cut is not a cut.** Reframing inside one set barely changes the picture – the measuring tool found 18 of our 28
  designed cuts. Give every same-room cut its own light (spotlight, rays, sky, burst); then it found 26.
- **The first render always looks finished.** Ours was too slow (14 cuts/min), too still (44 % static shots), too bright (0.47)
  and too pale (0.39). Only measuring with the same tool as the original showed it (`example/achilles/COMPARE.md`).
- **Tune the colour grade on sample frames first** (`tools/frame_stats.py` on ~200 frames), then render everything.
- **Old frames survive.** A render into a folder with frames from a longer earlier render leaves the old tail in the video.
  The build empties the folder first; do the same when you render by hand.
- **A broken scene page can leave the old render in place without an error.** After every render check `cues.json`: the frame
  count and `realVoice: true` (the build stops if the word timings did not load).
- **Comedy hits stop at the end of a life.** 12–16 effects per minute in the comic part, 5–7 in the last chapters, no gag
  sounds after the low point.
- **Thumbnail:** cut it from full-resolution frames (never upscale a small image), 1920×1080, and check it at feed size (~360 px).

## A new life from the example
Copy `example/achilles/` → write `LIFE.md`, the `voice/*.txt` and `EPISODE.md` for your life → record → add or change the
characters in `lib/cast2.js` (render `design/cast2.html` and look) → one scene per piece in `scenes/` → one score per piece in
`tools/score/` → list the pieces, their files and the chapter titles in `episode.json` → build, measure, fix.

## Paths
Tools find ffmpeg on the PATH (or `FFMPEG`), numpy via `PYLIB` if it is not installed, Chrome via `CHROME`, Python via `PYTHON`,
effects via `SFX_KIT`. Claude can adapt them to your machine.
