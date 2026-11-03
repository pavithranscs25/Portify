import { motion } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'

function TemplateCard({ template, onSelect }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-[#111116]"
    >
      {/* Template Preview */}
      <div className={`relative h-64 overflow-hidden p-5 ${template.previewBg}`}>
        <div className="mx-auto h-full max-w-[230px] overflow-hidden rounded-lg bg-white p-4 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-2 w-16 rounded bg-gray-800" />
            <div className="h-2 w-10 rounded bg-gray-300" />
          </div>

          <div className={`mb-2 h-3 w-24 rounded ${template.accent}`} />
          <div className="mb-2 h-2 w-32 rounded bg-gray-300" />
          <div className="mb-5 h-2 w-24 rounded bg-gray-200" />

          <div className="mb-4 h-20 rounded-md bg-gray-100" />

          <div className="mb-2 h-2 w-16 rounded bg-gray-700" />

          <div className="space-y-2">
            <div className="h-2 w-full rounded bg-gray-200" />
            <div className="h-2 w-4/5 rounded bg-gray-200" />
            <div className="h-2 w-3/5 rounded bg-gray-200" />
          </div>
        </div>

        <span className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
          {template.tag}
        </span>
      </div>

      {/* Template Details */}
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {template.name}
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              {template.description}
            </p>
          </div>

          <span className="rounded-lg bg-white/5 p-2 text-gray-400">
            <ArrowUpRight size={18} />
          </span>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {template.features.map((feature) => (
            <span
              key={feature}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-400"
            >
              {feature}
            </span>
          ))}
        </div>

        <button
          onClick={() => onSelect(template.id)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-medium text-white transition hover:bg-violet-500"
        >
          <Check size={16} />
          Use this template
        </button>
      </div>
    </motion.div>
  )
}

export default TemplateCard