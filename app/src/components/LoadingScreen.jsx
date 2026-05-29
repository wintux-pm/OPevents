import { useI18n } from '../i18n/I18nContext'

export default function LoadingScreen() {
  const { t } = useI18n()

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center gap-5 z-50">
      <div className="w-14 h-14 rounded-2xl bg-op-red flex items-center justify-center text-white font-extrabold text-lg shadow-lg animate-pulse">
        OP
      </div>
      <div className="text-slate-600 font-medium text-sm">{t('loading')}</div>
      <div className="w-40 h-0.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-op-red rounded-full"
          style={{ animation: 'loading-bar 1.2s ease-in-out infinite' }}
        />
      </div>
    </div>
  )
}
