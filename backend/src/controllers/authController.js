import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/db.js'
import { httpError } from '../utils/httpError.js'
import { requireObject, readText } from '../utils/validate.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }
}

function createToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, { subject: userId, expiresIn: '7d' })
}

function readPassword(value) {
  if (typeof value !== 'string' || value.length < 8 || value.length > 128 ||
      Buffer.byteLength(value, 'utf8') > 72) {
    throw httpError(400, 'Password must be at least 8 characters and no more than 72 bytes.')
  }
  return value
}

export async function register(req, res) {
  const body = requireObject(req.body)
  const name = readText(body.name, 'Name', { max: 100, required: true })
  const email = readText(body.email, 'Email', { max: 254, required: true }).toLowerCase()
  const password = readPassword(body.password)

  if (!emailPattern.test(email)) throw httpError(400, 'Enter a valid email address.')

  const passwordHash = await bcrypt.hash(password, 12)
  try {
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    })
    return res.status(201).json({ user: publicUser(user), token: createToken(user.id) })
  } catch (error) {
    if (error?.code === 'P2002') throw httpError(409, 'An account with this email already exists.')
    throw error
  }
}

export async function login(req, res) {
  const body = requireObject(req.body)
  const email = readText(body.email, 'Email', { max: 254, required: true }).toLowerCase()
  const password = readPassword(body.password)
  if (!emailPattern.test(email)) throw httpError(400, 'Enter a valid email address.')

  const user = await prisma.user.findUnique({ where: { email } })
  const passwordMatches = user && await bcrypt.compare(password, user.passwordHash)
  if (!passwordMatches) throw httpError(401, 'Email or password is incorrect.')
  return res.json({ user: publicUser(user), token: createToken(user.id) })
}

export async function currentUser(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, createdAt: true },
  })
  if (!user) throw httpError(401, 'Your account is no longer available.')
  return res.json({ user })
}
