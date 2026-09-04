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
  ShieldCheck,
  Clock,
  Activity,
  ChevronRight,
} from "lucide-react";
import "./AdminDashboard.css";
import auLogo from "../../src/assets/AU_logo.jpeg";
import { useTheme } from "../../src/context/useTheme";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();

  const categoryData = [
    { name: "Network", value: 326, width: "82%" },
    { name: "Hardware", value: 254, width: "64%" },
    { name: "Software", value: 202, width: "51%" },
    { name: "Account access", value: 151, width: "38%" },
    { name: "Printer", value: 96, width: "24%" },
  ];

  const activities = [
    {
      text: "Admin assigned ICT-2481 to Narin Somchai",
      time: "Just now",
    },
    {
      text: "AI escalated ICT-2488 as urgent",
      time: "Today",
    },
    {
      text: "Test Student signed in with Microsoft",
      time: "Today",
    },
  ];

  return (
    <div className="admin-page">
      {/* =========================
          SIDEBAR
      ========================== */}
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
          <button className="admin-nav-item active">
            <span><LayoutGrid size={18} /></span>
            Overview
          </button>

          <button
            className="admin-nav-item"
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

      {/* =========================
          MAIN
      ========================== */}
      <main className="admin-main">
        {/* TOPBAR */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="admin-sidebar-toggle">
              <PanelLeft size={18} />
            </button>

            <div>
              <h2>Administration overview</h2>
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

            <div className="admin-top-avatar">
              AD
            </div>
          </div>
        </header>

        {/* =========================
            PAGE CONTENT
        ========================== */}
        <section className="admin-content">
          <div className="admin-top-space"></div>

          {/* SYSTEM HEALTH */}
          <section className="system-health">
            <div className="system-health-left">
              <div className="health-icon">
                <ShieldCheck size={20} />
              </div>

              <div>
                <p className="health-label">
                  SYSTEM HEALTH
                </p>

                <h3>
                  All HelpDesk services are operating normally.
                </h3>

                <span>
                  Last security check completed today at 14:32.
                </span>
              </div>
            </div>

            <button
              className="audit-log-btn"
              onClick={() => navigate("/admin/audit")}
            >
              <ScrollText size={16} />
              Audit log
            </button>
          </section>

          {/* STATS */}
          <section className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-icon blue">
                <Ticket size={20} />
              </div>

              <div className="admin-stat-info">
                <p>Open tickets</p>
                <h3>4</h3>
              </div>

              <small>
                ↓ 8% this week
              </small>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon green">
                <Users size={20} />
              </div>

              <div className="admin-stat-info">
                <p>Active users</p>
                <h3>2,418</h3>
              </div>

              <small>
                46 technicians
              </small>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon orange">
                <Clock size={20} />
              </div>

              <div className="admin-stat-info">
                <p>Average resolution</p>
                <h3>5.4h</h3>
              </div>

              <small>
                Target: 8h
              </small>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon red">
                <Activity size={20} />
              </div>

              <div className="admin-stat-info">
                <p>SLA compliance</p>
                <h3>92%</h3>
              </div>

              <small>
                Last 30 days
              </small>
            </div>
          </section>

          {/* BOTTOM PANELS */}
          <section className="admin-bottom-grid">
            {/* TICKET VOLUME */}
            <div className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <h3>Ticket volume by category</h3>
                  <p>Current month</p>
                </div>
              </div>

              <div className="category-list">
                {categoryData.map((item) => (
                  <div
                    className="category-row"
                    key={item.name}
                  >
                    <span className="category-name">
                      {item.name}
                    </span>

                    <div className="category-bar">
                      <div
                        className="category-bar-fill"
                        style={{
                          width: item.width,
                        }}
                      ></div>
                    </div>

                    <strong>
                      {item.value}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <h3>
                    Recent administration activity
                  </h3>

                  <p>
                    Role, routing, and ticket events
                  </p>
                </div>

                <button
                  className="view-all-admin"
                  onClick={() => navigate("/admin/audit")}
                >
                  View all
                  <ChevronRight size={15} />
                </button>
              </div>

              <div className="activity-list">
                {activities.map((activity, index) => (
                  <div
                    className="activity-row"
                    key={index}
                  >
                    <div className="activity-icon">
                      <Clock size={15} />
                    </div>

                    <div>
                      <p>{activity.text}</p>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}