"""fix_word_ends.py - whisper puts word ends too early. Every pop and cut hangs on these timings, so a word that ends
too early makes a label land too early. This moves every word's "e" to the
real end in the finished voice: the first moment where the 10 ms level stays 45 dB under the speech level for 40 ms
(never past the next word's start). Usage: python fix_word_ends.py <voice.wav> <words.json> [dB under speech=45] [max extension s=0.45]   (rewrites words.json)
"""
import os
import json, subprocess, sys
sys.path.insert(0, os.environ.get('PYLIB', 'lib'))
import numpy as np  # noqa: E402

FF, SR = os.environ.get('FFMPEG', 'ffmpeg'), 16000
wav, wj = sys.argv[1], sys.argv[2]
DB = float(sys.argv[3]) if len(sys.argv) > 3 else 45.0
CAP = float(sys.argv[4]) if len(sys.argv) > 4 else 0.45
raw = subprocess.run([FF, '-v', 'error', '-i', wav, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
a = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
hop = int(0.01 * SR)
env = np.array([np.sqrt(np.mean(a[i:i + hop] ** 2)) for i in range(0, len(a) - hop, hop)]) + 1e-9
db = 20 * np.log10(env)
speech = np.median(db[db > db.max() - 30])
W = json.load(open(wj, encoding='utf-8'))
moved = 0
for k, w in enumerate(W):
    limit = W[k + 1]['s'] - 0.02 if k + 1 < len(W) else len(a) / SR
    i, quiet, end = int(w['e'] / 0.01), 0, None
    while i < len(db) and i * 0.01 < limit:
        quiet = quiet + 1 if db[i] < speech - DB else 0
        if quiet >= 4: end = (i + 1) * 0.01 - 0.03; break
        i += 1
    end = min(end if end is not None else limit, w['e'] + CAP, limit)
    if end > w['e'] + 0.01: w['e'] = round(end, 3); moved += 1
# word STARTS too (21.11.: "Eight hundred" lost its "Ei-" because the pause cut started at whisper's late start):
# go back from the start while there is still sound, at most 0.15 s, never into the previous word
for k, w in enumerate(W):
    floor = W[k - 1]['e'] + 0.02 if k > 0 else 0.0
    i = int(w['s'] / 0.01) - 1
    start = w['s']
    while i >= 0 and i * 0.01 > max(floor, w['s'] - 0.15) and db[i] >= speech - DB:
        start = i * 0.01; i -= 1
    if start < w['s'] - 0.01: w['s'] = round(max(floor, start - 0.02), 3); moved += 1
json.dump(W, open(wj, 'w', encoding='utf-8'), ensure_ascii=False)
print(f'{wj}: {moved}/{len(W)} word ends moved to the real end')
