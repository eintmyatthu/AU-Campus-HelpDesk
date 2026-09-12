// Optional live check against Google Public DNS. It does not use credentials.
const assert = require("node:assert/strict");
const { diagnoseHostname } = require("../services/dnsDiagnosticService");

async function main() {
  const result = await diagnoseHostname("www.au.edu");
  console.log(JSON.stringify(result, null, 2));
  assert.equal(result.provider, "Google Public DNS");
  assert.equal(result.hostname, "www.au.edu");
  assert.equal(result.resolved, true, `DNS lookup did not resolve: ${result.outcome}`);
}

main().catch((error) => {
  console.error(error.message || "Google DNS live test failed.");
  process.exitCode = 1;
});
