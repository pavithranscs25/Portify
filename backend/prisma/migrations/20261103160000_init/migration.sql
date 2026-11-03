-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "passwordHash" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "template" VARCHAR(20) NOT NULL DEFAULT 'modern',
    "slug" VARCHAR(140),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "name" VARCHAR(100) NOT NULL DEFAULT '',
    "role" VARCHAR(120) NOT NULL DEFAULT '',
    "email" VARCHAR(254) NOT NULL DEFAULT '',
    "location" VARCHAR(160) NOT NULL DEFAULT '',
    "about" TEXT NOT NULL DEFAULT '',
    "photo" TEXT,
    "github" VARCHAR(2048) NOT NULL DEFAULT '',
    "linkedin" VARCHAR(2048) NOT NULL DEFAULT '',
    "website" VARCHAR(2048) NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" UUID NOT NULL,
    "portfolioId" UUID NOT NULL,
    "degree" VARCHAR(160) NOT NULL DEFAULT '',
    "college" VARCHAR(200) NOT NULL DEFAULT '',
    "year" VARCHAR(60) NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" UUID NOT NULL,
    "portfolioId" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "technologies" TEXT NOT NULL DEFAULT '',
    "link" VARCHAR(2048) NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" UUID NOT NULL,
    "portfolioId" UUID NOT NULL,
    "role" VARCHAR(160) NOT NULL DEFAULT '',
    "company" VARCHAR(200) NOT NULL DEFAULT '',
    "period" VARCHAR(100) NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" UUID NOT NULL,
    "portfolioId" UUID NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_slug_key" ON "Portfolio"("slug");

-- CreateIndex
CREATE INDEX "Portfolio_userId_updatedAt_idx" ON "Portfolio"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "Education_portfolioId_sortOrder_idx" ON "Education"("portfolioId", "sortOrder");

-- CreateIndex
CREATE INDEX "Project_portfolioId_sortOrder_idx" ON "Project"("portfolioId", "sortOrder");

-- CreateIndex
CREATE INDEX "Experience_portfolioId_sortOrder_idx" ON "Experience"("portfolioId", "sortOrder");

-- CreateIndex
CREATE INDEX "Skill_portfolioId_sortOrder_idx" ON "Skill"("portfolioId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_portfolioId_name_key" ON "Skill"("portfolioId", "name");

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
