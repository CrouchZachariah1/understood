# UNDERSTOOD.

South African retail storefront for growing families. Launch catalogue: **NIKU** brief-cut underwear for toddlers, children and younger teens. The shop is the brand **UNDERSTOOD.** — NIKU is a curated product brand, not the site name.

Tagline: **Comfort. Understood.**

## Stack

- Next.js 16 (App Router) + TypeScript
- Prisma + SQLite locally (Postgres-ready)
- Server-verified payments (Yoco adapter + manual/EFT)
- Resend email adapter
- ZAR throughout

No Grok-specific runtime. You can open this folder in VS Code, push it to GitHub, and deploy anywhere Node 20+ runs.

## Quick start

```bash
cd understood
copy .env.example .env.local
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

Default owner (change immediately):

- Email: `owner@understood.co.za`
- Password: `UnderstoodLaunch1!`

Set `ADMIN_EMAIL` / `ADMIN_PASSWORD` before seeding to choose your own.

## What you can do without code

From **Admin**:

- Switch Summer / Spring / Autumn / Winter / Custom themes (preview, publish, rollback)
- Orders through packing → delivered
- Inventory by size and colour
- **Stock to move** recommendations (never auto-discounted)
- Bundles, discounts, campaigns, collections
- About / FAQ / delivery / returns / size guide
- WhatsApp number, delivery rates, social links

## Payments

`PAYMENT_PROVIDER=manual|yoco|stripe`

- **manual** — order is created as Pending Payment. Mark paid in admin after EFT reflects. The success page never marks paid on its own.
- **yoco** — server creates a Yoco Checkout; `/api/webhooks/yoco` verifies the Standard Webhooks signature, then stock is captured.
- Stripe keys are accepted in env for a later adapter without changing checkout UI.

Never put secret keys in the frontend.

## Production database

Local default is SQLite (`DATABASE_URL=file:./dev.db`).

For Postgres (Neon, Docker, etc.):

1. Set `DATABASE_URL` to your Postgres URL
2. In `prisma/schema.prisma` change `provider = "sqlite"` to `provider = "postgresql"`
3. Run `npx prisma db push` (or migrate)

`docker compose up -d` starts local Postgres if you prefer that.

## Email

If `RESEND_API_KEY` is set, customers get confirmation / paid / shipped / delivered mail and the owner gets paid-order alerts. If it is empty, emails are written to `EmailLog` and the console.

## Architecture notes

- Money is integer cents. Never floats.
- Stock is reserved at checkout and only decremented after **verified** payment.
- Guest checkout is first. Accounts are optional.
- Seasonal theme tokens live in the database and paint the whole storefront.

See `docs/DEPLOYMENT.md`.
