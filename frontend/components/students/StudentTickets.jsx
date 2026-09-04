import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Ticket,
  BookOpen,
  Activity,
  Settings as SettingsIcon,
  ShieldAlert,
  LogOut,
  Menu,
  Search,
  Plus,
  ChevronDown,
  Moon,
  Bell,
  ChevronRight,
} from "lucide-react";
import "./StudentTickets.css";
import auLogo from "../../src/assets/AU_logo.jpeg";

export default function StudentTickets() {
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
    },
    {
      id: "ICT-2476",
      title: "Unable to access Microsoft 365 account",
      location: "Online service",
      category: "Account access",
      priority: "Medium",
      status: "Waiting for user",
      response: "Waiting for your reply",
    },
  ];

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All statuses" ||
      ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="tickets-page">
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
          <button
            className="nav-item"
            onClick={() => navigate("/student")}
          >
            <LayoutGrid size={18} />
            Home
          </button>

          <button className="nav-item active">
            <Ticket size={18} />
            My tickets
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/student/knowledge")}
          >
            <BookOpen size={18} />
            Knowledge base
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/student/status")}
          >
            <Activity size={18} />
            Campus status
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/student/settings")}
          >
            <SettingsIcon size={18} />
            Settings
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="urgent-box">
            <div className="urgent-icon">
              <ShieldAlert size={20} />
            </div>

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
              className="profile-settings"
              onClick={() => navigate("/")}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="tickets-main">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="sidebar-toggle">
              <Menu size={20} />
            </button>

            <div>
              <h2>Tickets</h2>
              <p>Campus IT service workspace</p>
            </div>
          </div>

          <div className="topbar-right">
            <button className="student-demo">
              <span className="demo-avatar">ST</span>
              <span>Student demo</span>
              <ChevronDown size={15} />
            </button>

            <button className="icon-button" title="Toggle theme">
              <Moon size={18} />
            </button>

            <button className="icon-button notification" title="Notifications">
              <Bell size={18} />
              <span className="notification-dot"></span>
            </button>

            <div className="top-avatar">ST</div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <section className="tickets-content">
          <div className="tickets-spacer"></div>

          {/* TOOLBAR */}
          <div className="tickets-toolbar">
            <div className="search-wrapper">
              <span className="search-icon">
                <Search size={16} />
              </span>

              <input
                type="text"
                placeholder="Search ticket ID, title, or category"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="toolbar-right">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All statuses</option>
                <option>In progress</option>
                <option>Waiting for user</option>
              </select>

              <button
                className="new-ticket-btn"
                onClick={() => navigate("/student/new-ticket")}
              >
                <Plus size={16} />
                New ticket
              </button>
            </div>
          </div>

          {/* TICKET TABLE */}
          <div className="tickets-table-box">
            <div className="tickets-header-row">
              <span>TICKET</span>
              <span>CATEGORY</span>
              <span>PRIORITY</span>
              <span>STATUS</span>
              <span>EXPECTED RESPONSE</span>
              <span></span>
            </div>

            {filteredTickets.map((ticket) => (
              <div
                className="tickets-data-row"
                key={ticket.id}
              >
                <div>
                  <p className="ticket-id">{ticket.id}</p>

                  <strong>{ticket.title}</strong>

                  <small>{ticket.location}</small>
                </div>

                <span>{ticket.category}</span>

                <span className="priority-cell">
                  <i
                    className={`priority-dot ${
                      ticket.priority === "High"
                        ? "high"
                        : "medium"
                    }`}
                  ></i>

                  {ticket.priority}
                </span>

                <span>
                  <span
                    className={`ticket-status ${
                      ticket.status === "In progress"
                        ? "in-progress"
                        : "waiting"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </span>

                <span className="expected-response">
                  {ticket.response}
                </span>

                <button className="row-arrow">
                  <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="tickets-footer">
            <p>Showing {filteredTickets.length} tickets</p>

            <div className="pagination">
              <button disabled>
                Previous
              </button>

              <button disabled>
                Next
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}