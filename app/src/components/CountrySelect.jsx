import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { countryFlag, countryName } from '../utils/country'

// Full-width country picker with a flag grid, used on the landing page.
// The panel is portaled to the body so it is never clipped or mis-stacked by
// ancestors, and it follows the trigger on scroll/resize.
export default function CountrySelect({
  value,
  onChange,
  countries,
  placeholder,
  allLabel,
  lang,
}) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)
  const dropRef = useRef(null)
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })

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
    if (!open || !btnRef.current) return
    const update = () => {
      const r = btnRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + 6, left: r.left, width: r.width })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open])

  const choose = (code) => {
    onChange(code)
    setOpen(false)
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-4 py-3 rounded-xl bg-op-parchment border-2 border-op-bronze/40 text-op-ink text-sm flex items-center justify-between gap-2 cursor-pointer hover:border-op-bronze/70 focus:outline-none focus:border-op-red transition-colors"
      >
        <span className="truncate">
          {value ? `${countryFlag(value)} ${countryName(value, lang)}` : placeholder}
        </span>
        <svg
          className={`w-4 h-4 shrink-0 text-op-bronze transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && createPortal(
        <div
          ref={dropRef}
          className="fixed z-[1000] op-poster rounded-xl p-2 animate-fade-in"
          style={{ top: pos.top, left: pos.left, width: pos.width, minWidth: 220 }}
        >
          <button
            type="button"
            onClick={() => choose('')}
            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] font-semibold mb-1 transition-colors ${
              !value ? 'bg-op-navy text-white' : 'text-op-ink hover:bg-op-parchment-dark/60'
            }`}
          >
            🌐 {allLabel}
          </button>
          <div className="grid grid-cols-2 gap-1 max-h-[240px] overflow-y-auto scrollbar-thin">
            {countries.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => choose(c)}
                className={`flex items-center gap-1.5 px-2 py-2 rounded-lg text-[13px] text-left transition-colors ${
                  value === c
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
    </>
  )
}
