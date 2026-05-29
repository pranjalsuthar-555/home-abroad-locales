# Home Abroad

**Find where you belong.**

🌍 **Live app:** [home-abroad-locales.vercel.app](https://home-abroad-locales.vercel.app)

Home Abroad is a destination discovery experience for people seriously considering life abroad. It pairs a personality quiz with a filterable database of 561 global destinations — surfaced through an interactive 3D globe and a detailed table view.

The design philosophy: feel like a beautiful letter, not a SaaS product.

---

## What it does

Users enter the app, take a 10-question quiz designed to surface genuine tension between lifestyle values, and receive a primary + secondary personality type. From there, a pre-filtered globe of matching destinations is waiting — with tools to refine by budget, language, expat suitability, country trend, and personal dealbreakers.

---

## Screens

| Screen | Description |
|---|---|
| **Entry** | Password-gated. Passphrase: `i am home`. Personality type strips run above and below the input as ambient context. |
| **Landing** | Two postcard layouts that auto-flip every 3.5 seconds — front to back — on a warm cream background. |
| **Quiz** | 10 questions across life values, language tolerance, time horizon, and emotional drivers. Each answer maps to A / B / C / D. |
| **Reveal** | Cinematic personality reveal with a primary type and a secondary "blended with" combo card. |
| **Explorer** | 3D globe + table view of 561 destinations, pre-filtered to the user's personality. Eight adjustable filters. Guided walkthrough on first visit. |

---

## Personality Types

| Type | Name | Description |
|---|---|---|
| A | 🏙 Urban Explorer | Thrives in dynamic cities. Drawn to culture, connection, and possibility. |
| B | 🌴 Coastal Dreamer | Seeks salt air and slow living. Wants to exhale, not perform. |
| C | 🏔 Nature Seeker | Values solitude and space. Nature is the point, not the backdrop. |
| D | 🐓 Rooted Romantic | Wants to belong somewhere real. Community, roots, and meaningful daily life. |

Results show both a primary and secondary type — most people are a blend, and the combination is the real story.

---

## Key Features

### Personality Quiz
- 10 questions designed to create genuine tension — every option should feel like it could be right
- Scoring counts A/B/C/D responses; hybrid results shown when a secondary type is present
- Results persist in `localStorage` so returning users skip straight to their Explorer

### 3D Globe
- Powered by `react-globe.gl` with Three.js raycasting for hover + click
- Warm atmosphere tint, auto-rotates when idle, pauses on interaction
- Destination pins rendered as emoji (`📍`) with hover tooltips and click-to-postcard modals

### Filter System
- **Personality** — pre-filled from quiz result
- **Region** — continental groupings
- **Language** — top 20 by destination count
- **Cost of Living** — dual-handle slider, USD/month
- **Expat Suitability** — score 1–5 (visa ease, safety, expat community)
- **Country Trend** — Improving / Stable / Declining
- **Advantages** — positive attributes to filter for
- **Dealbreakers** — negative attributes to hide entirely

### Guided Filter Walkthrough
- 8-step tour that spotlights each filter in sequence
- Requires actual interaction (click, drag, select) before advancing — not a passive slideshow
- Stored in `localStorage` as `ha_tour_done`; replayable via the "? Tour" button in the top bar

### Postcard Modals
- Clicking any globe pin or table row opens a full postcard for that destination
- Shows score, cost, languages, local writers, country trend, and a personalised note

### Ambient Audio
- Voice note plays softly on entering the Explorer screen (volume: 0.5)
- Mute/unmute toggle in the bottom-left corner with an animated waveform indicator

### Session Persistence
- `ha_result` — persists quiz result across sessions in `localStorage`
- `ha_access` — persists password confirmation in `localStorage`
- Returning users with a saved result land directly on Explorer — no re-entry or re-quiz required

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | React 19 + Vite 8 |
| Globe | react-globe.gl (Three.js) |
| CSV parsing | PapaParse |
| Deployment | Vercel (serverless API + static frontend) |
| Fonts | IM Fell English (Google Fonts), Beyond Sweet (local `.woff`), Dancing Script (Google Fonts) |
| Styling | CSS custom properties + inline styles — no CSS framework |

---

## Project Structure

```
home-abroad-locales/
├── api/
│   └── destinations.js           # Vercel serverless function — serves destination data
├── public/
│   ├── HomeAbroad-Logo_Landscape-Color.webp
│   ├── beyondsweet-webfont.woff
│   ├── koh phangan island.webp
│   ├── postcard layout - 1.webp
│   ├── postcard layout - 2.webp
│   └── LALB Kailas audio.mp3
├── src/
│   ├── components/
│   │   ├── FilterWalkthrough.jsx  # 8-step guided tour component
│   │   ├── FloatingBotanicals.jsx # Decorative botanical emoji elements
│   │   ├── HoverCard.jsx          # Globe hover tooltip + table side panel
│   │   ├── PostcardModal.jsx      # Full destination postcard overlay
│   │   ├── WaxSeal.jsx            # Custom checkbox with wax seal aesthetic
│   │   ├── TornEdge.jsx           # Decorative torn paper edge SVG
│   │   └── FieldTooltips.jsx      # Tooltip definitions for filter fields
│   ├── data/
│   │   └── useDestinations.js     # Fetches + parses destination data from API
│   ├── screens/
│   │   ├── EntryScreen.jsx        # Password gate
│   │   ├── LandingScreen.jsx      # Postcard flip + CTA
│   │   ├── QuizScreen.jsx         # 10-question personality quiz
│   │   ├── RevealScreen.jsx       # Personality type reveal
│   │   └── ExplorerScreen.jsx     # Globe + table + filters
│   ├── styles/
│   │   └── globals.css            # All global CSS, variables, and animations
│   ├── App.jsx                    # Screen router + session state
│   └── main.jsx                   # React entry point
└── index.html
```

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

**Passphrase to enter the app: `i am home`**

---

## Deployment

Deployed on Vercel. `api/destinations.js` is a Vercel serverless function serving destination data. The project links to an existing Vercel project via `.vercel/project.json`.

```bash
# Deploy to production
npx vercel deploy --prod
```

---

## Destination Data

**561 destinations** across all inhabited continents. Each record includes:

| Field | Description |
|---|---|
| `destination` | City or place name |
| `country` | Country |
| `region` | Continental region |
| `personalities` | Array of personality tags |
| `costUSD` | Estimated monthly cost of living (USD) |
| `suitabilityScore` | Expat suitability score, 1–5 |
| `languages` | Languages spoken |
| `countryTrend` | Improving / Stable / Declining |
| `advantages` | Positive attributes |
| `disadvantages` | Negative attributes / dealbreakers |
| `writers` | Local voices with links |
| `lat` / `lng` | Coordinates for globe placement |

---

## Design Notes

- **Fonts**: IM Fell English for headings (editorial serif), Beyond Sweet for script accents and hero headline, Arial for all body copy and UI
- **Palette**: Warm almond backgrounds (`#EDE0D4`), coral CTAs (`#FF6F61`), lion/sand accents (`#B78A63`), deep ink for text
- **Motion**: All animations use `dreamFadeUp`, `waxStampPress`, and `slowReveal` — slow and unhurried, like a letter unfolding
- **Philosophy**: Every screen is designed to feel editorial and personal, not transactional. The app earns the user's trust before asking for their preferences

---

## localStorage Keys

| Key | Purpose | Cleared by |
|---|---|---|
| `ha_result` | Serialised personality result object | "Retake quiz" button |
| `ha_access` | Password confirmation flag | Manual clear only |
| `ha_screen` | Last active screen hint | "Retake quiz" button |
| `ha_tour_done` | Guided walkthrough completion flag | "? Tour" button resets it |

---

## License

Private. All rights reserved — Home Abroad.
