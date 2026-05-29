// Helpers to render any ISO-3166 alpha-2 country code without hardcoding maps.

// Turn "NO" into the 🇳🇴 flag emoji using regional indicator symbols.
export function countryFlag(code) {
  if (!code || code.length !== 2) return '🏴'
  const cc = code.toUpperCase()
  const base = 0x1f1e6 // regional indicator 'A'
  return String.fromCodePoint(
    base + cc.charCodeAt(0) - 65,
    base + cc.charCodeAt(1) - 65,
  )
}

const nameCache = {}

// Localized country name, e.g. countryName('NO', 'es') -> "Noruega".
export function countryName(code, lang = 'es') {
  if (!code) return ''
  const cc = code.toUpperCase()
  try {
    if (!nameCache[lang]) {
      nameCache[lang] = new Intl.DisplayNames([lang], { type: 'region' })
    }
    return nameCache[lang].of(cc) || cc
  } catch {
    return cc
  }
}
