// In-memory development user store.
// Lets the app run (and sign in) with no database configured.
// These mirror the Prisma seed users; swap back to Prisma once a
// DATABASE_URL is set up.

const devUsers = [
  {
    id: 1,
    name: "Test Student",
    email: "student@test.local",
    department: "Information Technology",
    role: "STUDENT",
    isActive: true,
  },
  {
    id: 2,
    name: "Test Technician",
    email: "technician@test.local",
    department: "Campus IT",
    role: "TECHNICIAN",
    isActive: true,
  },
  {
    id: 3,
    name: "Test Admin",
    email: "admin@test.local",
    department: "Campus IT",
    role: "ADMIN",
    isActive: true,
  },
];

module.exports = { devUsers };
