const prisma = require("../config/prisma");

const ROLES = ["STUDENT", "FACULTY", "TECHNICIAN", "ADMIN"];

const publicUser = {
  id: true,
  name: true,
  email: true,
  role: true,
  department: true,
  isActive: true,
};

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function sendServerError(res, error, message) {
  console.error(error);
  return res.status(500).json({ error: message });
}

/**
 * Development login.
 * Resolves an active seed user either by explicit email or by role
 * (matching the "Login as Student / Admin / Technician" buttons).
 * This is a stand-in until Microsoft Entra ID is connected; it does
 * not issue a signed token, it simply returns the user record.
 */
async function devLogin(req, res) {
  const { email, role } = req.body || {};

  if (!email && !role) {
    return res.status(400).json({ error: "An email or role is required to sign in." });
  }
  if (role && !ROLES.includes(role)) {
    return res.status(400).json({ error: "Invalid role." });
  }

  try {
    let user = null;
    if (email) {
      user = await prisma.user.findUnique({ where: { email: String(email).trim().toLowerCase() }, select: publicUser });
    } else {
      // First active user with the requested role.
      user = await prisma.user.findFirst({ where: { role, isActive: true }, select: publicUser });
    }

    if (!user) return res.status(404).json({ error: "No matching active account was found." });
    if (!user.isActive) return res.status(403).json({ error: "This account is inactive." });

    return res.json({ user });
  } catch (error) {
    return sendServerError(res, error, "Unable to sign in.");
  }
}

async function getUserById(req, res) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid user id." });

  try {
    const user = await prisma.user.findUnique({ where: { id }, select: publicUser });
    if (!user) return res.status(404).json({ error: "User not found." });
    return res.json(user);
  } catch (error) {
    return sendServerError(res, error, "Unable to retrieve user.");
  }
}

async function getUsers(req, res) {
  const { role } = req.query;
  if (role && !ROLES.includes(role)) {
    return res.status(400).json({ error: "Invalid role filter." });
  }

  try {
    const users = await prisma.user.findMany({
      where: role ? { role } : undefined,
      select: publicUser,
      orderBy: { name: "asc" },
    });
    return res.json(users);
  } catch (error) {
    return sendServerError(res, error, "Unable to retrieve users.");
  }
}

module.exports = { devLogin, getUserById, getUsers };
