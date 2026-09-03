import React from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import auLogo from "../../src/assets/AU_logo.jpeg";
import ticketIcon from "../../src/assets/Ticket.png"

export default function StudentDashboard() {
  const navigate = useNavigate();

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
            <span>⊞</span>
            Home
          </button>

          <button className="nav-item" onClick={handleMyTickets}>
            <span>
                <div className="ticketIcon">
                    <img src={ticketIcon} alt="Ticket Icon"/>
                </div>
            </span>
            My tickets
          </button>

          <button className="nav-item">
            <span>▱</span>
            Knowledge base
          </button>

          <button className="nav-item">
            <span>⌁</span>
            Campus status
          </button>

          <button className="nav-item">
            <span>⚙</span>
            Settings
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="urgent-box">
            <div className="urgent-icon">◎</div>

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
              ⎋
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-area">
        {/* TOP BAR */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="sidebar-toggle">☰</button>

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
              <p className="hero-label">✣ AI-ASSISTED SUPPORT</p>

              <h1>What can Campus IT help with?</h1>

              <p className="hero-text">
                Report an issue, get suggested solutions, and follow every
                update from one place.
              </p>

              <div className="hero-buttons">
                <button className="primary-button">
                  <span>＋</span>
                  Submit a ticket
                </button>

                <button className="secondary-button">
                  <span>▱</span>
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
                     <img src={ticketIcon} alt="Ticket Icon"/>
                </div>

                <div>
                  <p>Open tickets</p>
                  <h3>2</h3>
                </div>
              </div>

              <small>Across your account</small>
            </div>

            <div className="stat-card">
              <div className="stat-left">
                <div className="stat-icon orange">□</div>

                <div>
                  <p>Awaiting your reply</p>
                  <h3>1</h3>
                </div>
              </div>

              <small>Action may be needed</small>
            </div>

            <div className="stat-card">
              <div className="stat-left">
                <div className="stat-icon green">✓</div>

                <div>
                  <p>Resolved this month</p>
                  <h3>7</h3>
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
                <span>›</span>
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

              <div className="ticket-row">
                <div>
                  <p className="ticket-number">ICT-2481</p>
                  <strong>
                    Campus Wi-Fi disconnects in CL Building
                  </strong>
                  <small>CL Building · 403</small>
                </div>

                <span>Network</span>

                <span className="priority">
                  <i className="priority-dot high"></i>
                  High
                </span>

                <span>
                  <span className="status-pill progress">
                    In progress
                  </span>
                </span>

                <span className="response-text">
                  Today, 15:00
                </span>

                <span className="ticket-arrow">›</span>
              </div>

              <div className="ticket-row">
                <div>
                  <p className="ticket-number">ICT-2476</p>
                  <strong>
                    Unable to access Microsoft 365 account
                  </strong>
                  <small>Online service</small>
                </div>

                <span>Account access</span>

                <span className="priority">
                  <i className="priority-dot medium"></i>
                  Medium
                </span>

                <span>
                  <span className="status-pill waiting">
                    Waiting for user
                  </span>
                </span>

                <span className="response-text">
                  Waiting for your reply
                </span>

                <span className="ticket-arrow">›</span>
              </div>
            </div>
          </section>

          {/* BOTTOM CARDS */}
          <section className="bottom-grid">
            <div className="info-card">
              <div className="info-icon">⌁</div>

              <div className="info-text">
                <strong>
                  AU-Secure connection guide
                </strong>

                <p>
                  Resolve common Wi-Fi setup issues before
                  submitting a request.
                </p>
              </div>

              <button>Open guide</button>
            </div>

            <div className="info-card">
              <div className="info-icon">♧</div>

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