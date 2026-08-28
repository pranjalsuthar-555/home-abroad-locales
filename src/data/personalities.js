/* `key` stays in English on purpose — it's what the Explorer matches against the
   "Destination Personality" tags in Airtable, which are English. Only the display
   name and description are translated, via i18nKey. */
export const PERSONALITIES = {
  A: { letter: 'A', key: 'Urban Explorer',  i18nKey: 'urban',   emoji: '🏙', color: '#6B4FA0', tagClass: 'tag-urban'   },
  B: { letter: 'B', key: 'Coastal Dreamer', i18nKey: 'coastal', emoji: '🌴', color: '#2A7A65', tagClass: 'tag-coastal' },
  C: { letter: 'C', key: 'Nature Seeker',   i18nKey: 'nature',  emoji: '🏔', color: '#4A5C35', tagClass: 'tag-nature'  },
  D: { letter: 'D', key: 'Rooted Romantic', i18nKey: 'rooted',  emoji: '🐓', color: '#8B4A1E', tagClass: 'tag-rooted'  },
}

const BY_KEY = Object.fromEntries(Object.values(PERSONALITIES).map(p => [p.key, p]))

/* Results are persisted to localStorage, so a result saved by an older build can be
   missing fields added since (i18nKey, for one — without it the UI rendered
   "personalities.undefined.name"). Re-attach the current definition by its stable
   English key rather than trusting whatever shape was stored. */
export function rehydratePersonality(p) {
  if (!p) return null
  const current = BY_KEY[p.key]
  return current ? { ...p, ...current } : p
}

export function rehydrateResult(result) {
  if (!result) return null
  const primary = rehydratePersonality(result.primary)
  if (!primary) return null          // unrecognisable shape — treat as no saved result
  return {
    ...result,
    ...primary,                      // result spreads primary's fields at the top level too
    primary,
    secondary: rehydratePersonality(result.secondary),
    tertiary:  rehydratePersonality(result.tertiary),
  }
}
