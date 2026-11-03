import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Loader from './components/common/Loader.jsx'
import { useAuth } from './context/useAuth.js'

import Navbar from './components/common/Navbar.jsx'
import Footer from './components/common/Footer.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Register = lazy(() => import('./pages/Register.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const Templates = lazy(() => import('./pages/Templates.jsx'))
const CreatePortfolio = lazy(() => import('./pages/CreatePortfolio.jsx'))
const PublicPortfolio = lazy(() => import('./pages/PublicPortfolio.jsx'))


function App() {
  const { pathname } = useLocation()
  const isPublicPortfolio = pathname === '/portfolio-preview' ||
    (pathname !== '/' && !['/login', '/register', '/dashboard', '/templates', '/create-portfolio'].includes(pathname) && !pathname.startsWith('/builder/'))

  return (
    <div className="min-h-screen">
      {!isPublicPortfolio && <Navbar />}

      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/create-portfolio" element={<RequireAuth><CreatePortfolio /></RequireAuth>} />
          <Route path="/builder/:id" element={<RequireAuth><CreatePortfolio /></RequireAuth>} />
          <Route path="/portfolio-preview" element={<PublicPortfolio />} />
          <Route path="/:slug" element={<PublicPortfolio />} />
          <Route path="*" element={<div className="px-6 py-32 text-center text-gray-400">Page not found!</div>} />
        </Routes>
      </Suspense>

      {!isPublicPortfolio && <Footer />}
    </div>
  )
}

function RequireAuth({ children }) {
  const { user, ready } = useAuth()
  const location = useLocation()
  if (!ready) return <Loader label="Restoring your session…" />
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}

export default App
