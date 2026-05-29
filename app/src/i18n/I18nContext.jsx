import { createContext, useContext, useState, useCallback } from 'react'
import { translations } from './translations'

const I18nContext = createContext()

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('op-events-lang')
    if (saved && translations[saved]) return saved
    const browserLang = navigator.language.slice(0, 2)
    return translations[browserLang] ? browserLang : 'es'
  })

  const t = useCallback(
    (key) => translations[lang]?.[key] || translations.en[key] || key,
    [lang],
  )

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'es' ? 'en' : 'es'
      localStorage.setItem('op-events-lang', next)
      return next
    })
  }, [])

  return (
    <I18nContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
