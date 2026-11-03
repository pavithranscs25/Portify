import { useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import TemplateCard from '../components/portfolio/TemplateCard'

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    tag: 'Popular',
    description: 'A stylish portfolio for modern professionals.',
    previewBg: 'bg-gradient-to-br from-violet-500/30 to-blue-500/20',
    accent: 'bg-violet-500',
    features: ['Responsive', 'Projects', 'Experience'],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    tag: 'Clean',
    description: 'A simple layout that puts your work first.',
    previewBg: 'bg-gradient-to-br from-gray-500/30 to-gray-300/10',
    accent: 'bg-gray-800',
    features: ['Minimal', 'Typography', 'Clean UI'],
  },
  {
    id: 'developer',
    name: 'Developer',
    tag: 'For Developers',
    description: 'Showcase your technical skills and projects.',
    previewBg: 'bg-gradient-to-br from-emerald-500/30 to-cyan-500/20',
    accent: 'bg-emerald-500',
    features: ['Tech Stack', 'GitHub', 'Projects'],
  },
]

function Templates() {
  const navigate = useNavigate()

  const handleSelect = (templateId) => {
    navigate(`/create-portfolio?template=${templateId}`)
  }

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-7xl">

        <div className="mb-12 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            <Sparkles size={16} />
            Portfolio Templates
          </div>

          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Choose your <span className="text-violet-400">style.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Select a design that represents you. You can customize your
            portfolio later.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={handleSelect}
            />
          ))}
        </div>

      </div>
    </main>
  )
}

export default Templates