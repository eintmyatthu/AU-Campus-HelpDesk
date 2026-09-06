/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminShell.css";
import auLogo from "../../assets/AU_logo.jpeg";

export default function AdminShell({
  title,
  activePage,
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
              activePage === "overview" ? "active" : ""
            }`}
            onClick={() => navigate("/admin")}
          >
            <span>⊞</span>
            Overview
          </button>

          <button
            className={`admin-shell-nav-item ${
              activePage === "tickets" ? "active" : ""
            }`}
            onClick={() => navigate("/admin/tickets")}
          >
            <span>🎫</span>
            All tickets
          </button>

          <button
            className={`admin-shell-nav-item ${
              activePage === "users" ? "active" : ""
            }`}
          >
            <span>♙</span>
            Users & roles
          </button>

          <button
            className={`admin-shell-nav-item ${
              activePage === "service" ? "active" : ""
            }`}
            onClick={() => navigate("/admin/service")}
          >
            <span>⚙</span>
            Service setup
          </button>

          <button
            className={`admin-shell-nav-item ${
              activePage === "reports" ? "active" : ""
            }`}
          >
            <span>▥</span>
            Reports
          </button>

          <button
            className={`admin-shell-nav-item ${
              activePage === "audit" ? "active" : ""
            }`}
          >
            <span>◷</span>
            Audit logs
          </button>
        </nav>

        <div className="admin-shell-bottom">
          <div className="admin-shell-urgent">
            <div className="admin-shell-urgent-icon">◎</div>

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
              ↪
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="admin-shell-main">
        <header className="admin-shell-topbar">
          <div className="admin-shell-topbar-left">
            <button className="admin-shell-menu">
              ◫
            </button>

            <div>
              <h2>{title}</h2>
              <p>Campus IT service workspace</p>
            </div>
          </div>

          <div className="admin-shell-topbar-right">
            <button className="admin-shell-demo">
              <span>♙</span>
              <span>Administrator demo</span>
              <span>⌄</span>
            </button>

            <button className="admin-shell-icon">
              ☾
            </button>

            <button className="admin-shell-icon notification">
              ♧
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