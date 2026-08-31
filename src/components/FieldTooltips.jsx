import { useTranslation, Trans } from 'react-i18next'

/* Both the suitability score and country trend are Home Abroad's own destination-level
   figures, but their methodology is explicitly inspired by Elle Griffin's country-level
   "World Report Card" on Elysian — credited here with a real, clickable link. */
const ELYSIAN_URL = 'https://www.elysian.press/p/a-report-card-for-the-whole-world'
const FIELDS_WITH_SOURCE = ['suitabilityScore', 'countryTrend']

/* Labels and tips live in src/i18n/locales/*.json under card.fields.*
   These are our own UI strings — the Airtable field names are only used
   server-side as data keys and never surface here, so translating them
   needs no change to the base. */

export function tagClass(p = '') {
  const l = p.toLowerCase()
  if (l.includes('urban'))   return 'tag-urban'
  if (l.includes('coastal')) return 'tag-coastal'
  if (l.includes('nature'))  return 'tag-nature'
  if (l.includes('rooted'))  return 'tag-rooted'
  return 'tag-region'
}

export function FieldLabel({ fieldKey }) {
  const { t, i18n } = useTranslation()
  // a key we don't have copy for shouldn't render an empty label
  if (!i18n.exists(`card.fields.${fieldKey}.label`)) return null
  return (
    <span className="pc-tooltip-trigger">
      <span className="pc-field-label">
        {t(`card.fields.${fieldKey}.label`)}
        <span className="pc-info-dot">?</span>
      </span>
      <div className="pc-tooltip-box">
        {FIELDS_WITH_SOURCE.includes(fieldKey) ? (
          <Trans
            i18nKey={`card.fields.${fieldKey}.tip`}
            components={{
              link: (
                <a
                  href={ELYSIAN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pc-tooltip-link"
                  onClick={e => e.stopPropagation()}
                />
              ),
            }}
          />
        ) : (
          t(`card.fields.${fieldKey}.tip`)
        )}
      </div>
    </span>
  )
}

/* Airtable personality tags are English ("🌴 Coastal Dreamer"); match on that to pick
   the tip, but show the translated name. Unknown tags fall through untouched. */
function personalityKeyFor(tag = '') {
  const l = tag.toLowerCase()
  if (l.includes('urban'))   return 'urban'
  if (l.includes('coastal')) return 'coastal'
  if (l.includes('nature'))  return 'nature'
  if (l.includes('rooted'))  return 'rooted'
  return null
}

export function PersonalityTag({ tag }) {
  const { t } = useTranslation()
  const key = personalityKeyFor(tag)
  const cls = `tag ${tagClass(tag)}`
  if (!key) return <span className={cls}>{tag}</span>

  const emoji = (tag.match(/^\s*(\p{Extended_Pictographic}\uFE0F?)/u) || [])[1]
  const name  = t(`personalities.${key}.name`)
  return (
    <span className="pc-tooltip-trigger">
      <span className={cls}>{emoji ? `${emoji} ${name}` : name}</span>
      <div className="pc-tooltip-box pc-tooltip-tag">{t(`card.personalityTips.${key}`)}</div>
    </span>
  )
}
