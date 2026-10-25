# CLAUDE.md

Instructions for Claude when working in this repo (Gator Hack V).

## Skills to use

Load the matching skill before starting this kind of work:

- **Planning / sequencing work into phases** → `/fullstack-planner:roadmap`
- **Designing a screen, user flow, or design system** → `/fullstack-planner:design-ux`
- **Writing or building frontend UI code** → `/web-design-engineer`
- **Starting a new app/service from scratch** → `/fullstack-planner:scaffold-project`
- **Designing the database schema or API shape** → `/fullstack-planner:data-model`

Default order for a new feature: `data-model` → `scaffold-project` (new service only) → `design-ux` → implement with `web-design-engineer` → `roadmap` to sequence what's left.

## Frontend design rules

No generic "AI-slop" UI. Specifically:

- **Typography**: no Inter, Roboto, Arial, or default system fonts. Pick a distinctive font pairing and commit to it everywhere.
- **Color**: one cohesive theme defined as CSS variables. Dominant color + sharp accent, not evenly-distributed pastel palettes. No purple-gradient-on-white.
- **Motion**: CSS-only animations for HTML. One well-orchestrated page load (staggered reveals via `animation-delay`) beats scattered micro-interactions.
- **Backgrounds**: layered gradients, geometric patterns, or contextual effects — never a flat solid background by default.
- **Layout**: no predictable, cookie-cutter component patterns. Design should look built for this specific app, not a template.

Every new screen or component should match the existing system — check `design-ux` output or existing components before freelancing a new style.

## Code conventions

- No code comments.
- Keep output direct. Code and structure over explanation.

## Stack

- Frontend: React 19, Next.js App Router, Tailwind CSS 4
- Backend: TypeScript, Next.js 15, tRPC 11
- Database: Supabase Postgres through Prisma 6
- AI: hosted Gemma through the Google Gen AI SDK
- Hosting/deploy: Vercel

## Project layout

- The application root is `gator_hacks_2026/`.
- The main Ledgerline interface is `src/app/_components/bills-dashboard.tsx`.
- tRPC routers live in `src/server/api/routers/` and must be registered in `src/server/api/root.ts`.
- Server-only AI integrations live in `src/server/ai/`.
- Environment variables are validated in `src/env.js` and documented in `.env.example`.

## Gemma chat integration

The Ledgerline chat is connected to hosted Gemma and uses this flow:

`BillsDashboard` → `chat.send` tRPC mutation → `createChatReply` → reusable Gemma client → Gemini API

- `src/server/ai/gemma.ts` owns the provider client, model selection, role conversion, timeouts, retries, and normalized text responses.
- `src/server/chat.ts` owns chat validation and the Ledgerline system instruction. Keep product-specific prompts out of the provider client so it can also support bill summarization and tagging.
- `src/server/api/routers/chat.ts` is the public transport layer and must return sanitized errors without provider details.
- Chat history is browser-only and is intentionally not written to Prisma or Supabase.
- The client may send only `user` and `model` messages. The system instruction is server-owned.
- Requests are limited to 12 messages, 2,000 characters per user message, and 12,000 total characters.
- Do not log chat prompts, model responses, API keys, or user profile data.
- No live legislation retrieval is connected yet. The system instruction must not imply that current bills or statuses were looked up.

Required local configuration:

```env
GEMINI_API_KEY="your-google-ai-studio-api-key"
GEMMA_MODEL="gemma-4-26b-a4b-it"
```

`GEMMA_MODEL` is optional at runtime and defaults to `gemma-4-26b-a4b-it`. `GEMINI_API_KEY` is server-only and must never use a `NEXT_PUBLIC_` prefix.

## Verification

Run these from `gator_hacks_2026/` after changing the chat or AI provider:

```text
pnpm test
pnpm typecheck
pnpm exec eslint <changed files>
pnpm build
```

The Gemma and chat tests use mocked provider calls and must not make live API requests in CI.
