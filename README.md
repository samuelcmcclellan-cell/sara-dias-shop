# SUB — Sara Dias Pattern Tees

E-commerce prototype for exclusive all-over-print t-shirts by Brazilian pattern designer [Sara Dias](https://instagram.com/saradiasestampa). 8 curated patterns at $30/tee.

## Stack

- Next.js 15 (App Router) + TypeScript strict
- Tailwind CSS 4 + shadcn/ui (Radix primitives)
- Prisma + SQLite (local dev) — swap to Postgres for production
- Stripe Checkout + Webhooks (demo mode by default)
- Printify fulfillment (demo mode by default)

## Getting started

```bash
npm install
cp .env.example .env.local
npx prisma db push
npm run dev
```

All external integrations are in demo mode when their env keys are set to `placeholder`. Stripe checkout writes directly to the DB; Printify functions return mock IDs.

## Scripts

- `npm run dev` — Next dev server
- `npm run build` — production build
- `node scripts/generate-mockups.js` — regenerate tee mockups from pattern tiles in `public/patterns/`

## Site-wide password (optional)

Set `BASIC_AUTH_USER` + `BASIC_AUTH_PASSWORD` env vars to gate the whole site behind HTTP Basic Auth. Leave them unset for open access.
