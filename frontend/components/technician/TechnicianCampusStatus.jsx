import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Ticket,
  Wrench,
  BookOpen,
  Activity,
  ShieldAlert,
  ShieldCheck,
  Printer,
  LogOut,
  Menu,
  Moon,
  Bell,
  CheckCircle2,
  Clock,
} from "lucide-react";
import "./TechnicianCampusStatus.css";
import auLogo from "../../src/assets/AU_logo.jpeg";

export default function TechnicianCampusStatus() {
  const navigate = useNavigate();

  const services = [
    {
      name: "AU-Secure Wi-Fi",
      uptime: "30-day uptime 99.98%",
      icon: Activity,
      status: "Operational",
      type: "operational",
    },
    {
      name: "Microsoft 365",
      uptime: "30-day uptime 99.99%",
      icon: ShieldCheck,
      status: "Operational",
      type: "operational",
    },
    {
      name: "Learning Management System",
      uptime: "30-day uptime 99.95%",
      icon: BookOpen,
      status: "Operational",
      type: "operational",
    },
    {
      name: "Campus printing",
      uptime: "30-day uptime 97.42%",
      icon: Printer,
      status: "Degraded",
      type: "degraded",
    },
  ];

  const maintenance = [
    {
      title: "CL Building network upgrade",
      detail:
        "Friday, 4 Sep · 20:00–22:00 · Brief Wi-Fi interruptions expected",
    },
    {
      title: "Microsoft 365 directory synchronization",
      detail:
        "Sunday, 6 Sep · 01:00–02:00 · No expected user impact",
    },
  ];

  return (
    <div className="status-page">
      {/* SIDEBAR */}
      <aside className="status-sidebar">
        <div className="status-brand">
          <div className="status-logo">
            <img src={auLogo} alt="AU Logo" />
          </div>

          <div>
            <h2>AU HelpDesk</h2>
            <p>Campus IT Services</p>
          </div>
        </div>

        <nav className="status-nav">
          <button
            className="status-nav-item"
            onClick={() => navigate("/technician")}
          >
            <span><LayoutGrid size={18} /></span>
            Operations
          </button>

          <button
            className="status-nav-item"
            onClick={() => navigate("/technician/queue")}
          >
            <span><Ticket size={18} /></span>
            Open queue
            <span className="status-count">2</span>
          </button>

          <button
            className="status-nav-item"
            onClick={() => navigate("/technician/assignments")}
          >
            <span><Wrench size={18} /></span>
            My assignments
          </button>

          <button
            className="status-nav-item"
            onClick={() => navigate("/technician/knowledge")}
          >
            <span><BookOpen size={18} /></span>
            Knowledge base
          </button>

          <button className="status-nav-item active">
            <span><Activity size={18} /></span>
            Campus status
          </button>
        </nav>

        <div className="status-sidebar-bottom">
          <div className="status-urgent">
            <div className="status-urgent-icon"><ShieldAlert size={20} /></div>

            <h3>Urgent IT or security issue?</h3>
            <p>Call the Service Desk</p>
            <strong>02-300-4543</strong>
            <small>Mon–Fri · 08:00–18:00</small>
          </div>

          <div className="status-profile">
            <div className="status-avatar">TE</div>

            <div className="status-profile-info">
              <strong>Technician</strong>
              <span>technician@test.local</span>
            </div>

            <button
              className="status-profile-btn"
              onClick={() => navigate("/")}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="status-main">
        {/* TOPBAR */}
        <header className="status-topbar">
          <div className="status-topbar-left">
            <button className="status-menu"><Menu size={18} /></button>

            <div>
              <h2>Campus</h2>
              <p>Campus IT service workspace</p>
            </div>
          </div>

          <div className="status-topbar-right">

            <button className="status-icon"><Moon size={18} /></button>

            <button className="status-icon status-notification">
              <Bell size={18} />
              <span className="status-dot-alert"></span>
            </button>

            <div className="status-top-avatar">TE</div>
          </div>
        </header>

        {/* CONTENT */}
        <section className="status-content">
          <div className="status-spacer"></div>

          <div className="status-heading">
            <div>
              <h1>Campus service status</h1>
              <p>
                Operational information and scheduled maintenance.
              </p>
            </div>

            <span className="all-operational">
              <CheckCircle2 size={18} /> All core systems operational
            </span>
          </div>

          {/* SERVICE CARDS */}
          <section className="status-grid">
            {services.map((service) => {
              const ServiceIcon = service.icon;
              return (
              <article
                className="service-status-card"
                key={service.name}
              >
                <div className="service-status-left">
                  <div
                    className={`service-status-icon ${service.type}`}
                  >
                    <ServiceIcon size={20} />
                  </div>

                  <div>
                    <h3>{service.name}</h3>
                    <p>{service.uptime}</p>
                  </div>
                </div>

                <span
                  className={`service-status-pill ${service.type}`}
                >
                  {service.status}
                </span>
              </article>
              );
            })}
          </section>

          {/* MAINTENANCE */}
          <section className="maintenance-card">
            <div className="maintenance-head">
              <h2>Scheduled maintenance</h2>
              <p>
                Upcoming work that may affect campus services
              </p>
            </div>

            {maintenance.map((item) => (
              <div
                className="maintenance-row"
                key={item.title}
              >
                <div className="maintenance-icon">
                  <Clock size={20} />
                </div>

                <div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>
              </div>
            ))}
          </section>

          {/* EMERGENCY */}
          <section className="emergency-card">
            <div className="emergency-icon">!</div>

            <div>
              <h3>Emergency IT and security reporting</h3>

              <p>
                For phishing, suspected compromise, data loss, or a campus-wide
                outage, call 02-300-4543 immediately.
              </p>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}