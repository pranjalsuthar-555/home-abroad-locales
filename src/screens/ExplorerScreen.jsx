import { useState, useMemo, useEffect, useRef, lazy, Suspense } from 'react'
import * as THREE from 'three'
import { useTranslation } from 'react-i18next'
import Papa from 'papaparse'
import HoverCard from '../components/HoverCard.jsx'
import WaxSeal from '../components/WaxSeal.jsx'
import PostcardModal from '../components/PostcardModal.jsx'
import FilterWalkthrough from '../components/FilterWalkthrough.jsx'

// Lazy-load the heavy 3D globe so it doesn't block initial paint
const Globe = lazy(() => import('react-globe.gl'))

/* ═══════════════════════ CONSTANTS ═══════════════════════ */

const TOTAL = 561

const DEFAULT_FILTERS = {
  personalities:  [],
  regions:        [],
  languages:      [],
  costRange:      [0, 10000],
  suitabilityMin: 0,
  countryTrends:  [],
  advantages:     [],
  disadvantages:  [],
}

/* ═══════════════════════ HELPERS ═══════════════════════ */

function personalityTagClass(p = '') {
  const l = p.toLowerCase()
  if (l.includes('urban'))   return 'tag-urban'
  if (l.includes('coastal')) return 'tag-coastal'
  if (l.includes('nature'))  return 'tag-nature'
  if (l.includes('rooted'))  return 'tag-rooted'
  return 'tag-region'
}

/* Airtable stores personality tags in English ("🐓 Rooted Romantic"). Those raw values
   drive the filtering, so they must not change — this only swaps what's displayed,
   keeping the emoji. Any tag outside the known four falls through unchanged. */
function personalityI18nKey(p = '') {
  const l = p.toLowerCase()
  if (l.includes('urban'))   return 'urban'
  if (l.includes('coastal')) return 'coastal'
  if (l.includes('nature'))  return 'nature'
  if (l.includes('rooted'))  return 'rooted'
  return null
}

function localisePersonality(raw, t) {
  const key = personalityI18nKey(raw)
  if (!key) return raw
  const emoji = (raw.match(/^\s*(\p{Extended_Pictographic}️?)/u) || [])[1]
  return emoji ? `${emoji} ${t(`personalities.${key}.name`)}` : t(`personalities.${key}.name`)
}

function countBy(arr) {
  const c = {}
  arr.forEach(v => { c[v] = (c[v] || 0) + 1 })
  return c
}

function topN(counts, n) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k]) => k)
}

function downloadCSV(data) {
  const rows = data.map(d => ({
    Destination: d.destination,
    Country: d.country,
    Region: d.region,
    Personalities: d.personalities.join('; '),
    'Cost/Month (USD)': d.costUSD ?? '',
    'Suitability Score': d.suitabilityScore ?? '',
    Languages: d.languages.join('; '),
    Religions: d.religions.join('; '),
    'Country Trend': d.countryTrend ?? '',
    'Tourism Website': d.tourismWebsite ?? '',
    'Writers': (d.writers || []).map(w => w.name).join('; '),
    'Writer Links': (d.writers || []).map(w => w.link || '').join('; '),
  }))
  const csv  = Papa.unparse(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  Object.assign(document.createElement('a'), { href: url, download: 'home-abroad-destinations.csv' }).click()
  URL.revokeObjectURL(url)
}

/* ═══════════════════════ SUB-COMPONENTS ═══════════════════════ */

const explorerCSS = `
  .explorer-table tbody tr:hover td { background: var(--coral-light); cursor: pointer; }
  .explorer-table tbody tr:hover td:first-child { box-shadow: inset 3px 0 0 var(--coral); }
  .sidebar-scroll::-webkit-scrollbar { width: 4px; }
  .sidebar-scroll::-webkit-scrollbar-thumb { background: var(--almond-dark); border-radius: 2px; }
  .filter-section-body {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.4s var(--ease-dream), padding 0.3s ease;
  }
  .filter-section-body.open { max-height: 400px; }
  .filter-chevron { transition: transform 0.3s ease; }
  .filter-chevron.open { transform: rotate(180deg); }
  .reset-link { position: relative; transition: color 0.2s ease; }
  .reset-link::after {
    content: ''; position: absolute; bottom: -1px; left: 0;
    width: 0; height: 1px; background: var(--coral);
    transition: width 0.3s ease;
  }
  .reset-link:hover { color: var(--coral) !important; }
  .reset-link:hover::after { width: 100%; }
  @keyframes countPulse {
    0%   { transform: scale(1); }
    40%  { transform: scale(1.15); }
    100% { transform: scale(1); }
  }
  .count-pulse { animation: countPulse 0.3s var(--ease-spring) both; }
  @keyframes globeOpacityPulse {
    0%   { opacity: 0.75; }
    100% { opacity: 1; }
  }
  .globe-pulse { animation: globeOpacityPulse 0.3s ease both; }
  .view-fade-in  { animation: dreamFadeUp 0.4s var(--ease-dream) both; }
  .view-fade-out { animation: dreamFadeIn 0s both; opacity: 0; }
  @keyframes tableRowIn {
    from { opacity: 0; transform: translateY(10px); filter: blur(2px); }
    to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
  }
`

function FilterSection({ title, subtitle, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ borderBottom: '1px solid var(--almond-dark)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '11px 0', background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 500, color: 'var(--ink)',
        }}
      >
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
          <span>{title}</span>
          {subtitle && <span style={{ fontSize: '0.72rem', fontWeight: 400, color: 'var(--slate)' }}>{subtitle}</span>}
        </span>
        <span className={`filter-chevron ${open ? 'open' : ''}`} style={{ color: 'var(--slate)', fontSize: '0.65rem' }}>▼</span>
      </button>
      <div className={`filter-section-body ${open ? 'open' : ''}`}>
        <div style={{ paddingBottom: '14px' }}>{children}</div>
      </div>
    </div>
  )
}

/* labelFor lets a group display something other than the raw Airtable value — the
   value itself still drives filtering, so matching is unaffected. */
function CheckGroup({ options, selected, onChange, labelFor }) {
  function toggle(opt) {
    onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt])
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', maxHeight: '180px', overflowY: 'auto' }}>
      {options.map(opt => (
        <WaxSeal
          key={opt}
          checked={selected.includes(opt)}
          onChange={() => toggle(opt)}
          label={labelFor ? labelFor(opt) : opt}
        />
      ))}
    </div>
  )
}

function TrendPills({ options, selected, onChange }) {
  function toggle(opt) {
    onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt])
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {options.map(opt => {
        const active = selected.includes(opt)
        return (
          <button key={opt} onClick={() => toggle(opt)} style={{
            padding: '5px 12px', borderRadius: 'var(--radius-pill)',
            border: `1.5px solid ${active ? 'var(--coral)' : 'var(--almond-dark)'}`,
            background: active ? 'var(--coral-light)' : 'transparent',
            color: active ? 'var(--redwood)' : 'var(--ink-light)',
            fontFamily: 'var(--font-body)', fontSize: '0.78rem', cursor: 'pointer',
            transition: 'all 0.18s ease',
          }}>
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function TableSkeleton() {
  const COLS = 8
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--almond-dark)' }}>
            {Array.from({ length: COLS }, (_, i) => (
              <th key={i} style={{ padding: '14px 16px' }}>
                <div className="skeleton" style={{ height: '11px', width: `${40 + (i * 13) % 40}px` }} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }, (_, r) => (
            <tr key={r} style={{ borderBottom: '1px solid var(--almond-dark)' }}>
              {Array.from({ length: COLS }, (_, c) => (
                <td key={c} style={{ padding: '14px 16px' }}>
                  <div className="skeleton" style={{ height: '13px', width: `${35 + ((r + c) * 17) % 50}%` }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DestinationsLoading({ t }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem' }}>
      <div className="spinner" />
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--slate)', margin: 0 }}>
        {t('explorer.loading')}
      </p>
    </div>
  )
}

function EmptyState({ onReset, t }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', padding: '4rem 2rem' }}>
      <span style={{ fontSize: '4rem' }}>🗺</span>
      <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.4rem', color: 'var(--ink)', textAlign: 'center', margin: 0 }}>
        {t('explorer.emptyState')}
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--slate)', textAlign: 'center', margin: 0 }}>
        {t('explorer.emptyStateHint')}
      </p>
      <button className="btn-ghost" onClick={onReset}>{t('explorer.resetFilters')}</button>
    </div>
  )
}

/* ═══════════════════════ MAIN COMPONENT ═══════════════════════ */

export default function ExplorerScreen({ result, destinations = [], destLoading, destError, onRestartQuiz }) {
  const { t } = useTranslation()
  const [viewMode,    setViewMode]    = useState('globe')
  const [isMobile,    setIsMobile]    = useState(() => window.innerWidth < 900)
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 900)
  const [filters,     setFilters]     = useState(DEFAULT_FILTERS)
  const [search,      setSearch]      = useState('')
  const [selectedDest, setSelectedDest] = useState(null)
  const [hoveredDest,  setHoveredDest]  = useState(null)
  const [mousePos,     setMousePos]     = useState({ x: 0, y: 0 })
  const [globeSize,    setGlobeSize]    = useState({ w: 800, h: 600 })
  const [countriesGeo, setCountriesGeo] = useState(null)

  const globeRef      = useRef(null)
  const mainRef       = useRef(null)
  const rotationTimer = useRef(null)
  const prevCountRef  = useRef(null)
  const [countPulse,      setCountPulse]      = useState(false)
  const [globePulse,      setGlobePulse]      = useState(false)

  const audioRef    = useRef(null)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [audioPlayed,  setAudioPlayed]  = useState(false)

  /* The walkthrough drives the filter sidebar, which is a full-screen drawer on mobile —
     auto-running it there would bury the globe behind filters on first load. Phones start
     on the globe instead; the tour stays available from the "? Tour" button. */
  const [showTour, setShowTour] = useState(
    () => window.innerWidth >= 900 && localStorage.getItem('ha_tour_done') !== 'true'
  )

  function startTour() {
    setSidebarOpen(true)
    localStorage.removeItem('ha_tour_done')
    setShowTour(true)
  }

  useEffect(() => {
    if (showTour) setSidebarOpen(true)
  }, [showTour])

  useEffect(() => {
    if (!audioPlayed && audioRef.current) {
      audioRef.current.volume = 0.5
      audioRef.current.play().then(() => {
        setAudioPlaying(true)
        setAudioPlayed(true)
      }).catch(() => {})
    }
  }, [])

  function toggleAudio() {
    if (!audioRef.current) return
    if (audioPlaying) {
      audioRef.current.pause()
      setAudioPlaying(false)
    } else {
      audioRef.current.play()
      setAudioPlaying(true)
    }
  }

  /* ── load vector country shapes for the globe (rendered natively, no photo texture) ── */
  useEffect(() => {
    fetch('/data/world-countries.geojson')
      .then(res => res.json())
      .then(geo => setCountriesGeo(geo))
      .catch(() => setCountriesGeo({ features: [] }))
  }, [])

  /* ── ocean material for the globe sphere — flat navy, no image texture ── */
  const oceanMaterial = useMemo(
    () => new THREE.MeshPhongMaterial({ color: '#1a2535', shininess: 3 }),
    []
  )

  /* ── pre-populate personality filter from quiz result ── */
  useEffect(() => {
    if (!destinations.length || !result?.primary) return
    const all = [...new Set(destinations.flatMap(d => d.personalities))]

    function findMatch(key) {
      if (!key) return null
      const k = key.toLowerCase()
      return all.find(p => p.toLowerCase().includes(k)) ?? null
    }

    const matched = [
      findMatch(result.primary.key),
      result.isHybrid && result.secondary ? findMatch(result.secondary.key) : null,
    ].filter(Boolean)

    if (matched.length) setFilters(f => ({ ...f, personalities: matched }))
  }, [destinations.length, result?.primary?.key, result?.secondary?.key])

  /* ── global mouse tracking ── */
  useEffect(() => {
    const h = e => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', h)
    return () => window.removeEventListener('mousemove', h)
  }, [])

  /* ── measure main area for globe ── */
  useEffect(() => {
    if (!mainRef.current) return
    const obs = new ResizeObserver(([entry]) => {
      setGlobeSize({ w: entry.contentRect.width, h: entry.contentRect.height })
    })
    obs.observe(mainRef.current)
    return () => obs.disconnect()
  }, [])

  /* ── browser Back closes the destination card instead of leaving the app ──
     Opening a destination is a view change with no URL of its own, so Back used to
     navigate away from the site entirely. Pushing a history entry while the card is
     open means Back pops that entry and returns to the explorer. The ref tracks
     whether we still own that entry, so closing via ✕ / Esc / the backdrop removes
     it without risking a second pop that would leave the app. ── */
  const modalHistoryRef = useRef(false)
  const selectedDestId = selectedDest?.id ?? null
  useEffect(() => {
    if (!selectedDestId) return
    window.history.pushState({ haDestination: true }, '')
    modalHistoryRef.current = true

    const onPop = () => {
      modalHistoryRef.current = false
      setSelectedDest(null)
    }
    window.addEventListener('popstate', onPop)

    return () => {
      window.removeEventListener('popstate', onPop)
      if (modalHistoryRef.current) {
        modalHistoryRef.current = false
        window.history.back()
      }
    }
  }, [selectedDestId])

  /* ── track viewport so layout reacts to resize / orientation change ── */
  useEffect(() => {
    const h = () => {
      const mobile = window.innerWidth < 900
      setIsMobile(mobile)
      if (mobile) setSidebarOpen(false)
    }
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  /* ── derived filter options (memoized) ── */
  const opts = useMemo(() => ({
    personalities: [...new Set(destinations.flatMap(d => d.personalities))].sort(),
    regions:       [...new Set(destinations.map(d => d.region).filter(Boolean))].sort(),
    languages:     topN(countBy(destinations.flatMap(d => d.languages)), 20),
    advantages:    topN(countBy(destinations.flatMap(d => d.advantages)), 100),
    disadvantages: topN(countBy(destinations.flatMap(d => d.disadvantages)), 100),
    trends:        [...new Set(destinations.map(d => d.countryTrend).filter(Boolean))].sort(),
  }), [destinations])

  /* ── filtered destinations (memoized) ── */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return destinations.filter(d => {
      if (q && !d.destination.toLowerCase().includes(q) &&
               !d.country.toLowerCase().includes(q) &&
               !d.region.toLowerCase().includes(q))              return false
      if (filters.personalities.length  && !filters.personalities.some(fp => d.personalities.some(dp => dp.toLowerCase().includes(fp.toLowerCase()) || fp.toLowerCase().includes(dp.toLowerCase()))))  return false
      if (filters.regions.length        && !filters.regions.includes(d.region))                            return false
      if (filters.languages.length      && !filters.languages.some(l => d.languages.includes(l)))          return false
      if (d.costUSD != null && d.costUSD < filters.costRange[0])                                            return false
      if (d.costUSD != null && filters.costRange[1] < 10000 && d.costUSD > filters.costRange[1])           return false
      if (d.suitabilityScore != null && filters.suitabilityMin > 0 && d.suitabilityScore < filters.suitabilityMin) return false
      if (filters.countryTrends.length  && !filters.countryTrends.includes(d.countryTrend))                return false
      if (filters.advantages.length     && !filters.advantages.some(a => d.advantages.includes(a)))        return false
      if (filters.disadvantages.length  &&  filters.disadvantages.some(a => d.disadvantages.includes(a)))   return false
      return true
    })
  }, [destinations, filters, search])

  const globeData = useMemo(() => filtered.filter(d => d.lat != null && d.lng != null), [filtered])

  /* count pill pulse + globe pulse when filtered length changes */
  useEffect(() => {
    if (prevCountRef.current !== null && prevCountRef.current !== filtered.length) {
      setCountPulse(true)
      setGlobePulse(true)
    }
    prevCountRef.current = filtered.length
  }, [filtered.length])

  function setFilter(key, val) { setFilters(f => ({ ...f, [key]: val })) }
  function resetFilters()      { setFilters(DEFAULT_FILTERS); setSearch('') }

  /* ── globe rotation setup ── */
  function initGlobeRotation() {
    const ctrl = globeRef.current?.controls()
    if (!ctrl) return
    ctrl.autoRotate      = true
    ctrl.autoRotateSpeed = 0.3
  }

  /* ── cleanup idle timer on unmount ── */
  useEffect(() => () => clearTimeout(rotationTimer.current), [])

  function handleGlobeMouseEnter() {
    const ctrl = globeRef.current?.controls()
    if (ctrl) ctrl.autoRotate = false
    clearTimeout(rotationTimer.current)
  }

  function handleGlobeMouseMove() {
    const ctrl = globeRef.current?.controls()
    if (ctrl) ctrl.autoRotate = false
    clearTimeout(rotationTimer.current)
    rotationTimer.current = setTimeout(() => {
      const c = globeRef.current?.controls()
      if (c) c.autoRotate = true
    }, 60000)
  }

  function handleGlobeMouseLeave() {
    clearTimeout(rotationTimer.current)
    rotationTimer.current = setTimeout(() => {
      const c = globeRef.current?.controls()
      if (c) c.autoRotate = true
    }, 60000)
  }

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--almond)', overflow: 'hidden' }}>
      <style>{explorerCSS}</style>

      {/* ══ TOP BAR ══ */}
      <header className="explorer-topbar" style={s.topBar}>
        <div className="header-logo">
          <img src="/HomeAbroad-Logo_Landscape-Color.webp" alt="Home Abroad" className="logo-img" />
        </div>

        {/* sits in the header beside the logo — as a floating pill it collided with
            the Export CSV button in table view */}
        <button className="audio-indicator" onClick={toggleAudio} aria-label={audioPlaying ? 'Mute' : 'Play audio'}>
          <span className="audio-wave-bars">
            <span className={`audio-bar ${audioPlaying ? 'playing' : ''}`} />
            <span className={`audio-bar ${audioPlaying ? 'playing' : ''}`} />
            <span className={`audio-bar ${audioPlaying ? 'playing' : ''}`} />
          </span>
          <span className="audio-label">{audioPlaying ? 'Playing' : 'Listen'}</span>
        </button>

        {/* personality tags — hidden on very small screens via CSS class */}
        <div className="explorer-personality-pills" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {result?.primary && (
            <span className={`tag ${result.primary.tagClass}`}>
              {result.primary.emoji} {t(`personalities.${result.primary.i18nKey}.name`)}
            </span>
          )}
          {result?.secondary && (
            <span className={`tag ${result.secondary.tagClass}`} style={{ opacity: 0.75 }}>
              {result.secondary.emoji} {t(`personalities.${result.secondary.i18nKey}.name`)}
            </span>
          )}
        </div>

        {/* search input */}
        <div className="explorer-search" style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: '0 1 200px' }}>
          <span style={{ position: 'absolute', left: '10px', fontSize: '0.8rem', pointerEvents: 'none', color: 'var(--slate)' }}>🔍</span>
          <input
            type="text"
            placeholder={t('explorer.search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 28px 6px 28px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.82rem',
              border: '1.5px solid var(--almond-dark)',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--almond)',
              color: 'var(--ink)',
              outline: 'none',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ position: 'absolute', right: '9px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate)', fontSize: '0.7rem', lineHeight: 1, padding: '2px' }}
              aria-label={t('explorer.clearSearch')}
            >✕</button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* count in coral pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              className={countPulse ? 'count-pulse' : ''}
              onAnimationEnd={() => setCountPulse(false)}
              style={{
                fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 500,
                color: 'var(--white)', background: 'var(--coral)',
                padding: '3px 10px', borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap',
                display: 'inline-block',
              }}
            >
              {filtered.length}
            </span>
            <span className="explorer-count-label" style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--slate)', whiteSpace: 'nowrap' }}>
              {t('explorer.destinations')}
            </span>
          </div>

          {/* view toggle */}
          <div style={{ display: 'flex', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1.5px solid var(--almond-dark)' }}>
            {[{ mode: 'globe', icon: '🌐' }, { mode: 'table', icon: '≡' }].map(({ mode, icon }) => (
              <button
                key={mode}
                onClick={() => { setViewMode(mode); setSelectedDest(null) }}
                title={mode === 'globe' ? t('explorer.globeView') : t('explorer.tableView')}
                style={{
                  width: '36px', height: '34px', border: 'none', cursor: 'pointer',
                  background: viewMode === mode ? 'var(--coral)' : 'var(--almond-dark)',
                  color:      viewMode === mode ? 'var(--white)' : 'var(--ink-light)',
                  fontSize:   mode === 'table' ? '1.1rem' : '0.95rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
              >{icon}</button>
            ))}
          </div>

          <button
            className="btn-ghost"
            onClick={() => setSidebarOpen(o => !o)}
            style={{ padding: '7px 14px', fontSize: '0.82rem' }}
          >
            {t('explorer.filters')}
          </button>

          <button
            className="explorer-tour-btn"
            onClick={startTour}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--slate)',
              padding: '6px 8px', borderRadius: 'var(--radius-pill)',
              transition: 'color var(--transition)', whiteSpace: 'nowrap',
            }}
            title="Replay filter walkthrough"
          >
            {t('explorer.tour')}
          </button>

          <button
            className="explorer-retake-btn"
            onClick={onRestartQuiz}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--slate)',
              padding: '6px 10px', borderRadius: 'var(--radius-pill)',
              transition: 'color var(--transition)',
              whiteSpace: 'nowrap',
            }}
          >
            {t('explorer.retakeQuiz')}
          </button>
        </div>
      </header>

      {/* ══ BODY ══ */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* ── FILTER SIDEBAR ── */}
        {sidebarOpen && (
          <>
            {/* mobile scrim — starts below the header so the top bar stays tappable */}
            {isMobile && (
              <div
                onClick={() => setSidebarOpen(false)}
                style={{ position: 'fixed', top: '64px', left: 0, right: 0, bottom: 0, zIndex: 30, background: 'rgba(27,30,34,0.2)', backdropFilter: 'blur(2px)' }}
              />
            )}
            <aside
              className="sidebar-scroll dotted-texture"
              style={{
                width: isMobile ? 'min(88%, 340px)' : '300px',
                position: isMobile ? 'fixed' : 'relative',
                top: isMobile ? '64px' : 'auto',
                left: 0, bottom: 0, zIndex: isMobile ? 40 : 'auto',
                backgroundColor: 'var(--white)',
                borderRight: '1px solid var(--almond-dark)',
                boxShadow: isMobile ? '4px 0 24px rgba(27,30,34,0.18)' : 'none',
                overflowY: 'auto', flexShrink: 0,
              }}
            >
              <div style={{ padding: '20px 20px 80px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <h4 style={{ marginBottom: '4px' }}>{t('explorer.refineSearch')}</h4>
                  {isMobile && (
                    <button
                      onClick={() => setSidebarOpen(false)}
                      aria-label={t('explorer.closeFilters')}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '1.1rem', lineHeight: 1, color: 'var(--slate)',
                        padding: '4px 6px', marginTop: '-2px',
                      }}
                    >✕</button>
                  )}
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--slate)', marginBottom: '16px' }}>
                  {t('explorer.alreadyFiltered')}
                </p>

                <div data-filter="personality">
                  <FilterSection title={t('explorer.sections.personality')} defaultOpen>
                    <CheckGroup options={opts.personalities} selected={filters.personalities} onChange={v => setFilter('personalities', v)} labelFor={p => localisePersonality(p, t)} />
                  </FilterSection>
                </div>
                <FilterSection title={t('explorer.sections.region')}>
                  <CheckGroup options={opts.regions} selected={filters.regions} onChange={v => setFilter('regions', v)} />
                </FilterSection>
                <FilterSection title={t('explorer.sections.language')}>
                  <CheckGroup options={opts.languages} selected={filters.languages} onChange={v => setFilter('languages', v)} />
                </FilterSection>
                <div data-filter="cost">
                  <FilterSection title={t('explorer.sections.cost')}>
                    <div style={{ padding: '4px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--ink-light)', marginBottom: '4px' }}>
                        <span>${filters.costRange[0].toLocaleString()}</span>
                        <span>${filters.costRange[1].toLocaleString()}</span>
                      </div>
                      <input type="range" min={0} max={10000} step={100} value={filters.costRange[0]}
                        style={{ '--progress': `${(filters.costRange[0] / 10000) * 100}%` }}
                        onChange={e => setFilter('costRange', [Math.min(+e.target.value, filters.costRange[1] - 100), filters.costRange[1]])} />
                      <input type="range" min={0} max={10000} step={100} value={filters.costRange[1]}
                        style={{ '--progress': `${(filters.costRange[1] / 10000) * 100}%` }}
                        onChange={e => setFilter('costRange', [filters.costRange[0], Math.max(+e.target.value, filters.costRange[0] + 100)])} />
                    </div>
                  </FilterSection>
                </div>
                <div data-filter="score">
                  <FilterSection title={t('explorer.sections.suitability')}>
                    <div style={{ padding: '4px 0' }}>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--ink-light)', marginBottom: '4px' }}>
                        {t('explorer.scoreAtLeast', { n: filters.suitabilityMin })}
                      </div>
                      <input type="range" min={0} max={5} step={0.5} value={filters.suitabilityMin}
                        style={{ '--progress': `${(filters.suitabilityMin / 5) * 100}%` }}
                        onChange={e => setFilter('suitabilityMin', +e.target.value)} />
                    </div>
                  </FilterSection>
                </div>
                <div data-filter="trend">
                  <FilterSection title={t('explorer.sections.trend')}>
                    <TrendPills options={opts.trends} selected={filters.countryTrends} onChange={v => setFilter('countryTrends', v)} />
                  </FilterSection>
                </div>
                <div data-filter="advantages">
                  <FilterSection title={t('explorer.sections.advantages')}>
                    <CheckGroup options={opts.advantages} selected={filters.advantages} onChange={v => setFilter('advantages', v)} />
                  </FilterSection>
                </div>
                <div data-filter="dealbreakers">
                  <FilterSection title={t('explorer.sections.dealbreakers')} subtitle={t('explorer.dealbreakersSubtitle')}>
                    <CheckGroup options={opts.disadvantages} selected={filters.disadvantages} onChange={v => setFilter('disadvantages', v)} />
                  </FilterSection>
                </div>

                {/* these live in the header on desktop, which has no room for them on phones */}
                {isMobile && (
                  <div style={{
                    marginTop: '20px', paddingTop: '16px',
                    borderTop: '1px solid var(--almond-dark)',
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px',
                  }}>
                    <button
                      onClick={() => { setSidebarOpen(false); startTour() }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--slate)', padding: '4px 0' }}
                    >
                      {t('explorer.replayTour')}
                    </button>
                    <button
                      onClick={onRestartQuiz}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--slate)', padding: '4px 0' }}
                    >
                      {t('explorer.retakeQuiz')}
                    </button>
                  </div>
                )}
              </div>

              {/* sticky footer */}
              <div style={{
                position: 'sticky', bottom: 0, backgroundColor: 'var(--white)',
                borderTop: '1px solid var(--almond-dark)', padding: '12px 20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <button onClick={resetFilters} className="reset-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--coral)', padding: 0 }}>
                  {t('explorer.resetAll')}
                </button>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--slate)' }}>
                  {t('explorer.ofTotal', { shown: filtered.length, total: TOTAL })}
                </span>
              </div>
            </aside>
          </>
        )}

        {/* ── MAIN VIEW ── */}
        <main ref={mainRef} style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>

          {destLoading && destinations.length === 0 ? (
            <DestinationsLoading t={t} />
          ) : destError ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
              <p style={{ color: 'var(--slate)', fontFamily: 'var(--font-body)', textAlign: 'center' }}>
                Couldn't load destinations. Please refresh and try again.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState onReset={resetFilters} t={t} />
          ) : viewMode === 'globe' ? (

            /* ════ GLOBE VIEW ════ */
            <div
              className={globePulse ? 'globe-pulse' : ''}
              onAnimationEnd={() => setGlobePulse(false)}
              onMouseEnter={handleGlobeMouseEnter}
              onMouseMove={handleGlobeMouseMove}
              onMouseLeave={handleGlobeMouseLeave}
              style={{ flex: 1, position: 'relative', background: 'radial-gradient(ellipse at center, #3a5068 0%, #1a2535 100%)' }}
            >
              {globeSize.w > 0 && (
                <Suspense fallback={<DestinationsLoading t={t} />}>
                  <div className="animate-dreamFadeIn" style={{ animationDelay: '0.3s', animationDuration: '1.5s' }}>
                  <Globe
                    ref={globeRef}
                    width={globeSize.w}
                    height={globeSize.h || window.innerHeight - 64}
                    globeMaterial={oceanMaterial}
                    backgroundColor="rgba(0,0,0,0)"
                    atmosphereColor="#B78A63"
                    atmosphereAltitude={0.15}
                    // Vector country shapes — rendered natively, crisp at any zoom/DPI
                    polygonsData={countriesGeo?.features ?? []}
                    polygonCapColor={() => 'rgba(217,185,142,0.95)'}
                    polygonSideColor={() => 'rgba(161,91,68,0.28)'}
                    polygonStrokeColor={() => '#7A5A3E'}
                    polygonAltitude={0.008}
                    // Invisible cylinders — drive Three.js raycasting for hover + click
                    pointsData={globeData}
                    pointLat="lat"
                    pointLng="lng"
                    pointColor={() => 'rgba(0,0,0,0)'}
                    pointAltitude={0.02}
                    pointRadius={0.7}
                    onPointHover={pt => setHoveredDest(pt ?? null)}
                    onPointClick={pt => setSelectedDest(pt)}
                    // 📍 emoji — visual only, pointer-events:none so it never blocks hit detection
                    htmlElementsData={globeData}
                    htmlLat={d => d.lat}
                    htmlLng={d => d.lng}
                    htmlAltitude={0.01}
                    htmlElement={d => {
                      const el = document.createElement('div')
                      el.style.cssText = `
                        font-size: 14px;
                        line-height: 1;
                        user-select: none;
                        pointer-events: none;
                        filter: drop-shadow(0 1px 3px rgba(27,30,34,0.4));
                      `
                      el.textContent = '📍'
                      return el
                    }}
                    onGlobeReady={initGlobeRotation}
                  />
                  </div>
                </Suspense>
              )}

              {/* vignette overlay */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
                  background: 'radial-gradient(ellipse at center, transparent 50%, rgba(26,37,53,0.55) 100%)',
                }}
              />
            </div>

          ) : (

            /* ════ TABLE VIEW ════ */
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <button className="btn-ghost" onClick={() => downloadCSV(filtered)} style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
                  {t('explorer.exportCsv')}
                </button>
              </div>

              {destLoading ? <TableSkeleton /> : (
                <div className="card explorer-table-wrap" style={{ overflow: 'auto' }}>
                  <table className="explorer-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                    <thead>
                      <tr style={{ background: 'var(--almond-dark)' }}>
                        {['destination','country','region','personality','cost','score','languages','localWriter'].map(colKey => (
                          <th key={colKey} style={{
                            padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: '0.72rem',
                            fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em',
                            color: 'var(--slate)', textAlign: 'left', whiteSpace: 'nowrap',
                            borderBottom: '1px solid var(--almond-dark)',
                          }}>{t(`explorer.columns.${colKey}`)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((d, rowIdx) => (
                        <tr key={d.id} onClick={() => setSelectedDest(selectedDest?.id === d.id ? null : d)}
                          style={{
                            borderBottom: '1px solid var(--almond-dark)',
                            transition: 'background 0.15s ease',
                            animation: rowIdx < 10 ? `tableRowIn 0.5s var(--ease-dream) ${rowIdx * 0.05}s both` : 'none',
                          }}>
                          <td style={s.td}>{d.destination}</td>
                          <td style={s.td}>{d.country}</td>
                          <td style={s.td}>
                            <span className="tag tag-region" style={{ textTransform: 'none', fontSize: '0.72rem' }}>{d.region}</span>
                          </td>
                          <td style={{ ...s.td, maxWidth: '180px' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {d.personalities.slice(0, 2).map(p => (
                                <span key={p} className={`tag ${personalityTagClass(p)}`} style={{ fontSize: '0.65rem' }}>{localisePersonality(p, t)}</span>
                              ))}
                            </div>
                          </td>
                          <td style={s.td}>{d.costUSD != null ? `$${d.costUSD.toLocaleString()}` : '—'}</td>
                          <td style={s.td}>{d.suitabilityScore != null ? `${d.suitabilityScore}/5` : '—'}</td>
                          <td style={{ ...s.td, color: 'var(--slate)', fontSize: '0.82rem', maxWidth: '160px' }}>
                            {d.languages.slice(0, 3).join(', ')}{d.languages.length > 3 ? '…' : ''}
                          </td>
                          <td style={s.td}>
                            {d.writers?.length > 0
                              ? <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                  {d.writers.map((w, i) => (
                                    <a key={i} href={w.link || '#'} target="_blank" rel="noopener noreferrer"
                                      onClick={e => e.stopPropagation()}
                                      style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--redwood)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                                      {w.name} ↗
                                    </a>
                                  ))}
                                </div>
                              : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ── Globe hover tooltip ── */}
      {viewMode === 'globe' && hoveredDest && (
        <HoverCard destination={hoveredDest} x={mousePos.x} y={mousePos.y} mode="tooltip" />
      )}

      {/* ── Globe click → PostcardModal ── */}
      {viewMode === 'globe' && selectedDest && (
        <PostcardModal destination={selectedDest} result={result} onClose={() => setSelectedDest(null)} />
      )}

      {/* ── Table row click → side panel ── */}
      {viewMode === 'table' && selectedDest && (
        <HoverCard destination={selectedDest} result={result} mode="panel" onClose={() => setSelectedDest(null)} />
      )}

      {showTour && <FilterWalkthrough onComplete={() => setShowTour(false)} />}

      <audio ref={audioRef} src="/LALB Kailas audio.mp3" onEnded={() => setAudioPlaying(false)} />

    </div>
  )
}

/* ═══════════════════════ STYLES ═══════════════════════ */
const s = {
  topBar: {
    height: '64px', background: 'var(--white)', boxShadow: '0 1px 0 var(--almond-dark)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 1.25rem', gap: '0.75rem', flexShrink: 0, zIndex: 20, position: 'relative',
  },
  topLogo: {
    fontSize: '1.2rem', color: 'var(--lion)', letterSpacing: '0.02em', whiteSpace: 'nowrap',
  },
  td: {
    padding: '14px 16px', fontFamily: 'var(--font-body)', fontSize: '0.9rem',
    color: 'var(--ink-light)', verticalAlign: 'middle',
  },
}
