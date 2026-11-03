import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, Sparkles, X } from 'lucide-react'
import { useAuth } from '../../context/useAuth'

function Navbar() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#09090b]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-xl bg-violet-600 p-2">
            <Sparkles size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Porti<span className="text-violet-400">fy</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className="text-sm text-gray-400 hover:text-white">
            Home
          </NavLink>
          {user && <NavLink to="/dashboard" className="text-sm text-gray-400 hover:text-white">Dashboard</NavLink>}
          <a href="/#features" className="text-sm text-gray-400 hover:text-white">
            Features
          </a>
          <NavLink to="/templates" className="text-sm text-gray-400 hover:text-white">
            Templates
          </NavLink>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="max-w-36 truncate text-sm text-gray-400">{user.name}</span>
              <button type="button" onClick={handleLogout} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/5">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-300 hover:text-white">Log in</Link>
              <Link to="/register" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-500">Get started</Link>
            </>
          )}
        </div>
        <button type="button" className="rounded-lg p-2 text-gray-300 hover:bg-white/5 md:hidden" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {menuOpen && (
        <div className="space-y-1 border-t border-white/10 px-6 py-3 md:hidden">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5">Home</Link>
          {user && <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5">Dashboard</Link>}
          <Link to="/templates" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5">Templates</Link>
          {user
            ? <button type="button" onClick={handleLogout} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/5">Log out</button>
            : <div className="flex gap-3 px-3 py-2"><Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm text-gray-300">Log in</Link><Link to="/register" onClick={() => setMenuOpen(false)} className="text-sm text-violet-300">Get started</Link></div>}
        </div>
      )}
    </nav>
  )
}

export default Navbar
