# AU Campus HelpDesk

AU Campus HelpDesk is a role-based IT service desk for Assumption University. Students and faculty can report and follow support requests, technicians can claim and resolve work, and administrators can oversee tickets, users, service configuration, reports, and audit activity.

The project is a React single-page application backed by an Express API, Prisma ORM, and PostgreSQL. It supports Microsoft Entra ID sign-in for university accounts and development preview accounts for local testing.

![AU Campus HelpDesk sign-in](docs/screenshots/01-login.jpg)

## Contents

- [Features](#features)
- [Application workflow](#application-workflow)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Technology stack](#technology-stack)
- [Project structure](#project-structure)
- [Local setup](#local-setup)
- [Microsoft Entra ID setup](#microsoft-entra-id-setup)
- [Environment variables](#environment-variables)
- [Database model](#database-model)
- [API reference](#api-reference)
- [Ticket lifecycle](#ticket-lifecycle)
- [Testing and quality checks](#testing-and-quality-checks)
- [Deployment](#deployment)
- [Current implementation notes](#current-implementation-notes)

## Features

### Student and faculty workspace

- Role-protected dashboard with the signed-in user's tickets and statistics
- Ticket submission with title, description, category, priority, and room number
- Personal ticket list with search, filtering, status, and priority information
- Ticket detail timeline, comments, and resolution information
- Searchable knowledge base and campus service-status pages
- Login-based profile with editable name and department
- Light, dark, and system appearance preferences

### Technician workspace

- Operations dashboard with queue and workload summaries
- Priority-first open queue
- Safe self-claiming of available tickets
- Personal assignments list
- Start-work and resolve actions with enforced status transitions
- Network diagnostic results for eligible network tickets
- Technician notifications, knowledge base, and campus status

### Administrator workspace

- Campus-wide dashboard and ticket overview
- Searchable ticket management and ticket detail pages
- Assign or unassign technicians
- Correct ticket category and priority
- Add comments and review ticket history
- User and role management interface
- Service setup, reports, CSV export, and audit-log interfaces

### Platform capabilities

- Microsoft Entra ID single-tenant sign-in with tenant and email-domain validation
- Development preview login for seeded Student, Technician, and Admin accounts
- Role-based frontend routing for `STUDENT`, `FACULTY`, `TECHNICIAN`, and `ADMIN`
- PostgreSQL persistence through Prisma
- Annual human-readable ticket numbers such as `IT-2026-000001`
- Deterministic server-side category and priority classification
- Optional Google Public DNS lookup when a network ticket contains a hostname
- Ticket comments and immutable history records

## Application workflow

```mermaid
flowchart LR
    A[Sign in] --> B{Account role}
    B -->|Student or Faculty| C[Submit support request]
    C --> D[Server classifies category and priority]
    D --> E[Open ticket enters queue]
    B -->|Technician| F[Review open queue]
    F --> G[Claim ticket]
    G --> H[Start work]
    H --> I[Resolve with a note]
    E --> F
    I --> J[Student reviews update]
    J --> K{Issue fixed?}
    K -->|Yes| L[Close ticket]
    K -->|No| M[Reopen ticket]
    M --> F
    B -->|Admin| N[Monitor and manage]
    N --> E
    N --> G
```

Typical end-to-end journey:

1. A user signs in with an AU Microsoft account or a development preview account.
2. The role guard sends the user to the appropriate workspace.
3. A student or faculty member submits a support request.
4. The backend validates the reporter, classifies the ticket, generates its ticket number, and writes the creation history.
5. A technician reviews the open queue and claims the ticket.
6. The technician starts work and resolves the issue with a resolution note.
7. Ticket status, comments, assignment, and history are visible to the relevant interfaces.
8. An administrator can monitor all tickets, assign technicians, correct classification, and review activity.

## Screenshots

### Student dashboard

The dashboard is based on the authenticated user and shows only tickets reported by that account.

![Student dashboard](docs/screenshots/02-student-dashboard.jpg)

### Submit a support request

Students and faculty provide the incident details and location from the protected ticket form.

![New ticket form](docs/screenshots/03-new-ticket.jpg)

### Technician queue

Technicians see unassigned work and can claim a ticket for themselves.

![Technician open queue](docs/screenshots/04-technician-queue.jpg)

### Administration overview

Administrators get a campus-wide view of system health, workload, recent tickets, and operational metrics.

![Administration overview](docs/screenshots/05-admin-dashboard.jpg)

## Architecture

```text
Browser
  │
  │ React context + fetch (/helpdesk/api)
  ▼
React 19 / Vite SPA
  │
  │ Vite proxy in development; Nginx proxy in production
  ▼
Express 5 API
  ├── Microsoft token verification (jose + Entra JWKS)
  ├── Ticket classification rules
  ├── Google Public DNS diagnostic
  └── Prisma Client
          │
          ▼
      PostgreSQL
```

The API base path is `/helpdesk/api`. During development, Vite proxies that path to `http://localhost:3000`. In production, the compiled frontend can use the same-origin path through Nginx, or `VITE_API_URL` can point to another API origin.

Frontend state is organized into three providers:

- `AuthProvider` stores the active user, persists the login in local storage, refreshes profile data, and exposes login/logout/profile actions.
- `TicketsProvider` loads tickets after sign-in and exposes ticket workflow actions.
- `ThemeProvider` manages light, dark, and system appearance preferences.

## Technology stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, React Router 7, Vite 8, Lucide React, CSS |
| Backend | Node.js, Express 5, CommonJS |
| Database | PostgreSQL, Prisma ORM 6 |
| Authentication | Microsoft Entra ID, MSAL Browser, `jose` token verification |
| Diagnostics | Google Public DNS JSON-over-HTTPS endpoint |
| Testing | Node.js built-in test runner, ESLint, Vite production build |
| Deployment | Nginx, PM2, Linux VM |

## Project structure

```text
AU-Campus-HelpDesk/
├── backend/
│   ├── config/                 # Prisma client configuration
│   ├── controllers/            # User, ticket, comment, and history handlers
│   ├── docs/                   # Feature-specific backend notes
│   ├── prisma/
│   │   ├── migrations/         # PostgreSQL schema migrations
│   │   ├── schema.prisma       # Application data model
│   │   └── seed.js             # Development accounts
│   ├── routes/                 # Express API routes
│   ├── services/               # Auth, classification, DNS, and numbering logic
│   ├── tests/                  # Automated backend tests
│   ├── app.js                  # Express application
│   └── server.js               # Environment loading and server startup
├── frontend/
│   ├── components/
│   │   ├── admin/              # Administrator pages and shell
│   │   ├── login/              # Sign-in page
│   │   ├── students/           # Student/faculty pages
│   │   └── technician/         # Technician pages
│   ├── public/                 # Static public assets and MSAL redirect page
│   └── src/
│       ├── api/                # API client and enum/UI mappers
│       ├── auth/               # Microsoft sign-in integration
│       ├── components/         # Shared components and route guard
│       ├── context/            # Auth, ticket, and theme state
│       ├── App.jsx             # Application routes
│       └── main.jsx            # React entry point and providers
├── docs/screenshots/           # README workflow screenshots
├── images/                     # Source image assets
├── README.md                   # Complete project documentation
└── VM_DEPLOYMENT.md            # Azure/Linux VM deployment runbook
```

## Local setup

### Prerequisites

- Node.js 18 or newer
- npm
- PostgreSQL with an empty database available
- A modern browser

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd AU-Campus-HelpDesk
npm --prefix backend install
npm --prefix frontend install
```

### 2. Configure the backend

```bash
cp backend/.env.example backend/.env
```

Set at least `DATABASE_URL` in `backend/.env`:

```dotenv
PORT=3000
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/helpdesk"
```

### 3. Create and seed the database

```bash
cd backend
npx prisma generate
npx prisma migrate dev
npm run seed
cd ..
```

The seed command is intentionally blocked when `NODE_ENV=production`.

### 4. Configure the frontend

```bash
cp frontend/.env.example frontend/.env
```

For local development, either keep the default same-origin `/helpdesk/api` path and use the Vite proxy, or explicitly set:

```dotenv
VITE_API_URL=http://localhost:3000/helpdesk/api
```

### 5. Run the application

Use two terminals.

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The API health endpoint is [http://localhost:3000/helpdesk/api/health](http://localhost:3000/helpdesk/api/health).

### Development preview accounts

| Role | Email |
| --- | --- |
| Student | `student@test.local` |
| Technician | `technician@test.local` |
| Admin | `admin@test.local` |

Use the role buttons on the login page. The corresponding database users must exist, so run the seed step first.

## Microsoft Entra ID setup

1. Create a single-tenant app registration in Microsoft Entra ID.
2. Under **Authentication**, add a **Single-page application** platform.
3. Add these development redirect URIs:

   ```text
   http://localhost:5173
   http://localhost:5173/redirect.html
   ```

4. Add the equivalent HTTPS redirect URI for production, including `/redirect.html`.
5. Copy the **Directory (tenant) ID** and **Application (client) ID** into both environment files.

Backend:

```dotenv
MICROSOFT_TENANT_ID="your-directory-tenant-id"
MICROSOFT_CLIENT_ID="your-application-client-id"
MICROSOFT_ALLOWED_DOMAIN="au.edu"
```

Frontend:

```dotenv
VITE_MICROSOFT_TENANT_ID="your-directory-tenant-id"
VITE_MICROSOFT_CLIENT_ID="your-application-client-id"
```

The frontend uses the authorization-code flow with PKCE through MSAL Browser. The backend verifies the ID token signature, issuer, audience, tenant ID, stable Microsoft user ID, and allowed email domain. No client secret is required for this SPA sign-in flow.

On first sign-in, a permitted Microsoft user is created with the `STUDENT` role. Existing users retain their database role. Ensure **Assignment required?** is configured according to the university's access policy in the corresponding Enterprise application.

## Environment variables

### Backend — `backend/.env`

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | No | Express port; defaults to `3000` |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma |
| `MICROSOFT_TENANT_ID` | For Microsoft login | Allowed Entra tenant |
| `MICROSOFT_CLIENT_ID` | For Microsoft login | Registered SPA application/client ID |
| `MICROSOFT_ALLOWED_DOMAIN` | No | Allowed email domain; defaults to `au.edu` |
| `OPENAI_API_KEY` | Experimental only | Used by the optional AI categorization service, which is not currently wired into ticket creation |
| `OPENAI_MODEL` | Experimental only | AI categorization model name |
| `AI_TIMEOUT_MS` | Experimental only | AI provider timeout, capped at 15 seconds |

`keyVaultService.js` also contains support for `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, and `AZURE_KEY_VAULT_NAME`, but that service is not part of the current server startup path.

### Frontend — `frontend/.env`

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | No | API base URL; defaults to `/helpdesk/api` |
| `VITE_MICROSOFT_TENANT_ID` | For Microsoft login | Entra tenant ID used by MSAL |
| `VITE_MICROSOFT_CLIENT_ID` | For Microsoft login | Entra SPA client ID used by MSAL |

Do not commit real credentials or secrets. Variables beginning with `VITE_` are exposed to browser code and must contain public configuration only.

## Database model

The Prisma schema defines:

- `User` — Microsoft identifier, name, email, department, role, and activation state
- `Ticket` — ticket number, request details, classification, status, reporter, technician, and resolution
- `TicketComment` — discussion entries linked to a user and ticket
- `TicketHistory` — auditable action and status-transition records
- `TicketSequence` — concurrency-safe annual ticket numbering

Roles:

```text
STUDENT | FACULTY | TECHNICIAN | ADMIN
```

Categories:

```text
HARDWARE | SOFTWARE | NETWORK | ACCOUNT_ACCESS |
CLASSROOM_EQUIPMENT | PRINTER | OTHER
```

Priorities:

```text
LOW | MEDIUM | HIGH | URGENT
```

## API reference

Base URL: `/helpdesk/api`

### Health

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | API health check |

### Authentication and users

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/users/login` | Development login using `{ role }` or `{ email }` |
| `POST` | `/users/login/microsoft` | Verify a Microsoft ID token and sign in |
| `GET` | `/users` | List users; optional `?role=TECHNICIAN` filter |
| `GET` | `/users/:id` | Get a public user profile |
| `PATCH` | `/users/:id` | Update an active user's name and department |

### Tickets

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/tickets` | List tickets with reporter, technician, comments, and history |
| `POST` | `/tickets` | Create a ticket for `reporterId` |
| `GET` | `/tickets/:id` | Get one ticket |
| `PATCH` | `/tickets/:id` | Update supported ticket fields and write history |
| `POST` | `/tickets/:id/claim` | Claim, assign, or unassign a ticket |
| `PATCH` | `/tickets/:id/status` | Apply an allowed status transition |
| `POST` | `/tickets/:id/resolve` | Resolve an assigned in-progress ticket with a note |
| `GET` | `/tickets/:id/dns-diagnostic` | Run the optional hostname diagnostic |
| `GET` | `/tickets/:id/comments` | List ticket comments |
| `POST` | `/tickets/:id/comments` | Add a ticket comment |
| `GET` | `/tickets/:id/history` | List ticket history entries |

## Ticket lifecycle

The backend enforces allowed transitions rather than accepting arbitrary status changes.

```text
OPEN ──► CLAIMED ──► IN_PROGRESS ──► RESOLVED ──► CLOSED
  │                                      │            │
  └──────────────► IN_PROGRESS           └──► REOPENED ◄──┘
                         REOPENED ──► CLAIMED or IN_PROGRESS
```

Additional workflow rules include:

- A technician can only claim an unassigned `OPEN` or `REOPENED` ticket for themselves.
- A technician can only change or resolve tickets assigned to that technician.
- Resolution requires an `IN_PROGRESS` ticket and a non-empty resolution note.
- Only an administrator can change ticket category or priority after creation.
- Assignment, updates, resolution, and status changes write `TicketHistory` records.

Backend enums are converted to user-friendly labels in `frontend/src/api/mappers.js`.

## Classification and DNS diagnostics

Ticket creation currently uses `ruleCategorizationService.js`. Weighted keywords select a category, while explicit impact terms select priority. Normal requests default to `MEDIUM`, and unclear categories default to `OTHER`.

For a ticket classified as `NETWORK`, the backend searches the title and description for a valid hostname. If found, it queries the fixed Google Public DNS endpoint for IPv4 records with a bounded timeout. A DNS provider failure does not prevent ticket creation.

An OpenAI-based classifier and associated tests are present in `aiCategorizationService.js`, but the active ticket controller does not currently import that service.

## Testing and quality checks

Run all current automated checks from the repository root:

```bash
npm --prefix backend test
npm --prefix frontend run lint
npm --prefix frontend run build
```

The backend test files cover classification normalization and failure handling, ticket-creation fallbacks, DNS hostname extraction and resolution, request timeouts, and ticket workflow behavior with mocked dependencies. See the test-alignment note below before treating the current suite as a green release gate.

Useful development scripts:

| Location | Command | Purpose |
| --- | --- | --- |
| `backend` | `npm run dev` | Start Express with Nodemon |
| `backend` | `npm start` | Start Express with Node |
| `backend` | `npm test` | Run backend tests |
| `backend` | `npm run db:generate` | Generate Prisma Client |
| `backend` | `npm run db:push` | Push schema directly to a development database |
| `backend` | `npm run seed` | Create development users |
| `frontend` | `npm run dev` | Start Vite development server |
| `frontend` | `npm run lint` | Run ESLint |
| `frontend` | `npm run build` | Produce the deployable frontend build |
| `frontend` | `npm run preview` | Preview the production frontend build |

## Deployment

The repository includes [`VM_DEPLOYMENT.md`](VM_DEPLOYMENT.md), which documents the current Linux VM workflow using:

- a Vite production build
- PM2 for the backend process
- Prisma migrations in deployment mode
- Nginx for static frontend hosting and `/helpdesk/api/` proxying
- Microsoft Entra production redirect configuration

The minimum Nginx API proxy is:

```nginx
location /helpdesk/api/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

After deployment, verify the API before testing the UI:

```bash
curl https://your-helpdesk-host/helpdesk/api/health
```

## Current implementation notes

This repository is an actively developed project. The following boundaries are important when extending or deploying it:

- PostgreSQL is required for login, profiles, and complete ticket functionality. Although the server can start after an unavailable database connection, the functional workflows still depend on Prisma-backed data.
- Frontend route guards improve navigation and user experience, but the API does not yet use a signed application session or bearer token for per-request identity. Several endpoints accept user IDs from request data. Add server-issued sessions or access-token authorization before treating the API as production-secure.
- The Admin Users, Reports, Service Setup, and Audit Logs interfaces contain client-side demonstration data. Ticket administration is backed by the API, but those supporting admin modules need persistence endpoints to become fully operational.
- Notification controls and some campus status/knowledge-base content are currently local UI state or static content.
- The OpenAI classifier is tested but inactive; deterministic classification is the current source of truth.
- The current ticket-controller tests still inject the OpenAI classifier, while `ticketController.js` now imports the deterministic rule classifier. At the time of this review, `npm --prefix backend test` reports 19 failures caused by that mismatch; the tests need to be updated to inject or assert the active classifier.
- The frontend production build currently emits a bundle-size warning above 500 kB. Route-level lazy loading is a suitable future optimization.

## License

No project license has been added yet. Add a `LICENSE` file before distributing or accepting external contributions.
