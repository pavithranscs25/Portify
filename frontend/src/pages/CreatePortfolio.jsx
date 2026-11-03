import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  Briefcase,
  Code,
  Eye,
  FolderGit2,
  GraduationCap,
  ImagePlus,
  Plus,
  Save,
  Share2,
  Trash2,
  User,
} from 'lucide-react'
import PortfolioPreview from '../components/portfolio/PortfolioPreview'
import PortfolioForm from '../components/portfolio/PortfolioForm'
import {
  createPortfolio,
  getPortfolio,
  updatePortfolio,
} from '../services/portfolioService'
import {
  getErrorMessage,
  getPortfolioPayload,
  normalizePortfolio,
} from '../utils/validators'

const emptyForm = () => ({
  name: '',
  role: '',
  email: '',
  location: '',
  about: '',
  photo: '',
  github: '',
  linkedin: '',
  website: '',
  education: [],
  skills: [],
  projects: [],
  experience: [],
})

const templates = ['modern', 'minimal', 'developer']
const newEntry = (fields) => ({ id: crypto.randomUUID(), ...fields })

function CreatePortfolio() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [title, setTitle] = useState('My Portfolio')
  const [template, setTemplate] = useState(searchParams.get('template') || 'modern')
  const [form, setForm] = useState(emptyForm)
  const [loadedId, setLoadedId] = useState(null)
  const ready = !id || loadedId === id
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [error, setError] = useState('')
  const revision = useRef(0)
  const inFlight = useRef(false)
  const saveRef = useRef(null)

  useEffect(() => {
    let active = true
    if (!id) return () => { active = false }
    getPortfolio(id)
      .then((portfolio) => {
        if (!active) return
        setTitle(portfolio.title || 'My Portfolio')
        setTemplate(portfolio.template || 'modern')
        setForm(normalizePortfolio(portfolio))
        setDirty(false)
        setError('')
        setLoadedId(id)
      })
      .catch((loadError) => {
        if (!active) return
        setError(getErrorMessage(loadError, 'Unable to load this portfolio.'))
        setLoadedId(id)
      })

    return () => { active = false }
  }, [id])

  const markChanged = useCallback(() => {
    revision.current += 1
    setDirty(true)
    setSaveMessage('')
  }, [])

  const updateForm = (field, value) => {
    markChanged()
    setForm((current) => ({ ...current, [field]: value }))
  }

  const updateEntry = (field, entryId, key, value) => {
    markChanged()
    setForm((current) => ({
      ...current,
      [field]: current[field].map((entry) =>
        entry.id === entryId ? { ...entry, [key]: value } : entry
      ),
    }))
  }

  const addEntry = (field, values) => {
    markChanged()
    setForm((current) => ({
      ...current,
      [field]: [...current[field], newEntry(values)],
    }))
  }

  const removeEntry = (field, entryId) => {
    markChanged()
    setForm((current) => ({
      ...current,
      [field]: current[field].filter((entry) => entry.id !== entryId),
    }))
  }

  const save = useCallback(async () => {
    if (!title.trim()) {
      setError('Give this portfolio a name before saving.')
      return
    }
    if (inFlight.current) return

    const savedRevision = revision.current
    inFlight.current = true
    setSaving(true)
    setError('')
    setSaveMessage('Saving…')

    try {
      const payload = getPortfolioPayload(title, template, form)
      const portfolio = id
        ? await updatePortfolio(id, payload)
        : await createPortfolio(payload)
      if (!id && portfolio.id) {
        navigate(`/builder/${portfolio.id}`, { replace: true })
      }
      if (savedRevision === revision.current) {
        setDirty(false)
        setSaveMessage('Saved')
      } else {
        setSaveMessage('Changes pending')
      }
    } catch (saveError) {
      setError(getErrorMessage(saveError, 'Unable to save this portfolio.'))
      setSaveMessage('Save failed')
    } finally {
      inFlight.current = false
      setSaving(false)
      if (savedRevision !== revision.current) {
        window.setTimeout(() => saveRef.current?.(), 0)
      }
    }
  }, [form, id, navigate, template, title])

  useEffect(() => { saveRef.current = save }, [save])

  useEffect(() => {
    if (!ready || !dirty || inFlight.current) return undefined
    const timeout = window.setTimeout(save, 900)
    return () => window.clearTimeout(timeout)
  }, [dirty, form, ready, save, template, title])

  useEffect(() => {
    const warnBeforeLeave = (event) => {
      if (!dirty) return
      event.preventDefault()
      event.returnValue = ''
    }
    const confirmInternalNavigation = (event) => {
      if (!dirty || !(event.target instanceof Element)) return
      const link = event.target.closest('a[href]')
      if (!link || link.target === '_blank') return
      const destination = new URL(link.href, window.location.href)
      if (destination.origin !== window.location.origin ||
          (destination.pathname === window.location.pathname && destination.search === window.location.search)) return
      if (!window.confirm('Your latest changes are still syncing. Leave the builder?')) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
    window.addEventListener('beforeunload', warnBeforeLeave)
    document.addEventListener('click', confirmInternalNavigation, true)
    return () => {
      window.removeEventListener('beforeunload', warnBeforeLeave)
      document.removeEventListener('click', confirmInternalNavigation, true)
    }
  }, [dirty])

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Choose a JPG, PNG, or WebP image.')
      event.target.value = ''
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Profile photos must be 2 MB or smaller.')
      event.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => updateForm('photo', reader.result)
    reader.onerror = () => setError('Unable to read the selected image.')
    reader.readAsDataURL(file)
  }

  if (!ready) {
    return <main className="px-6 py-24 text-center text-gray-300">Loading portfolio…</main>
  }

  return (
    <main className="min-h-screen px-5 py-10 md:py-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-violet-400">Portfolio builder</p>
            <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
              {id ? 'Edit your portfolio' : 'Build your portfolio'}
            </h1>
            <p className="mt-2 text-gray-400">Your changes are saved to your account automatically.</p>
          </div>
          <div className="flex items-center gap-3">
            <span aria-live="polite" className="min-w-20 text-right text-sm text-gray-400">
              {saving ? 'Saving…' : dirty ? 'Unsaved changes' : saveMessage}
            </span>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
            >
              <Save size={17} /> Save
            </button>
          </div>
        </header>

        {error && (
          <div role="alert" className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
            <button type="button" onClick={() => setError('')} aria-label="Dismiss error" className="text-lg">×</button>
          </div>
        )}

        <div className="grid items-start gap-8 lg:grid-cols-2">
          <PortfolioForm className="space-y-5" onSubmit={save}>
            <div className="rounded-2xl border border-white/10 bg-[#111116] p-6">
              <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
                <User size={19} className="text-violet-400" /> Portfolio details
              </h2>
              <label className="mb-2 block text-sm text-gray-300" htmlFor="portfolio-title">Portfolio name</label>
              <input
                id="portfolio-title"
                value={title}
                maxLength={100}
                onChange={(event) => { setTitle(event.target.value); markChanged() }}
                className="builder-input"
                required
              />
              <label className="mb-2 mt-4 block text-sm text-gray-300" htmlFor="portfolio-template">Template</label>
              <select
                id="portfolio-template"
                value={template}
                onChange={(event) => { setTemplate(event.target.value); markChanged() }}
                className="builder-input"
              >
                {templates.map((item) => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}
              </select>
            </div>

            <Section title="Personal information" icon={User}>
              <PhotoUpload photo={form.photo} onChange={handlePhotoUpload} />
              <Field label="Full name" name="name" value={form.name} onChange={updateForm} required />
              <Field label="Professional title" name="role" value={form.role} onChange={updateForm} />
              <Field label="Email" name="email" type="email" value={form.email} onChange={updateForm} />
              <Field label="Location" name="location" value={form.location} onChange={updateForm} />
              <TextField label="About" name="about" value={form.about} onChange={updateForm} />
            </Section>

            <Section title="Social links" icon={Share2}>
              <Field label="GitHub" name="github" type="url" value={form.github} onChange={updateForm} />
              <Field label="LinkedIn" name="linkedin" type="url" value={form.linkedin} onChange={updateForm} />
              <Field label="Website" name="website" type="url" value={form.website} onChange={updateForm} />
            </Section>

            <EntrySection
              title="Education"
              icon={GraduationCap}
              entries={form.education}
              onAdd={() => addEntry('education', { degree: '', college: '', year: '' })}
              onRemove={(entryId) => removeEntry('education', entryId)}
              renderEntry={(entry) => (
                <>
                  <Field label="Degree / course" value={entry.degree || ''} onChange={(value) => updateEntry('education', entry.id, 'degree', value)} />
                  <Field label="School / university" value={entry.college || entry.institution || ''} onChange={(value) => updateEntry('education', entry.id, 'college', value)} />
                  <Field label="Year" value={entry.year || ''} onChange={(value) => updateEntry('education', entry.id, 'year', value)} />
                </>
              )}
            />

            <Section title="Skills" icon={Code}>
              <div className="space-y-3">
                {form.skills.map((skill, index) => (
                  <div className="flex gap-2" key={`skill-${index}`}>
                    <input
                      aria-label={`Skill ${index + 1}`}
                      value={typeof skill === 'string' ? skill : skill.name || ''}
                      onChange={(event) => {
                        const skills = [...form.skills]
                        skills[index] = event.target.value
                        updateForm('skills', skills)
                      }}
                      className="builder-input"
                      placeholder="e.g. JavaScript"
                    />
                    <RemoveButton label="Remove skill" onClick={() => updateForm('skills', form.skills.filter((_, itemIndex) => itemIndex !== index))} />
                  </div>
                ))}
                <AddButton label="Add skill" onClick={() => updateForm('skills', [...form.skills, ''])} />
              </div>
            </Section>

            <EntrySection
              title="Projects"
              icon={FolderGit2}
              entries={form.projects}
              onAdd={() => addEntry('projects', { name: '', description: '', technologies: '', link: '' })}
              onRemove={(entryId) => removeEntry('projects', entryId)}
              renderEntry={(entry) => (
                <>
                  <Field label="Project name" value={entry.name || ''} onChange={(value) => updateEntry('projects', entry.id, 'name', value)} />
                  <TextField label="Description" value={entry.description || ''} onChange={(value) => updateEntry('projects', entry.id, 'description', value)} />
                  <Field label="Technologies (comma separated)" value={Array.isArray(entry.technologies) ? entry.technologies.join(', ') : entry.technologies || ''} onChange={(value) => updateEntry('projects', entry.id, 'technologies', value)} />
                  <Field label="Project URL" type="url" value={entry.link || ''} onChange={(value) => updateEntry('projects', entry.id, 'link', value)} />
                </>
              )}
            />

            <EntrySection
              title="Experience"
              icon={Briefcase}
              entries={form.experience}
              onAdd={() => addEntry('experience', { role: '', company: '', period: '', description: '' })}
              onRemove={(entryId) => removeEntry('experience', entryId)}
              renderEntry={(entry) => (
                <>
                  <Field label="Role" value={entry.role || entry.title || ''} onChange={(value) => updateEntry('experience', entry.id, 'role', value)} />
                  <Field label="Company" value={entry.company || ''} onChange={(value) => updateEntry('experience', entry.id, 'company', value)} />
                  <Field label="Dates" value={entry.period || ''} onChange={(value) => updateEntry('experience', entry.id, 'period', value)} />
                  <TextField label="Description" value={entry.description || ''} onChange={(value) => updateEntry('experience', entry.id, 'description', value)} />
                </>
              )}
            />

            <button
              type="button"
              onClick={() => {
                if (dirty && !window.confirm('Your latest changes are still syncing. Leave the builder?')) return
                navigate('/portfolio-preview', { state: { title, template, content: form } })
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-5 py-3 font-semibold text-violet-200 hover:bg-violet-500/20"
            >
              <Eye size={18} /> Preview portfolio
            </button>
          </PortfolioForm>

          <aside className="lg:sticky lg:top-24">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold text-white"><Eye size={18} className="text-violet-400" /> Live preview</h2>
              <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs capitalize text-violet-300">{template}</span>
            </div>
            <PortfolioPreview form={form} template={template} />
          </aside>
        </div>
      </div>
    </main>
  )
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="space-y-4 rounded-2xl border border-white/10 bg-[#111116] p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-white"><Icon size={19} className="text-violet-400" />{title}</h2>
      {children}
    </section>
  )
}

function Field({ label, name, value, onChange, type = 'text', required = false }) {
  const id = name ? `field-${name}` : undefined
  return (
    <label className="block space-y-2 text-sm text-gray-300">
      {label}
      <input id={id} type={type} value={value} required={required} onChange={(event) => onChange(event.target.value)} className="builder-input" />
    </label>
  )
}

function TextField({ label, name, value, onChange }) {
  return (
    <label className="block space-y-2 text-sm text-gray-300">
      {label}
      <textarea id={name ? `field-${name}` : undefined} value={value} rows={4} onChange={(event) => onChange(event.target.value)} className="builder-input resize-y" />
    </label>
  )
}

function PhotoUpload({ photo, onChange }) {
  return (
    <div className="flex items-center gap-4">
      {photo
        ? <img src={photo} alt="Portfolio profile" className="h-16 w-16 rounded-full object-cover" />
        : <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10 text-violet-400"><ImagePlus size={24} /></div>}
      <label className="space-y-2 text-sm text-gray-300">
        Profile photo
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onChange} className="block max-w-full text-xs text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600 file:px-3 file:py-2 file:text-white" />
        <span className="block text-xs text-gray-500">JPG, PNG or WebP · up to 2 MB</span>
      </label>
    </div>
  )
}

function EntrySection({ title, icon, entries, onAdd, onRemove, renderEntry }) {
  return (
    <Section title={title} icon={icon}>
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <div key={entry.id || `${title}-${index}`} className="space-y-3 rounded-xl border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-300">{title} {index + 1}</h3>
              <RemoveButton label={`Remove ${title.toLowerCase()} ${index + 1}`} onClick={() => onRemove(entry.id)} />
            </div>
            {renderEntry(entry)}
          </div>
        ))}
        <AddButton label={`Add ${title.toLowerCase()}`} onClick={onAdd} />
      </div>
    </Section>
  )
}

function AddButton({ label, onClick }) {
  return <button type="button" onClick={onClick} className="inline-flex items-center gap-2 text-sm font-medium text-violet-300 hover:text-violet-200"><Plus size={16} />{label}</button>
}

function RemoveButton({ label, onClick }) {
  return <button type="button" onClick={onClick} aria-label={label} className="rounded-md p-1 text-gray-500 hover:bg-red-500/10 hover:text-red-300"><Trash2 size={16} /></button>
}

export default CreatePortfolio
