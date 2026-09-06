// Central API client for the AU HelpDesk backend.
// All calls go through the Vite dev proxy (see vite.config.js), so we use
// same-origin relative URLs. In production, set VITE_API_BASE_URL to point
// at the deployed API origin.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const API = `${BASE_URL}/helpdesk/api`;

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

export function claimTicket(id, technicianId) {
  return request(`/tickets/${id}/claim`, { method: "POST", body: { technicianId } });
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
