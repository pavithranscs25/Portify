import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import authRoutes from './routes/authRoutes.js'
import portfolioRoutes from './routes/portfolioRoutes.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be set to a random value of at least 32 characters.')
}

const origins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  next()
})
app.use(cors({
  origin(origin, callback) {
    if (!origin || origins.includes(origin)) return callback(null, true)
    return callback(new Error('Request origin is not allowed.'))
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}))
app.use(express.json({ limit: '4mb' }))

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api', portfolioRoutes)
app.use(notFound)
app.use(errorHandler)

const port = Number(process.env.PORT) || 5000
const server = app.listen(port, () => {
  console.log(`Portify API listening on port ${port}`)
})

async function shutdown(signal) {
  console.log(`${signal} received; closing API server.`)
  server.close(async () => {
    const { default: prisma } = await import('./config/db.js')
    await prisma.$disconnect()
    process.exit(0)
  })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

export { server }
export default app