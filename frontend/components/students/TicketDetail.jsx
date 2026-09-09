import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LayoutGrid,
  Ticket,
  BookOpen,
  Activity,
  Settings as SettingsIcon,
  ShieldAlert,
  LogOut,
  Menu,
  ArrowLeft,
  Send,
  CircleDot,
  Clock,
  UserCog,
  CheckCircle2,
} from "lucide-react";
import "./TicketDetail.css";
import auLogo from "../../src/assets/AU_logo.jpeg";
import { useTickets } from "../../src/context/useTickets";

// Derives a simple status timeline from the ticket's current status.
function buildTimeline(ticket) {
  const steps = [
    {
      key: "created",
      label: "Ticket created",
      at: ticket.createdAt,
      Icon: CircleDot,
    },
    {
      key: "triage",
      label: "Received by Campus IT",
      at: ticket.createdAt,
      Icon: Clock,
    },
  ];

  if (["In progress", "Waiting for user"].includes(ticket.status)) {
    steps.push({
      key: "progress",
      label: "A technician is working on it",
      at: ticket.response,
      Icon: UserCog,
    });
  }

  if (["Resolved", "Closed"].includes(ticket.status)) {
    steps.push({
      key: "resolved",
      label: "Marked resolved",
      at: ticket.response,
      Icon: CheckCircle2,
    });
  }

  return steps;
}

export default function TicketDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getTicket, addComment } = useTickets();

  const ticket = getTicket(id);
  const [draft, setDraft] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    addComment(id, draft);
    setDraft("");
  };

  const Sidebar = (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">
          <img src={auLogo} alt="AU Logo" />
        </div>

        <div>
          <h2>AU HelpDesk</h2>
          <p>Campus IT Services</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button className="nav-item" onClick={() => navigate("/student")}>
          <LayoutGrid size={18} />
          Home
        </button>

        <button
          className="nav-item active"
          onClick={() => navigate("/student/tickets")}
        >
          <Ticket size={18} />
          My tickets
        </button>

        <button
          className="nav-item"
          onClick={() => navigate("/student/knowledge")}
        >
          <BookOpen size={18} />
          Knowledge base
        </button>

        <button
          className="nav-item"
          onClick={() => navigate("/student/status")}
        >
          <Activity size={18} />
          Campus status
        </button>

        <button
          className="nav-item"
          onClick={() => navigate("/student/settings")}
        >
          <SettingsIcon size={18} />
          Settings
        </button>
      </nav>

      <div className="sidebar-bottom">
        <div className="urgent-box">
          <div className="urgent-icon">
            <ShieldAlert size={20} />
          </div>

          <h3>Urgent IT or security issue?</h3>
          <p>Call the Service Desk</p>

          <strong>02-300-4543</strong>

          <small>Mon–Fri · 08:00–18:00</small>
        </div>

        <div className="student-profile">
          <div className="avatar">ST</div>

          <div className="student-profile-info">
            <strong>Student</strong>
            <span>student@test.local</span>
          </div>

          <button
            className="profile-settings"
            onClick={() => navigate("/")}
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );

  // Ticket not found (e.g. reloaded with in-memory store empty).
  if (!ticket) {
    return (
      <div className="ticketdetail-page">
        {Sidebar}
        <main className="ticketdetail-main">
          <header className="topbar">
            <div className="topbar-left">
              <button className="sidebar-toggle">
                <Menu size={20} />
              </button>
              <div>
                <h2>Ticket</h2>
                <p>Campus IT service workspace</p>
              </div>
            </div>
            <div className="topbar-right">
              <div className="top-avatar">ST</div>
            </div>
          </header>

          <section className="ticketdetail-content">
            <div className="detail-card notfound">
              <h1>Ticket not found</h1>
              <p>
                This ticket may have expired from the demo session.
                Head back to your tickets list.
              </p>
              <button
                className="primary-submit"
                onClick={() => navigate("/student/tickets")}
              >
                Back to my tickets
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  const timeline = buildTimeline(ticket);
  const statusClass =
    ticket.status === "In progress"
      ? "in-progress"
      : ticket.status === "Resolved" || ticket.status === "Closed"
      ? "resolved"
      : ticket.status === "Open"
      ? "open"
      : "waiting";

  return (
    <div className="ticketdetail-page">
      {Sidebar}

      <main className="ticketdetail-main">
        <header className="topbar">
          <div className="topbar-left">
            <button className="sidebar-toggle">
              <Menu size={20} />
            </button>
            <div>
              <h2>Ticket {ticket.id}</h2>
              <p>Campus IT service workspace</p>
            </div>
          </div>
          <div className="topbar-right">
            <div className="top-avatar">ST</div>
          </div>
        </header>

        <section className="ticketdetail-content">
          <button
            className="back-link"
            onClick={() => navigate("/student/tickets")}
          >
            <ArrowLeft size={16} />
            Back to tickets
          </button>

          {/* HEADER CARD */}
          <div className="detail-card detail-header">
            <div className="detail-title-row">
              <div>
                <p className="detail-id">{ticket.id}</p>
                <h1>{ticket.title}</h1>
              </div>

              <span className={`ticket-status ${statusClass}`}>
                {ticket.status}
              </span>
            </div>

            <div className="detail-meta">
              <div>
                <span className="meta-label">Category</span>
                <span className="meta-value">{ticket.category}</span>
              </div>
              <div>
                <span className="meta-label">Priority</span>
                <span className="meta-value">{ticket.priority}</span>
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

          <div className="detail-columns">
            {/* LEFT: description + comments */}
            <div className="detail-main-col">
              <div className="detail-card">
                <h2>Description</h2>
                <p className="detail-description">
                  {ticket.description}
                </p>
              </div>

              <div className="detail-card comment-thread">
                <h2>Conversation</h2>

                {ticket.comments.length === 0 ? (
                  <p className="empty-thread">
                    No replies yet. Add a message below and Campus IT
                    will follow up here.
                  </p>
                ) : (
                  <div className="comment-list">
                    {ticket.comments.map((c) => (
                      <div
                        key={c.id}
                        className={`comment ${
                          c.role === "student" ? "mine" : "staff"
                        }`}
                      >
                        <div className="comment-avatar">
                          {c.role === "student" ? "ST" : "IT"}
                        </div>

                        <div className="comment-body">
                          <div className="comment-meta">
                            <strong>{c.author}</strong>
                            <span>{c.at}</span>
                          </div>
                          <p>{c.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <form className="comment-input" onSubmit={handleSend}>
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="primary-submit"
                    disabled={!draft.trim()}
                  >
                    <Send size={15} />
                    Send
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT: status timeline */}
            <div className="detail-side-col">
              <div className="detail-card">
                <h2>Status timeline</h2>

                <ol className="timeline">
                  {timeline.map((step, index) => (
                    <li
                      key={step.key}
                      className={
                        index === timeline.length - 1 ? "current" : ""
                      }
                    >
                      <span className="timeline-icon">
                        <step.Icon size={15} />
                      </span>
                      <div>
                        <strong>{step.label}</strong>
                        <small>{step.at}</small>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="expected-box">
                  <span>Expected response</span>
                  <strong>{ticket.response}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
