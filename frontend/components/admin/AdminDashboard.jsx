import { useNavigate } from "react-router-dom";
import {
  Ticket,
  Users,
  ScrollText,
  ShieldCheck,
  Clock,
  Activity,
  ChevronRight,
} from "lucide-react";
import AdminShell from "./AdminShell";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const categoryData = [
    { name: "Network", value: 326, width: "82%" },
    { name: "Hardware", value: 254, width: "64%" },
    { name: "Software", value: 202, width: "51%" },
    { name: "Account access", value: 151, width: "38%" },
    { name: "Printer", value: 96, width: "24%" },
  ];

  const activities = [
    { text: "Admin assigned ICT-2481 to Narin Somchai", time: "Just now" },
    { text: "AI escalated ICT-2488 as urgent", time: "Today" },
    { text: "Test Student signed in with Microsoft", time: "Today" },
  ];

  const stats = [
    {
      key: "open",
      label: "Open tickets",
      value: "4",
      note: "↓ 8% this week",
      Icon: Ticket,
      tone: "blue",
    },
    {
      key: "users",
      label: "Active users",
      value: "2,418",
      note: "46 technicians",
      Icon: Users,
      tone: "green",
    },
    {
      key: "resolution",
      label: "Average resolution",
      value: "5.4h",
      note: "Target: 8h",
      Icon: Clock,
      tone: "orange",
    },
    {
      key: "sla",
      label: "SLA compliance",
      value: "92%",
      note: "Last 30 days",
      Icon: Activity,
      tone: "red",
    },
  ];

  return (
    <AdminShell
      active="overview"
      title="Administration overview"
      subtitle="Campus IT service workspace"
    >
      {/* SYSTEM HEALTH */}
      <section className="system-health">
        <div className="system-health-left">
          <div className="health-icon">
            <ShieldCheck size={20} />
          </div>

          <div>
            <p className="health-label">SYSTEM HEALTH</p>
            <h3>All HelpDesk services are operating normally.</h3>
            <span>Last security check completed today at 14:32.</span>
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
        {stats.map((s) => (
          <div className="admin-stat-card" key={s.key}>
            <div className={`admin-stat-icon ${s.tone}`}>
              <s.Icon size={20} />
            </div>

            <div className="admin-stat-info">
              <p>{s.label}</p>
              <h3>{s.value}</h3>
            </div>

            <small>{s.note}</small>
          </div>
        ))}
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
              <div className="category-row" key={item.name}>
                <span className="category-name">{item.name}</span>

                <div className="category-bar">
                  <div
                    className="category-bar-fill"
                    style={{ width: item.width }}
                  ></div>
                </div>

                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h3>Recent administration activity</h3>
              <p>Role, routing, and ticket events</p>
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
              <div className="activity-row" key={index}>
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
    </AdminShell>
  );
}
