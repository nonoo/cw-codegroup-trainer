# CW Codegroup Trainer

Morse code receiving practice in the browser: one-minute rounds of random code groups,
a copy check, and a per-character mistake summary.

**▶ Open the trainer: <https://nonoo.github.io/cw-codegroup-trainer/>**

## Install it as an app

| Platform | Steps |
| --- | --- |
| Android / Chrome | Open the link → ⋮ menu → **Install app** (older builds: *Add to Home screen*) |
| iOS / Safari | Open the link → **Share** → **Add to Home Screen** |
| Desktop Chrome / Edge | Install icon in the address bar, or ⋮ → *Cast, save and share* → *Install page as app* |

After the first load it works with no network at all — the page caches itself and the
CW library locally, and the audio is synthesized in the browser.

## How it works

- On load, a **~1 minute round** of random code groups is generated (no autoplay).
- **Play** toggles start/pause, **Stop** stops and rewinds to the beginning, and the
  elapsed-time indicator counts playback seconds.
- Write the groups you copied into the textarea (case-insensitive, separated by spaces)
  and press **Check Result**.
- The summary shows groups sent / copied, correct groups, character errors, **error rate**,
  and a per-group diff: red = wrong or missed character, amber = extra character typed,
  `_` = missing position, `—` = whole group not copied.
- Closing the summary starts a fresh round; reloading the page does too.

Fixed parameters: **20 WPM**, **600 Hz**, group lengths **2–7** characters, alphabet
`A–Z 0–9 . = ? /`.

## Run it locally

```sh
python3 -m http.server 8000
# then open http://localhost:8000/
```

`localhost` counts as a secure context, so installing and offline caching work there as
well. Opening `index.html` directly from disk (`file://`) is fine for practice, but
browsers refuse to install a page or register a service worker from `file://`.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole app (UI, round generation, playback control, result check) |
| `jscwlib-0.3.0.js` | Vendored CW playback library |
| `manifest.webmanifest` | Web app manifest (name, icons, standalone display) |
| `sw.js` | Service worker: offline cache of the app shell |
| `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | App icons |

## Credits

- CW playback: [jscwlib](https://fkurz.net/ham/jscwlib.html) 0.3.0 by Fabian Kurz, DJ1YFK —
  MIT licensed, vendored here as `jscwlib-0.3.0.js`.
- The check-result workflow is modelled on the [LCWO](https://lcwo.net/) code group trainer.
