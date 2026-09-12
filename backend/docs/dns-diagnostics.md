# Google Public DNS diagnostics

When a new ticket is categorized as `NETWORK`, the backend extracts a validated
hostname from its title and description. If one is present, it queries the fixed
Google Public DNS JSON endpoint for A records. Other ticket categories and network
tickets without a hostname skip the request.

The normalized diagnostic is included in the creation response. Admin ticket
details and Technician Assignments can request a fresh diagnostic from:

```text
GET /helpdesk/api/tickets/:id/dns-diagnostic
```

The endpoint reads the stored ticket before deciding whether to contact Google.
It never accepts a caller-supplied URL. A timeout, HTTP error, malformed response,
DNS error, or empty A-record answer returns an unavailable/unsuccessful diagnostic
without preventing ticket creation.

No database migration is required. Diagnostics are intentionally calculated on
demand instead of being stored as user comments or ticket history.

Run offline tests with `npm test` from `backend/`. Run the optional live lookup:

```sh
node tests/dnsDiagnostic.live.js
```
