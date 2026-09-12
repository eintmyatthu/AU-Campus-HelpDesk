const { test, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const prisma = require("../config/prisma");
const { createTicket } = require("../controllers/ticketController");
const {
  diagnoseHostname,
  diagnoseNetworkTicket,
  extractHostname,
  normalizeHostname
} = require("../services/dnsDiagnosticService");

const originalFetch = global.fetch;
const originalKey = process.env.OPENAI_API_KEY;
const originalFindUser = prisma.user.findUnique;
const originalTransaction = prisma.$transaction;

afterEach(() => {
  global.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = originalKey;
  prisma.user.findUnique = originalFindUser;
  prisma.$transaction = originalTransaction;
});

test("extracts hostname from a network ticket", () => {
  assert.equal(extractHostname("Cannot access AU website", "www.au.edu is not opening."), "www.au.edu");
});

test("normalizes an HTTPS URL to its hostname", () => {
  assert.equal(normalizeHostname("https://www.au.edu/"), "www.au.edu");
});

test("extracts a subdomain", () => {
  assert.equal(extractHostname("Problem", "portal.au.edu is unavailable."), "portal.au.edu");
});

test("skips a network ticket without a hostname", async () => {
  global.fetch = () => assert.fail("DNS API must not be called");
  assert.deepEqual(
    await diagnoseNetworkTicket({ category: "NETWORK", title: "WiFi", description: "AU WiFi keeps disconnecting." }),
    { performed: false, reason: "no_hostname" }
  );
});

test("skips non-network tickets", async () => {
  global.fetch = () => assert.fail("DNS API must not be called");
  assert.deepEqual(
    await diagnoseNetworkTicket({ category: "PRINTER", title: "Printer", description: "Printer is jammed at printer.au.edu." }),
    { performed: false, reason: "not_network_ticket" }
  );
});

test("distinguishes no A records from successful resolution", async () => {
  global.fetch = async () => ({ ok: true, json: async () => ({ Status: 0, Answer: [{ type: 5, data: "alias.example.edu." }] }) });
  const result = await diagnoseHostname("www.au.edu");
  assert.equal(result.resolved, false);
  assert.equal(result.outcome, "no_a_records");
  assert.deepEqual(result.addresses, []);
});

test("uses only the fixed Google endpoint and returns normalized A records", async () => {
  global.fetch = async (url) => {
    assert.equal(url.origin, "https://dns.google");
    assert.equal(url.pathname, "/resolve");
    assert.equal(url.searchParams.get("name"), "www.au.edu");
    assert.equal(url.searchParams.get("type"), "A");
    return { ok: true, json: async () => ({ Status: 0, Answer: [
      { type: 1, data: "192.0.2.1" }, { type: 1, data: "192.0.2.1" }, { type: 28, data: "2001:db8::1" }
    ] }) };
  };
  const result = await diagnoseHostname("www.au.edu");
  assert.equal(result.resolved, true);
  assert.equal(result.outcome, "resolved");
  assert.deepEqual(result.addresses, ["192.0.2.1"]);
});

test("returns an optional failure result on timeout", async () => {
  global.fetch = async () => new Promise(() => {});
  const result = await diagnoseHostname("www.au.edu", { timeoutMs: 10 });
  assert.equal(result.resolved, false);
  assert.equal(result.outcome, "unavailable");
  assert.equal(result.reason, "timeout");
});

test("the timeout also covers reading the provider response", async () => {
  global.fetch = async () => ({ ok: true, json: async () => new Promise(() => {}) });
  const result = await diagnoseHostname("www.au.edu", { timeoutMs: 10 });
  assert.equal(result.resolved, false);
  assert.equal(result.reason, "timeout");
});

test("ticket creation survives a Google DNS failure", async () => {
  process.env.OPENAI_API_KEY = "test-key";
  global.fetch = async (url) => {
    if (String(url).includes("api.openai.com")) {
      return { ok: true, json: async () => ({ choices: [{
        finish_reason: "stop",
        message: { content: JSON.stringify({ category: "NETWORK", priority: "MEDIUM" }) }
      }] }) };
    }
    throw new Error("Google DNS unavailable");
  };
  prisma.user.findUnique = async () => ({ id: 1, role: "STUDENT", isActive: true });
  prisma.$transaction = async (fn) => fn({
    ticketSequence: { upsert: async () => ({ lastNumber: 1 }) },
    ticket: {
      create: async ({ data }) => ({ id: 1, ...data }),
      findUnique: async () => ({ id: 1, category: "NETWORK", priority: "MEDIUM" })
    },
    ticketHistory: { create: async () => ({}) }
  });
  const res = {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
  };
  await createTicket({ body: {
    title: "Cannot access AU website",
    description: "www.au.edu is not opening.",
    reporterId: 1
  } }, res);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.category, "NETWORK");
  assert.equal(res.body.dnsDiagnostic.performed, true);
  assert.equal(res.body.dnsDiagnostic.outcome, "unavailable");
});
