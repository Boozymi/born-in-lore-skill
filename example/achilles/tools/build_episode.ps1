# build_episode.ps1 – the whole episode from its pieces (EPISODE.md): narrator take -> word timings (faster-whisper, aligned to the
# script's own words) -> frames (Chrome) -> sound (tools/sound_piece.mjs: score + effects + mix) -> one mp4 per piece -> one video
# with a single loudness pass (-14 LUFS, -1.5 dBTP) and the YouTube chapter list.
# Needs: ffmpeg/ffprobe on the PATH, Node with puppeteer-core, Python with numpy + faster-whisper ($env:PYTHON, default python),
#        your narrator takes in voice/ (see the table below) and your effects in sfx/ ($env:SFX_KIT).
# The same build for Windows, macOS and Linux: node tools/build_episode.mjs (same options, written --no-join etc.).
#        Effects missing in sfx/ are made in code (tools/sfx_synth.mjs).
# Usage (Windows PowerShell, from anywhere): powershell -File tools\build_episode.ps1 [-Pieces hook,prologue,...] [-Scale 1]
#   The pieces, their files and the chapter titles come from episode.json in the episode folder.
#   -Scale 1.3333334 = 2560x1440 (final) · 1 = 1920x1080 · 0.5 = quick check · -NoJoin: pieces only · -JoinOnly · -SkipFrames
#   -Placeholder: pieces without a take get a Windows test voice (to check the flow before recording)
param([string[]]$Pieces = @(), [double]$Scale = 1, [string]$Name = 'episode', [switch]$Placeholder, [switch]$SkipFrames, [switch]$JoinOnly, [switch]$NoJoin)
$ErrorActionPreference = 'Stop'
$E = Split-Path $PSScriptRoot -Parent                      # the episode folder
# the running order lives in episode.json: one entry per piece (scene page, script text, narrator take, timings folder, chapter title)
$J = Get-Content "$E\episode.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$P = [ordered]@{}; $TITLES = [ordered]@{}
foreach ($x in $J.pieces) { $P[$x.id] = @($x.scene, $x.text, $x.take, $x.words); if ($x.chapter) { $TITLES[$x.id] = $x.chapter } }
$Pieces = @($Pieces | ForEach-Object { $_ -split ',' } | Where-Object { $_ })   # with -File, "ch2,ch3" arrives as one string
if (-not $Pieces.Count) { $Pieces = @($P.Keys) }
$py = if ($env:PYTHON) { $env:PYTHON } else { 'python' }
if (-not $env:SFX_KIT) { $env:SFX_KIT = "$E\sfx" }
$OUT = "$E\out\ep"; New-Item -ItemType Directory -Force $OUT | Out-Null
$inv = [Globalization.CultureInfo]::InvariantCulture
function Placeholder([string]$txtFile, [string]$wav) {
  Add-Type -AssemblyName System.Speech
  $s = New-Object System.Speech.Synthesis.SpeechSynthesizer
  $en = $s.GetInstalledVoices() | Where-Object { $_.VoiceInfo.Culture.Name -like 'en*' } | Select-Object -First 1
  if ($en) { $s.SelectVoice($en.VoiceInfo.Name) }
  $s.SetOutputToWaveFile($wav); $s.Speak((Get-Content $txtFile -Raw)); $s.Dispose()
}
function Dur([string]$f) { [double]::Parse((ffprobe -v error -show_entries format=duration -of csv=p=0 $f), $inv) }

if (-not $JoinOnly) { foreach ($k in $Pieces) {
  $scene, $txt, $take, $wd = $P[$k]
  $txtF = "$E\voice\$txt"; $dir = "$E\voice\$wd"; New-Item -ItemType Directory -Force $dir | Out-Null
  $src = "$E\voice\$take"
  $paced = [IO.Path]::ChangeExtension($src, '.wav')   # a take with longer sentence pauses (tools/pace_pauses.py) wins
  if (Test-Path $paced) { $src = $paced }
  if (-not (Test-Path $src)) {
    if (-not $Placeholder) { Write-Host "== $k : no narrator take ($take) - skipped (use -Placeholder for a test voice)"; continue }
    $src = "$dir\placeholder.wav"; Placeholder $txtF $src
  }
  Write-Host "== $k ($([IO.Path]::GetFileName($src)))"
  # 1) word timings, aligned to the script's own words (rebuilt when the take or the text is newer)
  $wj = "$dir\words.json"
  if (-not (Test-Path $wj) -or (Get-Item $wj).LastWriteTime -lt (Get-Item $src).LastWriteTime -or (Get-Item $wj).LastWriteTime -lt (Get-Item $txtF).LastWriteTime) {
    ffmpeg -v error -y -i $src -ac 1 -ar 16000 -c:a pcm_s16le "$dir\raw16k.wav"
    & $py "$E\tools\transcribe.py" "$dir\raw16k.wav" "$dir\raw.txt" | Out-Null
    & $py "$E\tools\voice_prep.py" "$dir\raw.words.json" $txtF $wj
    & $py "$E\tools\fix_word_ends.py" $src $wj
  }
  # 2) frames
  $fdir = "$OUT\$k"
  if (-not $SkipFrames) {
    New-Item -ItemType Directory -Force $fdir | Out-Null
    Get-ChildItem $fdir -Filter *.jpg -ErrorAction SilentlyContinue | Remove-Item -Force   # no leftover frames of older renders
    node "$E\tools\render.mjs" $scene --out "out/ep/$k" --scale $Scale --fmt jpg --q 92 --query "words=../voice/$wd/words.json" | Select-Object -Last 1
    if (-not (Get-Content "$fdir\cues.json" -Raw | ConvertFrom-Json).realVoice) { throw "$k : the page did not load the word timings" }
  }
  # 3) sound and 4) mov
  node "$E\tools\sound_piece.mjs" $k $src $wj "$fdir\cues.json" "$OUT\${k}_mix.wav"
  ffmpeg -v error -y -framerate 30 -i "$fdir\%05d.jpg" -i "$OUT\${k}_mix.wav" -c:v libx264 -preset medium -crf 17 -pix_fmt yuv420p -c:a pcm_s16le -shortest "$OUT\$k.mov"
} }
if ($NoJoin) { Write-Host 'pieces done (no join)'; exit 0 }

# 5) all pieces in one video + one loudness pass
$w = [int][Math]::Round(1920 * $Scale); $h = [int][Math]::Round(1080 * $Scale)
$parts = @($P.Keys | Where-Object { Test-Path "$OUT\$_.mov" })
$inputs = @(); $fc = ''
for ($i = 0; $i -lt $parts.Count; $i++) { $inputs += '-i'; $inputs += "$OUT\$($parts[$i]).mov"; $fc += "[${i}:v]scale=${w}:${h},setsar=1,fps=30[v$i];[${i}:a]aresample=48000[a$i];" }
$fc += (0..($parts.Count - 1) | ForEach-Object { "[v$_][a$_]" }) -join ''
$fc += "concat=n=$($parts.Count):v=1:a=1[v][a]"
ffmpeg -v error -y @inputs -filter_complex $fc -map '[v]' -map '[a]' -c:v libx264 -preset medium -crf 17 -pix_fmt yuv420p -c:a pcm_s16le "$OUT\${Name}_raw.mov"
$ErrorActionPreference = 'Continue'   # ffmpeg writes the loudnorm report to stderr
$m = (ffmpeg -hide_banner -i "$OUT\${Name}_raw.mov" -vn -af 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json' -f null - 2>&1 | Out-String)
$ErrorActionPreference = 'Stop'
$j = $m.Substring($m.LastIndexOf('{'), $m.LastIndexOf('}') - $m.LastIndexOf('{') + 1) | ConvertFrom-Json
$ln = "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$($j.input_i):measured_TP=$($j.input_tp):measured_LRA=$($j.input_lra):measured_thresh=$($j.input_thresh):offset=$($j.target_offset):linear=true"
ffmpeg -v error -y -i "$OUT\${Name}_raw.mov" -c:v copy -af "$ln,aresample=48000" -c:a aac -b:a 256k "$E\out\$Name.mp4"
# 6) the YouTube chapter list from the real piece lengths
$t = 0.0; $lines = @()
foreach ($k in $parts) {
  if ($TITLES.Contains($k)) { $lines += ('{0}:{1:D2} {2}' -f [int][Math]::Floor($t / 60), [int][Math]::Floor($t % 60), $TITLES[$k]) }
  $t += Dur "$OUT\$k.mov"
}
$lines | Out-File -Encoding utf8 "$E\out\${Name}_chapters.txt"
$lines
Write-Host "done: $E\out\$Name.mp4"
