import { useEffect, useMemo, useState } from 'react'
import * as authService from '../services/authService'
import AuthContext from './authContextValue.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    authService.getCurrentUser()
      .then((currentUser) => {
        if (active) setUser(currentUser)
      })
      .catch((loadError) => {
        if (active) setError(loadError.response?.data?.message || 'Unable to restore your session.')
      })
      .finally(() => {
        if (active) setReady(true)
      })
    return () => { active = false }
  }, [])

  const value = useMemo(() => ({
    user,
    ready,
    error,
    async login(credentials) {
      const currentUser = await authService.login(credentials)
      setError('')
      setUser(currentUser)
      return currentUser
    },
    async register(details) {
      const currentUser = await authService.register(details)
      setError('')
      setUser(currentUser)
      return currentUser
    },
    logout() {
      authService.logout()
      setUser(null)
    },
  }), [error, ready, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}