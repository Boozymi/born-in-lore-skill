"""frame_stats.py - mean brightness and saturation of a folder of frames, with the SAME formulas as
tools/measure_video.py (320x180, every 2nd pixel, luma = 0.299R+0.587G+0.114B, sat = (max-min)/max).
Used to tune the colour grade on sample frames before rendering everything.
Usage: python tools/frame_stats.py <folder> [<folder> ...]
"""
import os
import subprocess
import sys

sys.path.insert(0, os.environ.get('PYLIB', 'lib'))
import numpy as np  # noqa: E402

FF = os.environ.get('FFMPEG', 'ffmpeg')
W, H = 320, 180


def stats(folder):
    files = sorted(f for f in os.listdir(folder) if f.lower().endswith(('.jpg', '.png')))
    lum, sat = [], []
    for name in files:
        raw = subprocess.run([FF, '-v', 'error', '-i', os.path.join(folder, name), '-vf', f'scale={W}:{H}:flags=area,format=rgb24',
                              '-f', 'rawvideo', '-'], capture_output=True).stdout
        f = np.frombuffer(raw, np.uint8).reshape(H, W, 3)
        s = f[::2, ::2].astype(np.int32)
        l = (0.299 * s[..., 0] + 0.587 * s[..., 1] + 0.114 * s[..., 2]) / 255
        mx, mn = s.max(-1), s.min(-1)
        lum.append(float(l.mean()))
        sat.append(float(np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0).mean()))
    return len(files), float(np.mean(lum)), float(np.mean(sat))


if __name__ == '__main__':
    tot = []
    for d in sys.argv[1:]:
        n, l, s = stats(d)
        tot.append((n, l, s))
        print(f'{d}: {n} frames, luma {l:.3f}, saturation {s:.3f}')
    if len(tot) > 1:
        n = sum(t[0] for t in tot)
        print(f'all: luma {sum(t[0] * t[1] for t in tot) / n:.3f}, saturation {sum(t[0] * t[2] for t in tot) / n:.3f}')
