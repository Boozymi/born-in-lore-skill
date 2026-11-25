"""pace_pauses.py - slow a narrator take down WITHOUT touching the voice: only the pauses after sentences get longer.
Born in Lore speaks at ~2.5-2.7 words/s; a take that came out faster (chapter III: 3.3 words/s) gets extra silence after every
'.', '?' or '!' until it reaches the target pace (default 2.9). Uses the transcriber's word timings (raw.words.json).
Usage: python -I pace_pauses.py <take.mp3> <raw.words.json> <out.wav> [target words/s = 2.9] [max extra per pause s = 0.45]
"""
import json, subprocess, sys, os
sys.path.insert(0, os.environ.get('PYLIB', 'lib'))
import numpy as np  # noqa: E402

FF = os.environ.get('FFMPEG', 'ffmpeg')
SR = 44100
take, wj, out = sys.argv[1:4]
target = float(sys.argv[4]) if len(sys.argv) > 4 else 2.9
cap = float(sys.argv[5]) if len(sys.argv) > 5 else 0.45
raw = subprocess.run([FF, '-v', 'error', '-i', take, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
a = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
W = json.load(open(wj, encoding='utf-8'))
speech = W[-1]['e'] - W[0]['s']
need = max(0.0, len(W) / target - speech)
ends = [k for k in range(len(W) - 1) if W[k]['w'].rstrip()[-1:] in '.?!']
extra = min(cap, need / max(1, len(ends)))
# cut points: the middle of each sentence gap (silence), so nothing of a word is touched
parts, last = [], 0
for k in ends:
    mid = int((W[k]['e'] + W[k + 1]['s']) / 2 * SR)
    parts += [a[last:mid], np.zeros(int(extra * SR), np.float32)]
    last = mid
parts.append(a[last:])
y = np.concatenate(parts)
pcm = (np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes()
subprocess.run([FF, '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s16le', out], input=pcm, check=True)
print(f'{len(W)} words, {len(ends)} sentence pauses +{extra:.2f} s each: {len(W) / speech:.2f} -> {len(W) / (speech + extra * len(ends)):.2f} words/s -> {out}')
