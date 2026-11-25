# Changelog

## 1.0.0 – 2026-11-24

First public version.

- The complete workflow from a name to a finished episode (`SKILL.md`), with the questions Claude asks first and six
  checkpoints that wait for your OK. No fixed length: the story decides (the channel runs 7–14 minutes).
- The style bible and the script formula, measured on all six Born in Lore videos (16–17 Nov 2026), with the view counts at the
  study and one week later, plus the three newest episodes (Ghost, John Marston, Tommy Vercetti, measured 24 Nov 2026): longer
  episodes, the hook inside the prologue, a new ending, no text on the thumbnail, and the cut density measured per chapter.
- A whole example episode, "What If You Were Born as Achilles?", as a working project (`example/achilles/`).
- The build runs on Windows, macOS and Linux (`tools/build_episode.mjs`); the PowerShell build stays as a Windows extra.
- Every sound effect is also made in code (`tools/sfx_synth.mjs`), so an episode builds complete without an effects library.
- Narration in other languages: `WHISPER_LANG`.
- Gotchas from building the example, in `SKILL.md`.
- README: how it works, install in the Claude app, render tips with measured times, what to do when something goes wrong, and
  legal notes (your choice and your responsibility, no warranty, not affiliated).
