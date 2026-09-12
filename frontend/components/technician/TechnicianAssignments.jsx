import { useTickets } from "../../src/context/useTickets";
import { useAuth } from "../../src/context/useAuth";
// TechnicianAssignments.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Ticket,
  Wrench,
  BookOpen,
  Activity,
  ShieldAlert,
  LogOut,
  Menu,
  Moon,
} from "lucide-react";
import "./TechnicianAssignments.css";
import TechnicianNotifications from "./TechnicianNotifications";
import NetworkDiagnostic from "../../src/components/NetworkDiagnostic";
import auLogo from "../../src/assets/AU_logo.jpeg";

export default function TechnicianAssignments() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tickets, queueTickets, loading, error, setTicketStatus, resolveTicket } = useTickets();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [workingId, setWorkingId] = useState(null);
  const [actionError, setActionError] = useState("");

  const assignedTickets = tickets.filter(
    (ticket) => Number(ticket.technicianId) === Number(user?.id)
  );

  const filteredTickets = assignedTickets.filter((ticket) => {
    const query = searchTerm.toLowerCase();

    const matchesSearch =
      ticket.id.toLowerCase().includes(query) ||
      ticket.title.toLowerCase().includes(query) ||
      ticket.category.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All statuses" ||
      ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const runAction = async (ticket, action) => {
    setWorkingId(ticket.id);
    setActionError("");
    try {
      if (action === "start") {
        await setTicketStatus(ticket.id, "In progress");
      } else {
        const note = window.prompt("Resolution note:");
        if (!note?.trim()) return;
        await resolveTicket(ticket.id, note.trim());
      }
    } catch (actionRequestError) {
      setActionError(actionRequestError.message || "Unable to update ticket.");
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <div className="assignments-page">
      {/* SIDEBAR */}
      <aside className="assignments-sidebar">
        <div className="assignments-brand">
          <div className="assignments-logo">
            <img src={auLogo} alt="AU Logo" />
          </div>

          <div>
            <h2>AU HelpDesk</h2>
            <p>Campus IT Services</p>
          </div>
        </div>

        <nav className="assignments-nav">
          <button
            className="assignments-nav-item"
            onClick={() => navigate("/technician")}
          >
            <span><LayoutGrid size={18} /></span>
            Operations
          </button>

          <button
            className="assignments-nav-item"
            onClick={() => navigate("/technician/queue")}
          >
            <span><Ticket size={18} /></span>
            Open queue

            <span className="assignments-count">{queueTickets.length}</span>
          </button>

          <button className="assignments-nav-item active">
            <span><Wrench size={18} /></span>
            My assignments
          </button>

<button
  className="assignments-nav-item"
  onClick={() => navigate("/technician/knowledge")}
>
  <span><BookOpen size={18} /></span>
  Knowledge base
</button>

<button
  className="assignments-nav-item"
  onClick={() => navigate("/technician/status")}
>
  <span><Activity size={18} /></span>
  Campus status
</button>
        </nav>

        <div className="assignments-sidebar-bottom">
          <div className="assignments-urgent">
            <div className="assignments-urgent-icon"><ShieldAlert size={20} /></div>

            <h3>Urgent IT or security issue?</h3>
            <p>Call the Service Desk</p>

            <strong>02-300-4543</strong>

            <small>Mon–Fri · 08:00–18:00</small>
          </div>

          <div className="assignments-profile">
            <div className="assignments-avatar">TE</div>

            <div className="assignments-profile-info">
              <strong>Technician</strong>
              <span>technician@test.local</span>
            </div>

            <button
              className="assignments-profile-btn"
              onClick={() => navigate("/")}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="assignments-main">
        {/* TOP BAR */}
        <header className="assignments-topbar">
          <div className="assignments-topbar-left">
            <button className="assignments-menu">
              <Menu size={18} />
            </button>

            <div>
              <h2>Tickets</h2>
              <p>Campus IT service workspace</p>
            </div>
          </div>

          <div className="assignments-topbar-right">

            <button className="assignments-icon">
              <Moon size={18} />
            </button>

            <TechnicianNotifications buttonClassName="assignments-icon assignments-notification" dotClassName="assignments-dot" />

            <div className="assignments-top-avatar">
              TE
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <section className="assignments-content">
          <div className="assignments-spacer"></div>

          {/* TOOLBAR */}
          <div className="assignments-toolbar">
            <div className="assignments-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search ticket ID, title, or category"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="assignments-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All statuses</option>
              <option>Open</option>
              <option>Claimed</option>
              <option>In progress</option>
              <option>Resolved</option>
              <option>Reopened</option>
            </select>
          </div>

          {/* TABLE */}
          <div className="assignments-table">
            <div className="assignments-table-header">
              <span>TICKET</span>
              <span>CATEGORY</span>
              <span>PRIORITY</span>
              <span>STATUS</span>
              <span>EXPECTED RESPONSE</span>
              <span></span>
            </div>

            {loading && <div className="assignments-empty">Loading tickets…</div>}
            {!loading && (error || actionError) && <div className="assignments-empty" role="alert">{actionError || error}</div>}
            {!loading && !error && filteredTickets.map((ticket) => (
              <div
                className="assignments-table-row"
                key={ticket.id}
              >
                <div>
                  <div className="assignments-ticket-id-row">
                    <span className="assignments-ticket-id">
                      {ticket.id}
                    </span>

                    {ticket.priority === "Urgent" && (
                      <span className="assignments-escalated">
                        Escalated
                      </span>
                    )}
                  </div>

                  <strong>{ticket.title}</strong>
                  <small>{ticket.location}</small>
                </div>

                <span>{ticket.category}</span>

                <span className="assignments-priority">
                  <i
                    className={`assignments-priority-dot ${
                      ticket.priority === "Urgent"
                        ? "urgent"
                        : ticket.priority === "High"
                        ? "high"
                        : "medium"
                    }`}
                  ></i>

                  {ticket.priority}
                </span>

                <span>
                  <span
                    className={`assignments-status ${
                      ticket.status === "In progress"
                        ? "progress"
                        : ticket.status === "Resolved"
                        ? "resolved"
                        : "unassigned"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </span>

                <span className="assignments-response">
                  {ticket.response}
                  <NetworkDiagnostic ticket={ticket} compact />
                </span>

                {["Open", "Claimed", "Reopened"].includes(ticket.status) ? (
                  <button className="assignments-action" disabled={workingId === ticket.id} onClick={() => runAction(ticket, "start")}>Start Work</button>
                ) : ticket.status === "In progress" ? (
                  <button className="assignments-action" disabled={workingId === ticket.id} onClick={() => runAction(ticket, "resolve")}>Resolve</button>
                ) : (
                  <span className="assignments-complete">{ticket.status}</span>
                )}
              </div>
            ))}
            {!loading && !error && filteredTickets.length === 0 && <div className="assignments-empty">No assigned tickets found.</div>}
          </div>

          {/* FOOTER */}
          <div className="assignments-footer">
            <p>
              Showing {filteredTickets.length} tickets
            </p>

            <div className="assignments-pagination">
              <button disabled>Previous</button>
              <button disabled>Next</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
