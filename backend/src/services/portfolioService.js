import prisma from '../config/db.js'
import { generateSlug } from '../utils/generateSlug.js'
import { httpError } from '../utils/httpError.js'

const includeContent = {
  education: { orderBy: { sortOrder: 'asc' } },
  projects: { orderBy: { sortOrder: 'asc' } },
  experience: { orderBy: { sortOrder: 'asc' } },
  skills: { orderBy: { sortOrder: 'asc' } },
}

function toResponse(portfolio) {
  return {
    id: portfolio.id,
    title: portfolio.title,
    template: portfolio.template,
    slug: portfolio.slug,
    isPublished: portfolio.isPublished,
    createdAt: portfolio.createdAt,
    updatedAt: portfolio.updatedAt,
    content: {
      name: portfolio.name,
      role: portfolio.role,
      email: portfolio.email,
      location: portfolio.location,
      about: portfolio.about,
      photo: portfolio.photo || '',
      github: portfolio.github,
      linkedin: portfolio.linkedin,
      website: portfolio.website,
      education: portfolio.education.map(({ id, degree, college, year }) => ({ id, degree, college, year })),
      projects: portfolio.projects.map(({ id, name, description, technologies, link }) => ({ id, name, description, technologies, link })),
      experience: portfolio.experience.map(({ id, role, company, period, description }) => ({ id, role, company, period, description })),
      skills: portfolio.skills.map(({ id, name }) => ({ id, name })),
    },
  }
}

function scalarData(payload) {
  return {
    title: payload.title,
    template: payload.template,
    name: payload.content.name,
    role: payload.content.role,
    email: payload.content.email,
    location: payload.content.location,
    about: payload.content.about,
    photo: payload.content.photo || null,
    github: payload.content.github,
    linkedin: payload.content.linkedin,
    website: payload.content.website,
  }
}

function relations(content) {
  return {
    education: {
      create: content.education.map((item, sortOrder) => ({
        degree: item.degree,
        college: item.college,
        year: item.year,
        sortOrder,
      })),
    },
    projects: {
      create: content.projects.map((item, sortOrder) => ({
        name: item.name,
        description: item.description,
        technologies: item.technologies,
        link: item.link,
        sortOrder,
      })),
    },
    experience: {
      create: content.experience.map((item, sortOrder) => ({
        role: item.role,
        company: item.company,
        period: item.period,
        description: item.description,
        sortOrder,
      })),
    },
    skills: {
      create: content.skills.map((name, sortOrder) => ({ name, sortOrder })),
    },
  }
}

async function findOwnedPortfolio(userId, id) {
  const portfolio = await prisma.portfolio.findFirst({
    where: { id, userId },
    include: includeContent,
  })
  if (!portfolio) throw httpError(404, 'Portfolio not found.')
  return portfolio
}

export async function listPortfolios(userId) {
  const portfolios = await prisma.portfolio.findMany({
    where: { userId },
    include: includeContent,
    orderBy: { updatedAt: 'desc' },
  })
  return portfolios.map(toResponse)
}

export async function getPortfolio(userId, id) {
  return toResponse(await findOwnedPortfolio(userId, id))
}

export async function createPortfolio(userId, payload) {
  const portfolio = await prisma.portfolio.create({
    data: {
      userId,
      ...scalarData(payload),
      ...relations(payload.content),
    },
    include: includeContent,
  })
  return toResponse(portfolio)
}

export async function updatePortfolio(userId, id, payload) {
  await findOwnedPortfolio(userId, id)
  const portfolio = await prisma.$transaction((transaction) =>
    transaction.portfolio.update({
      where: { id },
      data: {
        ...scalarData(payload),
        education: { deleteMany: {}, ...relations(payload.content).education },
        projects: { deleteMany: {}, ...relations(payload.content).projects },
        experience: { deleteMany: {}, ...relations(payload.content).experience },
        skills: { deleteMany: {}, ...relations(payload.content).skills },
      },
      include: includeContent,
    })
  )
  return toResponse(portfolio)
}

export async function deletePortfolio(userId, id) {
  await findOwnedPortfolio(userId, id)
  await prisma.portfolio.delete({ where: { id } })
}

export async function duplicatePortfolio(userId, id) {
  const source = await findOwnedPortfolio(userId, id)
  const payload = {
    title: `${source.title} (copy)`.slice(0, 100),
    template: source.template,
    content: {
      name: source.name,
      role: source.role,
      email: source.email,
      location: source.location,
      about: source.about,
      photo: source.photo,
      github: source.github,
      linkedin: source.linkedin,
      website: source.website,
      education: source.education,
      projects: source.projects,
      experience: source.experience,
      skills: source.skills.map((skill) => skill.name),
    },
  }
  const copy = await prisma.portfolio.create({
    data: {
      userId,
      ...scalarData(payload),
      ...relations(payload.content),
      isPublished: false,
      slug: null,
    },
    include: includeContent,
  })
  return toResponse(copy)
}

export async function publishPortfolio(userId, id) {
  const source = await findOwnedPortfolio(userId, id)
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const slug = generateSlug(source.name || source.title)
    try {
      const portfolio = await prisma.portfolio.update({
        where: { id },
        data: { slug, isPublished: true },
        include: includeContent,
      })
      return toResponse(portfolio)
    } catch (error) {
      if (error?.code !== 'P2002' || attempt === 3) throw error
    }
  }
  throw httpError(500, 'Unable to generate a public URL.')
}

export async function unpublishPortfolio(userId, id) {
  await findOwnedPortfolio(userId, id)
  const portfolio = await prisma.portfolio.update({
    where: { id },
    data: { isPublished: false, slug: null },
    include: includeContent,
  })
  return toResponse(portfolio)
}

export async function getPublicPortfolio(slug) {
  const portfolio = await prisma.portfolio.findFirst({
    where: { slug, isPublished: true },
    include: includeContent,
  })
  if (!portfolio) throw httpError(404, 'Published portfolio not found.')
  return toResponse(portfolio)
}