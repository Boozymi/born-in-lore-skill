# geralt - picture measured frame by frame

- frames: 12345 (411.5 s at 30 fps)
- shots: 110 -> one cut every 3.78 s; 15.9 cuts per minute
- shot length: median 2.68 s, mean 3.74 s, p10 1.23 s, p90 7.62 s, longest 19.00 s
- shots per minute: 9 / 14 / 18 / 19 / 18 / 15 / 17
- inside a shot: static 13 %, slow drift 64 %, moving 24 % of shots
- frames with any visible change (motion > 0.002): 69 %
- light: mean luma 0.36 (p10 0.12, p90 0.55); saturation mean 0.44 (p10 0.22, p90 0.69)
- dark frames (luma < 0.06): 2.2 %

## Palette (k-means over sampled pixels)

| colour | share |
|---|---|
| #0b0b11 | 19.7 % |
| #7a7b91 | 11.1 % |
| #2a3142 | 11.1 % |
| #535065 | 10.9 % |
| #733d22 | 10.2 % |
| #392312 | 9.4 % |
| #9cb1ca | 7.4 % |
| #cdb290 | 6.8 % |
| #dedbd1 | 6.7 % |
| #8b7750 | 6.6 % |
