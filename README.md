# Gator Hacks 2026

T3 Stack app for Gator Hack V.

## Stack

Next.js (App Router) · tRPC · Prisma · PostgreSQL · NextAuth · Tailwind CSS · TypeScript

## Getting started

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, NEXTAUTH_SECRET, and OAuth provider keys
npm run db:push        # push the Prisma schema to your database
npm run dev
```

App runs at http://localhost:3000.

## Project layout

```
src/
  app/              Next.js App Router pages and API routes
  server/
    api/            tRPC routers (add new routers in server/api/routers, register in root.ts)
    auth.ts         NextAuth config
    db/client.ts    Prisma client
  trpc/react.tsx     Client-side tRPC + React Query setup
  styles/            Global CSS, design tokens
prisma/schema.prisma  Database schema
docs/                 Planning docs (brief, ADR, data model) if any exist
```

## Adding a feature

1. Add/extend models in `prisma/schema.prisma`, then `npm run db:push`.
2. Add a router in `src/server/api/routers/`, register it in `src/server/api/root.ts`.
3. Call it from a client component with `api.yourRouter.yourProcedure.useQuery(...)`.

See `CLAUDE.md` in the repo root for design conventions and which skill to use for what.
