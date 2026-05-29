import { useI18n } from '../i18n/I18nContext'

export default function Header() {
  const { t, lang, toggleLang } = useI18n()

  return (
    <header className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-op-red rounded-lg flex items-center justify-center text-white font-extrabold text-[11px] shadow-sm">
          OP
        </div>
        <div>
          <h1 className="text-[15px] font-bold text-slate-900 leading-tight">{t('title')}</h1>
          <p className="text-[10px] text-slate-400 leading-tight hidden sm:block">{t('subtitle')}</p>
        </div>
      </div>
      <button
        onClick={toggleLang}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-sm"
        aria-label={t('language')}
      >
        <span className="text-sm">{lang === 'es' ? '🇪🇸' : '🇬🇧'}</span>
        <span className="uppercase text-[11px] font-medium text-slate-600">{lang}</span>
      </button>
    </header>
  )
}
