import { useState, useRef, useEffect, useCallback } from 'react'
import EventCard from './EventCard'
import { useI18n } from '../i18n/I18nContext'

const PAGE_SIZE = 40

export default function EventList({
  events,
  onSelectEvent,
  totalCount,
  selectedId,
}) {
  const { t } = useI18n()
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const loaderRef = useRef(null)

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [events])

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, events.length))
  }, [events.length])

  useEffect(() => {
    const loader = loaderRef.current
    if (!loader) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { threshold: 0.1 },
    )
    observer.observe(loader)
    return () => observer.disconnect()
  }, [loadMore])

  const visibleEvents = events.slice(0, visibleCount)

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="text-5xl mb-4">🏴‍☠️</div>
        <h3 className="text-base font-bold text-op-ink uppercase tracking-wide">
          {t('noEvents')}
        </h3>
        <p className="text-sm text-op-ink-soft mt-1">{t('noEventsDesc')}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="px-5 py-2.5 text-[13px] text-op-ink-soft border-b-2 border-op-bronze/30 bg-op-parchment-light/90 backdrop-blur-sm sticky top-0 z-10 uppercase tracking-wide">
        <span className="font-bold text-op-ink">{events.length}</span>{' '}
        {t('of')}{' '}
        <span className="font-bold text-op-ink">{totalCount}</span>{' '}
        {events.length === 1 ? t('event') : t('events')}
      </div>

      <div>
        {visibleEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onClick={onSelectEvent}
            isSelected={selectedId === event.id}
          />
        ))}
      </div>

      {visibleCount < events.length && (
        <div ref={loaderRef} className="py-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-op-ink-soft">
            <div className="w-4 h-4 border-2 border-op-parchment-dark border-t-op-red rounded-full animate-spin" />
            {t('loading')}
          </div>
        </div>
      )}
    </div>
  )
}
