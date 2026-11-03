# Portify

Portify is a JavaScript portfolio builder with a React/Vite frontend and an Express, Prisma 7, and PostgreSQL API.

## Local development

Requirements: Node.js 20.19+, npm, and a PostgreSQL database.

1. Copy `backend/.env.example` to `backend/.env`, then set `DATABASE_URL` and a random `JWT_SECRET` of at least 32 characters. Keep `.env` files private.
2. From `backend`, install dependencies and create the initial schema migration:

   ```sh
   npm ci
   npm run db:generate
   npm run db:migrate:dev -- --name init
   npm run dev
   ```

3. Copy `frontend/.env.example` to `frontend/.env.local` if you need to override the defaults.
4. From `frontend`, install dependencies and start Vite:

   ```sh
   npm ci
   npm run dev
   ```

Vite proxies `/api` to `http://localhost:5000`. The frontend persists authentication in a JWT and portfolio content in PostgreSQL; browser storage is not used as the portfolio database.

## Production environment

### API (Render)

Set these Render environment variables; never commit their values:

- `DATABASE_URL`: PostgreSQL connection string (for example, Neon).
- `JWT_SECRET`: at least 32 cryptographically random characters.
- `CLIENT_URL`: exact deployed frontend origin, such as `https://your-site.example`; comma-separate additional trusted origins.
- `NODE_ENV=production`.

The Render blueprint in `backend/render.yaml` generates Prisma Client during build and runs `prisma migrate deploy` before starting the API. Configure a persistent PostgreSQL database and make its URL available to the service.

### Frontend (Vercel)

Set the project root to `frontend`, framework to Vite, and configure:

- `VITE_API_BASE_URL`: the deployed API origin ending in `/api`.
- `VITE_PUBLIC_APP_URL`: the canonical deployed frontend origin (without a trailing slash).

`frontend/vercel.json` sends deep links, including published portfolio slugs, to the SPA entry point. The public link uses this configured origin, falling back to the current origin when unset.

## Database changes

For local development, create migrations with `npm run db:migrate:dev -- --name <description>`. For deployed environments, apply checked-in migrations with `npm run db:migrate:deploy`; do not use `db push` against production.

## Checks

```sh
# frontend
npm run build
npm run lint

# backend
npm run db:generate
npm run db:migrate:deploy
```
