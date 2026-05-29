import { useState, useEffect, useRef } from 'react'
import { useI18n } from '../i18n/I18nContext'

const DEBOUNCE_MS = 200

export default function SearchBar({ value, onChange }) {
  const { t } = useI18n()
  const [text, setText] = useState(value)
  const [prevValue, setPrevValue] = useState(value)
  const debounceRef = useRef(null)

  // Sync the local input when value changes from outside (e.g. "clear filters")
  // using the render-time adjustment pattern instead of an effect.
  if (value !== prevValue) {
    setPrevValue(value)
    setText(value)
  }

  useEffect(() => () => clearTimeout(debounceRef.current), [])

  const handleChange = (val) => {
    setText(val) // instant feedback, never blocked by downstream rendering
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onChange(val), DEBOUNCE_MS)
  }

  const handleClear = () => {
    setText('')
    clearTimeout(debounceRef.current)
    onChange('')
  }

  return (
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-[18px] h-[18px] text-op-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <input
        type="text"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={t('searchPlaceholder')}
        className="w-full pl-10 pr-9 py-2.5 rounded-full border-2 border-op-bronze/40 bg-op-parchment-light text-sm text-op-ink
          focus:outline-none focus:ring-2 focus:ring-op-red/25 focus:border-op-red
          placeholder:text-op-ink-soft/70 transition-all hover:border-op-bronze/60"
      />
      {text && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-op-parchment-dark rounded-full transition-colors"
        >
          <svg className="w-4 h-4 text-op-ink-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
