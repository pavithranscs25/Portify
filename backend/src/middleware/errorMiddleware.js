export function notFound(req, res) {
  res.status(404).json({ message: 'The requested endpoint was not found.' })
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error)

  if (error?.code === 'P2002') {
    return res.status(409).json({ message: 'A record with these details already exists.' })
  }
  if (error?.code === 'P2025') {
    return res.status(404).json({ message: 'The requested record was not found.' })
  }

  const status = Number.isInteger(error?.statusCode)
    ? error.statusCode
    : Number.isInteger(error?.status) && error.status < 500
      ? error.status
      : 500
  if (status >= 500) console.error(error)
  return res.status(status).json({
    message: status >= 500 ? 'An unexpected server error occurred.' : error.message,
  })
}