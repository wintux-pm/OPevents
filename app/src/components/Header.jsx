import { useI18n } from '../i18n/I18nContext'
import StrawHat from './StrawHat'

export default function Header({ onHome }) {
  const { t, lang, toggleLang } = useI18n()

  return (
    <header className="relative bg-op-parchment-light/90 backdrop-blur-sm border-b-2 border-op-bronze/40 px-4 py-2 flex items-center justify-between shrink-0 shadow-sm">
      {/* gold hairline accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-op-gold/60 to-transparent" />

      <button
        onClick={onHome}
        className="group flex items-center gap-2.5 rounded-lg -mx-1 px-1 py-0.5 hover:bg-op-parchment-dark/50 transition-colors"
        aria-label={t('home')}
      >
        <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-op-red to-op-red-dark border-2 border-op-gold flex items-center justify-center shadow-[0_0_12px_rgba(201,150,47,0.35)]">
          <StrawHat className="w-6 h-6" />
        </div>
        <div className="text-left">
          <h1 className="text-[15px] font-extrabold text-op-ink leading-tight tracking-tight uppercase">{t('title')}</h1>
          <p className="text-[10px] text-op-bronze font-medium leading-tight hidden sm:block">{t('subtitle')}</p>
        </div>
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={onHome}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border-2 border-op-bronze/40 text-op-ink-soft hover:border-op-red/50 hover:text-op-red hover:bg-op-red/5 transition-all text-sm"
          aria-label={t('home')}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
          </svg>
          <span className="text-[11px] font-bold hidden sm:inline">{t('home')}</span>
        </button>
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border-2 border-op-bronze/40 hover:border-op-bronze/70 hover:bg-op-parchment-dark/50 transition-all text-sm"
          aria-label={t('language')}
        >
          <span className="text-sm">{lang === 'es' ? '🇪🇸' : '🇬🇧'}</span>
          <span className="uppercase text-[11px] font-bold text-op-ink-soft">{lang}</span>
        </button>
      </div>
    </header>
  )
}
