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
  Moon,
  Bell,
} from "lucide-react";
import "./AdminShell.css";
import auLogo from "../../src/assets/AU_logo.jpeg";
import { useTheme } from "../../src/context/useTheme";

const NAV = [
  { key: "overview", label: "Overview", Icon: LayoutGrid, to: "/admin" },
  { key: "tickets", label: "All tickets", Icon: Ticket, to: "/admin/tickets" },
  { key: "users", label: "Users & roles", Icon: Users, to: "/admin/users" },
  {
    key: "service",
    label: "Service setup",
    Icon: SlidersHorizontal,
    to: "/admin/service",
  },
  { key: "reports", label: "Reports", Icon: BarChart3, to: "/admin/reports" },
  { key: "audit", label: "Audit logs", Icon: ScrollText, to: "/admin/audit" },
];

export default function AdminShell({ active, title, subtitle, children }) {
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();

  return (
    <div className="admin-shell-page">
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
          {NAV.map((item) => (
            <button
              key={item.key}
              className={`admin-nav-item ${
                active === item.key ? "active" : ""
              }`}
              onClick={() => navigate(item.to)}
            >
              <span>
                <item.Icon size={18} />
              </span>
              {item.label}
            </button>
          ))}
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
      <main className="admin-shell-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="admin-sidebar-toggle">
              <PanelLeft size={18} />
            </button>

            <div>
              <h2>{title}</h2>
              <p>{subtitle}</p>
            </div>
          </div>

          <div className="admin-topbar-right">
            <button
              className="admin-icon-btn"
              onClick={toggleTheme}
              title="Toggle theme"
            >
              <Moon size={18} />
            </button>

            <button
              className="admin-icon-btn admin-notification"
              title="Notifications"
            >
              <Bell size={18} />
            </button>

            <div className="admin-top-avatar">AD</div>
          </div>
        </header>

        <section className="admin-shell-content">{children}</section>
      </main>
    </div>
  );
}
