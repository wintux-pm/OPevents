export function formatEventDate(dateStr, lang = 'es') {
  const date = new Date(dateStr)
  return date.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function formatEventTime(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatFullDate(dateStr, lang = 'es') {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
