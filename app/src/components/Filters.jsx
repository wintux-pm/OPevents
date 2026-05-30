import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useI18n } from '../i18n/I18nContext'
import { countryFlag, countryName } from '../utils/country'

function SelectChip({ value, onChange, placeholder, options }) {
  const active = !!value

  return (
    <div className="relative shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none cursor-pointer px-3.5 py-1.5 pr-7 rounded-full text-[13px] font-medium border transition-all outline-none ${
          active
            ? 'bg-op-navy text-white border-op-gold/60 shadow-sm'
            : 'bg-op-parchment-light text-op-ink border-op-bronze/40 hover:border-op-bronze/70 hover:shadow-sm'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg
        className={`w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${active ? 'text-white' : 'text-op-bronze'}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )
}

function DateChip({ filters, onUpdate }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)
  const dropRef = useRef(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const handler = (e) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target) &&
        dropRef.current && !dropRef.current.contains(e.target)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 6, left: rect.left })
    }
  }, [open])

  const hasDate = filters.dateFrom || filters.dateTo
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const tmrw = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  const tomorrow = `${tmrw.getFullYear()}-${String(tmrw.getMonth() + 1).padStart(2, '0')}-${String(tmrw.getDate()).padStart(2, '0')}`
  const wEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7)
  const weekEnd = `${wEnd.getFullYear()}-${String(wEnd.getMonth() + 1).padStart(2, '0')}-${String(wEnd.getDate()).padStart(2, '0')}`

  const quickDates = [
    { label: t('today'), from: today, to: today },
    { label: t('tomorrow'), from: tomorrow, to: tomorrow },
    { label: t('thisWeek'), from: today, to: weekEnd },
  ]

  let displayLabel = t('date')
  if (hasDate) {
    const isQuick = quickDates.find(
      (q) => q.from === filters.dateFrom && q.to === filters.dateTo,
    )
    displayLabel = isQuick
      ? isQuick.label
      : `${filters.dateFrom || '…'} → ${filters.dateTo || '…'}`
  }

  return (
    <div className="shrink-0">
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-all whitespace-nowrap flex items-center gap-1 ${
          hasDate
            ? 'bg-op-navy text-white border-op-gold/60 shadow-sm'
            : 'bg-op-parchment-light text-op-ink border-op-bronze/40 hover:border-op-bronze/70 hover:shadow-sm'
        }`}
      >
        {displayLabel}
        <svg
          className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''} ${hasDate ? 'text-white' : 'text-op-bronze'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && createPortal(
        <div
          ref={dropRef}
          className="fixed op-poster rounded-xl p-3 z-[1000] min-w-[220px] animate-fade-in"
          style={{ top: pos.top, left: pos.left }}
        >
          <div className="flex gap-1.5 mb-3">
            {quickDates.map((q) => {
              const isActive =
                filters.dateFrom === q.from && filters.dateTo === q.to
              return (
                <button
                  key={q.label}
                  onClick={() => {
                    if (isActive) {
                      onUpdate({ dateFrom: '', dateTo: '' })
                    } else {
                      onUpdate({ dateFrom: q.from, dateTo: q.to })
                    }
                    setOpen(false)
                  }}
                  className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    isActive
                      ? 'bg-op-navy text-white border-op-gold/60'
                      : 'bg-op-parchment text-op-ink-soft border-op-bronze/30 hover:border-op-bronze/60'
                  }`}
                >
                  {q.label}
                </button>
              )
            })}
          </div>
          <div className="space-y-2">
            <div>
              <label className="text-[11px] text-op-ink-soft font-medium mb-0.5 block">
                {t('dateFrom')}
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => onUpdate({ dateFrom: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-op-bronze/40 text-sm bg-op-parchment-light text-op-ink focus:ring-1 focus:ring-op-red/30 focus:border-op-red outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] text-op-ink-soft font-medium mb-0.5 block">
                {t('dateTo')}
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => onUpdate({ dateTo: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-op-bronze/40 text-sm bg-op-parchment-light text-op-ink focus:ring-1 focus:ring-op-red/30 focus:border-op-red outline-none"
              />
            </div>
          </div>
          {hasDate && (
            <button
              onClick={() => {
                onUpdate({ dateFrom: '', dateTo: '' })
                setOpen(false)
              }}
              className="w-full mt-2 text-xs text-op-red font-medium hover:text-op-red-dark text-center py-1"
            >
              {t('clearFilters')}
            </button>
          )}
        </div>,
        document.body,
      )}
    </div>
  )
}

function CountryChip({ filters, countries, onUpdate, t, lang }) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)
  const dropRef = useRef(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const handler = (e) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target) &&
        dropRef.current && !dropRef.current.contains(e.target)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      const width = 264
      const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8))
      setPos({ top: rect.bottom + 6, left })
    }
  }, [open])

  const selected = filters.country
  const active = !!selected
  const label = selected
    ? `${countryFlag(selected)} ${countryName(selected, lang)}`
    : t('country')

  const choose = (code) => {
    onUpdate({ country: code, city: '' })
    setOpen(false)
  }

  return (
    <div className="shrink-0">
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-all whitespace-nowrap flex items-center gap-1.5 ${
          active
            ? 'bg-op-navy text-white border-op-gold/60 shadow-sm'
            : 'bg-op-parchment-light text-op-ink border-op-bronze/40 hover:border-op-bronze/70 hover:shadow-sm'
        }`}
      >
        {label}
        <svg
          className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''} ${active ? 'text-white' : 'text-op-bronze'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && createPortal(
        <div
          ref={dropRef}
          className="fixed op-poster rounded-xl p-2 z-[1000] w-[264px] animate-fade-in"
          style={{ top: pos.top, left: pos.left }}
        >
          <button
            onClick={() => choose('')}
            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] font-semibold mb-1 transition-colors ${
              !selected ? 'bg-op-navy text-white' : 'text-op-ink hover:bg-op-parchment-dark/60'
            }`}
          >
            🌐 {t('allCountries')}
          </button>
          <div className="grid grid-cols-2 gap-1 max-h-[256px] overflow-y-auto scrollbar-thin">
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => choose(c)}
                className={`flex items-center gap-1.5 px-2 py-2 rounded-lg text-[13px] text-left transition-colors ${
                  selected === c
                    ? 'bg-op-navy text-white font-semibold'
                    : 'text-op-ink hover:bg-op-parchment-dark/60'
                }`}
              >
                <span className="text-base leading-none shrink-0">{countryFlag(c)}</span>
                <span className="truncate">{countryName(c, lang)}</span>
              </button>
            ))}
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}

export default function Filters({
  filters,
  onUpdate,
  cities,
  categories,
  countries,
  activeFilterCount,
}) {
  const { t, lang } = useI18n()

  return (
    <div className="relative">
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5 pr-7">
      {countries.length > 0 && (
        <CountryChip
          filters={filters}
          countries={countries}
          onUpdate={onUpdate}
          t={t}
          lang={lang}
        />
      )}

      <div className="w-px h-5 bg-op-bronze/30 shrink-0" />

      <SelectChip
        value={filters.category}
        onChange={(val) => onUpdate({ category: val })}
        placeholder={t('eventType')}
        options={categories.map((cat) => ({ value: cat, label: t(cat) }))}
      />

      {cities.length > 0 && (
        <SelectChip
          value={filters.city}
          onChange={(val) => onUpdate({ city: val })}
          placeholder={t('city')}
          options={cities.map((city) => ({ value: city, label: city }))}
        />
      )}

      <div className="w-px h-5 bg-op-bronze/30 shrink-0" />

      <DateChip filters={filters} onUpdate={onUpdate} />

      {filters.storeName && (
        <>
          <div className="w-px h-5 bg-op-bronze/30 shrink-0" />
          <button
            onClick={() => onUpdate({ storeName: '' })}
            className="shrink-0 flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[13px] font-medium bg-op-navy text-white border border-op-gold/60 transition-all"
          >
            🏪 {filters.storeName}
            <svg className="w-3 h-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </>
      )}

      {activeFilterCount > 0 && (
        <>
          <div className="w-px h-5 bg-op-bronze/30 shrink-0" />
          <button
            onClick={() =>
              onUpdate({
                country: '',
                category: '',
                city: '',
                storeName: '',
                dateFrom: '',
                dateTo: '',
              })
            }
            className="shrink-0 text-[13px] text-op-red hover:text-op-red-dark font-medium transition-colors whitespace-nowrap"
          >
            {t('clearFilters')}
          </button>
        </>
      )}
    </div>
      {/* scroll hint fade (mobile) */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-7 bg-gradient-to-l from-op-parchment-light to-transparent lg:hidden" />
    </div>
  )
}
