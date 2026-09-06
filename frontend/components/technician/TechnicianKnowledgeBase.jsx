import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Ticket,
  Wrench,
  BookOpen,
  Activity,
  ShieldAlert,
  ShieldCheck,
  Monitor,
  Printer,
  LogOut,
  Menu,
  Moon,
  Bell,
  ChevronRight,
} from "lucide-react";
import "./TechnicianKnowledgeBase.css";
import auLogo from "../../src/assets/AU_logo.jpeg";

export default function TechnicianKnowledgeBase() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const guides = [
    {
      category: "Network",
      icon: Activity,
      title: "Connect to AU-Secure Wi-Fi",
      description: "Setup for macOS, Windows, iOS, and Android",
      helpful: "94%",
    },
    {
      category: "Account",
      icon: ShieldCheck,
      title: "Reset your university password",
      description: "Recover access and update multi-factor authentication",
      helpful: "91%",
    },
    {
      category: "Software",
      icon: BookOpen,
      title: "Install Microsoft 365",
      description: "Download and activate university-licensed applications",
      helpful: "88%",
    },
    {
      category: "Printer",
      icon: Printer,
      title: "Connect to campus printers",
      description: "Printer IDs, drivers, queues, and common fixes",
      helpful: "86%",
    },
    {
      category: "Classroom",
      icon: Monitor,
      title: "Classroom display troubleshooting",
      description: "Checks for projectors, HDMI, audio, and lecterns",
      helpful: "93%",
    },
    {
      category: "Security",
      icon: ShieldCheck,
      title: "Report a suspicious email",
      description: "Immediate steps for phishing and account security",
      helpful: "97%",
    },
  ];

  const filteredGuides = guides.filter((guide) => {
    const query = searchTerm.toLowerCase();

    return (
      guide.title.toLowerCase().includes(query) ||
      guide.category.toLowerCase().includes(query) ||
      guide.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="tech-kb-page">
      {/* SIDEBAR */}
      <aside className="tech-kb-sidebar">
        <div className="tech-kb-brand">
          <div className="tech-kb-logo">
            <img src={auLogo} alt="AU Logo" />
          </div>

          <div>
            <h2>AU HelpDesk</h2>
            <p>Campus IT Services</p>
          </div>
        </div>

        <nav className="tech-kb-nav">
          <button
            className="tech-kb-nav-item"
            onClick={() => navigate("/technician")}
          >
            <span><LayoutGrid size={18} /></span>
            Operations
          </button>

          <button
            className="tech-kb-nav-item"
            onClick={() => navigate("/technician/queue")}
          >
            <span><Ticket size={18} /></span>
            Open queue

            <span className="tech-kb-count">2</span>
          </button>

          <button
            className="tech-kb-nav-item"
            onClick={() => navigate("/technician/assignments")}
          >
            <span><Wrench size={18} /></span>
            My assignments
          </button>

<button className="tech-kb-nav-item active">
  <span><BookOpen size={18} /></span>
  Knowledge base
</button>

<button
  className="tech-kb-nav-item"
  onClick={() => navigate("/technician/status")}
>
  <span><Activity size={18} /></span>
  Campus status
</button>
        </nav>

        <div className="tech-kb-sidebar-bottom">
          <div className="tech-kb-urgent">
            <div className="tech-kb-urgent-icon"><ShieldAlert size={20} /></div>

            <h3>Urgent IT or security issue?</h3>
            <p>Call the Service Desk</p>

            <strong>02-300-4543</strong>

            <small>Mon–Fri · 08:00–18:00</small>
          </div>

          <div className="tech-kb-profile">
            <div className="tech-kb-avatar">TE</div>

            <div className="tech-kb-profile-info">
              <strong>Technician</strong>
              <span>technician@test.local</span>
            </div>

            <button
              className="tech-kb-profile-btn"
              onClick={() => navigate("/")}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="tech-kb-main">
        <header className="tech-kb-topbar">
          <div className="tech-kb-topbar-left">
            <button className="tech-kb-menu"><Menu size={18} /></button>

            <div>
              <h2>Knowledge</h2>
              <p>Campus IT service workspace</p>
            </div>
          </div>

          <div className="tech-kb-topbar-right">

            <button className="tech-kb-icon"><Moon size={18} /></button>

            <button className="tech-kb-icon tech-kb-notification">
              <Bell size={18} />
              <span className="tech-kb-dot"></span>
            </button>

            <div className="tech-kb-top-avatar">TE</div>
          </div>
        </header>

        <section className="tech-kb-content">
          {/* HERO */}
          <section className="tech-kb-hero">
            <div className="tech-kb-hero-icon"><BookOpen size={20} /></div>

            <h1>Find a quick solution</h1>

            <p>
              Search guides maintained and reviewed by Campus IT Services.
            </p>

            <div className="tech-kb-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search Wi-Fi, Microsoft 365, printers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </section>

          {/* CARDS */}
          <section className="tech-kb-grid">
            {filteredGuides.map((guide) => {
              const GuideIcon = guide.icon;
              return (
              <article
                className="tech-kb-card"
                key={guide.title}
              >
                <div className="tech-kb-guide-icon">
                  <GuideIcon size={20} />
                </div>

                <span className="tech-kb-category">
                  {guide.category}
                </span>

                <h3>{guide.title}</h3>

                <p>{guide.description}</p>

                <div className="tech-kb-card-footer">
                  <button>
                    Read guide
                    <span><ChevronRight size={18} /></span>
                  </button>

                  <small>
                    {guide.helpful} found helpful
                  </small>
                </div>
              </article>
              );
            })}
          </section>

          {filteredGuides.length === 0 && (
            <div className="tech-kb-empty">
              No guides found.
            </div>
          )}

          {/* HELP BANNER */}
          <section className="tech-kb-help">
            <div className="tech-kb-help-left">
              <div className="tech-kb-help-icon"><Bell size={20} /></div>

              <div>
                <h3>Still need help?</h3>

                <p>
                  Create a ticket and include what you already tried.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/technician/queue")}
            >
              Contact IT support
            </button>
          </section>
        </section>
      </main>
    </div>
  );
}