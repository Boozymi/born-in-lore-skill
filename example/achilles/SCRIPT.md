# SCRIPT – "What If You Were Born as Achilles?" (the hook and chapter I, fully built)

The full life is planned in `LIFE.md`. Built first, as the example for every other chapter:

| piece | length | what it shows |
|---|---|---|
| **1 · Hook** | ~25 s | the hook formula in 25 s |
| **2 · Chapter I "Pyrrha"** (with chapter card) | ~50 s | the first chapter, start to finish |

Together ~75 s = ~2,250 frames at 30 fps. Narrator: a calm voice, 2.5 words per second (measured Born-in-Lore pace), not an excited voice.
Timing rules from `STYLE_BIBLE.md` (skill root) §5: text pops in 3–4 frames with overshoot, arrows draw on in ~10 frames, joke beat = action → 13-frame pause → pop, chapter card ≈ 1.7 s (fade in 10, hold 25, fade out 6), ~22 cuts per minute, acting never stops inside a shot.
Our own look: flat 2D vector, warm parchment and dusk palette from the measurement, Greek meander borders. **No lightning-flash opening, no "(that's you)" wording, no blackletter card** – those are theirs. We use the timing, not their designs.

---

## Piece 1 · Hook (62 words ≈ 25 s)

| # | narration | picture | text on screen | sound |
|---|---|---|---|---|
| 1 | *If you were born as Achilles,* | the grown-up hero on a cliff over the sea at dusk, slow push-in (no flash) | name tag **ACHILLES (you)** pops on "Achilles" | low drone in, music starts |
| 2 | *you'd kill lions at six,* | kid Achilles (6) drags a knocked-out lion (bigger than him) by the tail out of Chiron's cave, proud | **AGE 6** pops (3 frames) | soft thud on the lion drop |
| 3 | *then a son of Poseidon,* | adult Achilles, a man with a sea-blue trident emblem on his shield goes down; helmet strap in Achilles' hand | pointer label **SON OF POSEIDON** + arrow (10 frames) | hit |
| 4 | *then Troy's greatest prince,* | dusk, the gate of Troy; Hector's silhouette against the light | – | whoosh |
| 5 | *in front of his own father.* | tiny old Priam on the wall, hands to his face; slow push-in | – | music dips |
| 6 | *And you'd pick that life on purpose,* | a signpost: LONG & QUIET (farmhouse, green hill) or SHORT & LEGENDARY (fiery sky, spears); adult Achilles walks right without looking back | board texts | – |
| 7 | *knowing exactly how short it is.* | the Fates' thread: a big ball of thread for everyone else, one short golden piece for you, bronze shears closing on it | **EVERYONE ELSE** · **YOU** + arrow | snip at the end |
| 8 | *But right now, you're a baby,* | hard cut: the black river Styx; the baby hangs **upside down**, a hand holds him by the ankle, the heel on top | name tag **ACHILLES (still you)** pops on "baby" | music resolves |
| 9 | *hanging upside down by one heel* | wider: Thetis (hair like water, worried) on a rock above the river, holding him out | – | – |
| 10 | *over the river of the dead,* | the dip: everything goes under except the heel, rings on the water | **THE HEEL (stays dry)** + arrow to the dry heel | soft splash |
| 11 | *and you're already screaming for attention.* | pulled out, dripping, the baby screams, shake + shout lines | **LOUD** pops, tilted, yellow | – |

*Built: `scenes/hook.html`, 11 shots in ~25 s (≈ 26 cuts per minute with the estimated timing). Snaps to the real voice with `?words=../voice/hook/words.json`.*

## Piece 2 · Chapter I "Pyrrha" (121 words ≈ 48 s + card 1.7 s)

| # | narration | picture | text on screen | sound |
|---|---|---|---|---|
| 0 | – | fade to black → **chapter card**: small bronze shield emblem, letter-spaced gold **CHAPTER I**, title **Pyrrha** in our serif · 10 / 25 / 6 frames | CHAPTER I · Pyrrha | whoosh + soft boom |
| 1 | *Then a seer says Troy can't fall without you.* | old seer with a staff in a smoky tent, pointing straight at the camera | – | – |
| 2 | *So your mom does what any goddess would do. She hides you.* | Thetis rises out of the sea, grabs teen Achilles by the wrist; he's mid-bite of an apple | – | splash |
| 3 | *On an island, in a palace full of princesses.* | Skyros palace hall, parchment walls with meander border, six princesses in a row, slow drift | – | – |
| 4 | *As a girl.* | teen Achilles in a long dress, arms crossed, between the princesses; he's a head taller | – | – |
| 5 | *Your new name is Pyrrha.* | close-up, his name tag | **ACHILLES** → red line crosses it out (3 frames) → **13 frames nothing** → **PYRRHA** pops in yellow, tilted (4 frames) | hit on the strike, hit on the pop |
| 6 | *You're a teenager. It's not going great.* | he trips over the hem; a princess helps him up, he glares | – | – |
| 7 | *Then Odysseus shows up with gifts.* | Odysseus at the door: red beard, smirk, a cart of presents | name label **ODYSSEUS** small | door creak |
| 8 | *Dresses, jewelry, and, for some reason, one shield.* | the princesses crowd round dresses and jewelry; the shield lies at the edge of the pile | pointer **ONE (1) SHIELD** + arrow | – |
| 9 | *Somewhere outside, a war trumpet blows.* | wide: a soldier outside the window blows a long horn | – | horn (short, distant) |
| 10 | *Every girl in the room runs.* | everyone runs out of frame, dust | – | whoosh |
| 11 | *One of them grabs a spear.* | Achilles alone in the dress, spear and shield in hand, battle stance; Odysseus' smirk in the background | – | hit |
| 12 | *Before you sail, your mom tells you half her secret.* | night beach, ships in the dark; Thetis knee-deep in the water, Achilles (now in armor) facing her | – | music drops to a pad |
| 13 | *Two lives.* | two scrolls float up between them | – | – |
| 14 | *A long one at home, and nobody ever learns your name.* | left scroll unrolls: an old man on a porch, alone, fading to grey | scroll text **LONG LIFE · nobody remembers** | – |
| 15 | *Or a short one, and they sing about you forever.* | right scroll unrolls: a crowd around a singer with a lyre, Achilles' face on a painted vase | scroll text **SHORT LIFE · sung forever** | lyre phrase (2 notes) |
| 16 | *You pick fast. You always do.* | he grabs the right scroll before she finishes; her face | stamp **CHOSEN** slams on it | stamp hit |
| 17 | *Congratulations, Pyrrha. You're going to war.* | wide: 50 ships at dawn, Achilles at the bow, the dress thrown over the railing | – | music swells, then cut |

*Built: `scenes/chapter1.html` – chapter card + 17 shots, 50 s, on the narrator's word timings (`voice/part/words.json`, voice starts at 1.6 s after the card). Changes vs. the table: shot 2 = Thetis rises and whisks him off (no apple), the war horn has a flared bell, the scrolls are a vignette (grey house + old man / black-figure vase + music notes), the dress hangs over the railing next to him. Sound: `tools/sound_piece.mjs ch1` – our score in sections (seer drone → Dorian comedy vamp with a falling run on "not going great" → silence for the horn → scurry → D-major stab on the spear → slow night pads, golden Bbmaj7 for the short life → heroic finale with a hit on "war"), 13 effects.*

**Numbers:** ~28 shots in ~75 s (≈ 22 cuts per minute, like Kratos) · 10 text devices · 2 timed joke beats (Pyrrha strike-through, CHOSEN stamp) · ~15 sound effects (≈ 12 per minute, like Born in Lore – a cartoon may be busier than a talking video).
**Sources:** see `LIFE.md` §5. Skyros, the gifts and the trumpet: Apollodorus, *Library* 3.13; Statius, *Achilleid*. Pyrrha: Hyginus, *Fabulae* 96. Two lives: *Iliad* 9. "Before you sail" is our staging (the sources don't say when Thetis told him).
