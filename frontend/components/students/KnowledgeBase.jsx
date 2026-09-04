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
  ChevronRight,

  Wifi,

  KeyRound,

  AppWindow,

  Printer,

  MonitorPlay,

  ShieldCheck,

  LifeBuoy,

} from "lucide-react";

import "./KnowledgeBase.css";

import auLogo from "../../src/assets/AU_logo.jpeg";
 
export default function KnowledgeBase() {

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
 
  const guides = [

    {

      category: "Network",

      Icon: Wifi,

      title: "Connect to AU-Secure Wi-Fi",

      description: "Setup for macOS, Windows, iOS, and Android",

      helpful: "94%",

    },

    {

      category: "Account",

      Icon: KeyRound,

      title: "Reset your university password",

      description: "Recover access and update multi-factor authentication",

      helpful: "91%",

    },

    {

      category: "Software",

      Icon: AppWindow,

      title: "Install Microsoft 365",

      description: "Download and activate university-licensed applications",

      helpful: "88%",

    },

    {

      category: "Printer",

      Icon: Printer,

      title: "Connect to campus printers",

      description: "Printer IDs, drivers, queues, and common fixes",

      helpful: "86%",

    },

    {

      category: "Classroom",

      Icon: MonitorPlay,

      title: "Classroom display troubleshooting",

      description: "Checks for projectors, HDMI, audio, and lecterns",

      helpful: "93%",

    },

    {

      category: "Security",

      Icon: ShieldCheck,

      title: "Report a suspicious email",

      description: "Immediate steps for phishing and account security",

      helpful: "97%",

    },

  ];
 
  const filteredGuides = guides.filter((guide) => {

    const value = searchTerm.toLowerCase();
 
    return (

      guide.title.toLowerCase().includes(value) ||

      guide.category.toLowerCase().includes(value) ||

      guide.description.toLowerCase().includes(value)

    );

  });
 
  return (
<div className="knowledge-page">
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
 
          <button className="nav-item active">
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
 
      <main className="knowledge-main">
<header className="topbar">
<div className="topbar-left">
<button className="sidebar-toggle">
<Menu size={20} />
</button>
 
            <div>
<h2>Knowledge</h2>
<p>Campus IT service workspace</p>
</div>
</div>
 
          <div className="topbar-right">
            <div className="top-avatar">ST</div>
          </div>
        </header>

        <section className="knowledge-content">
<section className="knowledge-hero">
<div className="knowledge-hero-icon">
<BookOpen size={26} />
</div>
 
            <h1>Find a quick solution</h1>
 
            <p>

              Search guides maintained and reviewed by Campus IT Services.
</p>
 
            <div className="knowledge-search">
<Search size={17} />
 
              <input

                type="text"

                placeholder="Search Wi-Fi, Microsoft 365, printers..."

                value={searchTerm}

                onChange={(e) => setSearchTerm(e.target.value)}

              />
</div>
</section>
 
          <section className="knowledge-grid">

            {filteredGuides.map((guide) => (
<article

                className="knowledge-card"

                key={guide.title}
>
<div className="guide-icon">
<guide.Icon size={21} />
</div>
 
                <span className="guide-category">

                  {guide.category}
</span>
 
                <h3>{guide.title}</h3>
 
                <p>{guide.description}</p>
 
                <div className="guide-footer">
<button>

                    Read guide
<ChevronRight size={15} />
</button>
 
                  <small>

                    {guide.helpful} found helpful
</small>
</div>
</article>

            ))}
</section>
 
          {filteredGuides.length === 0 && (
<div className="no-guides">

              No guides found.
</div>

          )}
 
          <section className="help-banner">
<div className="help-left">
<div className="help-icon">
<LifeBuoy size={22} />
</div>
 
              <div>
<h3>Still need help?</h3>
 
                <p>

                  Create a ticket and include what you already tried.
</p>
</div>
</div>
 
            <button

              onClick={() => navigate("/student/tickets")}
>

              Contact IT support
</button>
</section>
</section>
</main>
</div>

  );

}
 