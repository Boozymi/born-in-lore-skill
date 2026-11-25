"""study_transcripts.py - turn the YouTube captions of every Born in Lore video into data Claude can study.

For each video folder in research/<id>/ it reads <id>.en-orig.vtt (word-level timings) and <id>.info.json
(title, chapters, views, upload date) and writes:
  study/<id>.words.tsv      every word with its start time
  study/<id>.chapters.md    the narration split by the video's own chapters, with timestamps
and one summary table study/transcripts.md: length, words, words per second, chapter count and length,
second-person share ("you"), and how each video opens and closes.
Usage: python tools/study_transcripts.py [research folder, default: research]
"""
import json
import os
import re
import sys

ROOT = sys.argv[1] if len(sys.argv) > 1 else 'research'   # folder with one sub-folder per video
OUT = os.path.join(ROOT, 'study')
TS = re.compile(r'<(\d\d):(\d\d):(\d\d\.\d\d\d)><c>(.*?)</c>')
CUE = re.compile(r'^(\d\d):(\d\d):(\d\d\.\d\d\d) -->')


def secs(h, m, s):
    return int(h) * 3600 + int(m) * 60 + float(s)


def words_from_vtt(path):
    """YouTube auto captions: the first word of a cue line has the cue start time, the rest carry <time><c> tags."""
    out, cue_start = [], 0.0
    for line in open(path, encoding='utf-8'):
        m = CUE.match(line)
        if m:
            cue_start = secs(*m.groups())
            continue
        if '<c>' not in line:
            continue
        first = line.split('<', 1)[0].strip()
        if first:
            out.append((cue_start, first))
        for h, mi, s, w in TS.findall(line):
            w = w.strip()
            if w:
                out.append((secs(h, mi, s), w))
    return out


def main():
    os.makedirs(OUT, exist_ok=True)
    rows = []
    for vid in sorted(os.listdir(ROOT)):
        d = os.path.join(ROOT, vid)
        vtt = os.path.join(d, vid + '.en-orig.vtt')
        if not os.path.isdir(d) or not os.path.exists(vtt):
            continue
        info = json.load(open(os.path.join(d, vid + '.info.json'), encoding='utf-8'))
        words = words_from_vtt(vtt)
        with open(os.path.join(OUT, vid + '.words.tsv'), 'w', encoding='utf-8') as f:
            f.write('t\tword\n' + ''.join(f'{t:.2f}\t{w}\n' for t, w in words))
        chapters = info.get('chapters') or [{'start_time': 0, 'end_time': info['duration'], 'title': 'all'}]
        md = [f"# {info['title']}\n", f"{info['duration']} s, {info.get('view_count')} views, uploaded {info.get('upload_date')}\n"]
        for c in chapters:
            ws = [w for t, w in words if c['start_time'] <= t < c['end_time']]
            md.append(f"\n## {int(c['start_time'] // 60)}:{int(c['start_time'] % 60):02d} {c['title']}  ({c['end_time'] - c['start_time']:.0f} s, {len(ws)} words)\n\n")
            md.append(' '.join(ws) + '\n')
        open(os.path.join(OUT, vid + '.chapters.md'), 'w', encoding='utf-8').write(''.join(md))
        speech = words[-1][0] - words[0][0] if words else 0
        you = sum(1 for _, w in words if re.fullmatch(r"(you|you're|you'd|you'll|your|yourself|you've)[.,!?]?", w.lower()))
        clen = [c['end_time'] - c['start_time'] for c in chapters]
        rows.append({
            'id': vid, 'title': info['title'], 'dur': info['duration'], 'views': info.get('view_count'),
            'words': len(words), 'wps': len(words) / speech if speech else 0, 'you': you / max(1, len(words)),
            'chapters': len(chapters), 'ch_med': sorted(clen)[len(clen) // 2], 'prologue': clen[0],
            'first': ' '.join(w for _, w in words[:14]), 'last': ' '.join(w for _, w in words[-18:]),
            'titles': ' / '.join(c['title'] for c in chapters),
        })
    rows.sort(key=lambda r: -(r['views'] or 0))
    md = ['# Born in Lore - transcripts in numbers\n\n',
          '| video | length | views | words | words/s | "you" share | chapters | median chapter | prologue |\n|---|---|---|---|---|---|---|---|---|\n']
    for r in rows:
        md.append(f"| {r['title'].split('|')[0].replace('What If You Were Born as ', '').strip(' ?')} | {r['dur'] // 60}:{r['dur'] % 60:02d} | {r['views']:,} | {r['words']} | {r['wps']:.2f} | {100 * r['you']:.1f} % | {r['chapters']} | {r['ch_med']:.0f} s | {r['prologue']:.0f} s |\n")
    md.append('\n## Chapter titles\n\n' + ''.join(f"- **{r['id']}**: {r['titles']}\n" for r in rows))
    md.append('\n## First and last words\n\n' + ''.join(f"- **{r['id']}** first: {r['first']} ... last: {r['last']}\n" for r in rows))
    open(os.path.join(OUT, 'transcripts.md'), 'w', encoding='utf-8').write(''.join(md))
    print(''.join(md[:2 + len(rows)]))


if __name__ == '__main__':
    sys.exit(main())
