"""voice_prep.py - turn a narrator take into what the scenes need: words.json with the SCRIPT's words + real timings.

The transcriber (faster-whisper) hears names its own way ("Pyrrha" -> "Pira") and moves punctuation, so its words are
aligned to the script tokens (difflib over normalised words) and the script spelling is kept. Also reports the pace
(words per second without the silence at the ends) and every pause >= 0.3 s, so the joke beats can be checked.
Usage: python tools/voice_prep.py <raw.words.json> <script.txt> <out words.json>
"""
import difflib
import json
import re
import sys


def norm(w):
    return re.sub(r"[^a-z0-9']", '', w.lower())


def main():
    raw_p, script_p, out_p = sys.argv[1:4]
    raw = json.load(open(raw_p, encoding='utf-8'))
    toks = open(script_p, encoding='utf-8').read().split()
    a = [norm(x['w']) for x in raw]
    b = [norm(t) for t in toks]
    sm = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
    out = [None] * len(toks)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == 'equal' or (i2 - i1) == (j2 - j1):
            for k in range(j2 - j1):
                r = raw[i1 + k]
                out[j1 + k] = {'w': toks[j1 + k], 's': r['s'], 'e': r['e'], 'p': r.get('p', 1)}
        elif i2 > i1:
            # n heard words for m script words: spread the span evenly
            s, e = raw[i1]['s'], raw[i2 - 1]['e']
            m = j2 - j1
            for k in range(m):
                out[j1 + k] = {'w': toks[j1 + k], 's': round(s + (e - s) * k / m, 3), 'e': round(s + (e - s) * (k + 1) / m, 3), 'p': 0.5}
    # words the transcriber missed: squeeze them between their neighbours
    for j, o in enumerate(out):
        if o is None:
            prev = next((out[k] for k in range(j - 1, -1, -1) if out[k]), None)
            nxt = next((out[k] for k in range(j + 1, len(out)) if out[k]), None)
            s = prev['e'] if prev else 0.0
            e = nxt['s'] if nxt else s + 0.3
            out[j] = {'w': toks[j], 's': s, 'e': max(e, s + 0.05), 'p': 0.0}
    json.dump(out, open(out_p, 'w', encoding='utf-8'), indent=0)
    fixed = [(toks[j], raw[i]['w']) for tag, i1, i2, j1, j2 in sm.get_opcodes() if tag != 'equal'
             for i, j in zip(range(i1, i2), range(j1, j2))]
    speech = out[-1]['e'] - out[0]['s']
    print(f'{len(out)} words, speech {speech:.2f} s ({out[0]["s"]:.2f}-{out[-1]["e"]:.2f}), {len(out) / speech:.2f} words/s')
    if fixed:
        print('script spelling kept for:', ', '.join(f'{t} (heard "{h}")' for t, h in fixed))
    gaps = [(out[j]['w'], out[j + 1]['w'], out[j + 1]['s'] - out[j]['e']) for j in range(len(out) - 1)]
    print('pauses >= 0.30 s:', ', '.join(f'{x} | {y} {g:.2f}s' for x, y, g in gaps if g >= 0.3) or 'none')


if __name__ == '__main__':
    main()
