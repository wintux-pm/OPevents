import { useI18n } from '../i18n/I18nContext'
import { formatEventDate, formatEventTime } from '../utils/date'

const categoryConfig = {
  storeTournament: { color: '#3b82f6', icon: '🏪' },
  releaseEvent: { color: '#8b5cf6', icon: '🎉' },
  instantEvent: { color: '#22c55e', icon: '⚡' },
  piratesParty: { color: '#f59e0b', icon: '🏴‍☠️' },
  grandBattle: { color: '#ef4444', icon: '⚔️' },
  sealedBattle: { color: '#14b8a6', icon: '📦' },
  buddyBattle: { color: '#ec4899', icon: '🤝' },
  twoontwoBattle: { color: '#f97316', icon: '👥' },
}

const countryFlags = { ES: '🇪🇸', DE: '🇩🇪' }

export default function EventCard({ event, onClick, isSelected }) {
  const { t, lang } = useI18n()
  const cat = categoryConfig[event.category] || categoryConfig.storeTournament

  const isToday =
    event.startDate.slice(0, 10) === new Date().toISOString().slice(0, 10)

  return (
    <button
      onClick={() => onClick(event)}
      className={`w-full text-left px-5 py-3.5 cursor-pointer transition-all border-b border-slate-100 group ${
        isSelected
          ? 'bg-red-50/60'
          : 'hover:bg-slate-50'
      }`}
    >
      <div className="flex gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ backgroundColor: cat.color + '14' }}
        >
          {cat.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span
              className="text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: cat.color }}
            >
              {t(event.category)}
            </span>
            {isToday && (
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-op-red text-white">
                {t('today')}
              </span>
            )}
            {event.isCanceled && (
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-slate-400 text-white line-through">
                {t('statusCanceled')}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-[15px] text-slate-900 truncate group-hover:text-op-red transition-colors leading-snug">
            {event.store.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {countryFlags[event.store.countryCode]} {event.store.city}
            <span className="text-slate-300 mx-1">·</span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.store.address}, ${event.store.postcode} ${event.store.city}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-op-red hover:underline transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {event.store.address}
            </a>
          </p>
        </div>

        <div className="text-right shrink-0 flex flex-col items-end justify-center gap-0.5">
          <div className="text-[13px] font-medium text-slate-800">
            {formatEventDate(event.startDate, lang)}
          </div>
          <div className="text-[11px] text-slate-400">
            {formatEventTime(event.startDate)}
          </div>
          <div
            className={`text-xs font-bold mt-0.5 ${
              !event.hasFee || event.isFree ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {!event.hasFee || event.isFree
              ? t('priceNA')
              : `${event.fee.toFixed(0)}${event.feeCurrency === 'EUR' ? '€' : event.feeCurrency}`}
          </div>
        </div>
      </div>
    </button>
  )
}
