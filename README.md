# ADS Blind Spot Simulator

Interactive geometry model of the blind spot that drive-based pole inspection
leaves on a roadside pole's circumference.

**Live page:** https://anthony0514.github.io/ads-visuallizer/

## What it models

A forward-looking camera on a survey vehicle captures a pole only while the pole
is ahead of the vehicle and inside the effective capture range `L`. Each captured
viewpoint sees half the pole's circumference, so the arc that is never captured
follows from how wide an azimuth range the drive sweeps.

    swept azimuth   Δθ  = (bearing span covered by the two passes)
    blind sector    θb  = 360° − 2τ − Δθ
    blind ratio         = θb / 360°

- `d` — perpendicular offset from the driving line to the pole
- `L` — effective capture range, the distance inside which resolution is usable
- `τ` — usable incidence limit; pure geometry means τ = 90°

Because the camera looks forward, one pass covers only the approach half of the
sweep. The return pass carries the other half, which is why the round trip is
required rather than optional.

At 40 km/h, 15 fps, L = 50 m, right-hand traffic:

| Pole | Offset | Swept azimuth | Blind | One pass only |
|------|--------|---------------|-------|---------------|
| A | 10.0 m | 152.8° | 7.6 % | 29.4 % |
| B | 12.5 m | 146.9° | 9.3 % | 30.2 % |
| C | 11.0 m | 150.4° | 8.3 % | 30.4 % |
| D | 15.0 m | 140.8° | 11.0 % | 31.0 % |
| E | 13.0 m | 145.7° | 9.6 % | 30.6 % |

## What it leaves out

- Straight road assumed. A curve widens the sweep and shrinks the blind sector.
- Horizontal azimuth only. Crossarms and insulators add an elevation constraint.
- Occlusion excluded. Trees, parked cars and walls are a separate line item.
- τ = 90° is a floor. A grazing-angle surface is visible but hard to read.
- The pole is a plain cylinder. Attachments cast their own shadows.

## Pages in this repository

`index.html` is a tab shell that loads each visualizer in place:

| Tab | File | What it covers |
|-----|------|----------------|
| Blind Spot | `blind-spot.html` | The blind sector left on a pole's circumference by a drive-based pass |
| 전주 기울기 | `pole_tilt.html` | Recovering pole tilt from the two images of a round trip |

Deep-link a tab with a hash: `.../#blind-spot`, `.../#pole-tilt`.

## Using it

Open `index.html`, or open either page on its own. Each visualizer is a single
self-contained file except for the Google Fonts link, so any static host works.
In the blind spot page, **Record GIF** renders one round trip frame by frame and
encodes a GIF in the page.

## Notes

`robots.txt` and a `noindex` meta tag keep this out of search results. The repository
is public so GitHub Pages can serve it, but the page is not meant to be indexed.
