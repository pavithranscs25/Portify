import { httpError } from './httpError.js'

export function requireObject(value, message = 'A JSON object is required.') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw httpError(400, message)
  }
  return value
}

export function readText(value, field, { max = 500, required = false } = {}) {
  if (value === undefined || value === null) value = ''
  if (typeof value !== 'string') throw httpError(400, `${field} must be text.`)
  const text = value.trim()
  if (required && !text) throw httpError(400, `${field} is required.`)
  if (text.length > max) throw httpError(400, `${field} must be ${max} characters or fewer.`)
  return text
}

export function readUrl(value, field) {
  const url = readText(value, field, { max: 2048 })
  if (!url) return ''
  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) {
      throw new Error('Invalid URL')
    }
    return parsed.toString()
  } catch {
    throw httpError(400, `${field} must be a valid HTTP or HTTPS URL.`)
  }
}
