import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  UserCog,
  CircleDot,
  Clock,
} from "lucide-react";
import AdminShell from "./AdminShell";
import "./AdminTicketDetail.css";
import { useTickets } from "../../src/context/useTickets";
import { listUsers } from "../../src/api/client";
import {
  TICKET_STATUSES,
  TICKET_PRIORITIES,
} from "../../src/context/ticketsMeta";

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

export default function AdminTicketDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    getTicket,
    addComment,
    assignTicket,
    setTicketStatus,
    setTicketPriority,
  } = useTickets();

  const ticket = getTicket(id);
  const [draft, setDraft] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    listUsers("TECHNICIAN")
      .then(setTechnicians)
      .catch(() => setTechnicians([]));
  }, []);

  const runAction = async (fn) => {
    setActionError("");
    try {
      await fn();
    } catch (err) {
      setActionError(err.message || "Action failed.");
    }
  };

  if (!ticket) {
    return (
      <AdminShell
        active="tickets"
        title="Ticket"
        subtitle="Campus IT service workspace"
      >
        <button
          className="admin-back-link"
          onClick={() => navigate("/admin/tickets")}
        >
          <ArrowLeft size={16} />
          Back to tickets
        </button>

        <div className="admin-panel-card admin-detail-notfound">
          <h1>Ticket not found</h1>
          <p>This ticket may have expired from the demo session.</p>
          <button
            className="admin-primary-btn"
            onClick={() => navigate("/admin/tickets")}
          >
            Back to all tickets
          </button>
        </div>
      </AdminShell>
    );
  }

  const handleReply = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    runAction(async () => {
      await addComment(id, draft);
      setDraft("");
    });
  };

  return (
    <AdminShell
      active="tickets"
      title={`Ticket ${ticket.id}`}
      subtitle="Campus IT service workspace"
    >
      <button
        className="admin-back-link"
        onClick={() => navigate("/admin/tickets")}
      >
        <ArrowLeft size={16} />
        Back to tickets
      </button>

      {/* HEADER */}
      <div className="admin-panel-card admin-detail-header">
        <div className="admin-detail-title">
          <div>
            <p className="admin-detail-id">{ticket.id}</p>
            <h1>{ticket.title}</h1>
          </div>

          <span className={`admin-status-pill ${statusClass(ticket.status)}`}>
            {ticket.status}
          </span>
        </div>

        <div className="admin-detail-meta">
          <div>
            <span className="meta-label">Reporter</span>
            <span className="meta-value">{ticket.reporter || "—"}</span>
          </div>
          <div>
            <span className="meta-label">Category</span>
            <span className="meta-value">{ticket.category}</span>
          </div>
          <div>
            <span className="meta-label">Location</span>
            <span className="meta-value">{ticket.location}</span>
          </div>
          <div>
            <span className="meta-label">Submitted</span>
            <span className="meta-value">{ticket.createdAt}</span>
          </div>
        </div>
      </div>

      <div className="admin-detail-grid">
        {/* LEFT: description + conversation */}
        <div className="admin-detail-main">
          <div className="admin-panel-card admin-detail-card">
            <h2>Description</h2>
            <p className="admin-detail-desc">{ticket.description}</p>
          </div>

          <div className="admin-panel-card admin-detail-card">
            <h2>Conversation</h2>

            {ticket.comments.length === 0 ? (
              <p className="admin-detail-empty">No replies yet.</p>
            ) : (
              <div className="admin-comment-list">
                {ticket.comments.map((c) => (
                  <div
                    key={c.id}
                    className={`admin-comment ${
                      c.role === "staff" ? "staff" : "student"
                    }`}
                  >
                    <div className="admin-comment-avatar">
                      {c.role === "staff" ? "IT" : "ST"}
                    </div>

                    <div className="admin-comment-body">
                      <div className="admin-comment-meta">
                        <strong>{c.author}</strong>
                        <span>{c.at}</span>
                      </div>
                      <p>{c.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form className="admin-comment-input" onSubmit={handleReply}>
              <input
                type="text"
                placeholder="Reply to the reporter..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <button
                type="submit"
                className="admin-primary-btn"
                disabled={!draft.trim()}
              >
                <Send size={15} />
                Send
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: admin controls + history */}
        <div className="admin-detail-side">
          <div className="admin-panel-card admin-detail-card">
            <h2>Manage</h2>

            <label className="admin-control">
              <span>
                <UserCog size={13} />
                Assignee
              </span>
              <select
                value={ticket.technicianId || ""}
                onChange={(e) =>
                  runAction(() =>
                    assignTicket(id, e.target.value ? Number(e.target.value) : null)
                  )
                }
              >
                <option value="">Unassigned</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-control">
              <span>Status</span>
              <select
                value={ticket.status}
                onChange={(e) =>
                  runAction(() => setTicketStatus(id, e.target.value))
                }
              >
                {TICKET_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-control">
              <span>Priority</span>
              <select
                value={ticket.priority}
                onChange={(e) =>
                  runAction(() => setTicketPriority(id, e.target.value))
                }
              >
                {TICKET_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>

            {actionError && (
              <p className="admin-detail-action-error">{actionError}</p>
            )}
          </div>

          <div className="admin-panel-card admin-detail-card">
            <h2>History</h2>

            <ol className="admin-timeline">
              {(ticket.history || []).map((h, index) => (
                <li
                  key={h.id}
                  className={
                    index === ticket.history.length - 1 ? "current" : ""
                  }
                >
                  <span className="admin-timeline-icon">
                    {index === 0 ? (
                      <CircleDot size={14} />
                    ) : (
                      <Clock size={14} />
                    )}
                  </span>
                  <div>
                    <strong>{h.action}</strong>
                    <small>{h.at}</small>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
