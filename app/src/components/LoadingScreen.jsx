import { useI18n } from '../i18n/I18nContext'
import StrawHat from './StrawHat'

export default function LoadingScreen() {
  const { t } = useI18n()

  return (
    <div className="fixed inset-0 op-paper flex flex-col items-center justify-center gap-5 z-50">
      <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-op-red to-op-red-dark border-2 border-op-gold flex items-center justify-center shadow-[0_0_28px_rgba(201,150,47,0.45)] animate-pulse">
        <StrawHat className="w-11 h-11" />
      </div>
      <div className="text-op-ink font-bold text-sm uppercase tracking-widest">{t('loading')}</div>
      <div className="w-40 h-1 bg-op-parchment-dark rounded-full overflow-hidden">
        <div
          className="h-full bg-op-red rounded-full"
          style={{ animation: 'loading-bar 1.2s ease-in-out infinite' }}
        />
      </div>
    </div>
  )
}
