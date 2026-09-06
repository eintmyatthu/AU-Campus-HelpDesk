/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Ticket,
  User,
  Settings,
  Monitor,
  Clock,
  ShieldAlert,
  LogOut,
  Menu,
  Moon,
  Bell,
} from "lucide-react";
import "./AdminShell.css";
import auLogo from "../../src/assets/AU_logo.jpeg";

export default function AdminShell({
  title,
  subtitle = "Campus IT service workspace",
  active,
  children,
}) {
  const navigate = useNavigate();

  return (
    <div className="admin-shell">
      {/* SIDEBAR */}
      <aside className="admin-shell-sidebar">
        <div className="admin-shell-brand">
          <div className="admin-shell-logo">
            <img src={auLogo} alt="AU Logo" />
          </div>

          <div>
            <h2>AU HelpDesk</h2>
            <p>Campus IT Services</p>
          </div>
        </div>

        <nav className="admin-shell-nav">
          <button
            className={`admin-shell-nav-item ${
              active === "overview" ? "active" : ""
            }`}
            onClick={() => navigate("/admin")}
          >
            <span><LayoutGrid size={18} /></span>
            Overview
          </button>

          <button
            className={`admin-shell-nav-item ${
              active === "tickets" ? "active" : ""
            }`}
            onClick={() => navigate("/admin/tickets")}
          >
            <span><Ticket size={18} /></span>
            All tickets
          </button>

          <button
            className={`admin-shell-nav-item ${
              active === "users" ? "active" : ""
            }`}
            onClick={() => navigate("/admin/users")}
          >
            <span><User size={18} /></span>
            Users & roles
          </button>

          <button
            className={`admin-shell-nav-item ${
              active === "service" ? "active" : ""
            }`}
            onClick={() => navigate("/admin/service")}
          >
            <span><Settings size={18} /></span>
            Service setup
          </button>

          <button
            className={`admin-shell-nav-item ${
              active === "reports" ? "active" : ""
            }`}
            onClick={() => navigate("/admin/reports")}
          >
            <span><Monitor size={18} /></span>
            Reports
          </button>

          <button
            className={`admin-shell-nav-item ${
              active === "audit" ? "active" : ""
            }`}
            onClick={() => navigate("/admin/audit")}
          >
            <span><Clock size={18} /></span>
            Audit logs
          </button>
        </nav>

        <div className="admin-shell-bottom">
          <div className="admin-shell-urgent">
            <div className="admin-shell-urgent-icon"><ShieldAlert size={20} /></div>

            <h3>Urgent IT or security issue?</h3>
            <p>Call the Service Desk</p>

            <strong>02-300-4543</strong>

            <small>Mon–Fri · 08:00–18:00</small>
          </div>

          <div className="admin-shell-profile">
            <div className="admin-shell-avatar">AD</div>

            <div className="admin-shell-profile-info">
              <strong>Admin</strong>
              <span>admin@test.local</span>
            </div>

            <button
              className="admin-shell-logout"
              onClick={() => navigate("/")}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="admin-shell-main">
        <header className="admin-shell-topbar">
          <div className="admin-shell-topbar-left">
            <button className="admin-shell-menu">
              <Menu size={18} />
            </button>

            <div>
              <h2>{title}</h2>
              <p>{subtitle}</p>
            </div>
          </div>

          <div className="admin-shell-topbar-right">

            <button className="admin-shell-icon">
              <Moon size={18} />
            </button>

            <button className="admin-shell-icon notification">
              <Bell size={18} />
              <span className="admin-shell-dot"></span>
            </button>

            <div className="admin-shell-top-avatar">
              AD
            </div>
          </div>
        </header>

        <div className="admin-shell-content">
          {children}
        </div>
      </main>
    </div>
  );
}