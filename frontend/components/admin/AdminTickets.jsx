// AdminTickets.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Ticket,
  Users,
  SlidersHorizontal,
  BarChart3,
  ScrollText,
  ShieldAlert,
  LogOut,
  PanelLeft,
  ChevronDown,
  Moon,
  Bell,
  Search,
  ChevronRight,
} from "lucide-react";
import "./AdminTickets.css";
import auLogo from "../../src/assets/AU_logo.jpeg";
import { useTheme } from "../../src/context/useTheme";
import { useTickets } from "../../src/context/useTickets";

export default function AdminTickets() {
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();
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
      statusFilter === "All statuses" ||
      ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-tickets-page">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-logo">
            <img src={auLogo} alt="AU Logo" />
          </div>

          <div>
            <h2>AU HelpDesk</h2>
            <p>Campus IT Services</p>
          </div>
        </div>

        <nav className="admin-nav">
          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin")}
          >
            <span><LayoutGrid size={18} /></span>
            Overview
          </button>

          <button
            className="admin-nav-item active"
            onClick={() => navigate("/admin/tickets")}
          >
            <span><Ticket size={18} /></span>
            All tickets
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/users")}
          >
            <span><Users size={18} /></span>
            Users & roles
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/service")}
          >
            <span><SlidersHorizontal size={18} /></span>
            Service setup
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/reports")}
          >
            <span><BarChart3 size={18} /></span>
            Reports
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/audit")}
          >
            <span><ScrollText size={18} /></span>
            Audit logs
          </button>
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-urgent-box">
            <div className="admin-urgent-icon">
              <ShieldAlert size={20} />
            </div>

            <h3>Urgent IT or security issue?</h3>
            <p>Call the Service Desk</p>

            <strong>02-300-4543</strong>

            <small>Mon–Fri · 08:00–18:00</small>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">AD</div>

            <div className="admin-profile-info">
              <strong>Admin</strong>
              <span>admin@test.local</span>
            </div>

            <button
              className="admin-settings-btn"
              onClick={() => navigate("/")}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="admin-tickets-main">
        {/* TOPBAR */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="admin-sidebar-toggle">
              <PanelLeft size={18} />
            </button>

            <div>
              <h2>Tickets</h2>
              <p>Campus IT service workspace</p>
            </div>
          </div>

          <div className="admin-topbar-right">
            <button className="admin-demo-btn">
              <span className="admin-demo-avatar">AD</span>
              <span>Administrator demo</span>
              <ChevronDown size={15} />
            </button>

            <button
              className="admin-icon-btn"
              onClick={toggleTheme}
              title="Toggle theme"
            >
              <Moon size={18} />
            </button>

            <button className="admin-icon-btn admin-notification" title="Notifications">
              <Bell size={18} />
              <span className="admin-notification-dot"></span>
            </button>

            <div className="admin-top-avatar">AD</div>
          </div>
        </header>

        {/* CONTENT */}
        <section className="admin-ticket-content">
          <div className="admin-ticket-spacer"></div>

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
              <option>In progress</option>
              <option>Waiting for user</option>
              <option>Resolved</option>
              <option>Unassigned</option>
            </select>
          </div>

          {/* TABLE */}
          <div className="admin-ticket-table">
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
                onClick={() => navigate(`/student/tickets/${ticket.id}`)}
              >
                <div>
                  <div className="admin-ticket-id-line">
                    <span className="admin-ticket-id">
                      {ticket.id}
                    </span>

                    {ticket.escalated && (
                      <span className="escalated-badge">
                        Escalated
                      </span>
                    )}
                  </div>

                  <strong>{ticket.title}</strong>

                  <small>{ticket.location}</small>
                </div>

                <span>{ticket.category}</span>

                <span className="admin-priority">
                  <i
                    className={`admin-priority-dot ${
                      ticket.priority === "High"
                        ? "high"
                        : ticket.priority === "Urgent"
                        ? "urgent"
                        : "medium"
                    }`}
                  ></i>

                  {ticket.priority}
                </span>

                <span>
                  <span
                    className={`admin-status-pill ${
                      ticket.status === "In progress"
                        ? "in-progress"
                        : ticket.status === "Waiting for user"
                        ? "waiting"
                        : ticket.status === "Resolved"
                        ? "resolved"
                        : "unassigned"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </span>

                <span className="admin-response">
                  {ticket.response}
                </span>

                <button className="admin-row-arrow">
                  <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="admin-ticket-footer">
            <p>
              Showing {filteredTickets.length} tickets
            </p>

            <div className="admin-pagination">
              <button disabled>Previous</button>
              <button disabled>Next</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}