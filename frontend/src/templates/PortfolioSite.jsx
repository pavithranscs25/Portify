import { useState } from 'react'
import {
  ArrowUpRight,
  Code2,
  ExternalLink,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  X,
} from 'lucide-react'

const designs = {
  modern: {
    page: 'bg-[#f8f7ff] text-slate-900',
    muted: 'text-slate-600',
    accent: 'text-violet-700',
    button: 'bg-violet-700 text-white hover:bg-violet-600',
    card: 'border border-violet-100 bg-white shadow-sm',
    hero: 'bg-gradient-to-br from-violet-100 via-white to-fuchsia-100',
    section: 'bg-white',
  },
  minimal: {
    page: 'bg-[#faf9f6] text-[#292724]',
    muted: 'text-stone-600',
    accent: 'text-stone-700',
    button: 'bg-stone-900 text-white hover:bg-stone-700',
    card: 'border border-stone-200 bg-white',
    hero: 'bg-[#faf9f6]',
    section: 'bg-[#faf9f6]',
  },
  developer: {
    page: 'bg-[#0a1020] text-slate-100',
    muted: 'text-slate-400',
    accent: 'text-emerald-300',
    button: 'bg-emerald-300 text-slate-950 hover:bg-emerald-200',
    card: 'border border-emerald-300/15 bg-[#111b2c]',
    hero: 'bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15),transparent_50%),#0a1020]',
    section: 'bg-[#0d1627]',
  },
}
const currentYear = new Date().getFullYear()

function validWebLink(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value)
}

function listOfSkills(skills) {
  if (Array.isArray(skills)) return skills.map((skill) => typeof skill === 'string' ? skill : skill.name).filter(Boolean)
  return (skills || '').split(',').map((skill) => skill.trim()).filter(Boolean)
}

function PortfolioSite({ form = {}, template = 'modern' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const style = designs[template] || designs.modern
  const skills = listOfSkills(form.skills)
  const education = form.education || []
  const projects = form.projects || []
  const experience = Array.isArray(form.experience)
    ? form.experience
    : form.experience
      ? [{ description: form.experience }]
      : []
  const socials = [
    { name: 'GitHub', href: form.github, icon: Code2 },
    { name: 'LinkedIn', href: form.linkedin },
    { name: 'Website', href: form.website },
  ].filter((item) => validWebLink(item.href))

  const links = [
    ['About', '#about'],
    ['Education', '#education'],
    ['Skills', '#skills'],
    ['Projects', '#projects'],
    ['Experience', '#experience'],
    ['Contact', '#contact'],
  ]

  return (
    <div className={`min-h-screen ${style.page} ${template === 'developer' ? 'font-mono' : ''}`}>
      <header className={`sticky top-0 z-30 border-b border-current/10 backdrop-blur-xl ${template === 'developer' ? 'bg-[#0a1020]/90' : 'bg-white/85'}`}>
        <nav aria-label="Portfolio navigation" className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#home" className={`font-semibold ${template === 'developer' ? 'font-mono' : ''}`}>
            {template === 'developer' ? '~/ ' : ''}{form.name || 'Portfolio'}
            <span className={style.accent}>.</span>
          </a>
          <div className="hidden items-center gap-6 text-sm md:flex">
            {links.map(([label, href]) => <a key={href} href={href} className={`${style.muted} hover:opacity-70`}>{label}</a>)}
          </div>
          <a href="#contact" className={`hidden rounded-lg px-4 py-2 text-sm font-semibold md:inline-flex ${style.button}`}>Contact me</a>
          <button type="button" className="rounded-lg p-2 md:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
        {menuOpen && <div className="space-y-1 border-t border-current/10 px-5 py-3 md:hidden">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className={`block rounded-md px-3 py-2 text-sm ${style.muted}`}>{label}</a>)}</div>}
      </header>

      <main>
        <section id="home" className={`scroll-mt-20 ${style.hero} ${template === 'modern' ? 'portfolio-modern-hero' : ''}`}>
          <div className="mx-auto grid min-h-[560px] max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-[1fr_auto] md:px-8">
            <div>
              <p className={`mb-5 text-sm font-semibold uppercase tracking-[0.18em] ${style.accent}`}>
                {template === 'developer' ? '// available for opportunities' : 'Hello, I am'}
              </p>
              <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
                {form.name || 'Your Name'}
              </h1>
              <p className={`mt-4 text-xl md:text-2xl ${style.muted}`}>{form.role || 'Professional title'}</p>
              {form.about && <p className={`mt-6 max-w-2xl whitespace-pre-line leading-8 ${style.muted}`}>{form.about}</p>}
              {form.location && <p className={`mt-5 flex items-center gap-2 text-sm ${style.muted}`}><MapPin size={16} />{form.location}</p>}
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#projects" className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold ${style.button}`}>Explore my work <ArrowUpRight size={17} /></a>
                {form.email && <a href={`mailto:${form.email}`} className="inline-flex items-center gap-2 rounded-xl border border-current/20 px-5 py-3 font-semibold"><Mail size={17} /> Get in touch</a>}
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                {socials.map(({ name, href, icon: Icon }) => <a key={name} href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 rounded-lg border border-current/10 px-3 py-2 text-sm ${style.muted}`}><span>{name}</span>{Icon ? <Icon size={15} /> : <ExternalLink size={14} />}</a>)}
              </div>
            </div>
            {form.photo ? (
              <img src={form.photo} alt={form.name ? `${form.name} profile` : 'Profile'} className={`mx-auto h-56 w-56 rounded-[2rem] border-4 object-cover shadow-xl md:h-72 md:w-72 ${template === 'developer' ? 'border-emerald-300/30' : 'border-white'}`} />
            ) : (
              <div aria-hidden="true" className={`mx-auto flex h-56 w-56 items-center justify-center rounded-[2rem] border border-current/10 text-7xl font-bold md:h-72 md:w-72 ${style.card} ${style.accent}`}>{(form.name || 'P').charAt(0).toUpperCase()}</div>
            )}
          </div>
        </section>

        <div className="mx-auto max-w-6xl space-y-5 px-5 py-12 md:px-8 md:py-16">
          <section id="about" className={`scroll-mt-24 rounded-2xl p-7 md:p-9 ${style.section} ${style.card}`}>
            <SectionHeading title="About" subtitle={template === 'developer' ? '<about />' : 'A little about me'} style={style} />
            <p className={`mt-5 max-w-3xl whitespace-pre-line leading-8 ${style.muted}`}>{form.about || 'Add an introduction in your portfolio editor.'}</p>
          </section>

          <section id="education" className={`scroll-mt-24 rounded-2xl p-7 md:p-9 ${style.section} ${style.card}`}>
            <SectionHeading title="Education" subtitle="Learning and growth" style={style} />
            {education.length ? <div className="mt-6 grid gap-4 md:grid-cols-2">{education.map((item, index) => <article key={item.id || `education-${index}`} className={`rounded-xl p-5 ${style.card}`}><GraduationCap className={style.accent} size={22} /><h3 className="mt-3 font-semibold">{item.degree || 'Degree / course'}</h3><p className={`mt-1 text-sm ${style.muted}`}>{item.college || item.institution || ''}</p>{item.year && <p className={`mt-3 text-sm ${style.accent}`}>{item.year}</p>}</article>)}</div> : <p className={`mt-6 ${style.muted}`}>Education details will appear here.</p>}
          </section>

          <section id="skills" className={`scroll-mt-24 rounded-2xl p-7 md:p-9 ${style.section} ${style.card}`}>
            <SectionHeading title="Skills" subtitle="Tools of the trade" style={style} />
            {skills.length ? <div className="mt-6 flex flex-wrap gap-2">{skills.map((skill, index) => <span key={`${skill}-${index}`} className={`rounded-lg px-3 py-2 text-sm ${style.card} ${style.accent}`}><Code2 className="mr-2 inline" size={14} />{skill}</span>)}</div> : <p className={`mt-6 ${style.muted}`}>Add skills in your portfolio editor.</p>}
          </section>

          <section id="projects" className={`scroll-mt-24 rounded-2xl p-7 md:p-9 ${style.section} ${style.card}`}>
            <SectionHeading title="Projects" subtitle="Selected work" style={style} />
            {projects.length ? <div className="mt-6 grid gap-4 md:grid-cols-2">{projects.map((project, index) => <article key={project.id || `project-${index}`} className={`rounded-xl p-5 ${style.card}`}><h3 className="text-lg font-semibold">{project.name || 'Project'}</h3>{project.description && <p className={`mt-3 whitespace-pre-line text-sm leading-7 ${style.muted}`}>{project.description}</p>}{project.technologies && <div className="mt-4 flex flex-wrap gap-2">{(Array.isArray(project.technologies) ? project.technologies : project.technologies.split(',')).map((technology) => technology.trim()).filter(Boolean).map((technology, itemIndex) => <span key={`${technology}-${itemIndex}`} className="rounded bg-current/5 px-2 py-1 text-xs">{technology}</span>)}</div>}{validWebLink(project.link) && <a href={project.link} target="_blank" rel="noopener noreferrer" className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold ${style.accent}`}>View project <ExternalLink size={14} /></a>}</article>)}</div> : <p className={`mt-6 ${style.muted}`}>Projects will appear here.</p>}
          </section>

          <section id="experience" className={`scroll-mt-24 rounded-2xl p-7 md:p-9 ${style.section} ${style.card}`}>
            <SectionHeading title="Experience" subtitle="Where I have worked" style={style} />
            {experience.length ? <div className="mt-6 space-y-5">{experience.map((item, index) => <article key={item.id || `experience-${index}`} className="border-l-2 border-current/20 pl-5"><h3 className="font-semibold">{item.role || item.title || 'Experience'}{item.company ? ` · ${item.company}` : ''}</h3>{item.period && <p className={`mt-1 text-sm ${style.accent}`}>{item.period}</p>}{item.description && <p className={`mt-3 whitespace-pre-line text-sm leading-7 ${style.muted}`}>{item.description}</p>}</article>)}</div> : <p className={`mt-6 ${style.muted}`}>Experience will appear here.</p>}
          </section>

          <section id="contact" className={`scroll-mt-24 rounded-2xl p-8 text-center md:p-12 ${style.section} ${style.card}`}>
            <SectionHeading title="Let's work together" subtitle="Get in touch" style={style} centered />
            <p className={`mx-auto mt-4 max-w-xl leading-7 ${style.muted}`}>Have an opportunity or a project in mind? I would love to hear from you.</p>
            {form.email && <a href={`mailto:${form.email}`} className={`mt-7 inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold ${style.button}`}><Mail size={17} />{form.email}</a>}
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">{socials.map(({ name, href }) => <a key={name} href={href} target="_blank" rel="noopener noreferrer" className={style.accent}>{name}</a>)}</div>
          </section>
        </div>
      </main>

      <footer className="border-t border-current/10 px-5 py-7 text-center">
        <p className={`text-sm ${style.muted}`}>© {currentYear} {form.name || 'Portfolio'}{template === 'developer' ? ' · built with care' : ' · Portfolio'}</p>
      </footer>
    </div>
  )
}

function SectionHeading({ title, subtitle, style, centered = false }) {
  return (
    <div className={centered ? 'text-center' : ''}>
      <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${style.accent}`}>{subtitle}</p>
      <h2 className="mt-2 text-2xl font-bold md:text-3xl">{title}</h2>
    </div>
  )
}

export default PortfolioSite
