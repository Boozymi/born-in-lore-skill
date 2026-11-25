# frame_sheets.ps1 - every single frame of a clip on contact sheets, so Claude can study the motion frame by frame.
# One sheet = 10 x 6 = 60 frames = 2 seconds at 30 fps. The frame number is burned into every tile.
# Usage (Windows): powershell -File tools\frame_sheets.ps1 <video> <start s> <seconds> <out dir>
# macOS / Linux, the same sheets (first = start s × 30):
#   ffmpeg -ss <start> -t <seconds> -i <video> -an -vf "fps=30,scale=320:-2,drawtext=text='%{eif\:n+<first>\:d}':x=6:y=4:fontsize=18:fontcolor=white:box=1:boxcolor=black@0.6,tile=10x6:padding=3:color=0x111111" -q:v 3 <out dir>/s%02d.jpg
param([string]$Video, [double]$Start, [double]$Seconds, [string]$Out)
$ff = 'ffmpeg'                     # ffmpeg on the PATH
New-Item -ItemType Directory -Force $Out | Out-Null
$first = [int][Math]::Round($Start * 30)   # frame number of the first tile

& $ff -v error -y -ss $Start -t $Seconds -i $Video -an `
  -vf "fps=30,scale=320:-2,drawtext=fontfile='C\:/Windows/Fonts/consola.ttf':text='%{eif\:n+$first\:d}':x=6:y=4:fontsize=18:fontcolor=white:box=1:boxcolor=black@0.6,tile=10x6:padding=3:color=0x111111" `
  -q:v 3 (Join-Path $Out 's%02d.jpg')

Get-ChildItem $Out -Filter 's*.jpg' | ForEach-Object { '{0}  {1:N0} KB' -f $_.Name, ($_.Length / 1KB) }
