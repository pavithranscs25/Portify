import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { getErrorMessage } from '../utils/validators'

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    const { name, email, password, confirmPassword } = formData

    if (!name.trim() || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await register({ name: name.trim(), email: email.trim(), password })
      navigate('/dashboard', { replace: true })
    } catch (registerError) {
      setError(getErrorMessage(registerError, 'Unable to create your account.'))
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

          <h1 className="text-3xl font-bold">Create your account</h1>

          <p className="mt-3 text-sm text-gray-400">
            Start building your professional identity today.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121116] p-7 shadow-2xl">

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Full name
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#09090b] px-4 focus-within:border-violet-500">
                <User size={18} className="text-gray-500" />

                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-gray-600"
                />
              </div>
            </div>

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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
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

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Confirm password
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#09090b] px-4 focus-within:border-violet-500">
                <Lock size={18} className="text-gray-500" />

                <input
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-gray-600"
                />
              </div>
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
              {loading ? 'Creating account…' : 'Create account'} {!loading && <ArrowRight size={18} />}
            </button>

          </form>

        </div>

        <p className="mt-7 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-violet-400 hover:text-violet-300">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Register
