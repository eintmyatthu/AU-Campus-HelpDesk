// Translates between backend enum values (uppercase) and the friendly
// display labels the UI uses. Keeps a single source of truth so the
// frontend and backend contracts stay aligned.

export const STATUS_LABELS = {
  OPEN: "Open",
  CLAIMED: "Claimed",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
  REOPENED: "Reopened",
};

export const PRIORITY_LABELS = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

export const CATEGORY_LABELS = {
  HARDWARE: "Hardware",
  SOFTWARE: "Software",
  NETWORK: "Network",
  ACCOUNT_ACCESS: "Account access",
  CLASSROOM_EQUIPMENT: "Classroom equipment",
  PRINTER: "Printer",
  OTHER: "Other",
};

function invert(obj) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));
}

export const STATUS_ENUM = invert(STATUS_LABELS);
export const PRIORITY_ENUM = invert(PRIORITY_LABELS);
export const CATEGORY_ENUM = invert(CATEGORY_LABELS);

function relativeTime(iso) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

/**
 * Normalizes a backend ticket record into the shape the UI components expect
 * (friendly labels, string display fields). Keeps the numeric id as `dbId`
 * and exposes `ticketNumber` as the display `id`.
 */
export function toUiTicket(t) {
  if (!t) return null;
  return {
    dbId: t.id,
    id: t.ticketNumber || String(t.id),
    title: t.title,
    description: t.description,
    location: t.roomNumber || "Not specified",
    category: CATEGORY_LABELS[t.category] || "Other",
    priority: PRIORITY_LABELS[t.priority] || "Medium",
    status: STATUS_LABELS[t.status] || t.status,
    response: t.resolutionNote || "Awaiting triage",
    createdAt: relativeTime(t.createdAt),
    createdAtRaw: t.createdAt,
    reporter: t.reporter?.name || "Unknown",
    reporterId: t.reporterId,
    assignee: t.technician?.name || null,
    technicianId: t.technicianId || null,
    comments: (t.comments || []).map(toUiComment),
    history: (t.history || []).map(toUiHistory),
  };
}

export function toUiComment(c) {
  const role = c.user?.role || "STAFF";
  return {
    id: c.id,
    author: c.user?.name || "Unknown",
    role: role === "STUDENT" ? "student" : "staff",
    message: c.message,
    at: relativeTime(c.createdAt),
  };
}

export function toUiHistory(h) {
  return {
    id: h.id,
    action: h.action,
    at: relativeTime(h.createdAt),
  };
}
