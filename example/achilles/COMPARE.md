# Ours vs. the original – measured with the same tool

Tool: `tools/measure_video.py`, same settings as for the six Born in Lore videos (every frame, 320x180, cut threshold 0.40).
Ours v1 = our first full render.

| | Kratos (823K) | all six Born in Lore | **ours v1** | verdict |
|---|---|---|---|---|
| cuts per minute | 22.2 | 15.8 – 27.6 | **14.0** | too slow – below even the slowest of the six |
| median shot | 1.80 s | 1.4 – 2.7 s | 2.32 s | slower |
| static shots | 19 % | 13 – 24 % | **44 %** | far too still |
| slow drift / moving | 50 % / 31 % | 45–64 % / 15–39 % | 44 % / 11 % | too little real movement |
| frames with visible change | 70 % | 59 – 71 % | **52 %** | the picture stands still too often |
| mean brightness (luma) | 0.33 | 0.23 – 0.36 | **0.47** | too bright |
| saturation | 0.46 | 0.44 – 0.62 | **0.39** | too pale |
| dark frames | 5.5 % | 2 – 8 % | 2.2 % | ok |

## Why the cut count is low
We designed 28 cuts in the measured part. The tool found 18. The 10 it missed all stay in the same set
with the same colours (three Styx shots in a row, five shots in the palace hall, the reframings of the two scrolls):
a reframe in the same room barely changes the picture, so by the measure that counts for Kratos it is not a cut.

## What it means
To the eye, v1 looked finished. The numbers say: it cuts too rarely, stands still too often, and is too bright and too pale
for this style. Born in Lore is moodier (darker, richer colour) and keeps the picture moving in 70 % of all frames.

## After the fix – v2, measured again with the same tool

Our v2 render, same voice and mix, only the picture changed.

| | Kratos | all six | ours v1 | **ours v2** | |
|---|---|---|---|---|---|
| cuts per minute | 22.2 | 15.8 – 27.6 | 14.0 | **20.6** | inside the range |
| median shot | 1.80 s | 1.4 – 2.7 s | 2.32 s | **2.32 s** | inside |
| static shots | 19 % | 13 – 24 % | 44 % | **12 %** | a touch livelier than the six |
| slow drift / moving | 50 % / 31 % | 45–64 % / 15–39 % | 44 % / 11 % | **50 % / 38 %** | like Kratos |
| frames with visible change | 70 % | 59 – 71 % | 52 % | **84 %** | now above the range (the slow camera float never stops) |
| mean brightness | 0.33 | 0.23 – 0.36 | 0.47 | **0.33** | = Kratos |
| saturation | 0.46 | 0.44 – 0.62 | 0.39 | **0.55** | inside |
| dark frames | 5.5 % | 2 – 8 % | 2.2 % | **5.3 %** | = Kratos |

What changed: the cut detector now sees 26 of our 28 cuts (v1: 18) because same-room cuts got their own light – a spotlight for
"As a girl", violet rays for the name gag, red-gold rays for the spear, a moonlit sky over the river, a comic burst for the scream,
grey fog and gold light for the two scrolls. Every camera move is 2.4x bigger with a slow float, characters breathe more.
Colour grade: gamma R 1.55 / G 1.68 / B 1.82, saturation x0.95 (tuned on 218 sample frames with `tools/frame_stats.py`),
the palace walls and floor one step darker.

## The whole episode, measured with the same tool

All eleven pieces (hook, prologue, chapters I–IX, ending and end card), 8:30, built with `tools/build_episode.ps1`.

| | Kratos | all six | **the whole episode** |
|---|---|---|---|
| cuts per minute | 22.2 | 15.8 – 27.6 | **24.1** |
| median shot | 1.80 s | 1.4 – 2.7 s | **2.07 s** |
| static shots | 19 % | 13 – 24 % | **11 %** |
| slow drift / moving | 50 % / 31 % | 45–64 % / 15–39 % | **64 % / 26 %** |
| frames with visible change | 70 % | 59 – 71 % | **85 %** |
| mean brightness | 0.33 | 0.23 – 0.36 | **0.27** |
| saturation | 0.46 | 0.44 – 0.62 | **0.57** |
| dark frames | 5.5 % | 2 – 8 % | **5.6 %** |

Shots per minute over the episode: 29 / 30 / 20 / 25 / 29 / 20 / 21 / 22 / 10 – fastest in the comic prologue, slower at the
low points, the last minute is the quiet ending and the end card. Effects per minute: 12–16 in the comic part, 7 and 5 in the
last two chapters (on purpose: no comedy hits at the end of a life).

## Fix plan (then measure again)
1. **Cuts that read as cuts:** inside one set alternate wide shots with close-ups on a different, darker backdrop
   (reaction shots), and give each same-room cut a clear change of framing and light.
2. **Movement in every shot:** stronger push-ins and drifts, parallax between foreground and background, more acting
   (breathing, blinks, hair and cape sway, floating dust).
3. **Grade:** a global colour grade towards the measured range – darker mid-tones (target luma ≈ 0.33), more saturation
   (target ≈ 0.46), warmer shadows, a slightly stronger vignette.
