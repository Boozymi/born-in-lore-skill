"""measure_video.py - measure the picture of a video frame by frame: cuts, shot lengths, motion, light, colour, palette.

Every frame is decoded (320x180, all 30 fps) and compared with the one before it:
  - cut      = colour histogram jumps (8x8x8 bins, half L1 distance > --cut) and is a local peak
  - motion   = mean absolute luma change to the previous frame (0..1), per shot median -> static / drift / moving
  - light    = mean luma, saturation = mean (max-min)/max
  - palette  = k-means (k=10) over pixels sampled every 15th frame
Writes to <out dir>: <name>.shots.tsv, <name>.measure.md (numbers + palette) and <name>.shots.jpg (one frame per shot,
numbered, so the shots can be looked at one by one).
With --chapters (a yt-dlp .info.json or a chapter list like out/episode_chapters.txt) it adds one row per chapter, so you see
whether every part is as densely cut as the prologue.
Usage: python tools/measure_video.py <video> <out dir> [--name N] [--cut 0.40] [--chapters <info.json | chapters.txt>]
"""
import json
import os
import re
import subprocess
import sys

sys.path.insert(0, os.environ.get('PYLIB', 'lib'))
import numpy as np  # noqa: E402

FF = os.environ.get('FFMPEG', 'ffmpeg')
W, H, FPS = 320, 180, 30


def frames(path):
    p = subprocess.Popen([FF, '-v', 'error', '-i', path, '-an', '-vf', f'fps={FPS},scale={W}:{H}:flags=area,format=rgb24',
                          '-f', 'rawvideo', '-'], stdout=subprocess.PIPE)
    n = W * H * 3
    while True:
        b = p.stdout.read(n)
        if len(b) < n:
            break
        yield np.frombuffer(b, np.uint8).reshape(H, W, 3)
    p.wait()


def kmeans(px, k=10, it=20, seed=1):
    rng = np.random.default_rng(seed)
    c = px[rng.choice(len(px), k, replace=False)].astype(np.float32)
    for _ in range(it):
        d = ((px[:, None, :] - c[None]) ** 2).sum(-1)
        lab = d.argmin(1)
        for j in range(k):
            m = px[lab == j]
            if len(m):
                c[j] = m.mean(0)
    share = np.bincount(lab, minlength=k) / len(px)
    o = np.argsort(-share)
    return c[o], share[o]


def chapters(path, dur):
    """[(title, start_s, end_s)] from a yt-dlp .info.json or a YouTube chapter list ("0:00 Prologue" per line)."""
    if path.endswith('.json'):
        info = json.load(open(path, encoding='utf-8'))
        return [(c['title'], c['start_time'], c['end_time']) for c in info.get('chapters') or []]
    marks = []
    for line in open(path, encoding='utf-8-sig'):
        m = re.match(r'\s*((?:\d+:)?\d+:\d\d)\s+(.+)', line)
        if m:
            secs = 0
            for p in m.group(1).split(':'):
                secs = secs * 60 + int(p)
            marks.append((m.group(2).strip(), secs))
    return [(t, s, marks[i + 1][1] if i + 1 < len(marks) else dur) for i, (t, s) in enumerate(marks)]


def per_chapter(shots, chs):
    """One row per chapter: is the picture as dense in every part as in the prologue?"""
    md = ['\n## Per chapter\n\n| chapter | length | cuts per minute | median shot | static | moving | luma | saturation |\n'
          '|---|---|---|---|---|---|---|---|\n']
    for title, a0, b0 in chs:
        ss = [s_ for s_ in shots if a0 <= s_[1] / FPS < b0]
        if not ss or b0 <= a0:
            continue
        k = [s_[5] for s_ in ss]
        md.append(f'| {title} | {b0 - a0:.0f} s | {60 * len(ss) / (b0 - a0):.1f} | {np.median([s_[3] for s_ in ss]):.2f} s | '
                  f'{100 * k.count("static") / len(k):.0f} % | {100 * k.count("moving") / len(k):.0f} % | '
                  f'{np.mean([s_[6] for s_ in ss]):.2f} | {np.mean([s_[7] for s_ in ss]):.2f} |\n')
    return md


def main():
    a = sys.argv[1:]
    video, out = a[0], a[1]
    name = a[a.index('--name') + 1] if '--name' in a else os.path.splitext(os.path.basename(video))[0]
    cut_thr = float(a[a.index('--cut') + 1]) if '--cut' in a else 0.40
    os.makedirs(out, exist_ok=True)

    hist_d, motion, luma, sat, mids, samples, prev_h, prev_l = [], [], [], [], {}, [], None, None
    keep = []  # every frame at 160x90 for the shot sheet (mid frames picked later)
    for i, f in enumerate(frames(video)):
        s = f[::2, ::2].astype(np.int32)
        q = (s[..., 0] >> 5) * 64 + (s[..., 1] >> 5) * 8 + (s[..., 2] >> 5)
        h = np.bincount(q.ravel(), minlength=512) / q.size
        l = (0.299 * s[..., 0] + 0.587 * s[..., 1] + 0.114 * s[..., 2]) / 255
        mx, mn = s.max(-1), s.min(-1)
        hist_d.append(0.0 if prev_h is None else 0.5 * np.abs(h - prev_h).sum())
        motion.append(0.0 if prev_l is None else float(np.abs(l - prev_l).mean()))
        luma.append(float(l.mean()))
        sat.append(float(np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0).mean()))
        prev_h, prev_l = h, l
        keep.append(f[::2, ::2].copy())
        if i % 15 == 0:
            samples.append(s.reshape(-1, 3)[::7])
    n = len(luma)
    hist_d, motion, luma, sat = map(np.array, (hist_d, motion, luma, sat))

    # cuts: big histogram jump that is also the largest change within +-3 frames (ignores flicker and flashes)
    cuts = [0]
    for i in range(1, n):
        lo, hi = max(1, i - 3), min(n, i + 4)
        if hist_d[i] > cut_thr and hist_d[i] >= hist_d[lo:hi].max() and i - cuts[-1] >= 4:
            cuts.append(i)
    cuts.append(n)
    shots = []
    for k in range(len(cuts) - 1):
        a0, b0 = cuts[k], cuts[k + 1]
        m = float(np.median(motion[a0 + 1:b0])) if b0 - a0 > 2 else 0.0
        kind = 'static' if m < 0.002 else 'drift' if m < 0.008 else 'moving'
        shots.append((k + 1, a0, b0, (b0 - a0) / FPS, m, kind, float(luma[a0:b0].mean()), float(sat[a0:b0].mean())))

    with open(os.path.join(out, name + '.shots.tsv'), 'w', encoding='utf-8') as f:
        f.write('shot\tstart_s\tend_s\tlen_s\tmotion\tkind\tluma\tsat\n')
        for s_ in shots:
            f.write(f'{s_[0]}\t{s_[1] / FPS:.2f}\t{s_[2] / FPS:.2f}\t{s_[3]:.2f}\t{s_[4]:.4f}\t{s_[5]}\t{s_[6]:.3f}\t{s_[7]:.3f}\n')

    lens = np.array([s_[3] for s_ in shots])
    kinds = [s_[5] for s_ in shots]
    dur = n / FPS
    pal, share = kmeans(np.concatenate(samples).astype(np.float32))
    per_min = np.histogram([s_[1] / FPS for s_ in shots], bins=np.arange(0, dur + 60, 60))[0]
    md = [f'# {name} - picture measured frame by frame\n\n',
          f'- frames: {n} ({dur:.1f} s at {FPS} fps)\n',
          f'- shots: {len(shots)} -> one cut every {dur / max(1, len(shots) - 1):.2f} s; {60 * (len(shots) - 1) / dur:.1f} cuts per minute\n',
          f'- shot length: median {np.median(lens):.2f} s, mean {lens.mean():.2f} s, p10 {np.percentile(lens, 10):.2f} s, p90 {np.percentile(lens, 90):.2f} s, longest {lens.max():.2f} s\n',
          f'- shots per minute: {" / ".join(str(x) for x in per_min)}\n',
          f'- inside a shot: static {100 * kinds.count("static") / len(kinds):.0f} %, slow drift {100 * kinds.count("drift") / len(kinds):.0f} %, moving {100 * kinds.count("moving") / len(kinds):.0f} % of shots\n',
          f'- frames with any visible change (motion > 0.002): {100 * (motion > 0.002).mean():.0f} %\n',
          f'- light: mean luma {luma.mean():.2f} (p10 {np.percentile(luma, 10):.2f}, p90 {np.percentile(luma, 90):.2f}); saturation mean {sat.mean():.2f} (p10 {np.percentile(sat, 10):.2f}, p90 {np.percentile(sat, 90):.2f})\n',
          f'- dark frames (luma < 0.06): {100 * (luma < 0.06).mean():.1f} %\n',
          '\n## Palette (k-means over sampled pixels)\n\n| colour | share |\n|---|---|\n']
    md += [f'| #{int(c[0]):02x}{int(c[1]):02x}{int(c[2]):02x} | {100 * s_:.1f} % |\n' for c, s_ in zip(pal, share)]
    if '--chapters' in a:
        md += per_chapter(shots, chapters(a[a.index('--chapters') + 1], dur))
    open(os.path.join(out, name + '.measure.md'), 'w', encoding='utf-8').write(''.join(md))

    # one frame per shot (middle frame), numbered, as a sheet
    tmp = os.path.join(out, '_shots_tmp')
    os.makedirs(tmp, exist_ok=True)
    for f_ in os.listdir(tmp):
        os.remove(os.path.join(tmp, f_))
    for s_ in shots:
        img = keep[(s_[1] + s_[2]) // 2]
        with open(os.path.join(tmp, f'{s_[0]:04d}.ppm'), 'wb') as f:
            f.write(b'P6 160 90 255\n' + img.tobytes())
    cols = 12
    rows = (len(shots) + cols - 1) // cols
    subprocess.run([FF, '-v', 'error', '-y', '-framerate', '1', '-start_number', '1', '-i', os.path.join(tmp, '%04d.ppm'), '-vf',
                    "scale=240:135,drawtext=fontfile='C\\:/Windows/Fonts/consola.ttf':text='%{eif\\:n+1\\:d}':x=4:y=3:fontsize=15:"
                    f"fontcolor=white:box=1:boxcolor=black@0.6,tile={cols}x{rows}:padding=3:color=0x111111",
                    '-frames:v', '1', '-q:v', '3', os.path.join(out, name + '.shots.jpg')], check=True)
    for f_ in os.listdir(tmp):
        os.remove(os.path.join(tmp, f_))
    os.rmdir(tmp)
    print(''.join(md[:10]))


if __name__ == '__main__':
    main()
