import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  BookOpen,
  Check,
  LayoutGrid,
  LogOut,
  Menu,
  MonitorSmartphone,
  Moon,
  Settings as SettingsIcon,
  ShieldAlert,
  Sun,
  Ticket,
} from "lucide-react";
import "./Settings.css";
import { useTheme } from "../../src/context/useTheme";
import { useAuth } from "../../src/context/useAuth";
import { getUserInitials, getUserRoleLabel } from "../../src/utils/userDisplay";
import auLogo from "../../src/assets/AU_logo.jpeg";

const notificationOptions = [
  { key: "statusUpdates", title: "Ticket status changes", description: "When a ticket you reported moves to a new status" },
  { key: "newComments", title: "New comments", description: "When IT staff reply to one of your tickets" },
  { key: "resolved", title: "Ticket resolved", description: "When one of your tickets is marked resolved" },
  { key: "maintenance", title: "Scheduled maintenance", description: "Reminders about planned campus IT maintenance" },
];

export default function Settings() {
  const { user } = useAuth();
  return <SettingsContent key={`${user.name}:${user.department || ""}`} />;
}

function SettingsContent() {
  const navigate = useNavigate();
  const { user, loading, logout, updateProfile } = useAuth();
  const { preference: theme, setTheme } = useTheme();
  const [name, setName] = useState(user.name);
  const [department, setDepartment] = useState(user.department || "");
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [notifications, setNotifications] = useState({
    statusUpdates: true,
    newComments: true,
    resolved: true,
    maintenance: false,
  });

  const draftUser = useMemo(() => ({ ...user, name }), [user, name]);
  const role = getUserRoleLabel(user);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaved(false);
    setSaveError("");

    try {
      await updateProfile({ name, department });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      setSaveError(error.message || "Unable to save your profile.");
    }
  };

  return (
    <div className="settings-page">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo"><img src={auLogo} alt="AU Logo" /></div>
          <div><h2>AU HelpDesk</h2><p>Campus IT Services</p></div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => navigate("/student")}><LayoutGrid size={18} /> Home</button>
          <button className="nav-item" onClick={() => navigate("/student/tickets")}><Ticket size={18} /> My tickets</button>
          <button className="nav-item" onClick={() => navigate("/student/knowledge")}><BookOpen size={18} /> Knowledge base</button>
          <button className="nav-item" onClick={() => navigate("/student/status")}><Activity size={18} /> Campus status</button>
          <button className="nav-item active"><SettingsIcon size={18} /> Settings</button>
        </nav>

        <div className="sidebar-bottom">
          <div className="urgent-box">
            <div className="urgent-icon"><ShieldAlert size={20} /></div>
            <h3>Urgent IT or security issue?</h3><p>Call the Service Desk</p>
            <strong>02-300-4543</strong><small>Mon–Fri · 08:00–18:00</small>
          </div>
          <div className="student-profile">
            <div className="avatar">{getUserInitials(user)}</div>
            <div className="student-profile-info"><strong>{user.name}</strong><span>{user.email}</span></div>
            <button className="profile-settings" onClick={handleLogout} title="Logout"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>

      <main className="settings-main">
        <header className="topbar">
          <div className="topbar-left">
            <button className="sidebar-toggle"><Menu size={20} /></button>
            <div><h2>Settings</h2><p>Manage your account and preferences</p></div>
          </div>
          <div className="topbar-right"><div className="top-avatar">{getUserInitials(user)}</div></div>
        </header>

        <form className="settings-content" onSubmit={handleSave}>
          <section className="settings-card">
            <div className="settings-card-head"><h2>Profile</h2><p>Your personal details and account information</p></div>
            <div className="settings-card-body">
              <div className="profile-header">
                <div className="profile-avatar">{getUserInitials(draftUser)}</div>
                <div><strong>{name || user.name}</strong><small>{user.email}</small></div>
              </div>
              <div className="form-grid">
                <label className="form-field">
                  <span>Full name</span>
                  <input type="text" value={name} maxLength={120} required onChange={(event) => setName(event.target.value)} />
                </label>
                <label className="form-field">
                  <span>Department</span>
                  <input type="text" value={department} maxLength={120} placeholder="Enter your department" onChange={(event) => setDepartment(event.target.value)} />
                </label>
                <label className="form-field">
                  <span>Email</span>
                  <input type="email" value={user.email} readOnly className="readonly" />
                  <small className="field-hint">Managed by your Microsoft account</small>
                </label>
                <label className="form-field">
                  <span>Role</span>
                  <input type="text" value={role} readOnly className="readonly" />
                </label>
              </div>
            </div>
          </section>

          <section className="settings-card">
            <div className="settings-card-head"><h2>Notifications</h2><p>Choose what updates you want to receive</p></div>
            <div className="settings-card-body">
              {notificationOptions.map((option) => (
                <div className="toggle-row" key={option.key}>
                  <div className="toggle-info"><strong>{option.title}</strong><small>{option.description}</small></div>
                  <button
                    type="button"
                    className={`toggle ${notifications[option.key] ? "on" : ""}`}
                    onClick={() => setNotifications((current) => ({ ...current, [option.key]: !current[option.key] }))}
                    aria-pressed={notifications[option.key]}
                    aria-label={option.title}
                  ><span className="toggle-knob"></span></button>
                </div>
              ))}
            </div>
          </section>

          <section className="settings-card">
            <div className="settings-card-head"><h2>Appearance</h2><p>Customize how the workspace looks</p></div>
            <div className="settings-card-body">
              <div className="theme-options">
                {[
                  { value: "light", label: "Light", Icon: Sun },
                  { value: "dark", label: "Dark", Icon: Moon },
                  { value: "system", label: "System", Icon: MonitorSmartphone },
                ].map(({ value, label, Icon }) => (
                  <button type="button" className={`theme-option ${theme === value ? "selected" : ""}`} onClick={() => setTheme(value)} key={value}>
                    <div className={`theme-preview ${value}`}><Icon size={20} /></div><strong>{label}</strong>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <div className="settings-actions">
            {saveError && <span className="save-error" role="alert">{saveError}</span>}
            {saved && <span className="save-confirm"><Check size={15} /> Changes saved</span>}
            <button type="submit" className="save-button" disabled={loading}>{loading ? "Saving…" : "Save changes"}</button>
          </div>
        </form>
      </main>
    </div>
  );
}
