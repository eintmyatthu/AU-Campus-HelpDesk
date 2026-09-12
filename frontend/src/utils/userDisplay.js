export function getUserInitials(user) {
  const parts = String(user?.name || "Student")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "ST";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts.at(-1)[0]}`.toUpperCase();
}

export function getUserRoleLabel(user) {
  const role = String(user?.role || "STUDENT").toLowerCase();
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function getUserFirstName(user) {
  return String(user?.name || "Student").trim().split(/\s+/)[0];
}
