# Home Abroad Locales

**Find where you belong.**

A personality quiz + interactive 3D globe that helps people seriously considering life abroad discover their ideal destination from 561 global locations.

🌍 **Live:** [home-abroad-locales.vercel.app](https://home-abroad-locales.vercel.app)  
📘 **Design philosophy:** feel like a beautiful letter, not a SaaS product.

---

## What it does

You enter the app, take a 10-question personality quiz designed to create genuine tension between lifestyle values, receive a primary + secondary personality type. From there, an interactive globe pre-filtered to your personality is waiting — with 8 adjustable filters (region, language, cost, expat suitability, country trend, advantages, dealbreakers) and a table view of all 561 destinations. Click any pin to see a full postcard with local writers, cost, languages, and a personalized note.

---

## The personalities

| Type | Name | Vibe |
|---|---|---|
| 🏙️ **A** | Urban Explorer | Thrives in dynamic cities. Culture, connection, possibility. |
| 🌴 **B** | Coastal Dreamer | Salt air and slow living. Want to exhale, not perform. |
| 🏔️ **C** | Nature Seeker | Solitude and space. Nature is the point, not backdrop. |
| 🐓 **D** | Rooted Romantic | Belonging somewhere real. Community, roots, meaning. |

Most people are a blend — the combination is the real story.

---

## Features that matter

**Personality quiz**
- 10 questions with genuine tension (every option should feel right)
- Hybrid results when secondary types present
- Results persist in localStorage — returning users skip straight to Explorer

**3D Globe**
- Powered by react-globe.gl + Three.js raycasting for hover + click
- Warm atmosphere tint, auto-rotates when idle, pauses on interaction
- Destination pins as emoji (📍) with hover tooltips + click-to-postcard modals

**Filter system (8 dimensions)**
- Personality (pre-filled from quiz)
- Region (continental groupings)
- Language (top 20 by destination count)
- Cost of living (dual-handle slider, USD/month)
- Expat suitability (1–5 score: visa ease, safety, expat community)
- Country trend (Improving / Stable / Declining)
- Advantages (positive attributes to filter for)
- Dealbreakers (negative attributes to hide entirely)

**Guided walkthrough**
- 8-step interactive tour spotlighting each filter
- Requires actual interaction before advancing (not passive)
- Stored in localStorage; replayable via "? Tour" button

**Postcards + ambient audio**
- Full destination postcard for each location
- Soft voice note plays on Explorer entry
- Mute/unmute toggle with animated waveform

**Session persistence**
- `ha_result` — quiz result across sessions
- `ha_access` — password confirmation
- `ha_screen` — last active screen hint
- Returning users with saved result land straight on Explorer

---

## Tech stack

| Layer | Tool |
|---|---|
| Framework | React 19 + Vite 8 |
| Globe | react-globe.gl (Three.js) |
| CSV parsing | PapaParse |
| Deployment | Vercel (serverless API + static frontend) |
| Fonts | IM Fell English, Beyond Sweet, Dancing Script |
| Styling | CSS custom properties + inline — no framework |
| Serverless | Vercel Functions for destination data |

---

## Data: 561 destinations

Each record includes:
- Destination + country + region
- Personality tags (which types match)
- Cost USD (estimated monthly)
- Suitability score (1–5 for expats)
- Languages spoken
- Country trend (Improving/Stable/Declining)
- Advantages & disadvantages
- Local writers with links
- Latitude / longitude

---

## How to run locally

```bash
npm install
npm run dev
# → http://localhost:5173

# Production build
npm run build

# Preview production build
npm run preview
```

**Passphrase to enter the app:** `i am home`

---

## Deployment

Deployed on Vercel. `api/destinations.js` is a serverless function serving destination data.

```bash
npx vercel deploy --prod
```

---

## Design notes

**Fonts:** IM Fell English (editorial serif), Beyond Sweet (script), Arial (body/UI)  
**Palette:** Warm almond (#EDE0D4), coral CTAs (#FF6F61), lion/sand accents (#B78A63)  
**Motion:** All animations use `dreamFadeUp`, `waxStampPress`, `slowReveal` — slow and unhurried  
**Philosophy:** Every screen feels editorial and personal, not transactional. Earn trust before asking for preferences.

---

## What you can learn from this

✓ Building complex data experiences without a backend  
✓ React + Vite + Three.js integration  
✓ Designing UX for anxious users (make scary accessible)  
✓ CSV data parsing at scale  
✓ Session persistence & localStorage strategy  
✓ Guided onboarding that requires interaction  
✓ Voice + motion in web design

---

## Contributing

This is a portfolio project, but ideas welcome. Found a broken link or outdated info? Open an issue.

---

## About

Built by **Pranjal Suthar** — exploring the intersection of applied psychology, design, and human behavior.

→ [GitHub](https://github.com/pranjalsuthar-555) · [LinkedIn](https://www.linkedin.com/in/sutharpranjal) · [Email](mailto:pranjalsuthar.work@gmail.com)

---

## License

Private. All rights reserved.
