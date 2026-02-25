# Convene — Web

> Meeting management web application built with Next.js 15 and TypeScript.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)

---

## Overview

Convene is a clean, responsive meeting management dashboard that lets teams schedule, track, and join meetings from a single interface. The UI supports both **dark and light themes** and is fully responsive across desktop and mobile.

This project was built as a UI prototype / frontend showcase with a dummy data layer — the API routes and middleware are production-ready and wired to real backend endpoints.

---

## Features

- **Dashboard** — Today's meeting summary banner, upcoming meetings list, and live search
- **Calendar** — Month view with per-day meeting indicators and detail panel
- **Contacts** — Team directory grouped by department with expandable contact cards
- **Create Meeting** — Full form with Virtual/Physical toggle, date & time picker, participant picker (search from contacts), and agenda editor
- **Quick Add** — Streamlined 3-field meeting creation (title, date preset, duration)
- **Dark / Light mode** — System-aware theme with manual toggle in Settings
- **Auth guard** — Middleware that protects all routes via JWT cookie; redirects unauthenticated users to `/login`
- **Responsive layout** — Sidebar on desktop, bottom navigation on mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Date utilities | date-fns |
| Auth | JWT via httpOnly cookie |
| API proxy | Next.js Route Handlers |

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts      # Proxy to auth server, sets JWT cookie
│   │   │   ├── logout/route.ts     # Clears auth cookie
│   │   │   └── me/route.ts         # Decodes JWT, returns user info
│   │   └── users/route.ts          # Proxy to external user service (5-min cache)
│   ├── calendar/page.tsx           # Calendar view
│   ├── contacts/page.tsx           # Team directory
│   ├── login/page.tsx              # Login screen
│   ├── meetings/
│   │   ├── new/page.tsx            # Full meeting creation form
│   │   └── quick/page.tsx          # Quick add meeting
│   ├── settings/page.tsx           # Settings & theme toggle
│   ├── layout.tsx                  # Root layout & metadata
│   └── page.tsx                    # Home / dashboard
├── components/
│   ├── Avatar.tsx                  # Gravatar-style avatar with initials fallback
│   ├── BottomNav.tsx               # Mobile bottom navigation bar
│   ├── MeetingCard.tsx             # Meeting list item card
│   ├── ParticipantPicker.tsx       # Searchable contact picker with chip list
│   └── TodayBanner.tsx             # Today's schedule summary card
└── lib/
    ├── api.ts                      # meetingApi & userApi (currently using dummy data)
    ├── dummy.ts                    # Dummy data: user, contacts, meetings
    ├── theme.tsx                   # Dark/light/system theme context
    ├── use-user.ts                 # useUser hook
    └── utils.ts                   # Shared utilities
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd web

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Variables

```env
# Auth backend (JWT login endpoint)
AUTH_SERVER=https://your-auth-server.com

# Meeting API secret forwarded as Bearer token to internal API routes
MEETING_API_SECRET=your-secret-key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

---

## Architecture Notes

### Auth Flow
1. User submits login form → POST `/api/auth/login`
2. Next.js route handler proxies to external auth server
3. On success, JWT is stored as an **httpOnly cookie** (`auth_token`)
4. Middleware (`src/proxy.ts`) checks the cookie on every request and redirects unauthenticated users to `/login`
5. `/api/auth/me` decodes the JWT payload client-side for display (no sensitive data)

### Data Layer
Currently all meeting and user data comes from `src/lib/dummy.ts` via `src/lib/api.ts`. Each `meetingApi` method returns `Promise.resolve(DUMMY_DATA)` — swapping to real API calls requires only updating `src/lib/api.ts`.

The API routes (`/api/auth/*`, `/api/users`) are already connected to real backend services.

---

## Screenshots

> _Coming soon — add screenshots or a screen recording of the app here._

---

## Author

Built by **deenqtt**
# Convene-Web-Dashboard
