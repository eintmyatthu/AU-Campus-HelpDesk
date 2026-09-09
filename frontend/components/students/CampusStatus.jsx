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

  CheckCircle2,

  AlertTriangle,

  Wrench,

  TrendingUp,

  TrendingDown,

  Minus,

} from "lucide-react";

import "./CampusStatus.css";

import auLogo from "../../src/assets/AU_logo.jpeg";
 
export default function CampusStatus() {

  const navigate = useNavigate();
 
  // Mock service health. In production this comes from /api/status.

  const services = [

    {

      name: "Campus Wi-Fi",

      description: "AU-Secure & AU-Guest wireless networks",

      status: "operational",

    },

    {

      name: "Microsoft 365",

      description: "Outlook, Teams, OneDrive, and Office apps",

      status: "operational",

    },

    {

      name: "Moodle LMS",

      description: "Course content, assignments, and grades",

      status: "degraded",

    },

    {

      name: "Campus Printers",

      description: "Library and lab printing queues",

      status: "operational",

    },

    {

      name: "VPN Access",

      description: "Remote access to campus resources",

      status: "outage",

    },

    {

      name: "Classroom AV",

      description: "Projectors, displays, and lecterns",

      status: "maintenance",

    },

  ];
 
  // Mock active incidents. In production this comes from /api/incidents.

  const incidents = [

    {

      id: "INC-104",

      title: "VPN connection failures for off-campus users",

      service: "VPN Access",

      severity: "Major outage",

      startedAt: "Today, 09:12",

      update:

        "Engineers have identified an authentication node failure and are failing over to a backup. Next update in 30 minutes.",

    },

    {

      id: "INC-103",

      title: "Moodle running slower than usual",

      service: "Moodle LMS",

      severity: "Degraded performance",

      startedAt: "Today, 08:40",

      update:

        "Increased load during morning submissions. We are scaling additional capacity and monitoring response times.",

    },

  ];
 
  // Derived from open tickets grouped by category (mock of a real aggregate query).

  const trendingIssues = [

    { category: "Network", count: 12, trend: "up" },

    { category: "Account access", count: 7, trend: "up" },

    { category: "Software", count: 4, trend: "flat" },

    { category: "Printer", count: 2, trend: "down" },

  ];
 
  // Mock scheduled maintenance windows.

  const maintenance = [

    {

      title: "Email server security patching",

      service: "Microsoft 365",

      window: "Sat, 14 Sep · 22:00 – 23:30",

      impact: "Brief interruptions to Outlook sending expected.",

    },

    {

      title: "Classroom AV firmware update",

      service: "Classroom AV",

      window: "Sun, 15 Sep · 07:00 – 09:00",

      impact: "Projectors in the CL Building will be offline.",

    },

  ];
 
  const statusLabels = {

    operational: "Operational",

    degraded: "Degraded",

    outage: "Outage",

    maintenance: "Maintenance",

  };
 
  const operationalCount = services.filter(

    (s) => s.status === "operational"

  ).length;
 
  const allOperational = operationalCount === services.length;
 
  return (
<div className="status-page">

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
 
          <button className="nav-item active">
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
<main className="status-main">

        {/* TOPBAR */}
<header className="topbar">
<div className="topbar-left">
<button className="sidebar-toggle">
<Menu size={20} />
</button>
 
            <div>
<h2>Campus status</h2>
<p>Live health of campus IT services</p>
</div>
</div>
 
          <div className="topbar-right">
 
            <div className="top-avatar">ST</div>
</div>
</header>
 
        {/* CONTENT */}
<section className="status-content">

          {/* OVERALL BANNER */}
<div

            className={`status-overall ${

              allOperational ? "ok" : "issues"

            }`}
>
<div className="status-overall-icon">

              {allOperational ? (
<CheckCircle2 size={26} />

              ) : (
<AlertTriangle size={26} />

              )}
</div>
 
            <div>
<h1>

                {allOperational

                  ? "All systems operational"

                  : "Some systems are experiencing issues"}
</h1>
 
              <p>

                {operationalCount} of {services.length} services

                operational · Updated just now
</p>
</div>
</div>
 
          {/* SERVICE LIST */}
<section className="status-section">
<div className="section-heading">
<div>
<h2>Services</h2>
<p>Current status of monitored campus systems</p>
</div>
</div>
 
            <div className="service-list">

              {services.map((service) => (
<div className="service-row" key={service.name}>
<div className="service-info">
<span

                      className={`status-dot ${service.status}`}
></span>
 
                    <div>
<strong>{service.name}</strong>
<small>{service.description}</small>
</div>
</div>
 
                  <span className={`status-badge ${service.status}`}>

                    {statusLabels[service.status]}
</span>
</div>

              ))}
</div>
</section>
 
          {/* TWO COLUMN: INCIDENTS + TRENDING */}
<div className="status-columns">

            {/* ACTIVE INCIDENTS */}
<section className="status-section">
<div className="section-heading">
<div>
<h2>Active incidents</h2>
<p>Issues our team is currently working on</p>
</div>
</div>
 
              {incidents.length === 0 ? (
<div className="empty-card">

                  No active incidents. Everything is running smoothly.
</div>

              ) : (
<div className="incident-list">

                  {incidents.map((incident) => (
<article

                      className="incident-card"

                      key={incident.id}
>
<div className="incident-top">
<span className="incident-severity">

                          {incident.severity}
</span>
<small>{incident.startedAt}</small>
</div>
 
                      <h3>{incident.title}</h3>
 
                      <span className="incident-service">

                        {incident.service}
</span>
 
                      <p>{incident.update}</p>
</article>

                  ))}
</div>

              )}
</section>
 
            {/* TRENDING ISSUES */}
<section className="status-section">
<div className="section-heading">
<div>
<h2>Trending issues</h2>
<p>Open tickets by category in the last hour</p>
</div>
</div>
 
              <div className="trending-list">

                {trendingIssues.map((item) => (
<div

                    className="trending-row"

                    key={item.category}
>
<div className="trending-info">
<strong>{item.category}</strong>
<small>{item.count} open tickets</small>
</div>
 
                    <span className={`trend-pill ${item.trend}`}>

                      {item.trend === "up" ? (
<>
<TrendingUp size={13} />

                          Rising
</>

                      ) : item.trend === "down" ? (
<>
<TrendingDown size={13} />

                          Falling
</>

                      ) : (
<>
<Minus size={13} />

                          Steady
</>

                      )}
</span>
</div>

                ))}
</div>
</section>
</div>
 
          {/* SCHEDULED MAINTENANCE */}
<section className="status-section">
<div className="section-heading">
<div>
<h2>Scheduled maintenance</h2>
<p>Planned work that may affect service availability</p>
</div>
</div>
 
            <div className="maintenance-list">

              {maintenance.map((item) => (
<div className="maintenance-row" key={item.title}>
<div className="maintenance-icon">
<Wrench size={18} />
</div>
 
                  <div className="maintenance-info">
<strong>{item.title}</strong>
<small>{item.impact}</small>
</div>
 
                  <div className="maintenance-meta">
<span className="maintenance-service">

                      {item.service}
</span>
<span className="maintenance-window">

                      {item.window}
</span>
</div>
</div>

              ))}
</div>
</section>
</section>
</main>
</div>

  );

}

 