import jwt from 'jsonwebtoken'

export function requireAuth(req, res, next) {
  const authorization = req.get('authorization') || ''
  const [scheme, token] = authorization.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Authentication is required.' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    if (!payload || typeof payload === 'string' || typeof payload.sub !== 'string') {
      return res.status(401).json({ message: 'Your session is invalid. Please sign in again.' })
    }
    req.user = { id: payload.sub }
    return next()
  } catch {
    return res.status(401).json({ message: 'Your session is invalid or has expired.' })
  }
}