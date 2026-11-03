import api from './api'

const TOKEN_KEY = 'portifyToken'

export async function register({ name, email, password }) {
  const { data } = await api.post('/auth/register', { name, email, password })
  localStorage.setItem(TOKEN_KEY, data.token)
  return data.user
}

export async function login({ email, password }) {
  const { data } = await api.post('/auth/login', { email, password })
  localStorage.setItem(TOKEN_KEY, data.token)
  return data.user
}

export async function getCurrentUser() {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return null

  try {
    const { data } = await api.get('/auth/me')
    return data.user
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      return null
    }
    throw error
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
}