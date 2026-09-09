# AU Campus HelpDesk

Campus IT service desk with a React (Vite) frontend and an Express + Prisma
(PostgreSQL) backend. Students report tickets, technicians work a queue, and
admins oversee tickets, users, and configuration.

## Architecture

- **frontend/** — React + Vite SPA. Roles: Student, Technician, Admin.
- **backend/** — Express API at `/helpdesk/api`, Prisma ORM, PostgreSQL.

The frontend talks to the backend through same-origin relative URLs
(`/helpdesk/api/...`). In development, Vite proxies `/helpdesk` to
`http://localhost:3000` (see `frontend/vite.config.js`). For a deployed
frontend, set `VITE_API_BASE_URL` to the API origin.

## Prerequisites

- Node.js 18+
- A PostgreSQL database

## Backend setup

```bash
cd backend
npm install
cp .env.example .env          # set DATABASE_URL and PORT
npx prisma migrate dev        # create the schema
npm run seed                  # create the three dev users
npm run dev                   # starts on http://localhost:3000
```

### Seeded development users

| Role       | Email                    |
| ---------- | ------------------------ |
| Student    | student@test.local       |
| Technician | technician@test.local    |
| Admin      | admin@test.local         |

## Frontend setup

```bash
cd frontend
npm install
npm run dev                   # starts on http://localhost:5173
```

Open the app, then use the **Development Preview** buttons on the login
screen (Login as Student / Admin / Technician). Each button calls the
backend dev-login endpoint, which resolves the matching seeded user and
stores the session in `localStorage`. Route guards enforce role access:
students cannot open `/admin` or `/technician`, and vice versa.

## Authentication (development)

Real Microsoft Entra ID (Azure AD) sign-in is not yet wired. The current
flow is a development stand-in:

- `POST /helpdesk/api/users/login` with `{ role }` or `{ email }` returns the
  matching active user record (no signed token yet).
- The frontend `AuthContext` persists that user and exposes `useAuth()`.
- `RequireRole` guards each route by role.

When integrating Entra ID, replace the dev-login call with the OAuth flow
and issue/verify a real token; the `microsoftId` field already exists on the
`User` model.

## API overview

Base path: `/helpdesk/api`

- `GET  /health`
- `POST /users/login`            — dev login by role or email
- `GET  /users?role=TECHNICIAN`  — list users (optionally by role)
- `GET  /users/:id`
- `GET  /tickets`                — list all tickets
- `POST /tickets`                — create (requires `reporterId`)
- `GET  /tickets/:id`
- `PATCH /tickets/:id`           — update title/description/category/priority
- `POST /tickets/:id/claim`      — technician claims a ticket
- `PATCH /tickets/:id/status`    — status transition (state machine enforced)
- `POST /tickets/:id/resolve`
- `GET/POST /tickets/:id/comments`
- `GET  /tickets/:id/history`

### Ticket lifecycle

The backend enforces status transitions:

```
OPEN -> CLAIMED -> IN_PROGRESS -> RESOLVED -> CLOSED/REOPENED
```

The frontend uses friendly labels (e.g. "In progress"); the mapping to
backend enums lives in `frontend/src/api/mappers.js`.

## Scripts

Frontend: `npm run dev`, `npm run build`, `npm run lint`
Backend: `npm run dev`, `npm start`, `npm run seed`
