const prisma = require("../config/prisma");

const ROLES = ["STUDENT", "FACULTY", "TECHNICIAN", "ADMIN"];

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// Strip nothing sensitive here since these are just demo records, but keep the
// same public shape the frontend expects.
function toPublic(user) {
  if (!user) return null;
  const { id, name, email, role, department, isActive } = user;
  return { id, name, email, role, department, isActive };
}

/**
 * Development login.
 * Resolves an active in-memory user either by explicit email or by role
 * (matching the "Login as Student / Admin / Technician" buttons).
 */
async function devLogin(req, res) {
  const { email, role } = req.body || {};

  if (!email && !role) {
    return res.status(400).json({ error: "An email or role is required to sign in." });
  }
  if (role && !ROLES.includes(role)) {
    return res.status(400).json({ error: "Invalid role." });
  }

  const user = email
    ? await prisma.user.findUnique({ where: { email: String(email).trim().toLowerCase() } })
    : await prisma.user.findFirst({ where: { role, isActive: true }, orderBy: { id: "asc" } });

  if (!user) return res.status(404).json({ error: "No matching active account was found." });
  if (!user.isActive) return res.status(403).json({ error: "This account is inactive." });

  return res.json({ user: toPublic(user) });
}

async function getUserById(req, res) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid user id." });

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ error: "User not found." });
  return res.json(toPublic(user));
}

async function getUsers(req, res) {
  const { role } = req.query;
  if (role && !ROLES.includes(role)) {
    return res.status(400).json({ error: "Invalid role filter." });
  }

  const users = (await prisma.user.findMany({
    where: role ? { role } : undefined,
    orderBy: { name: "asc" }
  })).map(toPublic);

  return res.json(users);
}

module.exports = { devLogin, getUserById, getUsers };
