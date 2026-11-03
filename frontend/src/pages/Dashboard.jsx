import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BriefcaseBusiness,
  FileEdit,
  Globe,
  Plus,
  Search,
  Sparkles,
} from 'lucide-react'
import PortfolioCard from '../components/dashboard/PortfolioCard'
import Loader from '../components/common/Loader'
import { useAuth } from '../context/useAuth'
import {
  deletePortfolio,
  duplicatePortfolio,
  getPortfolios,
  publishPortfolio,
  unpublishPortfolio,
} from '../services/portfolioService'
import { getErrorMessage } from '../utils/validators'

function Dashboard() {
  const { user } = useAuth()
  const [portfolios, setPortfolios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const refresh = async () => {
    setError('')
    try {
      const items = await getPortfolios()
      setPortfolios(items)
      return items
    } catch (loadError) {
      const message = getErrorMessage(loadError, 'Could not load your portfolios.')
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    getPortfolios()
      .then((items) => { if (active) setPortfolios(items) })
      .catch((loadError) => { if (active) setError(getErrorMessage(loadError, 'Could not load your portfolios.')) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const visiblePortfolios = useMemo(() => {
    const search = query.trim().toLowerCase()
    return portfolios.filter((portfolio) => {
      const isPublished = Boolean(portfolio.isPublished)
      const matchesFilter = filter === 'all' ||
        (filter === 'published' && isPublished) ||
        (filter === 'drafts' && !isPublished)
      const content = portfolio.content || {}
      const matchesSearch = !search ||
        [portfolio.title, content.name, content.role].some((value) =>
          value?.toLowerCase().includes(search)
        )
      return matchesFilter && matchesSearch
    })
  }, [filter, portfolios, query])

  const runAction = async (action, successMessage) => {
    setError('')
    setNotice('')
    try {
      await action()
      await refresh()
      setNotice(successMessage)
    } catch (actionError) {
      setError(getErrorMessage(actionError))
    }
  }

  const handleDelete = async (portfolio) => {
    if (!window.confirm(`Delete "${portfolio.title}"? This cannot be undone.`)) return
    await runAction(() => deletePortfolio(portfolio.id), 'Portfolio deleted.')
  }

  const handleDuplicate = async (portfolio) => {
    await runAction(() => duplicatePortfolio(portfolio.id), 'Portfolio duplicated.')
  }

  const handlePublish = async (portfolio) => {
    const action = portfolio.isPublished
      ? () => unpublishPortfolio(portfolio.id)
      : () => publishPortfolio(portfolio.id)
    await runAction(action, portfolio.isPublished ? 'Portfolio unpublished.' : 'Portfolio published.')
  }

  const counts = {
    total: portfolios.length,
    published: portfolios.filter((portfolio) => portfolio.isPublished).length,
    drafts: portfolios.filter((portfolio) => !portfolio.isPublished).length,
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-10 md:px-6">
      <header className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm text-violet-400"><Sparkles size={16} /> YOUR WORKSPACE</div>
          <h1 className="text-3xl font-bold md:text-4xl">Welcome back, {user?.name?.trim().split(/\s+/)[0] || 'there'}!</h1>
          <p className="mt-3 text-gray-400">Manage and share your portfolio websites.</p>
        </div>
        <Link to="/templates" className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold hover:bg-violet-500">
          <Plus size={19} /> Create portfolio
        </Link>
      </header>

      {error && <p role="alert" className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</p>}
      {notice && <p role="status" className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">{notice}</p>}

      <section aria-label="Portfolio totals" className="mb-9 grid gap-4 sm:grid-cols-3">
        <Stat label="Total portfolios" count={counts.total} icon={BriefcaseBusiness} color="text-violet-400" />
        <Stat label="Published" count={counts.published} icon={Globe} color="text-emerald-400" />
        <Stat label="Drafts" count={counts.drafts} icon={FileEdit} color="text-amber-300" />
      </section>

      <section>
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold">My portfolios</h2>
            <p className="mt-1 text-sm text-gray-400">{portfolios.length} portfolio{portfolios.length === 1 ? '' : 's'} in your workspace</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#111116] px-3">
              <Search size={16} className="text-gray-500" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search portfolios" className="w-full bg-transparent py-2.5 text-sm outline-none sm:w-48" />
            </label>
            <select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter portfolios" className="rounded-lg border border-white/10 bg-[#111116] px-3 py-2.5 text-sm text-gray-200">
              <option value="all">All portfolios</option>
              <option value="published">Published</option>
              <option value="drafts">Drafts</option>
            </select>
          </div>
        </div>

        {loading ? <Loader /> : portfolios.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#111116] px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400"><BriefcaseBusiness size={28} /></div>
            <h3 className="text-xl font-semibold">Your workspace is ready</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400">Create your first portfolio and tailor it to your work.</p>
            <Link to="/templates" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"><Plus size={18} /> Create your first portfolio</Link>
          </div>
        ) : visiblePortfolios.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#111116] px-6 py-12 text-center text-gray-400">No portfolios match this search or filter.</div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visiblePortfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
                onDelete={() => handleDelete(portfolio)}
                onDuplicate={() => handleDuplicate(portfolio)}
                onPublish={() => handlePublish(portfolio)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function Stat({ label, count, icon: Icon, color }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#121116] p-5">
      <div><p className="text-sm text-gray-400">{label}</p><p className="mt-2 text-3xl font-bold">{count}</p></div>
      <Icon className={color} size={24} />
    </div>
  )
}

export default Dashboard
