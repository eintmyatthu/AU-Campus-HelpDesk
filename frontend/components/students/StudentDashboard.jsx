import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Ticket,
  BookOpen,
  Activity,
  Settings as SettingsIcon,
  ShieldAlert,
  LogOut,
  Menu,
  Sparkles,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Wifi,
  CalendarClock,
  ChevronRight,
} from "lucide-react";
import "./StudentDashboard.css";
import auLogo from "../../src/assets/AU_logo.jpeg";
import { useTickets } from "../../src/context/useTickets";

function statusClass(status) {
  switch (status) {
    case "In progress":
      return "progress";
    case "Waiting for user":
      return "waiting";
    case "Resolved":
    case "Closed":
      return "resolved";
    case "Open":
      return "open";
    default:
      return "waiting";
  }
}

function priorityClass(priority) {
  if (priority === "Urgent") return "urgent";
  if (priority === "High") return "high";
  if (priority === "Low") return "low";
  return "medium";
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { tickets } = useTickets();

  const openCount = tickets.filter(
    (t) => t.status === "Open" || t.status === "In progress"
  ).length;
  const awaitingCount = tickets.filter(
    (t) => t.status === "Waiting for user"
  ).length;
  const resolvedCount = tickets.filter(
    (t) => t.status === "Resolved" || t.status === "Closed"
  ).length;
  const recentTickets = tickets.slice(0, 4);

  const handleLogout = () => {
    navigate("/");
  };

  const handleMyTickets = () => {
    navigate("/student/tickets");
  };

  return (
    <div className="dashboard">
      {/* SIDEBAR */}
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
          <button className="nav-item active">
            <LayoutGrid size={18} />
            Home
          </button>

          <button className="nav-item" onClick={handleMyTickets}>
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
              className="logout-button"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-area">
        {/* TOP BAR */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="sidebar-toggle">
              <Menu size={20} />
            </button>

            <div>
              <h2>Good afternoon, Student</h2>
              <p>Campus IT service workspace</p>
            </div>
          </div>

          <div className="topbar-right">
            <div className="top-avatar">ST</div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <section className="content">
          {/* HERO */}
          <section className="support-hero">
            <div className="hero-main">
              <p className="hero-label">
                <Sparkles size={13} />
                AI-ASSISTED SUPPORT
              </p>

              <h1>What can Campus IT help with?</h1>

              <p className="hero-text">
                Report an issue, get suggested solutions, and follow every
                update from one place.
              </p>

              <div className="hero-buttons">
                <button
                  className="primary-button"
                  onClick={() => navigate("/student/new-ticket")}
                >
                  <Plus size={17} />
                  Submit a ticket
                </button>

                <button
                  className="secondary-button"
                  onClick={() => navigate("/student/knowledge")}
                >
                  <Search size={16} />
                  Find a quick fix
                </button>
              </div>
            </div>

            <div className="service-card">
              <div className="status-heading">
                <span className="status-dot"></span>
                <strong>All core services operational</strong>
              </div>

              <p className="last-check">Last checked 2 minutes ago</p>

              <div className="service-row">
                <strong>AU-Secure</strong>
                <span>Operational</span>
              </div>

              <div className="service-row">
                <strong>Microsoft 365</strong>
                <span>Operational</span>
              </div>
            </div>

            <div className="hero-circle hero-circle-one"></div>
            <div className="hero-circle hero-circle-two"></div>
          </section>

          {/* STATISTICS */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-left">
                <div className="stat-icon blue">
                  <Ticket size={20} />
                </div>

                <div>
                  <p>Open tickets</p>
                  <h3>{openCount}</h3>
                </div>
              </div>

              <small>Across your account</small>
            </div>

            <div className="stat-card">
              <div className="stat-left">
                <div className="stat-icon orange">
                  <Clock size={20} />
                </div>

                <div>
                  <p>Awaiting your reply</p>
                  <h3>{awaitingCount}</h3>
                </div>
              </div>

              <small>Action may be needed</small>
            </div>

            <div className="stat-card">
              <div className="stat-left">
                <div className="stat-icon green">
                  <CheckCircle2 size={20} />
                </div>

                <div>
                  <p>Resolved this month</p>
                  <h3>{resolvedCount}</h3>
                </div>
              </div>

              <small>Average 5h 24m</small>
            </div>
          </section>

          {/* RECENT TICKETS */}
          <section className="recent-section">
            <div className="section-heading">
              <div>
                <h2>Recent tickets</h2>
                <p>Status, ownership, and expected response times</p>
              </div>

              <button className="view-all" onClick={handleMyTickets}>
                View all
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="tickets-table">
              <div className="ticket-header">
                <span>TICKET</span>
                <span>CATEGORY</span>
                <span>PRIORITY</span>
                <span>STATUS</span>
                <span>EXPECTED RESPONSE</span>
                <span></span>
              </div>

              {recentTickets.length === 0 ? (
                <div className="ticket-empty">
                  You have no tickets yet. Submit a request to get started.
                </div>
              ) : (
                recentTickets.map((ticket) => (
                  <div
                    className="ticket-row"
                    key={ticket.id}
                    onClick={() =>
                      navigate(`/student/tickets/${ticket.id}`)
                    }
                  >
                    <div>
                      <p className="ticket-number">{ticket.id}</p>
                      <strong>{ticket.title}</strong>
                      <small>{ticket.location}</small>
                    </div>

                    <span>{ticket.category}</span>

                    <span className="priority">
                      <i
                        className={`priority-dot ${priorityClass(
                          ticket.priority
                        )}`}
                      ></i>
                      {ticket.priority}
                    </span>

                    <span>
                      <span
                        className={`status-pill ${statusClass(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </span>

                    <span className="response-text">{ticket.response}</span>

                    <span className="ticket-arrow">
                      <ChevronRight size={18} />
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* BOTTOM CARDS */}
          <section className="bottom-grid">
            <div className="info-card">
              <div className="info-icon">
                <Wifi size={20} />
              </div>

              <div className="info-text">
                <strong>
                  AU-Secure connection guide
                </strong>

                <p>
                  Resolve common Wi-Fi setup issues before
                  submitting a request.
                </p>
              </div>

              <button onClick={() => navigate("/student/knowledge")}>
                Open guide
              </button>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <CalendarClock size={20} />
              </div>

              <div className="info-text">
                <strong>
                  Scheduled network maintenance
                </strong>

                <p>
                  CL Building · Friday, 20:00–22:00
                </p>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}