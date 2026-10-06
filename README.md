# VIT Stellar — Club Website

React 19 + Vite single-page site for VIT Stellar (Astronomy Club, VIT Vellore).
Forms (merchandise, board application, team registration, feedback, certificates) talk to Supabase.

## Getting started

```bash
npm install
cp .env.example .env      # then fill in your Supabase URL + anon key
npm run dev               # http://localhost:3000
npm run build             # production build -> dist/
npm run lint              # oxlint
```

Database setup (tables, RLS policies, storage): see `supabase/setup.sql`.

## Project structure

```
src/
├─ main.jsx, App.jsx        entry + router
├─ pages/                   LandingPage (composes all sections)
├─ features/                one .jsx file per page section (Hero, AboutUs, Fame, Team, Fest, ...)
├─ components/
│  ├─ layout/               Header, Footer (+ their .css), StarField
│  └─ ui/                   Icon, SelectDropdown, SocialIcon, ErrorBoundary
├─ hooks/                   useCountdown, useNow
├─ content/                 page text/data, one file per section
├─ config/                  deadlines.js, features.js, announcement.js
├─ lib/                     supabaseClient, dateUtils
└─ styles/                  index.css (base), main.css (section styles)
supabase/setup.sql          database schema + policies
```

Imports use the `@/` alias for `src/` (e.g. `import Icon from '@/components/ui/Icon'`).

## Common edits

| I want to…                                   | Edit                                   |
|----------------------------------------------|----------------------------------------|
| Change page text, team, events, FAQ          | `src/content/<section>.js`             |
| Change a form open/close date                | `src/config/deadlines.js` **and** the time-lock policies in `supabase/setup.sql` |
| Change the header announcement capsule       | `src/config/announcement.js`           |
| Show/hide Board Application / Domain Selection / fest sponsor / fest POCs | `src/config/features.js` |
| Add images/PDFs                              | `public/assets/...`                    |

> The database enforces form deadlines (RLS policies use `now()`); `deadlines.js` only controls what the UI shows.
> Keep both in sync.