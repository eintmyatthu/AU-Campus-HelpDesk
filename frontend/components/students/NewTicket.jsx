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
  ChevronDown,
  Moon,
  Bell,
  ArrowLeft,
  Send,
  CheckCircle2,
} from "lucide-react";
import "./NewTicket.css";
import auLogo from "../../src/assets/AU_logo.jpeg";
import { useTickets } from "../../src/context/useTickets";
import { useTheme } from "../../src/context/useTheme";

// Matches the backend Category and Priority enums.
const CATEGORIES = [
  { value: "NETWORK", label: "Network" },
  { value: "SOFTWARE", label: "Software" },
  { value: "HARDWARE", label: "Hardware" },
  { value: "ACCOUNT_ACCESS", label: "Account access" },
  { value: "CLASSROOM_EQUIPMENT", label: "Classroom equipment" },
  { value: "PRINTER", label: "Printer" },
  { value: "OTHER", label: "Other" },
];

const PRIORITIES = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

export default function NewTicket() {
  const navigate = useNavigate();
  const { addTicket } = useTickets();
  const { toggleTheme } = useTheme();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "NETWORK",
    priority: "MEDIUM",
    roomNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Please enter a short title.";
    if (!form.description.trim())
      next.description = "Please describe the issue.";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }

    setSubmitting(true);

    // Persists the ticket via POST /helpdesk/api/tickets through the context.
    try {
      await addTicket(form);
      setSubmitted(true);
    } catch (err) {
      setErrors({ submit: err.message || "Unable to submit ticket." });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="newticket-page">
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

        <main className="newticket-main">
          <section className="newticket-content">
            <div className="success-card">
              <div className="success-icon">
                <CheckCircle2 size={40} />
              </div>

              <h1>Ticket submitted</h1>

              <p>
                Your request has been logged. You can track its status
                from My tickets.
              </p>

              <div className="success-actions">
                <button
                  className="primary-submit"
                  onClick={() => navigate("/student/tickets")}
                >
                  View my tickets
                </button>

                <button
                  className="ghost-button"
                  onClick={() => navigate("/student")}
                >
                  Back to home
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="newticket-page">
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

      {/* MAIN */}
      <main className="newticket-main">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="sidebar-toggle">
              <Menu size={20} />
            </button>

            <div>
              <h2>New ticket</h2>
              <p>Report an issue to Campus IT</p>
            </div>
          </div>

          <div className="topbar-right">
            <button className="student-demo">
              <span className="demo-avatar">ST</span>
              <span>Student demo</span>
              <ChevronDown size={15} />
            </button>

            <button
              className="icon-button"
              title="Toggle theme"
              onClick={toggleTheme}
            >
              <Moon size={18} />
            </button>

            <button className="icon-button notification" title="Notifications">
              <Bell size={18} />
              <span className="notification-dot"></span>
            </button>

            <div className="top-avatar">ST</div>
          </div>
        </header>

        {/* CONTENT */}
        <section className="newticket-content">
          <button
            className="back-link"
            onClick={() => navigate("/student/tickets")}
          >
            <ArrowLeft size={16} />
            Back to tickets
          </button>

          <form className="ticket-form-card" onSubmit={handleSubmit}>
            <div className="form-head">
              <h1>Submit a support request</h1>
              <p>
                Give us a few details so the right team can help you faster.
              </p>
            </div>

            <div className="form-body">
              <label className="field">
                <span>
                  Title <em>*</em>
                </span>
                <input
                  type="text"
                  placeholder="e.g. Campus Wi-Fi keeps disconnecting"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  className={errors.title ? "invalid" : ""}
                />
                {errors.title && (
                  <small className="error-text">{errors.title}</small>
                )}
              </label>

              <label className="field">
                <span>
                  Description <em>*</em>
                </span>
                <textarea
                  rows={5}
                  placeholder="Describe what happened, when it started, and what you already tried."
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  className={errors.description ? "invalid" : ""}
                />
                {errors.description && (
                  <small className="error-text">
                    {errors.description}
                  </small>
                )}
              </label>

              <div className="field-grid">
                <label className="field">
                  <span>Category</span>
                  <select
                    value={form.category}
                    onChange={(e) => update("category", e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span>Priority</span>
                  <select
                    value={form.priority}
                    onChange={(e) => update("priority", e.target.value)}
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="field">
                <span>Location / room number</span>
                <input
                  type="text"
                  placeholder="e.g. CL Building · 403 (optional)"
                  value={form.roomNumber}
                  onChange={(e) => update("roomNumber", e.target.value)}
                />
              </label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="ghost-button"
                onClick={() => navigate("/student/tickets")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-submit"
                disabled={submitting}
              >
                <Send size={16} />
                {submitting ? "Submitting..." : "Submit ticket"}
              </button>
            </div>

            {errors.submit && (
              <p className="newticket-submit-error">{errors.submit}</p>
            )}
          </form>
        </section>
      </main>
    </div>
  );
}
