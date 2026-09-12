// TechnicianQueue.jsx

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
import "./TechnicianQueue.css";
import TechnicianNotifications from "./TechnicianNotifications";
import auLogo from "../../src/assets/AU_logo.jpeg";
import { useTickets } from "../../src/context/useTickets";
import { useAuth } from "../../src/context/useAuth";
import { getUserInitials } from "../../src/utils/userDisplay";

export default function TechnicianQueue() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const initials = getUserInitials(user);
  const [searchTerm, setSearchTerm] = useState("");
  const [claimingId, setClaimingId] = useState(null);
  const [claimError, setClaimError] = useState("");
  const { queueTickets, loading, error, claimTicket } = useTickets();

  const handleClaim = async (ticket) => {
    setClaimingId(ticket.id);
    setClaimError("");
    try {
      await claimTicket(ticket.id);
      navigate("/technician/assignments");
    } catch (claimRequestError) {
      setClaimError(claimRequestError.message || "Unable to claim ticket.");
    } finally {
      setClaimingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const filteredTickets = queueTickets.filter((ticket) => {
    const query = searchTerm.toLowerCase();

    return (
      ticket.id.toLowerCase().includes(query) ||
      ticket.title.toLowerCase().includes(query) ||
      ticket.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="queue-page">
      {/* SIDEBAR */}
      <aside className="queue-sidebar">
        <div className="queue-brand">
          <div className="queue-brand-logo">
            <img src={auLogo} alt="AU Logo" />
          </div>

          <div>
            <h2>AU HelpDesk</h2>
            <p>Campus IT Services</p>
          </div>
        </div>

        <nav className="queue-nav">
          <button
            className="queue-nav-item"
            onClick={() => navigate("/technician")}
          >
            <span><LayoutGrid size={18} /></span>
            Operations
          </button>

          <button className="queue-nav-item active">
            <span><Ticket size={18} /></span>
            Open queue

            <span className="queue-count">
              {queueTickets.length}
            </span>
          </button>

<button
  className="queue-nav-item"
  onClick={() => navigate("/technician/assignments")}
>
  <span><Wrench size={18} /></span>
  My assignments
</button>
<button
  className="queue-nav-item"
  onClick={() => navigate("/technician/knowledge")}
>
  <span><BookOpen size={18} /></span>
  Knowledge base
</button>

<button
  className="queue-nav-item"
  onClick={() => navigate("/technician/status")}
>
  <span><Activity size={18} /></span>
  Campus status
</button>
        </nav>

        <div className="queue-sidebar-bottom">
          <div className="queue-urgent-box">
            <div className="queue-urgent-icon"><ShieldAlert size={20} /></div>

            <h3>Urgent IT or security issue?</h3>
            <p>Call the Service Desk</p>

            <strong>02-300-4543</strong>

            <small>Mon–Fri · 08:00–18:00</small>
          </div>

          <div className="queue-profile">
            <div className="queue-avatar">{initials}</div>

            <div className="queue-profile-info">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>

            <button
              className="queue-profile-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="queue-main">
        {/* TOPBAR */}
        <header className="queue-topbar">
          <div className="queue-topbar-left">
            <button className="queue-sidebar-toggle">
              <Menu size={18} />
            </button>

            <div>
              <h2>Queue</h2>
              <p>Campus IT service workspace</p>
            </div>
          </div>

          <div className="queue-topbar-right">

            <button className="queue-icon-btn">
              <Moon size={18} />
            </button>

            <TechnicianNotifications buttonClassName="queue-icon-btn queue-notification" dotClassName="queue-notification-dot" />

            <div className="queue-top-avatar">{initials}</div>
          </div>
        </header>

        {/* CONTENT */}
        <section className="queue-content">
          <div className="queue-top-space"></div>

          {/* TOOLBAR */}
          <div className="queue-toolbar">
            <div className="queue-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search the campus queue"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <span className="priority-first">
              Priority first
            </span>
          </div>

          {/* TABLE */}
          <div className="queue-table">
            <div className="queue-table-header">
              <span>TICKET</span>
              <span>CATEGORY</span>
              <span>PRIORITY</span>
              <span>STATUS</span>
              <span>EXPECTED RESPONSE</span>
              <span></span>
            </div>

            {loading && (
              <div className="queue-empty">Loading tickets…</div>
            )}

            {!loading && (error || claimError) && (
              <div className="queue-empty" role="alert">
                {claimError || error}
              </div>
            )}

            {!loading && !error && filteredTickets.map((ticket) => (
              <div
                className="queue-table-row"
                key={ticket.id}
              >
                <div>
                  <div className="queue-ticket-id-line">
                    <span className="queue-ticket-id">
                      {ticket.id}
                    </span>

                    {ticket.priority === "Urgent" && (
                      <span className="queue-escalated">
                        Escalated
                      </span>
                    )}
                  </div>

                  <strong>{ticket.title}</strong>
                  <small>{ticket.location}</small>
                </div>

                <span>{ticket.category}</span>

                <span className="queue-priority">
                  <i
                    className={`queue-priority-dot ${
                      ticket.priority === "Urgent"
                        ? "urgent"
                        : "medium"
                    }`}
                  ></i>

                  {ticket.priority}
                </span>

                <span>
                  <span className="queue-status">
                    Unassigned
                  </span>
                </span>

                <span className="queue-response">
                  {ticket.response}
                </span>

                <button
                  type="button"
                  className="claim-button"
                  disabled={claimingId === ticket.id}
                  onClick={() => handleClaim(ticket)}
                >
                  {claimingId === ticket.id ? "Claiming…" : "Claim"}
                </button>
              </div>
            ))}

            {!loading && !error && filteredTickets.length === 0 && (
              <div className="queue-empty">
                No tickets found.
              </div>
            )}
          </div>

          {/* ESCALATION NOTICE */}
          <section className="escalation-notice">
            <div className="escalation-icon">
              !
            </div>

            <div>
              <h3>Escalation rule active</h3>

              <p>
                Urgent security and campus-wide outage reports notify
                the on-call lead immediately.
              </p>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
