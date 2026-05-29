import { memo, useMemo, useEffect, useCallback, useRef } from 'react'
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

const storeIconCache = {}

// One icon per store group, showing the store name + number of events there.
function getStoreGroupIcon(group, filteredStore) {
  const color = group.sameCategory
    ? categoryColors[group.category] || DEFAULT_COLOR
    : DEFAULT_COLOR
  const showClose = filteredStore === group.name
  const cacheKey = `${group.name}__${color}__${group.events.length}__${showClose ? 1 : 0}`
  if (storeIconCache[cacheKey]) return storeIconCache[cacheKey]

  const icon = L.divIcon({
    html: storeLabelHtml(group.name, group.events.length, color, showClose),
    className: 'store-cluster-icon',
    iconSize: L.point(40, 40),
    iconAnchor: L.point(20, 20),
  })
  storeIconCache[cacheKey] = icon
  return icon
}

function makeClusterIconFactory(filteredStore) {
  return function createClusterIcon(cluster) {
    const markers = cluster.getAllChildMarkers()
    // Counts reflect total events, not just the number of store markers.
    const count = markers.reduce((sum, m) => sum + (m.options.eventCount || 1), 0)
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

function MapBounds({ groups }) {
  const map = useMap()
  const didFit = useRef(false)

  useEffect(() => {
    if (didFit.current || groups.length === 0) return
    const points = groups.map((g) => [g.lat, g.lng])
    if (points.length > 0) {
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 13 })
      didFit.current = true
    }
  }, [groups, map])

  return null
}

function EventMap({ events, onSelectEvent, storeName, onClearStore }) {
  const wrapperRef = useRef(null)

  // Aggregate events into one marker per store/location. With tens of
  // thousands of events this cuts the marker count by an order of magnitude,
  // which is what keeps the map fast (and able to load at all) on mobile.
  const storeGroups = useMemo(() => {
    const map = new Map()
    for (const e of events) {
      if (!e.lat || !e.lng) continue
      const key = `${e.store.name}@${e.lat.toFixed(4)},${e.lng.toFixed(4)}`
      let group = map.get(key)
      if (!group) {
        group = {
          key,
          lat: e.lat,
          lng: e.lng,
          name: e.store.name,
          category: e.category,
          sameCategory: true,
          events: [],
        }
        map.set(key, group)
      }
      if (group.category !== e.category) group.sameCategory = false
      group.events.push(e)
    }
    return [...map.values()]
  }, [events])

  const center = useMemo(() => {
    if (storeGroups.length === 0) return [46.0, 5.0]
    const sumLat = storeGroups.reduce((s, g) => s + g.lat, 0)
    const sumLng = storeGroups.reduce((s, g) => s + g.lng, 0)
    return [sumLat / storeGroups.length, sumLng / storeGroups.length]
  }, [storeGroups])

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
        <MapBounds groups={storeGroups} />
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          spiderfyOnMaxZoom
          spiderfyDistanceMultiplier={2.5}
          showCoverageOnHover={false}
          removeOutsideVisibleBounds
          iconCreateFunction={clusterIconFn}
        >
          {storeGroups.map((group) => (
            <Marker
              key={group.key}
              position={[group.lat, group.lng]}
              icon={getStoreGroupIcon(group, storeName)}
              alt={group.name}
              category={group.sameCategory ? group.category : 'mixed'}
              eventCount={group.events.length}
              eventHandlers={{ click: () => onSelectEvent(group.events[0]) }}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  )
}

export default memo(EventMap)
