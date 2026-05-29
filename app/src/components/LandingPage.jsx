import { useState, useMemo } from 'react'
import { useI18n } from '../i18n/I18nContext'

function WaveLayer({ className = '', fill, speedClass }) {
  const path =
    'M0,40 C150,80 350,0 600,40 C850,80 1050,0 1200,40 L1200,120 L0,120 Z'
  return (
    <div className={`op-wave-track ${speedClass} flex ${className}`}>
      {[0, 1].map((i) => (
        <svg
          key={i}
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-1/2 h-full block"
        >
          <path d={path} fill={fill} />
        </svg>
      ))}
    </div>
  )
}

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
    <div className="min-h-screen bg-gradient-to-b from-[#071124] via-[#0b1e3f] to-[#06243f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Atmospheric glows */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-op-red rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-op-gold/60 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
      </div>

      {/* Compass rose watermark */}
      <svg
        className="op-compass absolute -top-16 -left-16 w-72 h-72 text-op-gold/10 pointer-events-none"
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
        <span className="text-[20rem] leading-none text-white/[0.03]">☠</span>
      </div>

      {/* Animated sea waves */}
      <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden pointer-events-none">
        <WaveLayer className="absolute bottom-3 h-24" fill="rgba(14,116,144,0.35)" speedClass="op-wave-slow" />
        <WaveLayer className="absolute bottom-0 h-28" fill="rgba(6,52,89,0.65)" speedClass="" />
      </div>

      <button
        onClick={toggleLang}
        className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-op-gold/30 hover:border-op-gold/60 hover:bg-white/10 transition-all text-sm z-20"
      >
        <span className="text-sm">{lang === 'es' ? '🇪🇸' : '🇬🇧'}</span>
        <span className="uppercase text-[11px] font-medium text-op-gold/80">{lang}</span>
      </button>

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Straw Hat emblem */}
        <div className="op-float relative mx-auto mb-6 w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-op-gold/40 blur-2xl" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-op-red to-op-red-dark border-4 border-op-gold flex items-center justify-center text-5xl shadow-[0_0_35px_rgba(241,196,15,0.55)]">
            <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">👒</span>
          </div>
        </div>

        <p className="op-gold-text text-xs font-bold tracking-[0.35em] uppercase mb-2">
          ⚓ One Piece Card Game ⚓
        </p>
        <h1 className="text-4xl font-extrabold text-white mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          {t('landingTitle')}
        </h1>

        {/* Flourish divider */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="h-px w-14 bg-gradient-to-r from-transparent to-op-gold/70" />
          <span className="text-op-gold op-bob">☠</span>
          <span className="h-px w-14 bg-gradient-to-l from-transparent to-op-gold/70" />
        </div>

        <p className="text-slate-300/90 text-sm mb-8">{t('landingSubtitle')}</p>

        {/* Wanted-poster style control panel */}
        <div className="rounded-2xl border border-op-gold/25 bg-white/[0.04] backdrop-blur-sm p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] space-y-3 mb-6">
          <div className="flex gap-3">
            <button
              onClick={() => { setCountry(country === 'ES' ? '' : 'ES'); setCity('') }}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${
                country === 'ES'
                  ? 'bg-op-red text-white border-op-gold shadow-lg shadow-op-red/40 ring-1 ring-op-gold/50'
                  : 'bg-white/10 text-white/80 border-white/10 hover:bg-white/15 hover:border-op-gold/30'
              }`}
            >
              🇪🇸 {t('spain')}
            </button>
            <button
              onClick={() => { setCountry(country === 'DE' ? '' : 'DE'); setCity('') }}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${
                country === 'DE'
                  ? 'bg-op-red text-white border-op-gold shadow-lg shadow-op-red/40 ring-1 ring-op-gold/50'
                  : 'bg-white/10 text-white/80 border-white/10 hover:bg-white/15 hover:border-op-gold/30'
              }`}
            >
              🇩🇪 {t('germany')}
            </button>
          </div>

          {filteredCities.length > 0 && (
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/10 text-sm appearance-none cursor-pointer focus:outline-none focus:border-op-gold/60 focus:ring-1 focus:ring-op-gold/40"
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
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/10 text-sm appearance-none cursor-pointer focus:outline-none focus:border-op-gold/60 focus:ring-1 focus:ring-op-gold/40"
          >
            <option value="" className="bg-slate-800">{t('selectEventType')}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-800">{t(cat)}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleEnter}
          className="group w-full py-3.5 rounded-xl bg-gradient-to-r from-op-red-dark via-op-red to-op-red-dark text-white font-bold text-sm border border-op-gold/40 shadow-lg shadow-op-red/40 transition-all active:scale-[0.98] hover:shadow-op-gold/30"
        >
          <span className="inline-flex items-center gap-2">
            ⚔️ {t('enterApp')}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </button>
        <button
          onClick={handleExploreAll}
          className="mt-3 text-sm text-slate-400 hover:text-op-gold transition-colors"
        >
          🧭 {t('exploreAll')}
        </button>
      </div>
    </div>
  )
}
