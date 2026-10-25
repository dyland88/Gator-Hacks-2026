To run the website, run:
`pnpm i`
`pnpm dev`

We are using postgresql with supabase

## Authentication and profiles

Copy `.env.example` to `.env` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the Supabase Connect dialog. These are separate from the server-only Postgres credentials. Legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` is also supported.

In Supabase Authentication > URL Configuration, set the production Site URL and allow these redirect URLs for each environment:

```text
http://localhost:3000/auth/callback
http://localhost:3000/auth/callback?next=/auth/reset-password
https://YOUR_DOMAIN/auth/callback
https://YOUR_DOMAIN/auth/callback?next=/auth/reset-password
```

If you run another local port, allow its callback URLs too. Signup uses the default confirmation email. The verification link should be opened in the same browser used for signup because the PKCE verifier is stored there.

Apply the additive profile SQL and generate the Prisma client:

```text
pnpm db:profiles
pnpm exec prisma generate
```

The SQL is safe to rerun. It creates `public.user_profiles`, an `auth.users` foreign key with cascading deletion, validation checks, owner-only RLS policies, timestamps, and a signup trigger. Existing auth users receive an empty profile. Supabase Auth owns emails and passwords; `user_profiles` stores tags, age, location, location ID, and gender. Use `db:profiles` to provision these database objects; `prisma db push` alone does not preserve the complete auth integration.

Accounts support email/password signup, sign-in, sign-out, email confirmation, password recovery, and cookie-based sessions. Signed-in preferences are loaded and saved through authenticated tRPC procedures using the user's Supabase session and RLS. Guest preferences stay on the device. Preferences selected before signup are transferred on the first sign-in on that device, without overwriting an existing populated account profile.

Verify database ownership rules with:

```text
pnpm exec prisma db execute --file prisma/sql/user-profiles.verify.sql --schema prisma/schema.prisma
pnpm test
pnpm typecheck
pnpm build
```

The SQL verification creates temporary test accounts and rolls the transaction back. Application tests mock authentication and do not send emails.

# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
