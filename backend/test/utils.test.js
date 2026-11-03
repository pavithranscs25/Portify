import assert from 'node:assert/strict'
import test from 'node:test'
import { generateSlug } from '../src/utils/generateSlug.js'
import { readText, readUrl } from '../src/utils/validate.js'

test('slug generation normalizes names and keeps generated URLs unique', () => {
  const first = generateSlug('Pavithran S')
  const second = generateSlug('Pavithran S')
  assert.match(first, /^pavithran-s-[a-f0-9]{8}$/)
  assert.notEqual(first, second)
})

test('text validation enforces required and maximum lengths', () => {
  assert.equal(readText('  Portify  ', 'Name', { required: true }), 'Portify')
  assert.throws(() => readText(' ', 'Name', { required: true }), { statusCode: 400 })
  assert.throws(() => readText('long', 'Name', { max: 3 }), { statusCode: 400 })
})

test('URL validation only accepts credential-free HTTP(S) addresses', () => {
  assert.equal(readUrl('https://example.com/profile', 'Website'), 'https://example.com/profile')
  assert.throws(() => readUrl('javascript:alert(1)', 'Website'), { statusCode: 400 })
  assert.throws(() => readUrl('https://user:pass@example.com', 'Website'), { statusCode: 400 })
})
