require("dotenv").config();

const app = require("./app");
const prisma = require("./config/prisma");

const PORT = process.env.PORT || 3000;

async function startServer() {
  // Try to connect to PostgreSQL, but do NOT block startup if it fails.
  // Development sign-in uses an in-memory user store, so the app is usable
  // without a database. Ticket persistence still requires a valid
  // DATABASE_URL — those write endpoints will error until one is configured.
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL");
  } catch (error) {
    console.warn(
      "Starting WITHOUT a database connection:",
      error.message
    );
    console.warn(
      "Sign-in works via the in-memory dev users. Set DATABASE_URL to enable ticket persistence."
    );
  }

  app.listen(PORT, () => {
    console.log(`HelpDesk server running on port ${PORT}`);
  });
}

startServer();
