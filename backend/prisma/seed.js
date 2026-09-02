const { PrismaClient, Role } = require("@prisma/client");

const prisma = new PrismaClient();

const developmentUsers = [
  { name: "Test Student", email: "student@test.local", role: Role.STUDENT },
  { name: "Test Technician", email: "technician@test.local", role: Role.TECHNICIAN },
  { name: "Test Admin", email: "admin@test.local", role: Role.ADMIN }
];

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Development seed must not run in production.");
  }

  for (const user of developmentUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user
    });
  }

  console.log("Development users are ready.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
