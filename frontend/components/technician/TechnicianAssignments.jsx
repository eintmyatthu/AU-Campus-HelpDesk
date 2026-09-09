// TechnicianAssignments.jsx

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
  ChevronRight,
} from "lucide-react";
import "./TechnicianAssignments.css";
import auLogo from "../../src/assets/AU_logo.jpeg";

export default function TechnicianAssignments() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");

  const tickets = [
    {
      id: "ICT-2481",
      title: "Campus Wi-Fi disconnects in CL Building",
      location: "CL Building · 403",
      category: "Network",
      priority: "High",
      status: "In progress",
      response: "Today, 15:00",
      escalated: false,
    },
    {
      id: "ICT-2459",
      title: "Projector shows no HDMI signal",
      location: "VMS Building · 201",
      category: "Classroom equipment",
      priority: "Medium",
      status: "Resolved",
      response: "Resolved within SLA",
      escalated: false,
    },
    {
      id: "ICT-2489",
      title: "Printer is producing blank pages",
      location: "Central Library · Floor 3",
      category: "Printer",
      priority: "Medium",
      status: "Unassigned",
      response: "Within 2 hours",
      escalated: false,
    },
    {
      id: "ICT-2488",
      title: "Cannot connect to AU-Secure network",
      location: "SG Building · 106",
      category: "Network",
      priority: "Urgent",
      status: "Unassigned",
      response: "Within 30 minutes",
      escalated: true,
    },
  ];

  const filteredTickets = tickets.filter((ticket) => {
    const query = searchTerm.toLowerCase();

    const matchesSearch =
      ticket.id.toLowerCase().includes(query) ||
      ticket.title.toLowerCase().includes(query) ||
      ticket.category.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All statuses" ||
      ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="assignments-page">
      {/* SIDEBAR */}
      <aside className="assignments-sidebar">
        <div className="assignments-brand">
          <div className="assignments-logo">
            <img src={auLogo} alt="AU Logo" />
          </div>

          <div>
            <h2>AU HelpDesk</h2>
            <p>Campus IT Services</p>
          </div>
        </div>

        <nav className="assignments-nav">
          <button
            className="assignments-nav-item"
            onClick={() => navigate("/technician")}
          >
            <span><LayoutGrid size={18} /></span>
            Operations
          </button>

          <button
            className="assignments-nav-item"
            onClick={() => navigate("/technician/queue")}
          >
            <span><Ticket size={18} /></span>
            Open queue

            <span className="assignments-count">2</span>
          </button>

          <button className="assignments-nav-item active">
            <span><Wrench size={18} /></span>
            My assignments
          </button>

<button
  className="assignments-nav-item"
  onClick={() => navigate("/technician/knowledge")}
>
  <span><BookOpen size={18} /></span>
  Knowledge base
</button>

<button
  className="assignments-nav-item"
  onClick={() => navigate("/technician/status")}
>
  <span><Activity size={18} /></span>
  Campus status
</button>
        </nav>

        <div className="assignments-sidebar-bottom">
          <div className="assignments-urgent">
            <div className="assignments-urgent-icon"><ShieldAlert size={20} /></div>

            <h3>Urgent IT or security issue?</h3>
            <p>Call the Service Desk</p>

            <strong>02-300-4543</strong>

            <small>Mon–Fri · 08:00–18:00</small>
          </div>

          <div className="assignments-profile">
            <div className="assignments-avatar">TE</div>

            <div className="assignments-profile-info">
              <strong>Technician</strong>
              <span>technician@test.local</span>
            </div>

            <button
              className="assignments-profile-btn"
              onClick={() => navigate("/")}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="assignments-main">
        {/* TOP BAR */}
        <header className="assignments-topbar">
          <div className="assignments-topbar-left">
            <button className="assignments-menu">
              <Menu size={18} />
            </button>

            <div>
              <h2>Tickets</h2>
              <p>Campus IT service workspace</p>
            </div>
          </div>

          <div className="assignments-topbar-right">

            <button className="assignments-icon">
              <Moon size={18} />
            </button>

            <button className="assignments-icon assignments-notification">
              <Bell size={18} />
              <span className="assignments-dot"></span>
            </button>

            <div className="assignments-top-avatar">
              TE
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <section className="assignments-content">
          <div className="assignments-spacer"></div>

          {/* TOOLBAR */}
          <div className="assignments-toolbar">
            <div className="assignments-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search ticket ID, title, or category"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="assignments-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All statuses</option>
              <option>In progress</option>
              <option>Resolved</option>
              <option>Unassigned</option>
            </select>
          </div>

          {/* TABLE */}
          <div className="assignments-table">
            <div className="assignments-table-header">
              <span>TICKET</span>
              <span>CATEGORY</span>
              <span>PRIORITY</span>
              <span>STATUS</span>
              <span>EXPECTED RESPONSE</span>
              <span></span>
            </div>

            {filteredTickets.map((ticket) => (
              <div
                className="assignments-table-row"
                key={ticket.id}
              >
                <div>
                  <div className="assignments-ticket-id-row">
                    <span className="assignments-ticket-id">
                      {ticket.id}
                    </span>

                    {ticket.escalated && (
                      <span className="assignments-escalated">
                        Escalated
                      </span>
                    )}
                  </div>

                  <strong>{ticket.title}</strong>
                  <small>{ticket.location}</small>
                </div>

                <span>{ticket.category}</span>

                <span className="assignments-priority">
                  <i
                    className={`assignments-priority-dot ${
                      ticket.priority === "Urgent"
                        ? "urgent"
                        : ticket.priority === "High"
                        ? "high"
                        : "medium"
                    }`}
                  ></i>

                  {ticket.priority}
                </span>

                <span>
                  <span
                    className={`assignments-status ${
                      ticket.status === "In progress"
                        ? "progress"
                        : ticket.status === "Resolved"
                        ? "resolved"
                        : "unassigned"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </span>

                <span className="assignments-response">
                  {ticket.response}
                </span>

                <button className="assignments-arrow">
                  <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="assignments-footer">
            <p>
              Showing {filteredTickets.length} tickets
            </p>

            <div className="assignments-pagination">
              <button disabled>Previous</button>
              <button disabled>Next</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}