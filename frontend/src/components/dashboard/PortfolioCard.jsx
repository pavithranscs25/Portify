import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Copy,
  Eye,
  ExternalLink,
  Globe,
  Pencil,
  PlusSquare,
  Trash2,
} from 'lucide-react'

const publicAppUrl = import.meta.env.VITE_PUBLIC_APP_URL || window.location.origin
const templateColors = {
  modern: 'from-violet-950 via-[#171329] to-fuchsia-950',
  minimal: 'from-stone-800 via-stone-700 to-stone-900',
  developer: 'from-emerald-950 via-slate-900 to-cyan-950',
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString()
}

function PortfolioCard({ portfolio, onDelete, onDuplicate, onPublish }) {
  const [shareMessage, setShareMessage] = useState('')
  const content = portfolio.content || {}
  const isPublished = Boolean(portfolio.isPublished)
  const publicUrl = portfolio.slug
    ? `${publicAppUrl.replace(/\/$/, '')}/${encodeURIComponent(portfolio.slug)}`
    : ''

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl)
      setShareMessage('Link copied')
    } catch {
      setShareMessage('Unable to copy link')
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#121116] transition hover:border-violet-500/40">
      <div className={`relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br ${templateColors[portfolio.template] || templateColors.modern}`}>
        <div className="text-center">
          {content.photo
            ? <img src={content.photo} alt="" className="mx-auto mb-2 h-12 w-12 rounded-full object-cover" />
            : <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg font-bold">{(content.name || portfolio.title || 'P').charAt(0).toUpperCase()}</div>}
          <p className="text-lg font-semibold text-white">{content.name || portfolio.title || 'Untitled portfolio'}</p>
          <p className="mt-1 text-xs text-gray-300">{content.role || 'Add your professional title'}</p>
        </div>
        <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs ${isPublished ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-200'}`}>
          {isPublished ? 'Published' : 'Draft'}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-white">{portfolio.title}</h3>
            <p className="mt-1 text-xs capitalize text-gray-400">{portfolio.template || 'modern'} template</p>
          </div>
          <span className="shrink-0 rounded-full bg-white/5 px-2.5 py-1 text-xs text-gray-400">
            {isPublished ? 'Live' : 'Private'}
          </span>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-xs">
          <div><dt className="text-gray-500">Created</dt><dd className="mt-1 text-gray-300">{formatDate(portfolio.createdAt)}</dd></div>
          <div><dt className="text-gray-500">Updated</dt><dd className="mt-1 text-gray-300">{formatDate(portfolio.updatedAt)}</dd></div>
        </dl>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link to={`/builder/${portfolio.id}`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 py-2.5 text-sm font-medium hover:bg-violet-500">
            <Pencil size={15} /> Edit
          </Link>
          {isPublished ? (
            <Link to={`/${encodeURIComponent(portfolio.slug)}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 py-2.5 text-sm text-gray-200 hover:bg-white/5">
              <ExternalLink size={15} /> View
            </Link>
          ) : (
            <button type="button" onClick={onPublish} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 py-2.5 text-sm text-gray-200 hover:bg-white/5">
              <Globe size={15} /> Publish
            </button>
          )}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {isPublished ? (
            <>
              <button type="button" onClick={copyLink} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-xs text-gray-300 hover:bg-white/5">
                <Copy size={14} /> Share link
              </button>
              <button type="button" onClick={onPublish} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-xs text-gray-300 hover:bg-white/5">
                <Globe size={14} /> Unpublish
              </button>
              <button type="button" onClick={onDuplicate} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-xs text-gray-300 hover:bg-white/5">
                <PlusSquare size={14} /> Duplicate
              </button>
            </>
          ) : (
            <>
              <Link to="/portfolio-preview" state={{ title: portfolio.title, template: portfolio.template, content }} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-xs text-gray-300 hover:bg-white/5">
                <Eye size={14} /> Preview
              </Link>
              <button type="button" onClick={onDuplicate} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-xs text-gray-300 hover:bg-white/5">
                <PlusSquare size={14} /> Duplicate
              </button>
            </>
          )}
          <button type="button" onClick={onDelete} className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/20 py-2 text-xs text-red-300 hover:bg-red-500/10">
            <Trash2 size={14} /> Delete
          </button>
        </div>
        {shareMessage && <p role="status" className="mt-2 text-center text-xs text-gray-400">{shareMessage}</p>}
      </div>
    </article>
  )
}

export default PortfolioCard
