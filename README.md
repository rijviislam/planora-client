# Planora — Client

Next.js + Tailwind frontend.

## Setup

```bash
cd client
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
npm run dev
```

Runs at `http://localhost:3000`. Make sure the `server` is running too.

## Design system
"Ticket-stub" identity — events render as torn-admission tickets (`.ticket` in
`globals.css`). Palette: paper (#FAF6EF), ink (#1B1F3B), coral accent
(#FF6B4A), moss for free badges, gold for paid badges. Display type is
Fraunces, body is Inter, labels/dates use JetBrains Mono.

## Built so far
- Homepage: navbar, hero (featured event), upcoming events slider, category
  filters, CTA, footer
- `/login`, `/signup` — validated forms wired to the API
- `/events` — search with loading/empty/error states
- `/dashboard` — auth-guarded shell with sidebar
  - **My events** — create/edit/delete events, manage participants
    (approve / reject / ban)
  - **Pending invitations** — accept (or pay & accept), decline
  - **My reviews** — edit/delete within the review window
  - **Settings** — update profile name

## Still to build
- Event details page with join/pay/request actions
- Admin moderation views (manage users, remove events)
