import { useState, useCallback, useMemo, useDeferredValue, lazy, Suspense } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import Filters from './components/Filters'
import EventList from './components/EventList'
import EventDetail from './components/EventDetail'
import LoadingScreen from './components/LoadingScreen'
import LandingPage from './components/LandingPage'
import { useEvents, useFilteredEvents } from './hooks/useEvents'
import { useI18n } from './i18n/I18nContext'

const EventMap = lazy(() => import('./components/EventMap'))

const initialFilters = {
  search: '',
  country: '',
  category: '',
  city: '',
  storeName: '',
  dateFrom: '',
  dateTo: '',
}

export default function App() {
  const { t } = useI18n()
  const { events, loading, cities, categories } = useEvents()
  const [filters, setFilters] = useState(initialFilters)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [mobileView, setMobileView] = useState('list')
  const [showLanding, setShowLanding] = useState(true)

  const updateFilters = useCallback((patch) => {
    setFilters((prev) => ({ ...prev, ...patch }))
  }, [])

  const handleMapStoreClick = useCallback((event) => {
    setSelectedEvent(event)
    setFilters((prev) => ({ ...prev, storeName: event.store.name }))
  }, [])

  const handleClearStore = useCallback(() => {
    setFilters((prev) => ({ ...prev, storeName: '' }))
  }, [])

  const filteredEvents = useFilteredEvents(events, filters)
  // The map is the heaviest consumer (thousands of markers); render it at a lower
  // priority so it never blocks the list or interactions while filters change.
  const deferredEvents = useDeferredValue(filteredEvents)

  const filteredCities = useMemo(() => {
    if (!filters.country) return cities
    return [
      ...new Set(
        events
          .filter(
            (e) =>
              e.store.countryCode.toLowerCase() ===
              filters.country.toLowerCase(),
          )
          .map((e) => e.store.city),
      ),
    ].sort()
  }, [events, cities, filters.country])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.country) count++
    if (filters.category) count++
    if (filters.city) count++
    if (filters.storeName) count++
    if (filters.dateFrom || filters.dateTo) count++
    return count
  }, [filters])

  const handleLandingEnter = useCallback((preFilters) => {
    setFilters((prev) => ({ ...prev, ...preFilters }))
    setShowLanding(false)
  }, [])

  const handleGoHome = useCallback(() => {
    setSelectedEvent(null)
    setShowLanding(true)
  }, [])

  if (loading) return <LoadingScreen />

  if (showLanding) {
    return <LandingPage events={events} cities={cities} categories={categories} onEnter={handleLandingEnter} />
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <Header onHome={handleGoHome} />

      {/* Search & Filters */}
      <div className="border-b border-slate-200 bg-white shrink-0 z-20">
        <div className="max-w-none px-4 lg:px-5 py-2.5 space-y-2">
          <SearchBar
            value={filters.search}
            onChange={(val) => updateFilters({ search: val })}
          />
          <Filters
            filters={filters}
            onUpdate={updateFilters}
            cities={filteredCities}
            categories={categories}
            activeFilterCount={activeFilterCount}
          />
        </div>
      </div>

      {/* Split view: results + map */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Results panel */}
        <div
          className={`w-full lg:w-[480px] xl:w-[540px] overflow-y-auto bg-white border-r border-slate-200 scrollbar-thin shrink-0 ${
            mobileView === 'map' ? 'hidden lg:block' : ''
          }`}
        >
          <EventList
            events={filteredEvents}
            onSelectEvent={setSelectedEvent}
            totalCount={events.length}
            selectedId={selectedEvent?.id}
          />
        </div>

        {/* Map panel */}
        <div
          className={`flex-1 relative ${
            mobileView === 'list' ? 'hidden lg:block' : 'block w-full'
          }`}
        >
          <Suspense
            fallback={
              <div className="h-full flex items-center justify-center bg-slate-50">
                <div className="w-5 h-5 border-2 border-slate-200 border-t-op-red rounded-full animate-spin" />
              </div>
            }
          >
            <EventMap
              events={deferredEvents}
              onSelectEvent={handleMapStoreClick}
              storeName={filters.storeName}
              onClearStore={handleClearStore}
            />
          </Suspense>
        </div>

        {/* Mobile toggle button */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={() =>
              setMobileView(mobileView === 'list' ? 'map' : 'list')
            }
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-op-navy text-white text-sm font-semibold shadow-xl active:scale-95 transition-transform"
          >
            {mobileView === 'list' ? (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                  />
                </svg>
                {t('map')}
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                  />
                </svg>
                {t('list')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Event detail */}
      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  )
}
