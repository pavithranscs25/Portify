function Loader({ label = 'Loading portfolios…' }) {
  return (
    <div role="status" className="flex min-h-48 items-center justify-center gap-3 text-sm text-gray-400">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" aria-hidden="true" />
      {label}
    </div>
  )
}

export default Loader