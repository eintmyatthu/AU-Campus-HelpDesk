# Automatic ticket categorization

The existing `POST /helpdesk/api/tickets` accepts `title`, `description`,
`roomNumber` and `reporterId`. Previously it always saved OTHER/MEDIUM. The Student
form's old category/priority selectors were never included in the API request.
They are now replaced with explanatory text; the layout, submit spinner, success
screen and backend-to-UI enum mappings remain intact.

Creation validates input and the active reporter, calls `categorizeTicket(title,
description)` before opening the Prisma transaction, then saves the normalized
classification with the ticket. It still generates the ticket number and creates
TICKET_CREATED history atomically. Submitted category/priority fields are ignored,
as before. All users of this existing creation endpoint get automatic classification.

## Provider and configuration

Use Node 18+ for native fetch (verified locally on Node 24). In backend/.env set:

```dotenv
OPENAI_API_KEY=your_backend_key
OPENAI_MODEL=gpt-4o-mini
AI_TIMEOUT_MS=5000
```

Never put the key in frontend configuration or a VITE_ variable. No new npm
dependencies or Prisma schema changes are needed. Only title and description are
sent to OpenAI. Provider code is isolated in services/aiCategorizationService.js.
The implementation uses [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
with a strict JSON schema plus independent local validation.

Allowed values are loaded from the generated Prisma Category and Priority enums:

- Category: HARDWARE, SOFTWARE, NETWORK, ACCOUNT_ACCESS, CLASSROOM_EQUIPMENT, PRINTER, OTHER.
- Priority: LOW, MEDIUM, HIGH, URGENT.

Strings are trimmed and uppercased. Invalid category becomes OTHER; invalid
priority becomes MEDIUM independently. Missing credentials, HTTP errors, timeouts,
refusals, truncated responses and malformed JSON return OTHER/MEDIUM. Backend logs
contain only a fixed failure reason or HTTP status, never raw provider errors or
keys. The deadline covers fetching and reading the response, defaults to 5 seconds,
is capped at 15 seconds, and aborts the request. No retries delay submission.
AI failure does not prevent creation; database failures still can.

## Corrections and history

The existing PATCH /helpdesk/api/tickets/:id still accepts category and priority
with changedById. Existing policy permits active ADMIN users to correct them;
technicians remain subject to the existing admin-only classification policy.
This task does not broaden role permissions. TICKET_UPDATED history is preserved.
The current schema stores status transitions and an update action, not old/new
category or priority values. There is no category-specific audit migration.
The Admin page already offers priority editing; category correction is available
through the existing PATCH API.

## Verification and exact manual steps

1. Run `npm test --prefix backend` from the repository root. The automated suite
   mocks OpenAI and Prisma: it tests the seven example contracts, normalization,
   failure fallback through the controller, history, and admin correction. It does
   not measure live model classification accuracy or real PostgreSQL persistence.
2. Configure the existing backend DATABASE_URL and a working PostgreSQL database
   with the project's schema and active Student/Admin users. Use the project's
   existing setup if needed. Set the AI variables above in backend/.env.
3. Start the backend with `npm run dev --prefix backend` and the frontend with
   `npm run dev --prefix frontend`. Open the URL printed by Vite and sign in as a
   Student backed by an active database user.
4. In New ticket, submit each title and description below, optionally Room 402.
   Confirm the submit button remains in its loading state until completion, the
   request is a single POST /helpdesk/api/tickets, and the response is HTTP 201.
   View My tickets and the Admin/Technician views to confirm saved classifications.

| Title | Description | Expected category |
| --- | --- | --- |
| Cannot connect to WiFi | I cannot connect to AU WiFi in Room 402. | NETWORK |
| VS Code crashes | VS Code closes every time I open my project. | SOFTWARE |
| Computer does not turn on | The desktop has no power and no lights. | HARDWARE |
| Account Cannot Login | I cannot login to my university account. | ACCOUNT_ACCESS |
| Projector not working | The projector in Room 402 does not display anything. | CLASSROOM_EQUIPMENT |
| Printer jam | The office printer has a paper jam and cannot print. | PRINTER |
| Something is wrong | I don't know what happened. | OTHER |

Priority should be conservative: typically MEDIUM, or HIGH for blocking work or
class. These examples do not establish campus-wide impact warranting URGENT.

5. Optionally evaluate these synthetic examples directly against the real model:
   run `node tests/aiCategorization.live.js` **from backend/**. This makes seven
   provider calls and may incur API charges. It prints expected/actual categories
   and flags URGENT for these examples. This is separate from the offline suite.
6. Clear OPENAI_API_KEY, restart the backend, then submit a Wi-Fi ticket. Confirm
   HTTP 201, OTHER/MEDIUM and TICKET_CREATED history. Repeat with
   OPENAI_API_KEY=invalid-test-key and restart. Expect the same successful fallback
   and a sanitized warning. Restore the real key afterward.
7. With actual ticket/admin IDs, correct the ticket using the existing API:

```sh
curl -X PATCH http://localhost:3000/helpdesk/api/tickets/TICKET_ID \
  -H 'Content-Type: application/json' \
  -d '{"category":"SOFTWARE","priority":"LOW","changedById":ADMIN_ID}'
```

Replace TICKET_ID and ADMIN_ID with numeric database IDs before running. Confirm
HTTP 200, SOFTWARE/LOW on refresh and a TICKET_UPDATED entry from
GET /helpdesk/api/tickets/TICKET_ID/history. Invalid enum values should return 400.

Live provider accuracy and PostgreSQL persistence must be checked in a configured
runtime; offline tests do not establish either. Existing user identity/role checks
still rely on the project's current request-ID workflow; authentication changes
are outside this task. No commits, pushes, deployment or Entra changes are included.
