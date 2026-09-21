# Deployment

UNDERSTOOD. is a standard Next.js app. It does not depend on Grok.

## Environment

Copy `.env.example` to `.env.local` (local) or set the same keys on your host.

Required:

- `DATABASE_URL`
- `AUTH_SECRET` (long random string)
- `APP_URL` / `NEXT_PUBLIC_APP_URL` (public origin, no trailing slash)

Optional:

- `PAYMENT_PROVIDER=yoco` plus `YOCO_SECRET_KEY`, `YOCO_WEBHOOK_SECRET`, `YOCO_MODE`
- `RESEND_API_KEY`, `EMAIL_FROM`, `OWNER_EMAIL`
- `WHATSAPP_NUMBER`

Generate `AUTH_SECRET` without printing it:

```bash
node -e "require('fs').appendFileSync('.env.local','AUTH_SECRET='+require('crypto').randomBytes(32).toString('base64url')+'\n')"
```

## Vercel

This repo is already linkable with the Vercel CLI.

```bash
npx vercel link
npx vercel env pull .env.local
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npx vercel --prod
```

Register the webhook:

`https://YOUR_DOMAIN/api/webhooks/yoco`

## Postgres

SQLite is for local convenience. Production should use Postgres.

1. Provision Neon (or any Postgres).
2. Switch `provider` in `prisma/schema.prisma` to `postgresql`.
3. Set `DATABASE_URL`.
4. `npx prisma db push` then seed.

## Going live checklist

- Change the seeded owner password
- Set live Yoco keys only on production
- Verify the `.co.za` domain with Yoco
- Send a test paid order over R2
- Confirm owner email arrives
- Add real product photos in Admin / `public/products`
- Set WhatsApp number in Settings
