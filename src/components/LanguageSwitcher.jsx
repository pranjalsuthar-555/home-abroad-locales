import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../i18n/index.js'

const css = `
  .lang-switcher {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 120;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 12px 9px 14px;
    background: var(--white);
    border: 1.5px solid var(--lion);
    border-radius: var(--radius-pill, 999px);
    box-shadow: 0 4px 18px rgba(27,30,34,0.20);
  }
  .lang-switcher-globe { font-size: 0.95rem; line-height: 1; }
  .lang-switcher select {
    appearance: none;
    -webkit-appearance: none;
    border: none;
    background: transparent;
    font-family: var(--font-body);
    font-size: 0.85rem;
    color: var(--ink);
    cursor: pointer;
    outline: none;
    padding-right: 16px;
    /* chevron, so it still reads as a dropdown without the native arrow */
    background-image: linear-gradient(45deg, transparent 50%, var(--lion) 50%),
                      linear-gradient(135deg, var(--lion) 50%, transparent 50%);
    background-position: right 5px center, right 1px center;
    background-size: 5px 5px, 5px 5px;
    background-repeat: no-repeat;
  }
  .lang-switcher select:focus-visible { outline: 2px solid var(--redwood); outline-offset: 3px; }

  @media (max-width: 600px) {
    /* clear of the Explorer's audio pill, which sits bottom-left */
    .lang-switcher { bottom: 14px; right: 14px; padding: 8px 10px 8px 12px; }
    .lang-switcher select { font-size: 16px; }  /* avoids iOS zoom-on-focus */
  }
`

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const current = LANGUAGES.find(l => l.code === i18n.resolvedLanguage) ?? LANGUAGES[0]

  return (
    <div className="lang-switcher">
      <style>{css}</style>
      <span className="lang-switcher-globe" aria-hidden="true">🌐</span>
      <select
        aria-label={t('language.label')}
        value={current.code}
        onChange={e => i18n.changeLanguage(e.target.value)}
      >
        {LANGUAGES.map(l => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </div>
  )
}
