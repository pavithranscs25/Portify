import {
  createPortfolio,
  deletePortfolio,
  duplicatePortfolio,
  getPortfolio,
  getPublicPortfolio,
  listPortfolios,
  publishPortfolio,
  unpublishPortfolio,
  updatePortfolio,
} from '../services/portfolioService.js'
import { httpError } from '../utils/httpError.js'
import { readText, readUrl, requireObject } from '../utils/validate.js'

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const templates = new Set(['modern', 'minimal', 'developer'])

function readList(value, field, max = 40) {
  if (value === undefined || value === null) return []
  if (!Array.isArray(value)) throw httpError(400, `${field} must be a list.`)
  if (value.length > max) throw httpError(400, `${field} cannot contain more than ${max} entries.`)
  return value
}

function readPhoto(value) {
  const photo = readText(value, 'Profile photo', { max: 2_800_000 })
  if (!photo) return ''
  const match = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(photo)
  if (!match || Buffer.from(match[2], 'base64').length > 2 * 1024 * 1024) {
    throw httpError(400, 'Profile photo must be a JPG, PNG, or WebP image no larger than 2 MB.')
  }
  return photo
}

function validatePortfolio(value) {
  const body = requireObject(value)
  const title = readText(body.title, 'Portfolio name', { max: 100, required: true })
  if (!templates.has(body.template)) throw httpError(400, 'Choose a supported portfolio template.')
  const content = requireObject(body.content, 'Portfolio content must be an object.')

  const skillsInput = Array.isArray(content.skills)
    ? content.skills
    : typeof content.skills === 'string'
      ? content.skills.split(',')
      : content.skills === undefined
        ? []
        : null
  if (!skillsInput) throw httpError(400, 'Skills must be a list.')
  if (skillsInput.length > 60) throw httpError(400, 'Skills cannot contain more than 60 entries.')
  const skills = skillsInput
    .map((item) => readText(typeof item === 'string' ? item : item?.name, 'Skill', { max: 80 }))
    .filter(Boolean)
  if (new Set(skills.map((skill) => skill.toLowerCase())).size !== skills.length) {
    throw httpError(400, 'Each skill can only be added once.')
  }

  const education = readList(content.education, 'Education').map((item) => {
    requireObject(item, 'Each education entry must be an object.')
    const email = readText(content.email, 'Email', { max: 254 })
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw httpError(400, 'Enter a valid portfolio email address.')
    }

    return {
      degree: readText(item.degree, 'Degree', { max: 160 }),
      college: readText(item.college ?? item.institution, 'School or university', { max: 200 }),
      year: readText(item.year, 'Education year', { max: 60 }),
    }
  }).filter((item) => item.degree || item.college || item.year)

  const projects = readList(content.projects, 'Projects').map((item) => {
    requireObject(item, 'Each project must be an object.')
    const technologies = Array.isArray(item.technologies)
      ? item.technologies.map((technology) => readText(technology, 'Technology', { max: 80 })).filter(Boolean).join(', ')
      : readText(item.technologies, 'Technologies', { max: 1000 })
    return {
      name: readText(item.name, 'Project name', { max: 160 }),
      description: readText(item.description, 'Project description', { max: 5000 }),
      technologies,
      link: readUrl(item.link, 'Project URL'),
    }
  }).filter((item) => item.name || item.description || item.technologies || item.link)

  const experienceInput = typeof content.experience === 'string'
    ? (content.experience.trim() ? [{ description: content.experience }] : [])
    : readList(content.experience, 'Experience')
  const experience = experienceInput.map((item) => {
    requireObject(item, 'Each experience entry must be an object.')
    return {
      role: readText(item.role ?? item.title, 'Experience role', { max: 160 }),
      company: readText(item.company, 'Company', { max: 200 }),
      period: readText(item.period, 'Experience dates', { max: 100 }),
      description: readText(item.description, 'Experience description', { max: 5000 }),
    }
  }).filter((item) => item.role || item.company || item.period || item.description)

  return {
    title,
    template: body.template,
    content: {
      name: readText(content.name, 'Name', { max: 100 }),
      role: readText(content.role, 'Professional title', { max: 120 }),
      email,
      location: readText(content.location, 'Location', { max: 160 }),
      about: readText(content.about, 'About', { max: 10_000 }),
      photo: readPhoto(content.photo),
      github: readUrl(content.github, 'GitHub URL'),
      linkedin: readUrl(content.linkedin, 'LinkedIn URL'),
      website: readUrl(content.website, 'Website URL'),
      education,
      projects,
      experience,
      skills,
    },
  }
}

function readId(value) {
  if (!uuidPattern.test(value || '')) throw httpError(400, 'Portfolio ID is invalid.')
  return value
}

export async function list(req, res) {
  return res.json({ portfolios: await listPortfolios(req.user.id) })
}

export async function getById(req, res) {
  return res.json({ portfolio: await getPortfolio(req.user.id, readId(req.params.id)) })
}

export async function create(req, res) {
  const portfolio = await createPortfolio(req.user.id, validatePortfolio(req.body))
  return res.status(201).json({ portfolio })
}

export async function update(req, res) {
  const portfolio = await updatePortfolio(
    req.user.id,
    readId(req.params.id),
    validatePortfolio(req.body)
  )
  return res.json({ portfolio })
}

export async function remove(req, res) {
  await deletePortfolio(req.user.id, readId(req.params.id))
  return res.status(204).end()
}

export async function duplicate(req, res) {
  const portfolio = await duplicatePortfolio(req.user.id, readId(req.params.id))
  return res.status(201).json({ portfolio })
}

export async function publish(req, res) {
  const portfolio = await publishPortfolio(req.user.id, readId(req.params.id))
  return res.json({ portfolio })
}

export async function unpublish(req, res) {
  const portfolio = await unpublishPortfolio(req.user.id, readId(req.params.id))
  return res.json({ portfolio })
}

export async function getPublic(req, res) {
  const slug = readText(req.params.slug, 'Public slug', { max: 140, required: true })
  return res.json({ portfolio: await getPublicPortfolio(slug) })
}