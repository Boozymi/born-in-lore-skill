// build_episode.mjs – the whole episode from its pieces, on Windows, macOS and Linux (same steps as build_episode.ps1):
// narrator take -> word timings (faster-whisper, aligned to the script's own words) -> frames (Chrome) -> sound (tools/sound_piece.mjs:
// score + effects + mix) -> one movie per piece -> one video with a single loudness pass (-14 LUFS, -1.5 dBTP) + the YouTube chapters.
// Needs: ffmpeg + ffprobe (PATH, or FFMPEG / FFPROBE), Node with puppeteer-core (npm install), Chrome (CHROME if not the default path),
//        Python with numpy + faster-whisper (PYTHON, default python3 / python), your narrator takes in voice/ (names in episode.json).
//        Effects: your WAVs in sfx/ (SFX_KIT) – any that are missing are made in code (tools/sfx_synth.mjs).
// Usage (from anywhere): node tools/build_episode.mjs [--pieces hook,prologue,...] [--scale 1] [--name episode]
//   --scale 1.3333334 = 2560x1440 (final) · 1 = 1920x1080 · 0.5 = quick check
//   --no-join: pieces only · --join-only · --skip-frames
//   --placeholder: pieces without a take get a computer test voice (Windows: System.Speech, macOS: say, Linux: espeak-ng/espeak)
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const has = k => args.includes(k);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const E = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');   // the episode folder
const J = JSON.parse(fs.readFileSync(path.join(E, 'episode.json'), 'utf8'));
const P = new Map(J.pieces.map(x => [x.id, x]));
let pieces = (opt('--pieces', '') || '').split(',').filter(Boolean);
if (!pieces.length) pieces = [...P.keys()];
for (const k of pieces) if (!P.has(k)) { console.error(`unknown piece "${k}" (episode.json has: ${[...P.keys()].join(', ')})`); process.exit(1); }
const SCALE = Number(opt('--scale', 1)), NAME = opt('--name', 'episode');
const FF = process.env.FFMPEG || 'ffmpeg';
const FP = process.env.FFPROBE || (process.env.FFMPEG ? process.env.FFMPEG.replace(/ffmpeg(\.exe)?$/i, m => m.replace(/ffmpeg/i, 'ffprobe')) : 'ffprobe');
const PY = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
if (!process.env.SFX_KIT) process.env.SFX_KIT = path.join(E, 'sfx');
const OUT = path.join(E, 'out', 'ep'); fs.mkdirSync(OUT, { recursive: true });

function run(cmd, a, { capture = false, allowFail = false } = {}) {
  const r = spawnSync(cmd, a, { cwd: E, encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit', maxBuffer: 1 << 28 });
  if (r.error) throw new Error(`${cmd}: ${r.error.message}`);
  if (r.status !== 0 && !allowFail) throw new Error(`${cmd} ${a.slice(0, 3).join(' ')} … failed (${r.status})${capture ? '\n' + (r.stderr || '').slice(-800) : ''}`);
  return r;
}
const mtime = f => fs.existsSync(f) ? fs.statSync(f).mtimeMs : 0;
const dur = f => Number(run(FP, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], { capture: true }).stdout.trim());

// a computer test voice, so the flow can be checked before the real takes exist
function placeholder(txtFile, wav) {
  if (process.platform === 'win32') {
    const ps = `Add-Type -AssemblyName System.Speech; $s = New-Object System.Speech.Synthesis.SpeechSynthesizer;` +
      `$en = $s.GetInstalledVoices() | Where-Object { $_.VoiceInfo.Culture.Name -like 'en*' } | Select-Object -First 1;` +
      `if ($en) { $s.SelectVoice($en.VoiceInfo.Name) }; $s.SetOutputToWaveFile('${wav.replace(/'/g, "''")}');` +
      `$s.Speak([IO.File]::ReadAllText('${txtFile.replace(/'/g, "''")}')); $s.Dispose()`;
    run('powershell', ['-NoProfile', '-Command', ps]);
  } else if (process.platform === 'darwin') {
    const aiff = wav.replace(/\.wav$/, '.aiff');
    run('say', ['-o', aiff, '-f', txtFile]);
    run(FF, ['-v', 'error', '-y', '-i', aiff, wav]);
  } else {
    const tts = ['espeak-ng', 'espeak'].find(c => !spawnSync(c, ['--version']).error);
    if (!tts) throw new Error('no test voice: install espeak-ng (or record the takes)');
    run(tts, ['-v', 'en', '-w', wav, '-f', txtFile]);
  }
}

if (!has('--join-only')) for (const k of pieces) {
  const x = P.get(k);
  const txtF = path.join(E, 'voice', x.text), dir = path.join(E, 'voice', x.words);
  fs.mkdirSync(dir, { recursive: true });
  let src = path.join(E, 'voice', x.take);
  const paced = src.replace(/\.[^.]+$/, '.wav');                    // a take with longer sentence pauses (tools/pace_pauses.py) wins
  if (fs.existsSync(paced)) src = paced;
  if (!fs.existsSync(src)) {
    if (!has('--placeholder')) { console.log(`== ${k} : no narrator take (${x.take}) - skipped (use --placeholder for a test voice)`); continue; }
    src = path.join(dir, 'placeholder.wav'); placeholder(txtF, src);
  }
  console.log(`== ${k} (${path.basename(src)})`);
  // 1) word timings, aligned to the script's own words (rebuilt when the take or the text is newer)
  const wj = path.join(dir, 'words.json');
  if (mtime(wj) < mtime(src) || mtime(wj) < mtime(txtF)) {
    run(FF, ['-v', 'error', '-y', '-i', src, '-ac', '1', '-ar', '16000', '-c:a', 'pcm_s16le', path.join(dir, 'raw16k.wav')]);
    run(PY, [path.join(E, 'tools', 'transcribe.py'), path.join(dir, 'raw16k.wav'), path.join(dir, 'raw.txt')]);
    run(PY, [path.join(E, 'tools', 'voice_prep.py'), path.join(dir, 'raw.words.json'), txtF, wj]);
    run(PY, [path.join(E, 'tools', 'fix_word_ends.py'), src, wj]);
  }
  // 2) frames
  const fdir = path.join(OUT, k);
  if (!has('--skip-frames')) {
    fs.mkdirSync(fdir, { recursive: true });
    for (const f of fs.readdirSync(fdir)) if (f.endsWith('.jpg')) fs.unlinkSync(path.join(fdir, f));   // no leftover frames of older renders
    run(process.execPath, [path.join(E, 'tools', 'render.mjs'), x.scene, '--out', `out/ep/${k}`, '--scale', String(SCALE), '--fmt', 'jpg', '--q', '92',
      '--query', `words=../voice/${x.words}/words.json`]);
    if (!JSON.parse(fs.readFileSync(path.join(fdir, 'cues.json'), 'utf8')).realVoice) throw new Error(`${k}: the page did not load the word timings`);
  }
  // 3) sound and 4) movie
  const mixF = path.join(OUT, `${k}_mix.wav`);
  run(process.execPath, [path.join(E, 'tools', 'sound_piece.mjs'), k, src, wj, path.join(fdir, 'cues.json'), mixF]);
  run(FF, ['-v', 'error', '-y', '-framerate', '30', '-i', path.join(fdir, '%05d.jpg'), '-i', mixF, '-c:v', 'libx264', '-preset', 'medium', '-crf', '17',
    '-pix_fmt', 'yuv420p', '-c:a', 'pcm_s16le', '-shortest', path.join(OUT, `${k}.mov`)]);
}
if (has('--no-join')) { console.log('pieces done (no join)'); process.exit(0); }

// 5) all pieces in one video + one loudness pass
const w = Math.round(1920 * SCALE), h = Math.round(1080 * SCALE);
const parts = [...P.keys()].filter(k => fs.existsSync(path.join(OUT, `${k}.mov`)));
if (!parts.length) { console.error('no pieces built yet'); process.exit(1); }
const inputs = parts.flatMap(k => ['-i', path.join(OUT, `${k}.mov`)]);
let fc = parts.map((_, i) => `[${i}:v]scale=${w}:${h},setsar=1,fps=30[v${i}];[${i}:a]aresample=48000[a${i}];`).join('');
fc += parts.map((_, i) => `[v${i}][a${i}]`).join('') + `concat=n=${parts.length}:v=1:a=1[v][a]`;
const raw = path.join(OUT, `${NAME}_raw.mov`);
run(FF, ['-v', 'error', '-y', ...inputs, '-filter_complex', fc, '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17',
  '-pix_fmt', 'yuv420p', '-c:a', 'pcm_s16le', raw]);
const rep = run(FF, ['-hide_banner', '-i', raw, '-vn', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], { capture: true }).stderr;
const j = JSON.parse(rep.slice(rep.lastIndexOf('{'), rep.lastIndexOf('}') + 1));
const ln = `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true`;
const final = path.join(E, 'out', `${NAME}.mp4`);
run(FF, ['-v', 'error', '-y', '-i', raw, '-c:v', 'copy', '-af', `${ln},aresample=48000`, '-c:a', 'aac', '-b:a', '256k', final]);
// 6) the YouTube chapter list from the real piece lengths
let t = 0; const lines = [];
for (const k of parts) {
  const c = P.get(k).chapter;
  if (c) lines.push(`${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')} ${c}`);
  t += dur(path.join(OUT, `${k}.mov`));
}
fs.writeFileSync(path.join(E, 'out', `${NAME}_chapters.txt`), lines.join('\n') + '\n');
console.log(lines.join('\n'));
console.log(`done: ${final}`);
