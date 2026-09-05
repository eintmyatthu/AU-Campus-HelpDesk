import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";
import AdminShell from "./AdminShell";
import "./AdminTickets.css";
import { useTickets } from "../../src/context/useTickets";

function statusClass(status) {
  switch (status) {
    case "In progress":
      return "in-progress";
    case "Waiting for user":
      return "waiting";
    case "Resolved":
    case "Closed":
      return "resolved";
    case "Open":
      return "open";
    default:
      return "unassigned";
  }
}

function priorityClass(priority) {
  if (priority === "Urgent") return "urgent";
  if (priority === "High") return "high";
  if (priority === "Low") return "low";
  return "medium";
}

export default function AdminTickets() {
  const navigate = useNavigate();
  const { tickets } = useTickets();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");

  const filteredTickets = tickets.filter((ticket) => {
    const query = searchTerm.toLowerCase();

    const matchesSearch =
      ticket.id.toLowerCase().includes(query) ||
      ticket.title.toLowerCase().includes(query) ||
      ticket.category.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All statuses" || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminShell
      active="tickets"
      title="Tickets"
      subtitle="Campus IT service workspace"
    >
      {/* TOOLBAR */}
      <div className="admin-ticket-toolbar">
        <div className="admin-ticket-search">
          <Search size={16} />

          <input
            type="text"
            placeholder="Search ticket ID, title, or category"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="admin-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All statuses</option>
          <option>Open</option>
          <option>In progress</option>
          <option>Waiting for user</option>
          <option>Resolved</option>
          <option>Closed</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="admin-ticket-table admin-panel-card">
        <div className="admin-ticket-header">
          <span>TICKET</span>
          <span>CATEGORY</span>
          <span>PRIORITY</span>
          <span>STATUS</span>
          <span>EXPECTED RESPONSE</span>
          <span></span>
        </div>

        {filteredTickets.map((ticket) => (
          <div
            className="admin-ticket-row"
            key={ticket.id}
            onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
          >
            <div className="admin-ticket-main">
              <div className="admin-ticket-id-line">
                <span className="admin-ticket-id">{ticket.id}</span>
              </div>

              <strong>{ticket.title}</strong>

              <small>{ticket.location}</small>
            </div>

            <span>{ticket.category}</span>

            <span className="admin-priority">
              <i className={`admin-priority-dot ${priorityClass(ticket.priority)}`}></i>
              {ticket.priority}
            </span>

            <span>
              <span className={`admin-status-pill ${statusClass(ticket.status)}`}>
                {ticket.status}
              </span>
            </span>

            <span className="admin-response">{ticket.response}</span>

            <button className="admin-row-arrow" aria-label="Open ticket">
              <ChevronRight size={18} />
            </button>
          </div>
        ))}

        {filteredTickets.length === 0 && (
          <div className="admin-ticket-empty">
            No tickets match your filters.
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="admin-ticket-footer">
        <p>Showing {filteredTickets.length} tickets</p>

        <div className="admin-pagination">
          <button disabled>Previous</button>
          <button disabled>Next</button>
        </div>
      </div>
    </AdminShell>
  );
}
