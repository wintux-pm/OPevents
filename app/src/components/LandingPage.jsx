import { useState, useMemo } from 'react'
import { useI18n } from '../i18n/I18nContext'
import StrawHat from './StrawHat'
import { countryFlag, countryName } from '../utils/country'

export default function LandingPage({ events, cities, categories, countries, onEnter }) {
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

  const selectClass =
    'w-full px-4 py-3 rounded-xl bg-op-parchment border-2 border-op-bronze/40 text-op-ink text-sm appearance-none cursor-pointer focus:outline-none focus:border-op-red focus:ring-1 focus:ring-op-red/30'

  return (
    <div className="min-h-screen op-paper flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Nautical chart grid */}
      <div
        className="absolute inset-0 op-chart-grid pointer-events-none"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 75% at 50% 45%, #000 35%, transparent 92%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 75% at 50% 45%, #000 35%, transparent 92%)',
        }}
      />

      {/* Compass rose watermark */}
      <svg
        className="op-compass absolute -top-16 -left-16 w-72 h-72 text-op-bronze/15 pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="44" />
        <circle cx="50" cy="50" r="34" />
        <path d="M50 4 L56 50 L50 96 L44 50 Z" fill="currentColor" stroke="none" />
        <path d="M4 50 L50 44 L96 50 L50 56 Z" fill="currentColor" stroke="none" />
        <path d="M18 18 L50 47 L82 18 L53 50 L82 82 L50 53 L18 82 L47 50 Z" fill="currentColor" stroke="none" opacity="0.5" />
      </svg>

      {/* Jolly Roger watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[20rem] leading-none text-op-ink/[0.04]">☠</span>
      </div>

      <button
        onClick={toggleLang}
        className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border-2 border-op-bronze/40 hover:border-op-bronze/70 hover:bg-op-parchment-light transition-all text-sm z-20"
      >
        <span className="text-sm">{lang === 'es' ? '🇪🇸' : '🇬🇧'}</span>
        <span className="uppercase text-[11px] font-bold text-op-ink-soft">{lang}</span>
      </button>

      {/* WANTED poster */}
      <div className="relative z-10 w-full max-w-md op-poster rounded-2xl px-7 pt-10 pb-7 text-center">
        {/* Straw Hat emblem, overlapping the top edge */}
        <div className="op-float absolute -top-9 left-1/2 -translate-x-1/2 w-[72px] h-[72px]">
          <div className="absolute inset-0 rounded-full bg-op-gold/30 blur-xl" />
          <div className="relative w-[72px] h-[72px] rounded-full bg-gradient-to-br from-op-red to-op-red-dark border-[3px] border-op-gold flex items-center justify-center shadow-[0_0_28px_rgba(201,150,47,0.5)]">
            <StrawHat className="w-12 h-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
          </div>
        </div>

        <p className="text-[11px] font-bold tracking-[0.4em] uppercase text-op-bronze mt-3 mb-1">
          ⚓ One Piece Card Game ⚓
        </p>
        <h1 className="text-4xl font-black text-op-ink uppercase tracking-tight leading-none mb-3">
          {t('landingTitle')}
        </h1>

        {/* Flourish divider */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-op-bronze/60" />
          <span className="text-op-bronze op-bob">☠</span>
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-op-bronze/60" />
        </div>

        <p className="text-op-ink-soft text-sm mb-6">{t('landingSubtitle')}</p>

        {/* Filters */}
        <div className="space-y-3 mb-6 text-left">
          {countries.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {countries.map((c) => {
                const active = country === c
                return (
                  <button
                    key={c}
                    onClick={() => { setCountry(active ? '' : c); setCity('') }}
                    className={`py-2 px-3 rounded-xl text-[13px] font-bold border-2 transition-all ${
                      active
                        ? 'bg-op-red text-white border-op-gold/70 shadow-md'
                        : 'bg-op-parchment text-op-ink border-op-bronze/40 hover:border-op-bronze/70'
                    }`}
                  >
                    {countryFlag(c)} {countryName(c, lang)}
                  </button>
                )
              })}
            </div>
          )}

          {filteredCities.length > 0 && (
            <select value={city} onChange={(e) => setCity(e.target.value)} className={selectClass}>
              <option value="">{t('selectCity')}</option>
              {filteredCities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}

          <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
            <option value="">{t('selectEventType')}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{t(cat)}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleEnter}
          className="group w-full py-3.5 rounded-xl bg-gradient-to-r from-op-red-dark via-op-red to-op-red-dark text-white font-bold text-sm uppercase tracking-wide border-2 border-op-gold/50 shadow-lg transition-all active:scale-[0.98] hover:shadow-op-gold/20"
        >
          <span className="inline-flex items-center gap-2">
            ⚔️ {t('enterApp')}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </button>
        <button
          onClick={handleExploreAll}
          className="mt-3 text-sm font-medium text-op-ink-soft hover:text-op-red transition-colors"
        >
          🧭 {t('exploreAll')}
        </button>
      </div>
    </div>
  )
}
