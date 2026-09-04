import { useState } from "react";
import {
  Search,
  Download,
  Ticket,
  ShieldAlert,
  ShieldCheck,
  UserCog,
  SlidersHorizontal,
  LogOut,
  Timer,
} from "lucide-react";
import AdminShell from "./AdminShell";
import "./AdminAuditLogs.css";

const events = [
  {
    id: 1,
    title: "Admin assigned ICT-2481 to Narin Somchai",
    actor: "Test Admin · Administrator · IP recorded",
    time: "Just now",
    type: "ticket",
    Icon: Ticket,
  },
  {
    id: 2,
    title: "AI escalated ICT-2488 as urgent",
    actor: "System automation · IP recorded",
    time: "Just now",
    type: "alert",
    Icon: ShieldAlert,
  },
  {
    id: 3,
    title: "Test Student signed in with Microsoft",
    actor: "Test Admin · Administrator · IP recorded",
    time: "Today",
    type: "auth",
    Icon: ShieldCheck,
  },
  {
    id: 4,
    title: "Test Admin changed Test Technician role to Technician",
    actor: "System automation · IP recorded",
    time: "Today",
    type: "role",
    Icon: UserCog,
  },
  {
    id: 5,
    title: "Category Network routing rule updated",
    actor: "Test Admin · Administrator · IP recorded",
    time: "Today",
    type: "config",
    Icon: SlidersHorizontal,
  },
  {
    id: 6,
    title: "Test Student session expired securely",
    actor: "System automation · IP recorded",
    time: "Yesterday",
    type: "auth",
    Icon: LogOut,
  },
  {
    id: 7,
    title: "SLA rule Urgent was updated",
    actor: "Test Admin · Administrator · IP recorded",
    time: "Yesterday",
    type: "sla",
    Icon: Timer,
  },
];

const FILTERS = ["All events", "Tickets", "Authentication", "Roles", "Configuration"];

const typeToFilter = {
  ticket: "Tickets",
  alert: "Tickets",
  auth: "Authentication",
  role: "Roles",
  config: "Configuration",
  sla: "Configuration",
};

export default function AdminAuditLogs() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All events");

  const filtered = events.filter((e) => {
    const q = search.toLowerCase();
    const matchesSearch =
      e.title.toLowerCase().includes(q) ||
      e.actor.toLowerCase().includes(q);
    const matchesFilter =
      filter === "All events" || typeToFilter[e.type] === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminShell
      active="audit"
      title="Audit"
      subtitle="Campus IT service workspace"
    >
      <div className="audit-toolbar">
        <div className="audit-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search events, users, or ticket IDs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="audit-toolbar-right">
          <select
            className="audit-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {FILTERS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          <button className="admin-secondary-btn">
            <Download size={15} />
            Export audit log
          </button>
        </div>
      </div>

      <div className="audit-list">
        {filtered.map((event) => (
          <div className="audit-row admin-panel-card" key={event.id}>
            <div className={`audit-icon ${event.type}`}>
              <event.Icon size={16} />
            </div>

            <div className="audit-info">
              <strong>{event.title}</strong>
              <small>{event.actor}</small>
            </div>

            <span className="audit-time">{event.time}</span>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="audit-empty admin-panel-card">
            No audit events match your filters.
          </div>
        )}
      </div>
    </AdminShell>
  );
}
