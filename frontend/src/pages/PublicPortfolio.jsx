import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import DownloadPDFButton from '../components/portfolio/DownloadPDFButton'
import DeveloperTemplate from '../templates/DeveloperTemplate'
import MinimalTemplate from '../templates/MinimalTemplate'
import ModernTemplate from '../templates/ModernTemplate'
import { getPublicPortfolio } from '../services/portfolioService'
import { getErrorMessage, normalizePortfolio } from '../utils/validators'

function PublicPortfolio() {
  const { slug } = useParams()
  const location = useLocation()
  const [loadResult, setLoadResult] = useState({ slug: null, portfolio: null, error: '' })

  useEffect(() => {
    if (!slug) return undefined

    let active = true
    getPublicPortfolio(slug)
      .then((result) => {
        if (active) {
          setLoadResult({ slug, portfolio: result, error: '' })
        }
      })
      .catch((loadError) => {
        if (active) setLoadResult({
          slug,
          portfolio: null,
          error: getErrorMessage(loadError, 'This portfolio is unavailable.'),
        })
      })
    return () => { active = false }
  }, [slug])

  const portfolio = slug
    ? (loadResult.slug === slug ? loadResult.portfolio : null)
    : location.state
  const loading = Boolean(slug && loadResult.slug !== slug)
  const error = slug && loadResult.slug === slug ? loadResult.error : ''
  useEffect(() => {
    if (portfolio?.title) document.title = `${portfolio.title} | Portify`
    return () => { document.title = 'Portify' }
  }, [portfolio?.title])

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center text-gray-300">Loading portfolio…</main>
  }

  if (error || !portfolio) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-bold text-white">{error ? 'Portfolio unavailable' : 'Preview not available'}</h1>
        <p className="mt-3 max-w-lg text-gray-400">{error || 'Open preview from the builder after adding portfolio information.'}</p>
        <Link to={slug ? '/' : '/dashboard'} className="mt-6 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-500">
          {slug ? 'Go to Portify' : 'Return to dashboard'}
        </Link>
      </main>
    )
  }

  const form = normalizePortfolio(portfolio)
  const template = portfolio.template || 'modern'
  const Template = {
    minimal: MinimalTemplate,
    developer: DeveloperTemplate,
  }[template] || ModernTemplate

  return (
    <>
      <div className="no-print sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#09090b]/95 px-4 py-3 text-white backdrop-blur md:px-8">
        <Link to={slug ? '/' : '/dashboard'} className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white">
          <ArrowLeft size={17} /> {slug ? 'Portify' : 'Back to dashboard'}
        </Link>
        <span className="hidden text-sm font-medium text-gray-400 sm:inline">{slug ? 'Published portfolio' : 'Portfolio preview'}</span>
        <DownloadPDFButton />
      </div>
      <div className="portfolio-document">
        <Template form={form} />
      </div>
    </>
  )
}

export default PublicPortfolio
