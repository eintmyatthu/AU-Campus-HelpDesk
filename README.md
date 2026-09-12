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
frontend, set `VITE_API_URL` to the API base URL.

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

Open the app, then sign in with an AU Microsoft account or use the
**Development Preview** buttons (Login as Student / Admin / Technician).
Route guards enforce role access: students cannot open `/admin` or
`/technician`, and vice versa.

## Microsoft Entra ID authentication

1. In Microsoft Entra admin center, create a **single-tenant** app registration.
2. Under **Authentication**, add a Single-page application redirect URI:
   `http://localhost:5173` (and the deployed frontend origin in production).
3. Copy the app's **Application (client) ID** and **Directory (tenant) ID**.
4. Add them to `backend/.env`:

   ```dotenv
   MICROSOFT_TENANT_ID="your-directory-tenant-id"
   MICROSOFT_CLIENT_ID="your-application-client-id"
   MICROSOFT_ALLOWED_DOMAIN="au.edu"
   ```

5. Add the same public identifiers to `frontend/.env`:

   ```dotenv
   VITE_MICROSOFT_TENANT_ID="your-directory-tenant-id"
   VITE_MICROSOFT_CLIENT_ID="your-application-client-id"
   ```

Restart both development servers after changing the environment files. No
client secret is used or needed by this SPA flow.

The backend verifies Microsoft's token signature, audience, issuer, and AU
tenant before accepting it. It also requires the account name to end in
`@au.edu`. A first-time AU user is created as a `STUDENT`; existing users keep
their assigned database role. Use the admin/database workflow to promote a
user to `FACULTY`, `TECHNICIAN`, or `ADMIN`.

### Development preview

The local preview login remains available for development:

- `POST /helpdesk/api/users/login` with `{ role }` or `{ email }` returns the
  matching active seeded user record.
- `POST /helpdesk/api/users/login/microsoft` with `{ idToken }` verifies and
  signs in an AU Entra account.
- The frontend `AuthContext` persists that user and exposes `useAuth()`.
- `RequireRole` guards each route by role.

## API overview

Base path: `/helpdesk/api`

- `GET  /health`
- `POST /users/login`            — dev login by role or email
- `POST /users/login/microsoft`  — verified Microsoft Entra ID login
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
