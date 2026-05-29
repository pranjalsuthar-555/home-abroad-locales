# Home Abroad Locales

> **Status:** Live · Last updated May 2026

**Find where you belong.**

🌍 **Live:** [home-abroad-locales.vercel.app](https://home-abroad-locales.vercel.app) · Password: `i am home`

---

## The idea

Most tools for moving abroad treat it like a logistics problem. It isn't. It's a question about who you are and what kind of life you want.

This app starts there. A 10-question quiz designed so every answer feels right — because the tension between options is the only honest way to surface what you actually value. From there, a 3D globe pre-filtered to your personality type, with 8 adjustable dimensions, full destination postcards, and local writer perspectives.

Design philosophy: earn trust before asking for preferences. Every screen should feel like a letter, not a product.

---

## Screenshots

<img src="assets/globe.png" width="100%" alt="3D globe with destination pins filtered by personality"/>

<br/>

<img src="assets/quiz.png" width="48%" alt="Quiz question with genuine tension between options"/> <img src="assets/postcard.png" width="48%" alt="Destination postcard with full data and local voice"/>

---

## The personalities

| Type | Name | Vibe |
|---|---|---|
| 🏙️ **A** | Urban Explorer | Thrives in dynamic cities. Culture, connection, possibility. |
| 🌴 **B** | Coastal Dreamer | Salt air and slow living. Want to exhale, not perform. |
| 🏔️ **C** | Nature Seeker | Solitude and space. Nature is the point, not backdrop. |
| 🐓 **D** | Rooted Romantic | Belonging somewhere real. Community, roots, meaning. |

Most people are a blend. The combination is the real story.

---

## Features

**Personality quiz**
10 questions. Hybrid results when secondary types present. Results persist across sessions — returning users skip straight to the globe.

**3D Globe**
react-globe.gl + Three.js raycasting for hover and click. Warm atmosphere tint, auto-rotates when idle, pauses on interaction. Destination pins with hover tooltips and click-to-postcard modals.

**8 filter dimensions**
Personality type · Region · Language · Cost of living (dual-handle slider, USD/month) · Expat suitability score · Country trend · Advantages · Dealbreakers

**Destination postcards**
Full data per location: cost, suitability score, country trend, languages, advantages, disadvantages, local writers with links, personalised note based on your type.

**Guided walkthrough**
8-step interactive tour. Requires actual interaction before advancing — not passive. Replayable via the Tour button.

**Ambient audio**
Soft voice note on first entry. Mute/unmute with animated waveform. The sound tells you what kind of experience this is before the UI does.

---

## Tech stack

| Layer | Tool |
|---|---|
| Framework | React 19 + Vite 8 |
| Globe | react-globe.gl (Three.js) |
| CSV parsing | PapaParse |
| Deployment | Vercel (serverless functions + static frontend) |
| Styling | CSS custom properties + inline — no framework |

---

## The data

561 destinations. Each record: destination, country, region, personality tags, estimated monthly cost (USD), expat suitability score (1–5), languages spoken, country trend, advantages, dealbreakers, local writers with links, coordinates.

---

## Design details

**Palette:** warm almond `#EDE0D4` · coral CTAs `#FF6F61` · lion/sand `#B78A63`
**Fonts:** IM Fell English (editorial serif) · Beyond Sweet (script) · Arial (body)
**Motion:** `dreamFadeUp` · `waxStampPress` · `slowReveal` — slow and unhurried

Every animation name is intentional. The pacing tells you what this is before you read a word.

---

## Run locally

```bash
npm install
npm run dev
# → http://localhost:5173
```

Passphrase: `i am home`

---

## License

Private. All rights reserved.

---

Built by **Pranjal Suthar** for [Home Abroad](https://homeabroadhq.substack.com) — a Substack publication for people building lives across borders.

→ [GitHub](https://github.com/pranjalsuthar-555) · [LinkedIn](https://www.linkedin.com/in/sutharpranjal) · [Email](mailto:pranjalsuthar.work@gmail.com)
