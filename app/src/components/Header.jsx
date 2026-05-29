import { useI18n } from '../i18n/I18nContext'

export default function Header({ onHome }) {
  const { t, lang, toggleLang } = useI18n()

  return (
    <header className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shrink-0">
      <button
        onClick={onHome}
        className="flex items-center gap-2.5 rounded-lg -mx-1 px-1 py-0.5 hover:bg-slate-50 transition-colors"
        aria-label={t('home')}
      >
        <div className="w-8 h-8 bg-op-red rounded-lg flex items-center justify-center text-white font-extrabold text-[11px] shadow-sm">
          OP
        </div>
        <div className="text-left">
          <h1 className="text-[15px] font-bold text-slate-900 leading-tight">{t('title')}</h1>
          <p className="text-[10px] text-slate-400 leading-tight hidden sm:block">{t('subtitle')}</p>
        </div>
      </button>
      <div className="flex items-center gap-2">
        <button
          onClick={onHome}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-slate-200 hover:border-op-red/40 hover:bg-op-red/5 hover:text-op-red text-slate-600 transition-all text-sm"
          aria-label={t('home')}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
          </svg>
          <span className="text-[11px] font-medium hidden sm:inline">{t('home')}</span>
        </button>
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-sm"
          aria-label={t('language')}
        >
          <span className="text-sm">{lang === 'es' ? '🇪🇸' : '🇬🇧'}</span>
          <span className="uppercase text-[11px] font-medium text-slate-600">{lang}</span>
        </button>
      </div>
    </header>
  )
}
