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
  Bell,
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";
import "./TechnicianDashboard.css";
import auLogo from "../../src/assets/AU_logo.jpeg";

export default function TechnicianDashboard() {
  const navigate = useNavigate();
  const [available, setAvailable] = useState(true);
  
  const assignedTickets = [
    {
      id: "ICT-2481",
      title: "Campus Wi-Fi disconnects in CL Building",
      location: "CL Building · 403",
      category: "Network",
      priority: "High",
      status: "In progress",
      response: "Today, 15:00",
    },
    {
      id: "ICT-2459",
      title: "Projector shows no HDMI signal",
      location: "VMS Building · 201",
      category: "Classroom equipment",
      priority: "Medium",
      status: "Resolved",
      response: "Resolved within SLA",
    },
  ];

  return (
    <div className="tech-page">
      {/* SIDEBAR */}
      <aside className="tech-sidebar">
        <div className="tech-brand">
          <div className="tech-brand-logo">
            <img src={auLogo} alt="AU Logo" />
          </div>

          <div>
            <h2>AU HelpDesk</h2>
            <p>Campus IT Services</p>
          </div>
        </div>

        <nav className="tech-nav">
          <button className="tech-nav-item active">
            <span><LayoutGrid size={18} /></span>
            Operations
          </button>

          <button
            className="tech-nav-item"
            onClick={() => navigate("/technician/queue")}
          >
            <span><Ticket size={18} /></span>
            Open queue

            <span className="queue-count">2</span>
          </button>

<button
  className="tech-nav-item"
  onClick={() => navigate("/technician/assignments")}
>
  <span><Wrench size={18} /></span>
  My assignments
</button>

<button
  className="tech-nav-item"
  onClick={() => navigate("/technician/knowledge")}
>
  <span><BookOpen size={18} /></span>
  Knowledge base
</button>

<button
  className="tech-nav-item"
  onClick={() => navigate("/technician/status")}
>
  <span><Activity size={18} /></span>
  Campus status
</button>
        </nav>

        <div className="tech-sidebar-bottom">
          <div className="tech-urgent-box">
            <div className="tech-urgent-icon"><ShieldAlert size={20} /></div>

            <h3>Urgent IT or security issue?</h3>
            <p>Call the Service Desk</p>

            <strong>02-300-4543</strong>

            <small>Mon–Fri · 08:00–18:00</small>
          </div>

          <div className="tech-profile">
            <div className="tech-avatar">TE</div>

            <div className="tech-profile-info">
              <strong>Technician</strong>
              <span>technician@test.local</span>
            </div>

            <button
              className="tech-profile-btn"
              onClick={() => navigate("/")}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="tech-main">
        {/* TOPBAR */}
        <header className="tech-topbar">
          <div className="tech-topbar-left">
            <button className="tech-sidebar-toggle"><Menu size={18} /></button>

            <div>
              <h2>Support operations</h2>
              <p>Campus IT service workspace</p>
            </div>
          </div>

          <div className="tech-topbar-right">

            <button className="tech-icon-btn"><Moon size={18} /></button>

            <button className="tech-icon-btn tech-notification">
              <Bell size={18} />
              <span className="tech-notification-dot"></span>
            </button>

            <div className="tech-top-avatar">TE</div>
          </div>
        </header>

        {/* CONTENT */}
        <section className="tech-content">
          <div className="tech-top-space"></div>

          {/* HERO */}
          <section className="tech-hero">
            <div className="tech-hero-left">
              <p className="tech-hero-label">
                <CheckCircle2 size={20} /> LIVE OPERATIONS
              </p>

              <h1>Keep the queue moving.</h1>

              <p className="tech-hero-text">
                Urgent tickets are surfaced first and SLA risk is highlighted
                automatically.
              </p>
            </div>

            <div className="availability-card">
              <div>
                <strong>Available</strong>
                <span>Accept new assignments</span>
              </div>

              <button
                className={`availability-toggle ${
                  available ? "on" : ""
                }`}
                onClick={() => setAvailable(!available)}
              >
                <span></span>
              </button>
            </div>

            <div className="tech-hero-circle circle-one"></div>
            <div className="tech-hero-circle circle-two"></div>
          </section>

          {/* STATS */}
          <section className="tech-stats-grid">
            <div className="tech-stat-card">
              <div className="tech-stat-icon red">
                <Ticket size={20} />
              </div>

              <div className="tech-stat-info">
                <p>Unassigned</p>
                <h3>2</h3>
              </div>

              <small>1 urgent</small>
            </div>

            <div className="tech-stat-card">
              <div className="tech-stat-icon blue">
                <Wrench size={20} />
              </div>

              <div className="tech-stat-info">
                <p>My active tickets</p>
                <h3>2</h3>
              </div>

              <small>Within capacity</small>
            </div>

            <div className="tech-stat-card">
              <div className="tech-stat-icon orange">
                <Clock size={20} />
              </div>

              <div className="tech-stat-info">
                <p>First response</p>
                <h3>18m</h3>
              </div>

              <small>Target: 30m</small>
            </div>

            <div className="tech-stat-card">
              <div className="tech-stat-icon green">
                <CheckCircle2 size={20} />
              </div>

              <div className="tech-stat-info">
                <p>SLA compliance</p>
                <h3>92%</h3>
              </div>

              <small>Last 30 days</small>
            </div>
          </section>

          {/* LOWER AREA */}
          <section className="tech-lower-grid">
            {/* ASSIGNED TICKETS */}
            <div className="tech-assigned-section">
              <div className="tech-section-heading">
                <div>
                  <h2>My assigned tickets</h2>
                  <p>Work that needs your attention</p>
                </div>

                <button className="tech-view-all">
                  View all
                  <span><ChevronRight size={18} /></span>
                </button>
              </div>

              <div className="tech-ticket-table">
                <div className="tech-ticket-header">
                  <span>TICKET</span>
                  <span>CATEGORY</span>
                  <span>PRIORITY</span>
                  <span>STATUS</span>
                  <span>EXPECTED RESPONSE</span>
                  <span></span>
                </div>

                {assignedTickets.map((ticket) => (
                  <div
                    className="tech-ticket-row"
                    key={ticket.id}
                  >
                    <div>
                      <p className="tech-ticket-id">
                        {ticket.id}
                      </p>

                      <strong>{ticket.title}</strong>

                      <small>{ticket.location}</small>
                    </div>

                    <span>{ticket.category}</span>

                    <span className="tech-priority">
                      <i
                        className={`tech-priority-dot ${
                          ticket.priority === "High"
                            ? "high"
                            : "medium"
                        }`}
                      ></i>

                      {ticket.priority}
                    </span>

                    <span>
                      <span
                        className={`tech-status-pill ${
                          ticket.status === "Resolved"
                            ? "resolved"
                            : "progress"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </span>

                    <span className="tech-response">
                      {ticket.response}
                    </span>

                    <button className="tech-row-arrow">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* WORKLOAD */}
            <aside className="workload-card">
              <h2>Workload</h2>
              <p>6 of 10 active slots</p>

              <div className="workload-progress">
                <div className="workload-progress-fill"></div>
              </div>

              <div className="workload-item">
                <span>Investigating</span>
                <strong>3</strong>
              </div>

              <div className="workload-item">
                <span>Waiting for user</span>
                <strong>2</strong>
              </div>

              <div className="workload-item">
                <span>Waiting for vendor</span>
                <strong>1</strong>
              </div>

              <button
                className="open-queue-btn"
                onClick={() => navigate("/technician/queue")}
              >
                Open full queue
              </button>
            </aside>
          </section>
        </section>
      </main>
    </div>
  );
}