# Architecture

```
src/
  app/(store)     storefront pages
  app/admin       owner dashboard
  app/actions     server actions (auth, cart, checkout, admin)
  app/api         webhooks + order status
  components/     store, admin, brand
  lib/            db, money, cart, pricing, payments, email, theme
  proxy.ts        optimistic admin cookie check (not the real auth)
```

Real authorization happens in server actions and `requireStaff()` / `requireSession()`. Proxy only redirects missing cookies.

## Payments

`getPaymentProvider()` returns an adapter. Checkout always creates a `PENDING_PAYMENT` order, reserves stock, then redirects. Paid is applied only by `applyVerifiedPayment` after a verified webhook or an admin mark-paid action.

## Theme engine

`Theme` rows store colours and campaign copy. One row is `published`. Admin can preview via cookie, publish (snapshot previous), or rollback.

## Inventory

`stock` is on-hand. `reserved` is held for unpaid checkouts. Capture moves reserved → sold after payment. Release returns reserved on cancel.
