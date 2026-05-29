import { useState, useEffect, useMemo } from 'react'

function classifyEvent(title) {
  const t = title.toLowerCase()
  if (t.includes('store tournament')) return 'storeTournament'
  if (t.includes('release event')) return 'releaseEvent'
  if (t.includes('instant')) return 'instantEvent'
  if (t.includes('pirates party')) return 'piratesParty'
  if (t.includes('grand battle')) return 'grandBattle'
  if (t.includes('sealed battle')) return 'sealedBattle'
  if (t.includes('buddy battle')) return 'buddyBattle'
  if (t.includes('2on2')) return 'twoontwoBattle'
  return 'storeTournament'
}

function titleCaseCity(city) {
  if (!city) return city
  return city
    .toLowerCase()
    .replace(/(?:^|\s|-)\S/g, (c) => c.toUpperCase())
}

const countryBounds = {
  DE: { latMin: 47, latMax: 55.5, lngMin: 5, lngMax: 16 },
  ES: { latMin: 27, latMax: 44, lngMin: -19, lngMax: 5 },
}

const geoOverrides = {
  'Corneliusstrasse 65_Düsseldorf': { lat: 51.2156, lng: 6.7797 },
}

function fixGeo(geo, store) {
  if (!geo) return { lat: undefined, lng: undefined }
  let lat = geo.x
  let lng = geo.y

  const key = `${store.address}_${store.city}`
  if (geoOverrides[key]) return geoOverrides[key]

  const bounds = countryBounds[store.country_code]
  if (bounds && (lat < bounds.latMin || lat > bounds.latMax || lng < bounds.lngMin || lng > bounds.lngMax)) {
    return { lat: undefined, lng: undefined }
  }

  return { lat, lng }
}

function normalizeEvent(event) {
  const geo = event.raw?.event_place_geo || event.raw?.place_geo
  const { lat, lng } = fixGeo(geo, event.store)
  const parsedFee = event.fee != null && event.fee !== '' ? parseFloat(event.fee) : null

  return {
    id: event.id,
    url: event.url,
    title: event.title,
    category: classifyEvent(event.title),
    startDate: event.start_date,
    endDate: event.end_date,
    store: {
      name: event.store.name,
      address: event.store.address,
      city: titleCaseCity(event.store.city),
      postcode: event.store.postcode,
      countryCode: event.store.country_code,
      prefCode: event.store.pref_code,
    },
    capacity: event.capacity,
    fee: parsedFee,
    feeCurrency: event.fee_currency || 'EUR',
    isFree: parsedFee === 0,
    hasFee: parsedFee != null,
    status: event.status,
    isCanceled: event.raw?.is_canceled || false,
    isApplicationOpen: event.raw?.applicationOpen === '1',
    isArrivingFirst: event.raw?.is_arriving_first || false,
    entryType: event.raw?.entry_type,
    lat,
    lng,
    timezone: event.raw?.timezone,
    phone: event.raw?.phone_number,
    organizerUrl: event.raw?.organizer_url,
    organizerSns: event.raw?.organizer_sns_url,
    excerpt: event.raw?.excerpt,
    notes: event.raw?.notes,
    applicationStart: event.application_period?.start,
    applicationEnd: event.application_period?.end,
  }
}

export function useEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/data/one_piece_events_es.json').then((r) => r.json()),
      fetch('/data/one_piece_events_de.json').then((r) => r.json()),
    ]).then(([esData, deData]) => {
      const allEvents = [
        ...esData.events.map(normalizeEvent),
        ...deData.events.map(normalizeEvent),
      ]
      const uniqueMap = new Map()
      for (const ev of allEvents) {
        uniqueMap.set(ev.id, ev)
      }
      const unique = [...uniqueMap.values()]
      unique.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      setEvents(unique)
      setLoading(false)
    })
  }, [])

  const cities = useMemo(() => {
    const citySet = new Set()
    for (const ev of events) {
      if (ev.store.city) citySet.add(ev.store.city)
    }
    return [...citySet].sort()
  }, [events])

  const categories = useMemo(() => {
    const catSet = new Set()
    for (const ev of events) {
      catSet.add(ev.category)
    }
    return [...catSet].sort()
  }, [events])

  return { events, loading, cities, categories }
}

export function useFilteredEvents(events, filters) {
  return useMemo(() => {
    const searchLower = filters.search?.toLowerCase() || ''

    return events.filter((ev) => {
      if (searchLower) {
        const haystack =
          `${ev.store.name} ${ev.store.city} ${ev.title} ${ev.store.address}`.toLowerCase()
        if (!haystack.includes(searchLower)) return false
      }

      if (filters.country && ev.store.countryCode.toLowerCase() !== filters.country.toLowerCase())
        return false

      if (filters.category && ev.category.toLowerCase() !== filters.category.toLowerCase())
        return false

      if (filters.city && ev.store.city.toLowerCase() !== filters.city.toLowerCase())
        return false

      if (filters.storeName && ev.store.name !== filters.storeName)
        return false

      if (filters.dateFrom) {
        const evDate = ev.startDate.slice(0, 10)
        if (evDate < filters.dateFrom) return false
      }

      if (filters.dateTo) {
        const evDate = ev.startDate.slice(0, 10)
        if (evDate > filters.dateTo) return false
      }

      return true
    })
  }, [events, filters])
}
