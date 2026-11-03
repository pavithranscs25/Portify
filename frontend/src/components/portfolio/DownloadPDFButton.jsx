import { Download } from 'lucide-react'

function DownloadPDFButton() {
  const handleDownload = () => {
    window.print()
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      aria-label="Print or save portfolio as a PDF"
      className="no-print inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-500"
    >
      <Download size={18} />
      Save as PDF
    </button>
  )
}

export default DownloadPDFButton