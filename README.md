# APParattus

Launch planning without the spreadsheet. Turn a raw idea into a sequenced release: milestones with owners and dates, risks tracked openly, and one shared view of where a launch actually stands.

Live at [app-arattus.vercel.app](https://app-arattus.vercel.app).

## Stack

- Next.js App Router + TypeScript
- Postgres via [Neon](https://neon.tech), provisioned through the Vercel Marketplace
- Auth: self-rolled email/password with signed session cookies (`jose` + `bcryptjs`) — no third-party auth provider

## Data model

- `users` — email/password accounts
- `launches` — a release being planned (status: planning → in_progress → at_risk/shipped/archived)
- `milestones` — sequenced steps within a launch, each with an owner and due date
- `risks` — flagged concerns per launch (severity + status)

## Local development

```bash
npm install
vercel env pull .env.local   # requires the project linked via `vercel link`
npm run dev
```

## Production build

```bash
npm run build
npm run start
```

Run `npm run typecheck` after installing dependencies to validate types locally — the Neon serverless driver's tagged-template query results are a union type that TypeScript won't let you index without an explicit cast, so every query in `app/api/**` casts its result immediately.
