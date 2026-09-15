const { test } = require("node:test");
const assert = require("node:assert/strict");
const { hashPassword, verifyPassword } = require("../services/passwordService");

test("password hashes verify only the original password", async () => {
  const hash = await hashPassword("AUStudent!2026");
  assert.notEqual(hash, "AUStudent!2026");
  assert.equal(await verifyPassword("AUStudent!2026", hash), true);
  assert.equal(await verifyPassword("wrong-password", hash), false);
});

test("malformed or missing hashes fail closed", async () => {
  assert.equal(await verifyPassword("AUStudent!2026", null), false);
  assert.equal(await verifyPassword("AUStudent!2026", "not-a-hash"), false);
});
