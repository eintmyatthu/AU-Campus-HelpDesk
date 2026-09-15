const { PrismaClient, Role } = require("@prisma/client");
const { hashPassword } = require("../services/passwordService");

const prisma = new PrismaClient();

const developmentUsers = [
  {
    name: "Test Student",
    email: "student@test.local",
    role: Role.STUDENT,
    password: "AUStudent!2026",
  },
  {
    name: "Test Technician 1",
    email: "technician1@test.local",
    role: Role.TECHNICIAN,
    password: "AUTech01!N7qP2026",
  },
  {
    name: "Test Technician 2",
    email: "technician2@test.local",
    role: Role.TECHNICIAN,
    password: "AUTech02!V9kR2026",
  },
  {
    name: "Test Technician 3",
    email: "technician3@test.local",
    role: Role.TECHNICIAN,
    password: "AUTech03!M4xT2026",
  },
  {
    name: "Test Technician 4",
    email: "technician4@test.local",
    role: Role.TECHNICIAN,
    password: "AUTech04!B8wL2026",
  },
  {
    name: "Test Admin 1",
    email: "admin1@test.local",
    role: Role.ADMIN,
    password: "AUAdmin01!X4mR2026",
  },
  {
    name: "Test Admin 2",
    email: "admin2@test.local",
    role: Role.ADMIN,
    password: "AUAdmin02!K9vD2026",
  },
];

async function main() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_DEVELOPMENT_SEED !== "true"
  ) {
    throw new Error(
      "Development seed must not run in production without ALLOW_DEVELOPMENT_SEED=true."
    );
  }

  for (const { password, ...user } of developmentUsers) {
    const passwordHash = await hashPassword(password);
    await prisma.user.upsert({
      where: { email: user.email },
      update: { ...user, passwordHash, isActive: true },
      create: { ...user, passwordHash },
    });
  }

  console.log("Development student, technician, and admin logins are ready.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
