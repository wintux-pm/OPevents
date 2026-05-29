import { useState, useMemo } from 'react'
import { useI18n } from '../i18n/I18nContext'

export default function LandingPage({ events, cities, categories, onEnter }) {
  const { t, lang, toggleLang } = useI18n()
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('')

  const filteredCities = useMemo(() => {
    if (!country) return cities
    return [
      ...new Set(
        events
          .filter((e) => e.store.countryCode.toLowerCase() === country.toLowerCase())
          .map((e) => e.store.city),
      ),
    ].sort()
  }, [events, cities, country])

  const handleEnter = () => {
    onEnter({ country, city, category })
  }

  const handleExploreAll = () => {
    onEnter({ country: '', city: '', category: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-op-red rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <button
        onClick={toggleLang}
        className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all text-sm z-10"
      >
        <span className="text-sm">{lang === 'es' ? '🇪🇸' : '🇬🇧'}</span>
        <span className="uppercase text-[11px] font-medium text-white/70">{lang}</span>
      </button>

      <div className="relative z-10 w-full max-w-md text-center">
        <div className="w-16 h-16 bg-op-red rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-lg mx-auto mb-6">
          OP
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">{t('landingTitle')}</h1>
        <p className="text-slate-400 text-sm mb-8">{t('landingSubtitle')}</p>

        <div className="space-y-3 mb-8">
          <div className="flex gap-3">
            <button
              onClick={() => { setCountry(country === 'ES' ? '' : 'ES'); setCity('') }}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${
                country === 'ES'
                  ? 'bg-op-red text-white border-op-red shadow-lg shadow-op-red/30'
                  : 'bg-white/10 text-white/80 border-white/10 hover:bg-white/15 hover:border-white/20'
              }`}
            >
              🇪🇸 {t('spain')}
            </button>
            <button
              onClick={() => { setCountry(country === 'DE' ? '' : 'DE'); setCity('') }}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${
                country === 'DE'
                  ? 'bg-op-red text-white border-op-red shadow-lg shadow-op-red/30'
                  : 'bg-white/10 text-white/80 border-white/10 hover:bg-white/15 hover:border-white/20'
              }`}
            >
              🇩🇪 {t('germany')}
            </button>
          </div>

          {filteredCities.length > 0 && (
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/10 text-sm appearance-none cursor-pointer focus:outline-none focus:border-op-red/50 focus:ring-1 focus:ring-op-red/30"
            >
              <option value="" className="bg-slate-800">{t('selectCity')}</option>
              {filteredCities.map((c) => (
                <option key={c} value={c} className="bg-slate-800">{c}</option>
              ))}
            </select>
          )}

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/10 text-sm appearance-none cursor-pointer focus:outline-none focus:border-op-red/50 focus:ring-1 focus:ring-op-red/30"
          >
            <option value="" className="bg-slate-800">{t('selectEventType')}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-800">{t(cat)}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleEnter}
          className="w-full py-3.5 rounded-xl bg-op-red hover:bg-op-red-dark text-white font-semibold text-sm shadow-lg shadow-op-red/30 transition-all active:scale-[0.98]"
        >
          {t('enterApp')} →
        </button>
        <button
          onClick={handleExploreAll}
          className="mt-3 text-sm text-slate-400 hover:text-white transition-colors"
        >
          {t('exploreAll')}
        </button>
      </div>
    </div>
  )
}
