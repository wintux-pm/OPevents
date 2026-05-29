import { useMemo, useEffect, useCallback, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'

const categoryColors = {
  storeTournament: '#3b82f6',
  releaseEvent: '#8b5cf6',
  instantEvent: '#22c55e',
  piratesParty: '#f59e0b',
  grandBattle: '#ef4444',
  sealedBattle: '#14b8a6',
  buddyBattle: '#ec4899',
  twoontwoBattle: '#f97316',
}

const DEFAULT_COLOR = '#e63946'

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function storeLabelHtml(name, count, color, showClose) {
  const truncated = name.length > 20 ? name.slice(0, 20) + '…' : name
  const closeBtn = showClose
    ? `<span class="store-cluster-close" data-clear-store="1">✕</span>`
    : ''
  return `<div class="store-cluster" style="background:${color}"><span class="store-cluster-name">${escapeHtml(truncated)}</span><span class="store-cluster-count">${count}</span>${closeBtn}</div>`
}

const storeMarkerCache = {}

function getStoreMarkerIcon(event, filteredStore) {
  const storeName = event.store.name
  const color = categoryColors[event.category] || DEFAULT_COLOR
  const showClose = filteredStore === storeName
  const cacheKey = `${storeName}__${color}__${showClose ? 1 : 0}`
  if (storeMarkerCache[cacheKey]) return storeMarkerCache[cacheKey]

  const icon = L.divIcon({
    html: storeLabelHtml(storeName, 1, color, showClose),
    className: 'store-cluster-icon',
    iconSize: L.point(40, 40),
    iconAnchor: L.point(20, 20),
  })
  storeMarkerCache[cacheKey] = icon
  return icon
}

function makeClusterIconFactory(filteredStore) {
  return function createClusterIcon(cluster) {
    const markers = cluster.getAllChildMarkers()
    const count = markers.length
    const firstName = markers[0]?.options.alt
    const allSameStore = firstName && markers.every((m) => m.options.alt === firstName)

    if (allSameStore) {
      const firstCategory = markers[0]?.options.category
      const allSameCategory =
        firstCategory && markers.every((m) => m.options.category === firstCategory)
      const color = allSameCategory
        ? categoryColors[firstCategory] || DEFAULT_COLOR
        : DEFAULT_COLOR
      const showClose = filteredStore === firstName
      return L.divIcon({
        html: storeLabelHtml(firstName, count, color, showClose),
        className: 'store-cluster-icon',
        iconSize: L.point(40, 40),
        iconAnchor: L.point(20, 20),
      })
    }

    const size = count < 10 ? 'small' : count < 100 ? 'medium' : 'large'
    return L.divIcon({
      html: `<div><span>${count}</span></div>`,
      className: `marker-cluster marker-cluster-${size}`,
      iconSize: L.point(40, 40),
    })
  }
}

function MapBounds({ events }) {
  const map = useMap()
  const didFit = useRef(false)

  useEffect(() => {
    if (didFit.current || events.length === 0) return
    const points = events
      .filter((e) => e.lat && e.lng)
      .map((e) => [e.lat, e.lng])
    if (points.length > 0) {
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 13 })
      didFit.current = true
    }
  }, [events, map])

  return null
}

export default function EventMap({ events, onSelectEvent, storeName, onClearStore }) {
  const wrapperRef = useRef(null)
  const geoEvents = useMemo(
    () => events.filter((e) => e.lat && e.lng),
    [events],
  )

  const center = useMemo(() => {
    if (geoEvents.length === 0) return [46.0, 5.0]
    const sumLat = geoEvents.reduce((s, e) => s + e.lat, 0)
    const sumLng = geoEvents.reduce((s, e) => s + e.lng, 0)
    return [sumLat / geoEvents.length, sumLng / geoEvents.length]
  }, [geoEvents])

  const clusterIconFn = useCallback(
    (cluster) => makeClusterIconFactory(storeName)(cluster),
    [storeName],
  )

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const handler = (e) => {
      if (e.target.closest('[data-clear-store]')) {
        e.stopPropagation()
        onClearStore()
      }
    }
    el.addEventListener('click', handler, true)
    return () => el.removeEventListener('click', handler, true)
  }, [onClearStore])

  return (
    <div ref={wrapperRef} className="h-full w-full relative">
      <MapContainer
        center={center}
        zoom={5}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapBounds events={geoEvents} />
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          spiderfyOnMaxZoom
          spiderfyDistanceMultiplier={2.5}
          showCoverageOnHover={false}
          iconCreateFunction={clusterIconFn}
        >
          {geoEvents.map((event) => (
            <Marker
              key={event.id}
              position={[event.lat, event.lng]}
              icon={getStoreMarkerIcon(event, storeName)}
              alt={event.store.name}
              category={event.category}
              eventHandlers={{ click: () => onSelectEvent(event) }}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  )
}
