import api from './api'

export async function getPortfolios() {
  const { data } = await api.get('/portfolios')
  return data.portfolios
}

export async function getPortfolio(id) {
  const { data } = await api.get(`/portfolios/${encodeURIComponent(id)}`)
  return data.portfolio
}

export async function createPortfolio(portfolio) {
  const { data } = await api.post('/portfolios', portfolio)
  return data.portfolio
}

export async function updatePortfolio(id, portfolio) {
  const { data } = await api.put(`/portfolios/${encodeURIComponent(id)}`, portfolio)
  return data.portfolio
}

export async function deletePortfolio(id) {
  await api.delete(`/portfolios/${encodeURIComponent(id)}`)
}

export async function duplicatePortfolio(id) {
  const { data } = await api.post(`/portfolios/${encodeURIComponent(id)}/duplicate`)
  return data.portfolio
}

export async function publishPortfolio(id) {
  const { data } = await api.post(`/portfolios/${encodeURIComponent(id)}/publish`)
  return data.portfolio
}

export async function unpublishPortfolio(id) {
  const { data } = await api.post(`/portfolios/${encodeURIComponent(id)}/unpublish`)
  return data.portfolio
}

export async function getPublicPortfolio(slug) {
  const { data } = await api.get(`/public/${encodeURIComponent(slug)}`)
  return data.portfolio
}