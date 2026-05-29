import { useEffect } from 'react'
import { useI18n } from '../i18n/I18nContext'
import { formatFullDate, formatEventTime } from '../utils/date'
import { countryFlag, countryName } from '../utils/country'

const categoryConfig = {
  storeTournament: { color: '#3b82f6', label: 'storeTournament', icon: '🏪' },
  releaseEvent: { color: '#8b5cf6', label: 'releaseEvent', icon: '🎉' },
  instantEvent: { color: '#22c55e', label: 'instantEvent', icon: '⚡' },
  piratesParty: { color: '#f59e0b', label: 'piratesParty', icon: '🏴‍☠️' },
  grandBattle: { color: '#ef4444', label: 'grandBattle', icon: '⚔️' },
  sealedBattle: { color: '#14b8a6', label: 'sealedBattle', icon: '📦' },
  buddyBattle: { color: '#ec4899', label: 'buddyBattle', icon: '🤝' },
  twoontwoBattle: { color: '#f97316', label: 'twoontwoBattle', icon: '👥' },
}

function StatusBadge({ event, t }) {
  if (event.isCanceled)
    return (
      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-op-parchment-dark text-op-ink-soft">
        {t('statusCanceled')}
      </span>
    )
  if (event.status === 31)
    return (
      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600">
        {t('statusFull')}
      </span>
    )
  if (event.isApplicationOpen)
    return (
      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600">
        {t('statusOpen')}
      </span>
    )
  return (
    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-op-parchment-dark text-op-ink-soft">
      {t('statusClosed')}
    </span>
  )
}

function InfoRow({ icon, label, value, href }) {
  if (!value) return null
  const content = href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-op-red hover:text-op-red-dark hover:underline break-all"
    >
      {value}
    </a>
  ) : (
    <span className="text-op-ink break-all">{value}</span>
  )

  return (
    <div className="flex items-start gap-2.5 py-2">
      <span className="text-op-ink-soft shrink-0 mt-0.5">{icon}</span>
      <div className="min-w-0">
        <div className="text-[10px] text-op-ink-soft font-medium uppercase tracking-wider">
          {label}
        </div>
        <div className="text-[13px] leading-snug mt-0.5">{content}</div>
      </div>
    </div>
  )
}

export default function EventDetail({ event, onClose, onFilterStore, isStoreFiltered }) {
  const { t, lang } = useI18n()

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!event) return null

  const cat = categoryConfig[event.category] || categoryConfig.storeTournament

  const bounty = !event.hasFee || event.isFree
    ? t('priceNA')
    : `${event.fee.toFixed(0)}${event.feeCurrency === 'EUR' ? '€' : event.feeCurrency}`

  return (
    <>
      <div
        className="fixed inset-0 bg-op-ink/50 z-40 animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed z-50 inset-0 flex items-end lg:items-center justify-center p-0 lg:p-6 animate-fade-in" onClick={onClose}>
        <div className="relative op-poster rounded-t-2xl lg:rounded-2xl !shadow-2xl overflow-hidden flex flex-col max-h-[92vh] lg:max-h-[85vh] w-full lg:w-[460px]" onClick={(e) => e.stopPropagation()}>
          {/* Corner brackets */}
          <span className="pointer-events-none absolute top-2.5 left-2.5 w-5 h-5 border-t-2 border-l-2 border-op-bronze/60 z-10" />
          <span className="pointer-events-none absolute top-2.5 right-2.5 w-5 h-5 border-t-2 border-r-2 border-op-bronze/60 z-10" />
          <span className="pointer-events-none absolute bottom-2.5 left-2.5 w-5 h-5 border-b-2 border-l-2 border-op-bronze/60 z-10" />
          <span className="pointer-events-none absolute bottom-2.5 right-2.5 w-5 h-5 border-b-2 border-r-2 border-op-bronze/60 z-10" />

          {/* Wanted-poster header */}
          <div className="relative px-6 pt-4 pb-4 text-center shrink-0">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-op-parchment-dark/70 hover:bg-op-parchment-dark border border-op-bronze/40 flex items-center justify-center transition-colors text-op-ink z-20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* WANTED */}
            <div className="flex items-center justify-center gap-2.5 mb-3">
              <span className="h-0.5 flex-1 max-w-[40px] bg-op-ink/70" />
              <h2 className="text-3xl font-black uppercase tracking-[0.18em] text-op-ink leading-none">
                Wanted
              </h2>
              <span className="h-0.5 flex-1 max-w-[40px] bg-op-ink/70" />
            </div>

            {/* Portrait frame */}
            <div
              className="mx-auto w-28 h-28 rounded-md border-[3px] border-op-ink/80 flex items-center justify-center text-6xl shadow-[inset_0_0_18px_rgba(42,32,20,0.25)]"
              style={{ background: cat.color + '26' }}
            >
              {cat.icon}
            </div>

            {/* DEAD OR ALIVE */}
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-op-ink mt-3 mb-2">
              Dead or Alive
            </p>

            <span
              className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-1.5"
              style={{ color: cat.color, backgroundColor: cat.color + '1f' }}
            >
              {t(cat.label)}
            </span>

            <h3 className="font-black text-xl text-op-ink uppercase leading-tight px-4">
              {event.store.name}
            </h3>
            <p className="text-sm text-op-ink-soft mt-0.5">
              {countryFlag(event.store.countryCode)} {event.store.city},{' '}
              {countryName(event.store.countryCode, lang)}
            </p>

            {/* Bounty */}
            <div className="flex items-center justify-center gap-2.5 mt-3">
              <span className="h-px w-8 bg-op-bronze/50" />
              <span className="text-2xl font-black text-op-ink tracking-wide whitespace-nowrap">
                <span className="text-op-bronze mr-1">฿</span>{bounty}
              </span>
              <span className="h-px w-8 bg-op-bronze/50" />
            </div>
          </div>

          <div className="op-divider-dashed mx-5 shrink-0" />

          {/* Stats row */}
          <div className="grid grid-cols-3 border-b border-op-bronze/25">
            <div className="p-3 text-center border-r border-op-bronze/25">
              <div className="text-[10px] text-op-ink-soft font-medium uppercase tracking-wider">
                {t('date')}
              </div>
              <div className="text-[13px] font-semibold text-op-ink mt-1">
                {formatFullDate(event.startDate, lang).split(',').slice(0, 1)}
              </div>
              <div className="text-[11px] text-op-ink-soft">
                {formatEventTime(event.startDate)}
              </div>
            </div>
            <div className="p-3 text-center border-r border-op-bronze/25">
              <div className="text-[10px] text-op-ink-soft font-medium uppercase tracking-wider">
                {t('fee')}
              </div>
              <div
                className={`text-[13px] font-bold mt-1 ${!event.hasFee || event.isFree ? 'text-op-ink-soft' : 'text-op-ink'}`}
              >
                {!event.hasFee || event.isFree
                  ? t('priceNA')
                  : `${event.fee.toFixed(0)}${event.feeCurrency === 'EUR' ? '€' : event.feeCurrency}`}
              </div>
            </div>
            <div className="p-3 text-center">
              <div className="text-[10px] text-op-ink-soft font-medium uppercase tracking-wider">
                {t('capacity')}
              </div>
              <div className="text-[13px] font-semibold text-op-ink mt-1">
                {event.capacity}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="px-5 py-2.5 flex items-center gap-2 border-b border-op-bronze/25">
            <StatusBadge event={event} t={t} />
            <span className="text-[11px] text-op-ink-soft">
              {event.entryType === 1 ? t('firstCome') : t('application')}
            </span>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 scrollbar-thin">
            {event.excerpt && (
              <div className="px-5 py-3 border-b border-op-bronze/25">
                <div className="text-[10px] text-op-ink-soft font-medium uppercase tracking-wider mb-1">
                  {t('description')}
                </div>
                <p className="text-[13px] text-op-ink leading-relaxed">
                  {event.excerpt}
                </p>
              </div>
            )}

            <div className="px-5 py-3 border-b border-op-bronze/25">
              <h3 className="text-[10px] font-semibold text-op-ink-soft uppercase tracking-wider mb-0.5">
                {t('eventDetails')}
              </h3>
              <InfoRow
                icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>}
                label={t('date')}
                value={`${formatFullDate(event.startDate, lang)} · ${formatEventTime(event.startDate)}`}
              />
              {event.applicationStart && (
                <InfoRow
                  icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  label={t('registrationPeriod')}
                  value={`${t('from')} ${formatFullDate(event.applicationStart, lang)}`}
                />
              )}
            </div>

            <div className="px-5 py-3">
              <h3 className="text-[10px] font-semibold text-op-ink-soft uppercase tracking-wider mb-0.5">
                {t('storeInfo')}
              </h3>
              <InfoRow
                icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>}
                label={t('address')}
                value={`${event.store.address}, ${event.store.postcode} ${event.store.city}`}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.store.address}, ${event.store.postcode} ${event.store.city}`)}`}
              />
              {event.phone && (
                <InfoRow
                  icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>}
                  label={t('phone')}
                  value={event.phone}
                  href={`tel:${event.phone}`}
                />
              )}
              {event.organizerUrl && (
                <InfoRow
                  icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>}
                  label={t('website')}
                  value={event.organizerUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  href={event.organizerUrl}
                />
              )}
              {event.organizerSns && (
                <InfoRow
                  icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>}
                  label={t('socialMedia')}
                  value={event.organizerSns.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  href={event.organizerSns}
                />
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="p-4 border-t-2 border-op-bronze/30 bg-op-parchment-light shrink-0 space-y-2.5">
            <p className="text-center text-[9px] font-bold uppercase tracking-[0.3em] text-op-bronze/80 pb-0.5">
              ⚓ Marine · World Government ⚓
            </p>
            {onFilterStore && (
              <button
                onClick={() => onFilterStore(event.store.name)}
                className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm border transition-colors ${
                  isStoreFiltered
                    ? 'border-op-bronze/40 text-op-ink-soft hover:bg-op-parchment-dark/50'
                    : 'border-op-red/40 text-op-red hover:bg-op-red/10'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M6 12h12m-9 5.25h6" />
                </svg>
                {isStoreFiltered ? t('clearStoreFilter') : t('filterByStore')}
              </button>
            )}
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 rounded-xl bg-op-red hover:bg-op-red-dark text-white font-semibold text-sm text-center transition-colors"
            >
              {t('register')} →
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
