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

  Moon,

  Sun,

  MonitorSmartphone,

  Check,

} from "lucide-react";

import "./Settings.css";

import auLogo from "../../src/assets/AU_logo.jpeg";
 
export default function Settings() {

  const navigate = useNavigate();
 
  // Profile state (mock — in production loaded from /api/users/me).

  const [name, setName] = useState("Student");

  const [department, setDepartment] = useState("Computer Science");

  const email = "student@test.local";

  const role = "Student";
 
  // Notification preferences (mock).

  const [notifications, setNotifications] = useState({

    statusUpdates: true,

    newComments: true,

    resolved: true,

    maintenance: false,

  });
 
  // Appearance.

  const [theme, setTheme] = useState("light");
 
  const [saved, setSaved] = useState(false);
 
  const toggleNotification = (key) => {

    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  };
 
  const handleSave = (e) => {

    e.preventDefault();

    // In production: PATCH /api/users/me with { name, department, notifications, theme }

    setSaved(true);

    setTimeout(() => setSaved(false), 2500);

  };
 
  const notificationOptions = [

    {

      key: "statusUpdates",

      title: "Ticket status changes",

      description: "When a ticket you reported moves to a new status",

    },

    {

      key: "newComments",

      title: "New comments",

      description: "When IT staff reply to one of your tickets",

    },

    {

      key: "resolved",

      title: "Ticket resolved",

      description: "When one of your tickets is marked resolved",

    },

    {

      key: "maintenance",

      title: "Scheduled maintenance",

      description: "Reminders about planned campus IT maintenance",

    },

  ];
 
  return (
<div className="settings-page">

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
 
          <button

            className="nav-item"

            onClick={() => navigate("/student/tickets")}
>
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
 
          <button className="nav-item active">
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
<main className="settings-main">

        {/* TOPBAR */}
<header className="topbar">
<div className="topbar-left">
<button className="sidebar-toggle">
<Menu size={20} />
</button>
 
            <div>
<h2>Settings</h2>
<p>Manage your account and preferences</p>
</div>
</div>
 
          <div className="topbar-right">
<div className="top-avatar">ST</div>
</div>
</header>
 
        {/* CONTENT */}
<form className="settings-content" onSubmit={handleSave}>

          {/* PROFILE */}
<section className="settings-card">
<div className="settings-card-head">
<h2>Profile</h2>
<p>Your personal details and account information</p>
</div>
 
            <div className="settings-card-body">
<div className="profile-header">
<div className="profile-avatar">ST</div>
 
                <div>
<strong>{name}</strong>
<small>{email}</small>
</div>
</div>
 
              <div className="form-grid">
<label className="form-field">
<span>Full name</span>
<input

                    type="text"

                    value={name}

                    onChange={(e) => setName(e.target.value)}

                  />
</label>
 
                <label className="form-field">
<span>Department</span>
<input

                    type="text"

                    value={department}

                    onChange={(e) => setDepartment(e.target.value)}

                  />
</label>
 
                <label className="form-field">
<span>Email</span>
<input

                    type="email"

                    value={email}

                    readOnly

                    className="readonly"

                  />
<small className="field-hint">

                    Managed by your Microsoft account
</small>
</label>
 
                <label className="form-field">
<span>Role</span>
<input

                    type="text"

                    value={role}

                    readOnly

                    className="readonly"

                  />
</label>
</div>
</div>
</section>
 
          {/* NOTIFICATIONS */}
<section className="settings-card">
<div className="settings-card-head">
<h2>Notifications</h2>
<p>Choose what updates you want to receive</p>
</div>
 
            <div className="settings-card-body">

              {notificationOptions.map((option) => (
<div className="toggle-row" key={option.key}>
<div className="toggle-info">
<strong>{option.title}</strong>
<small>{option.description}</small>
</div>
 
                  <button

                    type="button"

                    className={`toggle ${

                      notifications[option.key] ? "on" : ""

                    }`}

                    onClick={() => toggleNotification(option.key)}

                    aria-pressed={notifications[option.key]}

                    aria-label={option.title}
>
<span className="toggle-knob"></span>
</button>
</div>

              ))}
</div>
</section>
 
          {/* APPEARANCE */}
<section className="settings-card">
<div className="settings-card-head">
<h2>Appearance</h2>
<p>Customize how the workspace looks</p>
</div>
 
            <div className="settings-card-body">
<div className="theme-options">
<button

                  type="button"

                  className={`theme-option ${

                    theme === "light" ? "selected" : ""

                  }`}

                  onClick={() => setTheme("light")}
>
<div className="theme-preview light">
<Sun size={20} />
</div>
<strong>Light</strong>
</button>
 
                <button

                  type="button"

                  className={`theme-option ${

                    theme === "dark" ? "selected" : ""

                  }`}

                  onClick={() => setTheme("dark")}
>
<div className="theme-preview dark">
<Moon size={20} />
</div>
<strong>Dark</strong>
</button>
 
                <button

                  type="button"

                  className={`theme-option ${

                    theme === "system" ? "selected" : ""

                  }`}

                  onClick={() => setTheme("system")}
>
<div className="theme-preview system">
<MonitorSmartphone size={20} />
</div>
<strong>System</strong>
</button>
</div>
</div>
</section>
 
          {/* ACTIONS */}
<div className="settings-actions">

            {saved && (
<span className="save-confirm">
<Check size={15} />

                Changes saved
</span>

            )}
 
            <button type="submit" className="save-button">

              Save changes
</button>
</div>
</form>
</main>
</div>

  );

}

 