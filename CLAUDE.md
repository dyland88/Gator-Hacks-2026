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

T3 Stack:
- Frontend: Next.js, React, Tailwind CSS
- Backend: tRPC
- Database: Prisma + PostgreSQL
- Auth: NextAuth.js
- Hosting/deploy: <!-- fill in -->
- Language: TypeScript end to end
