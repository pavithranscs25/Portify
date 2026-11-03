import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { getErrorMessage } from '../utils/validators'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      await login(formData)
      const returnTo = location.state?.from
      navigate(returnTo ? `${returnTo.pathname}${returnTo.search || ''}` : '/dashboard', { replace: true })
    } catch (loginError) {
      setError(getErrorMessage(loginError, 'Unable to sign in.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-5 py-16">

      <div className="absolute left-1/2 top-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/15 blur-[120px]" />

      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600">
            <Sparkles size={27} />
          </div>

          <h1 className="text-3xl font-bold">Welcome back</h1>

          <p className="mt-3 text-sm text-gray-400">
            Sign in to continue building your portfolio.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121116] p-7 shadow-2xl">

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Email address
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#09090b] px-4 focus-within:border-violet-500">
                <Mail size={18} className="text-gray-500" />

                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Password
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#09090b] px-4 focus-within:border-violet-500">
                <Lock size={18} className="text-gray-500" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-gray-600"
                />

                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <span className="text-xs text-gray-500">Secure account access</span>
            </div>

            {error && (
              <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 font-semibold transition hover:bg-violet-500 disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'} {!loading && <ArrowRight size={18} />}
            </button>

          </form>

        </div>

        <p className="mt-7 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-violet-400 hover:text-violet-300">
            Create account
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login
