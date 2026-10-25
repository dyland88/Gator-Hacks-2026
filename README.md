<div align="center">

# Legal Seagull

**Local legislation, made easier.**

Follow your city's ordinances, receive weekly updates, and ask questions along the way.

Built for Gator Hack V - 2026

</div>

---

### What it does

- Browse updates to legislation where you live, personalized to your interests and demographics
- Keep up to date with weekly newsletter updates for ordinance activity in your city.
- Follow up with an AI Chatbot, powered by Gemma, to ask questions about ordinances

### Built with

Next.js · React · TypeScript · Tailwind CSS · tRPC  
Supabase · Prisma · Google Gemma · Firecrawl · Resend

### Run locally

Use Node.js 22+ and pnpm. From the repository root:

```sh
cd gator_hacks_2026
pnpm install
cp .env.example .env
```

Fill in `.env` with your Supabase database URLs, project URL, publishable key, and `GEMINI_API_KEY` for chat. The example also includes configuration for Firecrawl ingestion and Resend email digests.

Provision your Supabase database, then start the app:

```sh
pnpm db:profiles
pnpm db:ordinances
pnpm db:weekly-digests
pnpm dev
```

Open [localhost:3000](http://localhost:3000). For authentication redirects, ingestion, and deployment setup, see the [application guide](gator_hacks_2026/README.md).

### Project layout

```text
gator_hacks_2026/
├── src/app/          Pages and dashboard
├── src/server/       API, AI, and ingestion
├── src/lib/          Shared utilities and Supabase clients
└── prisma/           Database schema and SQL setup
```

### Checks

Run from `gator_hacks_2026/`:

```sh
pnpm test
pnpm typecheck
pnpm build
```
