// Opt-in: sends only these synthetic examples to OpenAI and may incur API charges.
require('dotenv').config({ quiet: true });
const assert = require('node:assert/strict');
const { Priority } = require('@prisma/client');
const { categorizeTicket } = require('../services/aiCategorizationService');
const examples = [
  ['Cannot connect to WiFi', 'I cannot connect to AU WiFi in Room 402.', 'NETWORK'],
  ['VS Code crashes', 'VS Code closes every time I open my project.', 'SOFTWARE'],
  ['Computer does not turn on', 'The desktop has no power and no lights.', 'HARDWARE'],
  ['Account Cannot Login', 'I cannot login to my university account.', 'ACCOUNT_ACCESS'],
  ['Projector not working', 'The projector in Room 402 does not display anything.', 'CLASSROOM_EQUIPMENT'],
  ['Printer jam', 'The office printer has a paper jam and cannot print.', 'PRINTER'],
  ['Something is wrong', "I don't know what happened.", 'OTHER']
];
async function main() {
  assert.ok(
    process.env.OPENAI_API_KEY?.trim(),
    'OPENAI_API_KEY is missing from backend/.env. Set it before running the live evaluation.'
  );
  let failures = 0;
  for (const [title, description, category] of examples) {
    const result = await categorizeTicket(title, description);
    const passed = result.category === category && Object.values(Priority).includes(result.priority) && result.priority !== 'URGENT';
    console.log(`${passed ? 'PASS' : 'FAIL'} ${title}: ${result.category} / ${result.priority} (expected ${category}, non-URGENT)`);
    if (!passed) failures++;
  }
  if (failures) process.exitCode = 1;
}
main().catch((error) => {
  console.error(error?.message || 'Live evaluation could not run. Check backend AI configuration.');
  process.exitCode = 1;
});
