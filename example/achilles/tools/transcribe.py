"""transcribe.py - word timings of a narrator take with faster-whisper (pip install faster-whisper).

Writes <out.txt> with one line per segment and, next to it, <out>.words.json: [{"w": word, "s": start, "e": end, "p": prob}, ...].
Input: a 16 kHz mono 16-bit wav (the build makes it with ffmpeg).
Usage: python transcribe.py <audio16k.wav> <out.txt> [model = small]
Language: English by default; for another narration language set WHISPER_LANG (e.g. de, es, fr).
"""
import json
import os
import sys
import wave

if os.environ.get('PYLIB'):   # packages installed into a separate folder (pip install --target <folder>)
    sys.path.insert(0, os.environ['PYLIB'])
import numpy as np  # noqa: E402
from faster_whisper import WhisperModel  # noqa: E402

model = WhisperModel(sys.argv[3] if len(sys.argv) > 3 else 'small', device='cpu', compute_type='int8')
with wave.open(sys.argv[1]) as w:
    audio = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
segs, info = model.transcribe(audio, language=os.environ.get('WHISPER_LANG', 'en'), word_timestamps=True, vad_filter=False, condition_on_previous_text=False)
words = []
with open(sys.argv[2], 'w', encoding='utf-8') as f:
    for s in segs:
        f.write(f'[{s.start:7.2f} - {s.end:7.2f}] {s.text.strip()}\n')
        for wd in s.words or []:
            words.append({'w': wd.word.strip(), 's': round(wd.start, 3), 'e': round(wd.end, 3), 'p': round(wd.probability, 3)})
with open(os.path.splitext(sys.argv[2])[0] + '.words.json', 'w', encoding='utf-8') as f:
    json.dump(words, f, indent=0)
print('done', round(info.duration, 2), 's,', len(words), 'words')
