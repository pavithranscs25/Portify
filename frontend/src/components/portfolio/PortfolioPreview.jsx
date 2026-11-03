import {
  Mail,
  MapPin,
  ExternalLink,
  Code2,
  GraduationCap,
  Briefcase,
  FolderGit2,
  User,
} from 'lucide-react'

// Reusable social links
function SocialLinks({ form, developer = false }) {
  const links = [
    { label: 'GitHub', url: form.github },
    { label: 'LinkedIn', url: form.linkedin },
    { label: 'Website', url: form.website },
  ]

  return (
    <div className="mt-5 flex flex-wrap gap-3">
      {links.map(({ label, url }) => {
        if (!url || !/^https?:\/\//i.test(url)) return null

        return (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
              developer
                ? 'border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20'
                : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
            }`}
          >
            {label}
            <ExternalLink size={12} />
          </a>
        )
      })}
    </div>
  )
}

// Profile photo
function ProfilePhoto({ form, size = 'h-24 w-24' }) {
  return form.photo ? (
    <img
      src={form.photo}
      alt={form.name || 'Profile'}
      className={`${size} rounded-full border-2 border-violet-400 object-cover`}
    />
  ) : (
    <div
      className={`${size} flex items-center justify-center rounded-full bg-violet-100 text-violet-600`}
    >
      <User size={32} />
    </div>
  )
}

// Reusable portfolio sections
function PreviewSections({
  form,
  skills,
  minimal = false,
  developer = false,
}) {
  const heading = developer
    ? 'mb-4 flex items-center gap-2 font-mono text-emerald-400'
    : minimal
      ? 'mb-4 text-sm font-bold uppercase tracking-[3px] text-gray-800'
      : 'mb-4 text-lg font-bold text-gray-900'

  const paragraph = developer
    ? 'whitespace-pre-wrap text-sm leading-7 text-gray-300'
    : 'whitespace-pre-wrap text-sm leading-7 text-gray-600'

  const sectionStyle = minimal
    ? 'border-t border-gray-200 py-6'
    : 'border-t border-gray-200 py-6'

  return (
    <div className="space-y-1">

      {/* ABOUT */}
      <section className={sectionStyle}>
        <h3 className={heading}>
          {developer && <User size={17} />}
          About Me
        </h3>

        <p className={paragraph}>
          {form.about || 'Your introduction will appear here.'}
        </p>
      </section>

      {/* EDUCATION */}
      <section className={sectionStyle}>
        <h3 className={heading}>
          {developer && <GraduationCap size={17} />}
          Education
        </h3>

        <div className="space-y-4">
          {(form.education || []).map((item, index) => (
            <div key={item.id || `education-${index}`}>
              <h4
                className={`font-semibold ${
                  developer ? 'text-white' : 'text-gray-800'
                }`}
              >
                {item.degree || 'Your Degree'}
              </h4>

              <p className={paragraph}>
                {item.college || item.institution || 'Your College / University'}
              </p>

              {item.year && (
                <p className="mt-1 text-xs text-violet-500">
                  {item.year}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section className={sectionStyle}>
        <h3 className={heading}>
          {developer && <Code2 size={17} />}
          Skills
        </h3>

        <div className="flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className={
                  developer
                    ? 'rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300'
                    : minimal
                      ? 'border-b border-gray-400 px-2 py-1 text-sm text-gray-700'
                      : 'rounded-md bg-violet-100 px-3 py-1 text-sm text-violet-700'
                }
              >
                {skill}
              </span>
            ))
          ) : (
            <p className={paragraph}>Your skills will appear here.</p>
          )}
        </div>
      </section>

      {/* PROJECTS */}
      <section className={sectionStyle}>
        <h3 className={heading}>
          {developer && <FolderGit2 size={17} />}
          Projects
        </h3>

        <div className="space-y-5">
          {(form.projects || []).map((item, index) => (
            <div
              key={item.id || `project-${index}`}
              className={
                developer
                  ? 'rounded-lg border border-emerald-400/20 bg-[#172337] p-4'
                  : minimal
                    ? 'border-l-2 border-gray-300 pl-4'
                    : 'rounded-xl bg-gray-50 p-4'
              }
            >
              <h4
                className={`font-semibold ${
                  developer ? 'text-white' : 'text-gray-800'
                }`}
              >
                {item.name || 'Your Project'}
              </h4>

              <p className={`mt-2 ${paragraph}`}>
                {item.description || 'Project description will appear here.'}
              </p>

              {item.technologies && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {(Array.isArray(item.technologies)
                    ? item.technologies
                    : item.technologies.split(','))
                    .map(tech => tech.trim())
                    .filter(Boolean)
                    .map(tech => (
                      <span
                        key={tech}
                        className={
                          developer
                            ? 'rounded bg-emerald-400/10 px-2 py-1 text-xs text-emerald-300'
                            : 'rounded bg-violet-100 px-2 py-1 text-xs text-violet-700'
                        }
                      >
                        {tech}
                      </span>
                    ))}
                </div>
              )}

              {item.link && /^https?:\/\//i.test(item.link) && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:underline"
                >
                  View Project
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className={sectionStyle}>
        <h3 className={heading}>
          {developer && <Briefcase size={17} />}
          Experience
        </h3>

        {Array.isArray(form.experience) && form.experience.length ? (
          <div className="space-y-4">
            {form.experience.map((item, index) => (
              <article key={item.id || `experience-${index}`}>
                <h4 className={developer ? 'font-semibold text-white' : 'font-semibold text-gray-800'}>
                  {item.role || item.title || 'Role'}
                  {item.company ? ` · ${item.company}` : ''}
                </h4>
                {item.period && <p className="mt-1 text-xs text-violet-500">{item.period}</p>}
                <p className={`mt-2 ${paragraph}`}>{item.description || ''}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className={paragraph}>
            {typeof form.experience === 'string' && form.experience
              ? form.experience
              : 'Your experience will appear here.'}
          </p>
        )}
      </section>

    </div>
  )
}

// MODERN TEMPLATE
function ModernPreview({ form, skills }) {
  return (
    <div className="min-h-[650px] overflow-hidden rounded-xl bg-white p-8 text-gray-900 shadow-xl">

      <div className="border-b-2 border-violet-500 pb-6">
        <div className="flex flex-wrap items-center gap-5">
          <ProfilePhoto form={form} />

          <div>
            <h1 className="text-3xl font-bold">
              {form.name || 'Your Name'}
            </h1>

            <p className="mt-2 text-lg text-violet-600">
              {form.role || 'Software Developer'}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          {form.email && (
            <span className="flex items-center gap-1">
              <Mail size={14} />
              {form.email}
            </span>
          )}

          {form.location && (
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {form.location}
            </span>
          )}
        </div>

        <SocialLinks form={form} />
      </div>

      <PreviewSections form={form} skills={skills} />
    </div>
  )
}

// MINIMAL TEMPLATE
function MinimalPreview({ form, skills }) {
  return (
    <div className="min-h-[650px] overflow-hidden rounded-xl bg-[#faf9f6] p-10 text-[#292929] shadow-xl">

      <div className="border-b border-gray-300 pb-8">
        <ProfilePhoto form={form} size="h-20 w-20" />

        <h1 className="mt-5 text-4xl font-light tracking-tight">
          {form.name || 'Your Name'}
        </h1>

        <p className="mt-3 text-sm uppercase tracking-[3px] text-gray-500">
          {form.role || 'Your Professional Title'}
        </p>

        <div className="mt-4 space-y-1 text-xs text-gray-500">
          {form.email && <p>{form.email}</p>}
          {form.location && <p>{form.location}</p>}
        </div>

        <SocialLinks form={form} />
      </div>

      <PreviewSections form={form} skills={skills} minimal />
    </div>
  )
}

// DEVELOPER TEMPLATE
function DeveloperPreview({ form, skills }) {
  return (
    <div className="min-h-[650px] overflow-hidden rounded-xl bg-[#101827] p-8 text-gray-100 shadow-xl">

      <div className="rounded-xl border border-emerald-400/30 bg-[#172337] p-6">

        <p className="mb-4 font-mono text-sm text-emerald-400">
          // Hello, World!
        </p>

        <div className="flex flex-wrap items-center gap-5">
          <ProfilePhoto form={form} />

          <div>
            <h1 className="text-3xl font-bold">
              {form.name || 'Your Name'}
            </h1>

            <p className="mt-2 text-emerald-400">
              {form.role || 'Full Stack Developer'}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm text-gray-400">
          {form.email && <p>{form.email}</p>}
          {form.location && <p>{form.location}</p>}
        </div>

        <SocialLinks form={form} developer />
      </div>

      <PreviewSections
        form={form}
        skills={skills}
        developer
      />
    </div>
  )
}

// MAIN PREVIEW COMPONENT
function PortfolioPreview({ form, template, skills }) {
  const portfolioSkills = skills || (Array.isArray(form.skills)
    ? form.skills.map((skill) => typeof skill === 'string' ? skill : skill.name).filter(Boolean)
    : (form.skills || '').split(',').map((skill) => skill.trim()).filter(Boolean))

  if (template === 'minimal') {
    return <MinimalPreview form={form} skills={portfolioSkills} />
  }

  if (template === 'developer') {
    return <DeveloperPreview form={form} skills={portfolioSkills} />
  }

  return <ModernPreview form={form} skills={portfolioSkills} />
}

export default PortfolioPreview
