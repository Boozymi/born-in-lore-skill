# kratos - picture measured frame by frame

- frames: 14568 (485.6 s at 30 fps)
- shots: 181 -> one cut every 2.70 s; 22.2 cuts per minute
- shot length: median 1.80 s, mean 2.68 s, p10 0.30 s, p90 6.27 s, longest 18.70 s
- shots per minute: 22 / 27 / 24 / 31 / 22 / 19 / 17 / 18 / 1
- inside a shot: static 19 %, slow drift 50 %, moving 31 % of shots
- frames with any visible change (motion > 0.002): 70 %
- light: mean luma 0.33 (p10 0.12, p90 0.58); saturation mean 0.46 (p10 0.23, p90 0.70)
- dark frames (luma < 0.06): 5.5 %

## Palette (k-means over sampled pixels)

| colour | share |
|---|---|
| #0e080c | 26.5 % |
| #2d2c3b | 12.3 % |
| #512714 | 12.0 % |
| #5f596f | 8.7 % |
| #79543a | 8.2 % |
| #ab8664 | 7.7 % |
| #dabf98 | 7.5 % |
| #8f96ab | 7.4 % |
| #d1d2cf | 6.8 % |
| #b64f18 | 2.8 % |
