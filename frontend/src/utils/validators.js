export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return error.response?.data?.message || error.message || fallback
}

export function normalizePortfolio(portfolio) {
  const content = portfolio?.content || portfolio || {}

  return {
    ...content,
    name: content.name || '',
    role: content.role || '',
    email: content.email || '',
    location: content.location || '',
    about: content.about || '',
    photo: content.photo || '',
    github: content.github || '',
    linkedin: content.linkedin || '',
    website: content.website || '',
    education: Array.isArray(content.education) ? content.education : [],
    skills: Array.isArray(content.skills)
      ? content.skills
      : typeof content.skills === 'string'
        ? content.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
        : [],
    projects: Array.isArray(content.projects) ? content.projects : [],
    experience: Array.isArray(content.experience)
      ? content.experience
      : typeof content.experience === 'string' && content.experience.trim()
        ? [{ id: 'legacy-experience', role: '', company: '', period: '', description: content.experience }]
        : [],
  }
}

export function getPortfolioPayload(title, template, form) {
  return { title: title.trim(), template, content: form }
}