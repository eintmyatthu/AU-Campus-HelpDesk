const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { Category, Priority } = require('@prisma/client');
const { categorizeTicket, normalizeClassification } = require('../services/aiCategorizationService');
const prisma = require('../config/prisma');
const { createTicket, updateTicket } = require('../controllers/ticketController');

const originalFetch = global.fetch;
const originalWarn = console.warn;
const originalEnv = { ...process.env };
const originals = { findUser: prisma.user.findUnique, transaction: prisma.$transaction, findTicket: prisma.ticket.findUnique };
afterEach(() => {
  global.fetch = originalFetch;
  console.warn = originalWarn;
  for (const key of ['OPENAI_API_KEY', 'OPENAI_MODEL', 'AI_TIMEOUT_MS']) {
    if (originalEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[key];
  }
  prisma.user.findUnique = originals.findUser;
  prisma.$transaction = originals.transaction;
  prisma.ticket.findUnique = originals.findTicket;
});
const fallback = { category: 'OTHER', priority: 'MEDIUM' };
function setup(fetchImpl) {
  process.env.OPENAI_API_KEY = 'test-secret-never-log';
  global.fetch = fetchImpl;
  const logs = [];
  console.warn = (...args) => logs.push(args.join(' '));
  return logs;
}
function response(value) {
  return { ok: true, json: async () => ({ choices: [{ finish_reason: 'stop', message: { content: JSON.stringify(value) } }] }) };
}
function database() {
  let saved;
  const history = [];
  prisma.user.findUnique = async () => ({ id: 1, role: 'STUDENT', isActive: true });
  prisma.$transaction = async (fn) => fn({
    ticketSequence: { upsert: async () => ({ lastNumber: 1 }) },
    ticket: {
      create: async ({ data }) => (saved = { id: 10, ...data }),
      update: async ({ data }) => (saved = { id: 10, ...data }),
      findUnique: async () => ({ ...saved, history })
    },
    ticketHistory: { create: async ({ data }) => history.push(data) }
  });
  return history;
}
function res() {
  return { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } };
}
const examples = [
  ['Cannot connect to WiFi', 'I cannot connect to AU WiFi in Room 402.', 'NETWORK'],
  ['VS Code crashes', 'VS Code closes every time I open my project.', 'SOFTWARE'],
  ['Computer does not turn on', 'The desktop has no power and no lights.', 'HARDWARE'],
  ['Account Cannot Login', 'I cannot login to my university account.', 'ACCOUNT_ACCESS'],
  ['Projector not working', 'The projector in Room 402 does not display anything.', 'CLASSROOM_EQUIPMENT'],
  ['Printer jam', 'The office printer has a paper jam and cannot print.', 'PRINTER'],
  ['Something is wrong', "I don't know what happened.", 'OTHER']
];
// These are provider-contract tests, not evidence of live model accuracy.
for (const [title, description, category] of examples) {
  test(`creation persists mocked classification: ${category}`, async () => {
    let called = false;
    setup(async (url, options) => {
      called = true;
      assert.equal(url, 'https://api.openai.com/v1/chat/completions');
      const request = JSON.parse(options.body);
      assert.deepEqual(JSON.parse(request.messages[1].content), { title, description });
      assert.deepEqual(request.response_format.json_schema.schema.properties.category.enum, Object.values(Category));
      assert.deepEqual(request.response_format.json_schema.schema.properties.priority.enum, Object.values(Priority));
      return response({ category: category.toLowerCase(), priority: ' medium ' });
    });
    const history = database();
    const result = res();
    await createTicket({ body: { title, description, reporterId: 1, roomNumber: '402', category: 'PRINTER', priority: 'URGENT' } }, result);
    assert.equal(called, true);
    assert.equal(result.statusCode, 201);
    assert.equal(result.body.category, category);
    assert.equal(result.body.priority, 'MEDIUM');
    assert.equal(result.body.status, 'OPEN');
    assert.equal(history[0].action, 'TICKET_CREATED');
  });
}

test('normalization validates fields independently against Prisma enums', () => {
  assert.deepEqual(normalizeClassification({ category: 'WIFI_PROBLEM', priority: 'high' }), { category: 'OTHER', priority: 'HIGH' });
  assert.deepEqual(normalizeClassification({ category: ' network ', priority: 'EMERGENCY' }), { category: 'NETWORK', priority: 'MEDIUM' });
  for (const value of [null, [], {}, 'NETWORK', { category: {}, priority: 5 }]) assert.deepEqual(normalizeClassification(value), fallback);
  for (const priority of Object.values(Priority)) assert.equal(normalizeClassification({ priority }).priority, priority);
});

const failures = {
  'missing API key': () => { delete process.env.OPENAI_API_KEY; throw new Error('fetch must not run'); },
  'invalid credentials': async () => ({ ok: false, status: 401 }),
  'provider 500': async () => ({ ok: false, status: 500 }),
  'rate limit': async () => ({ ok: false, status: 429 }),
  'network unavailable': async () => { throw new Error('test-secret-never-log provider internals'); },
  'malformed response JSON': async () => ({ ok: true, json: async () => { throw new SyntaxError('secret response'); } }),
  'malformed model JSON': async () => ({ ok: true, json: async () => ({ choices: [{ finish_reason: 'stop', message: { content: '{' } }] }) }),
  'refusal': async () => ({ ok: true, json: async () => ({ choices: [{ finish_reason: 'stop', message: { refusal: 'no' } }] }) }),
  'truncated output': async () => ({ ok: true, json: async () => ({ choices: [{ finish_reason: 'length', message: { content: '{}' } }] }) }),
  'timeout': async () => new Promise(() => {}),
  'response body timeout': async () => ({ ok: true, json: () => new Promise(() => {}) })
};
for (const [name, fetchImpl] of Object.entries(failures)) {
  test(`ticket creation survives ${name}`, async () => {
    const logs = setup(fetchImpl);
    if (name === 'missing API key') delete process.env.OPENAI_API_KEY;
    process.env.AI_TIMEOUT_MS = '15';
    database();
    const result = res();
    await createTicket({ body: { title: 'Problem', description: 'Details', reporterId: 1 } }, result);
    assert.equal(result.statusCode, 201);
    assert.equal(result.body.category, fallback.category);
    assert.equal(result.body.priority, fallback.priority);
    assert.equal(result.body.history[0].action, 'TICKET_CREATED');
    assert.ok(logs.length);
    assert.doesNotMatch(logs.join(' '), /test-secret-never-log|secret response/);
  });
}

test('timeout aborts provider request', async () => {
  let signal;
  setup(async (_, options) => { signal = options.signal; return new Promise(() => {}); });
  process.env.AI_TIMEOUT_MS = '10';
  assert.deepEqual(await categorizeTicket('test', 'test'), fallback);
  assert.equal(signal.aborted, true);
});

test('missing-key warning names the required backend variable', async () => {
  const logs = setup(() => assert.fail('fetch must not run'));
  delete process.env.OPENAI_API_KEY;
  assert.deepEqual(await categorizeTicket('test', 'test'), fallback);
  assert.match(logs.join(' '), /missing OPENAI_API_KEY; using OTHER\/MEDIUM/);
});

test('invalid input and inactive reporters never call AI or create a ticket', async () => {
  setup(() => assert.fail('AI must not run'));
  prisma.$transaction = () => assert.fail('transaction must not run');
  for (const body of [{ title: 123, description: 'x', reporterId: 1 }, { title: 'x', description: 'x', reporterId: 1, roomNumber: {} }]) {
    const result = res();
    await createTicket({ body }, result);
    assert.equal(result.statusCode, 400);
  }
  prisma.user.findUnique = async () => ({ isActive: false });
  const result = res();
  await createTicket({ body: { title: 'x', description: 'x', reporterId: 1 } }, result);
  assert.equal(result.statusCode, 404);
});

test('admin correction retains update history without rerunning AI', async () => {
  setup(() => assert.fail('AI must not run on updates'));
  database();
  prisma.user.findUnique = async () => ({ id: 1, role: 'ADMIN', isActive: true });
  prisma.ticket.findUnique = async () => ({ id: 10, status: 'OPEN' });
  const result = res();
  await updateTicket({ params: { id: '10' }, body: { changedById: 1, category: 'SOFTWARE', priority: 'LOW' } }, result);
  assert.equal(result.statusCode, 200);
  assert.equal(result.body.category, 'SOFTWARE');
  assert.equal(result.body.priority, 'LOW');
  assert.equal(result.body.history[0].action, 'TICKET_UPDATED');
});
