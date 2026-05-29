import { memo } from 'react'
import { useI18n } from '../i18n/I18nContext'
import { formatEventDate, formatEventTime } from '../utils/date'
import { countryFlag } from '../utils/country'

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

function EventCard({ event, onClick, isSelected }) {
  const { t, lang } = useI18n()
  const cat = categoryConfig[event.category] || categoryConfig.storeTournament

  const isToday =
    event.startDate.slice(0, 10) === new Date().toISOString().slice(0, 10)

  return (
    <div className="px-3 py-1.5">
      <button
        onClick={() => onClick(event)}
        className={`group block w-full text-left rounded-xl op-poster overflow-hidden cursor-pointer transition-all touch-manipulation hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.985] active:shadow-md ${
          isSelected ? 'ring-2 ring-op-red ring-offset-1 ring-offset-op-parchment' : ''
        }`}
      >
        <div className="flex">
          {/* category accent rail */}
          <div className="w-1.5 shrink-0" style={{ background: cat.color }} />

          <div className="flex-1 min-w-0 px-3.5 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{ color: cat.color, backgroundColor: cat.color + '1f' }}
              >
                <span>{cat.icon}</span>
                {t(event.category)}
              </span>
              {isToday && (
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-op-red text-white">
                  {t('today')}
                </span>
              )}
              {event.isCanceled && (
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-op-ink-soft text-white line-through">
                  {t('statusCanceled')}
                </span>
              )}
            </div>

            <h3 className="font-extrabold text-[15px] text-op-ink truncate group-hover:text-op-red transition-colors leading-snug">
              {event.store.name}
            </h3>

            <p className="text-xs text-op-ink-soft mt-0.5 truncate">
              {countryFlag(event.store.countryCode)} {event.store.city}
              <span className="text-op-bronze/50 mx-1">·</span>
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

            <div className="op-divider-dashed mt-2.5 pt-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-op-ink-soft min-w-0">
                <svg className="w-3.5 h-3.5 shrink-0 text-op-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                <span className="text-[12px] font-semibold text-op-ink truncate">
                  {formatEventDate(event.startDate, lang)}
                </span>
                <span className="text-[11px] text-op-ink-soft/80 shrink-0">
                  {formatEventTime(event.startDate)}
                </span>
              </div>
              <div
                className={`text-[12px] font-extrabold shrink-0 ${
                  !event.hasFee || event.isFree ? 'text-op-ink-soft' : 'text-op-red'
                }`}
              >
                {!event.hasFee || event.isFree
                  ? t('priceNA')
                  : `${event.fee.toFixed(0)}${event.feeCurrency === 'EUR' ? '€' : event.feeCurrency}`}
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  )
}

export default memo(EventCard)
