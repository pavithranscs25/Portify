import { randomBytes } from 'node:crypto'

export function generateSlug(value) {
  const base = (value || 'portfolio')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100) || 'portfolio'

  return `${base}-${randomBytes(4).toString('hex')}`
}