# Automatic ticket categorization

New tickets are categorized in the Express backend. `createTicket` validates the
request and active reporter, calls `categorizeTicket(title, description)`, and
stores the validated category and priority through Prisma. Existing tickets are
not reclassified.

The service uses Node's built-in `fetch` to call OpenAI Chat Completions with a
strict JSON schema. It loads allowed values from Prisma's generated `Category`
and `Priority` enums. Returned strings are trimmed and uppercased; invalid
categories become `OTHER`, and invalid priorities become `MEDIUM`.

Configure these values only in `backend/.env`:

```dotenv
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
AI_TIMEOUT_MS=5000
```

Never place the key in frontend configuration or a `VITE_` variable. Missing
credentials, HTTP errors, timeouts, refusals, incomplete responses, and malformed
JSON produce a sanitized backend warning and return `OTHER` / `MEDIUM`, allowing
ticket creation to continue.

Run the offline suite from the repository root:

```sh
npm test --prefix backend
```

After manually setting a valid key, run the live seven-example evaluation:

```sh
cd backend
node tests/aiCategorization.live.js
```

To verify recent persisted classifications in PostgreSQL, run:

```sql
SELECT "ticketNumber", title, category, priority
FROM "Ticket"
ORDER BY id DESC
LIMIT 5;
```
