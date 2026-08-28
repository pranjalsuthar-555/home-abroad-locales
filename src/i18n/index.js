import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import de from './locales/de.json'
import pt from './locales/pt.json'
import it from './locales/it.json'

/* Latin-script languages only for now. Arabic / Chinese / Japanese were deliberately
   left out: Arabic needs full RTL layout work (the Explorer is a left-anchored drawer
   plus a right-anchored header), and CJK needs webfont work — the display face here
   has no CJK glyphs. Both are separate jobs, not extra JSON files. */
export const LANGUAGES = [
  { code: 'en', label: 'English'    },
  { code: 'es', label: 'Español'    },
  { code: 'fr', label: 'Français'   },
  { code: 'de', label: 'Deutsch'    },
  { code: 'pt', label: 'Português'  },
  { code: 'it', label: 'Italiano'   },
]

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de },
      pt: { translation: pt },
      it: { translation: it },
    },
    fallbackLng: 'en',
    supportedLngs: LANGUAGES.map(l => l.code),
    nonExplicitSupportedLngs: true,   // "en-GB" / "es-MX" resolve to "en" / "es"
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'ha_lang',
      caches: ['localStorage'],
    },
  })

export default i18n
