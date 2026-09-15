const { randomBytes, scrypt: scryptCallback, timingSafeEqual } = require("node:crypto");
const { promisify } = require("node:util");

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

async function hashPassword(password) {
  if (typeof password !== "string" || password.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, KEY_LENGTH);
  return `scrypt$${salt}$${derivedKey.toString("hex")}`;
}

async function verifyPassword(password, storedHash) {
  if (typeof password !== "string" || typeof storedHash !== "string") return false;

  const [algorithm, salt, hashHex] = storedHash.split("$");
  if (algorithm !== "scrypt" || !salt || !hashHex) return false;

  try {
    const storedKey = Buffer.from(hashHex, "hex");
    if (storedKey.length !== KEY_LENGTH) return false;

    const suppliedKey = await scrypt(password, salt, storedKey.length);
    return timingSafeEqual(storedKey, suppliedKey);
  } catch {
    return false;
  }
}

module.exports = { hashPassword, verifyPassword };
