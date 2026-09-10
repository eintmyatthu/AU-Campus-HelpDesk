// Central API client for the AU HelpDesk backend.
// VITE_API_URL may point directly at the backend API. The relative fallback
// continues to work through the Vite development proxy.

const API = (import.meta.env.VITE_API_URL || "/helpdesk/api").replace(/\/+$/, "");

/**
 * Thin fetch wrapper that returns parsed JSON and throws an Error with the
 * server-provided message on non-2xx responses.
 */
async function request(path, { method = "GET", body, signal } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && data.error) || `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  return data;
}

/* ---------------- Service health ---------------- */

export function getHealth(signal) {
  return request("/health", { signal });
}

/* ---------------- Auth / users ---------------- */

export function login({ email, role }) {
  return request("/users/login", { method: "POST", body: { email, role } });
}

export function getUser(id) {
  return request(`/users/${id}`);
}

export function listUsers(role) {
  const query = role ? `?role=${encodeURIComponent(role)}` : "";
  return request(`/users${query}`);
}

/* ---------------- Tickets ---------------- */

export function listTickets(signal) {
  return request("/tickets", { signal });
}

export function getTicket(id) {
  return request(`/tickets/${id}`);
}

export function createTicket({ title, description, roomNumber, reporterId }) {
  return request("/tickets", {
    method: "POST",
    body: { title, description, roomNumber, reporterId },
  });
}

export function updateTicket(id, changes) {
  // changes may include title/description/roomNumber/category/priority + changedById
  return request(`/tickets/${id}`, { method: "PATCH", body: changes });
}

export function assignTicket(id, technicianId, changedById) {
  return request(`/tickets/${id}/claim`, { method: "POST", body: { technicianId, changedById } });
}

export function updateTicketStatus(id, status, changedById) {
  return request(`/tickets/${id}/status`, {
    method: "PATCH",
    body: { status, changedById },
  });
}

export function resolveTicket(id, technicianId, resolutionNote) {
  return request(`/tickets/${id}/resolve`, {
    method: "POST",
    body: { technicianId, resolutionNote },
  });
}

export function listComments(ticketId) {
  return request(`/tickets/${ticketId}/comments`);
}

export function addComment(ticketId, userId, message) {
  return request(`/tickets/${ticketId}/comments`, {
    method: "POST",
    body: { userId, message },
  });
}

export function getHistory(ticketId) {
  return request(`/tickets/${ticketId}/history`);
}
