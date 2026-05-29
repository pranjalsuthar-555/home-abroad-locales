export const FIELD_TOOLTIPS = {
  personalities: {
    label: 'Destination Personality',
    tip: 'The traveler archetypes this destination suits best, based on lifestyle, pace, and priorities. Hover each tag to learn more.',
  },
  costUSD: {
    label: 'Avg. Cost of Living / Month',
    tip: 'Estimated monthly budget for a comfortable expat lifestyle including rent, food, transport, and leisure. Based on Numbeo data, updated 2024.',
  },
  suitabilityScore: {
    label: 'Expat Suitability Score',
    tip: "A 1–5 composite score across: cost of living, visa accessibility, safety, quality of life, and expat community strength. Sourced from Elle Griffin's Living Abroad database at elysian.press.",
  },
  countryTrend: {
    label: 'Country Trend',
    tip: 'The economic, safety, and quality-of-life trajectory over the past 2–3 years. ↑ Growing = conditions improving for expats. → Stable = consistent. ↓ Declining = worsening conditions.',
  },
  languages: {
    label: 'Languages Spoken',
    tip: 'The most commonly spoken languages in this destination. Useful for gauging how easy daily life will be without the local language.',
  },
  religions: {
    label: 'Predominant Religions',
    tip: 'The primary religious traditions shaping local culture, social norms, and public life.',
  },
  advantages: {
    label: 'Advantages',
    tip: 'Key reasons expats choose and love this destination — the genuine strengths that make it stand out.',
  },
  disadvantages: {
    label: 'Disadvantages',
    tip: 'Real challenges expats face here — honest notes on what makes this destination difficult or not for everyone.',
  },
  tourismWebsite: {
    label: 'Official Tourism Site',
    tip: 'The official government or regional tourism portal for visa information, entry requirements, and travel planning.',
  },
  writers: {
    label: 'Local Voice',
    tip: 'A Substack written by someone who actually lives here — real on-the-ground perspective, not travel journalism.',
  },
}

export const PERSONALITY_TAG_TIPS = {
  'urban explorer': 'Vibrant city life, cultural richness, and a dynamic urban pace of living.',
  'coastal dreamer': 'Beach and island destinations with a relaxed, outdoor lifestyle and warm climate.',
  'nature seeker': 'Mountain, forest, and rural destinations for those who need natural surroundings.',
  'community rooter': 'Strong local community bonds and a warm, human-scale pace of everyday life.',
  'global nomad': 'Well-connected destinations popular with international expats and remote workers.',
}

export function tagClass(p = '') {
  const l = p.toLowerCase()
  if (l.includes('urban'))   return 'tag-urban'
  if (l.includes('coastal')) return 'tag-coastal'
  if (l.includes('nature'))  return 'tag-nature'
  if (l.includes('rooted'))  return 'tag-rooted'
  return 'tag-region'
}

export function FieldLabel({ fieldKey }) {
  const tooltip = FIELD_TOOLTIPS[fieldKey]
  if (!tooltip) return null
  return (
    <span className="pc-tooltip-trigger">
      <span className="pc-field-label">
        {tooltip.label}
        <span className="pc-info-dot">?</span>
      </span>
      <div className="pc-tooltip-box">{tooltip.tip}</div>
    </span>
  )
}

export function PersonalityTag({ tag }) {
  const tipKey = Object.keys(PERSONALITY_TAG_TIPS).find(k => tag.toLowerCase().includes(k))
  const tip = tipKey ? PERSONALITY_TAG_TIPS[tipKey] : null
  const cls = `tag ${tagClass(tag)}`
  if (!tip) return <span className={cls}>{tag}</span>
  return (
    <span className="pc-tooltip-trigger">
      <span className={cls}>{tag}</span>
      <div className="pc-tooltip-box pc-tooltip-tag">{tip}</div>
    </span>
  )
}
