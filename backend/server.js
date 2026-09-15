require("dotenv").config();

const app = require("./app");
const prisma = require("./config/prisma");

const PORT = process.env.PORT || 3000;

async function startServer() {
  // Try to connect to PostgreSQL, but keep the process available so its health
  // endpoint can still explain that the API is running. Authentication and all
  // persisted HelpDesk features require a valid DATABASE_URL.
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL");
  } catch (error) {
    console.warn(
      "Starting WITHOUT a database connection:",
      error.message
    );
    console.warn("Set DATABASE_URL to enable authentication and persistence.");
  }

  app.listen(PORT, () => {
    console.log(`HelpDesk server running on port ${PORT}`);
  });
}

startServer();
