import {
  Clock,
  Timer,
  ShieldCheck,
  MessageSquare,
  FileText,
  Download,
} from "lucide-react";
import AdminShell from "./AdminShell";
import "./AdminReports.css";
import { downloadCsv } from "../../src/utils/exportCsv";

const metrics = [
  {
    key: "first",
    label: "First response",
    value: "18m",
    note: "Target 30m",
    Icon: Clock,
    tone: "blue",
  },
  {
    key: "resolution",
    label: "Resolution time",
    value: "5.4h",
    note: "↓ 11%",
    Icon: Timer,
    tone: "green",
  },
  {
    key: "sla",
    label: "SLA compliance",
    value: "92%",
    note: "1,008 of 1,096",
    Icon: ShieldCheck,
    tone: "orange",
  },
  {
    key: "csat",
    label: "Satisfaction",
    value: "4.7/5",
    note: "412 responses",
    Icon: MessageSquare,
    tone: "red",
  },
];

const volume = [
  { week: "Week 1", open: 58, resolved: 72 },
  { week: "Week 2", open: 46, resolved: 64 },
  { week: "Week 3", open: 51, resolved: 69 },
  { week: "Week 4", open: 62, resolved: 81 },
];

const workload = [
  { name: "Narin Somchai", active: 9, load: 90 },
  { name: "Maya Prasert", active: 6, load: 60 },
  { name: "Test Technician", active: 4, load: 40 },
  { name: "Somchai K.", active: 9, load: 88 },
];

const problems = [
  { rank: 1, title: "Campus Wi-Fi connection", category: "Network", count: 126 },
  { rank: 2, title: "Microsoft 365 access", category: "Account Access", count: 98 },
  { rank: 3, title: "Classroom projector", category: "Classroom Equipment", count: 72 },
  { rank: 4, title: "Printer offline", category: "Printer", count: 54 },
  { rank: 5, title: "Password reset", category: "Account Access", count: 47 },
];

const maxBar = Math.max(...volume.flatMap((v) => [v.open, v.resolved]));

export default function AdminReports() {
  const handleExportCsv = () => {
    const rows = [
      ["Section", "Label", "Value", "Detail"],
      ...metrics.map((m) => ["Metric", m.label, m.value, m.note]),
      ...volume.map((v) => [
        "Volume",
        v.week,
        `Open ${v.open}`,
        `Resolved ${v.resolved}`,
      ]),
      ...workload.map((w) => [
        "Workload",
        w.name,
        `${w.active} active`,
        `${w.load}% load`,
      ]),
      ...problems.map((p) => [
        "Problem",
        p.title,
        `${p.count} tickets`,
        p.category,
      ]),
    ];
    downloadCsv("service-report.csv", rows[0], rows.slice(1));
  };

  const handleExportPdf = () => {
    // Browser print dialog lets the user "Save as PDF" without a library.
    window.print();
  };

  return (
    <AdminShell
      active="reports"
      title="Reports"
      subtitle="Campus IT service workspace"
    >
      <div className="admin-page-head reports-head">
        <div>
          <h1>Service reports</h1>
          <p>Operational performance for 1–30 September 2026.</p>
        </div>

        <div className="reports-actions">
          <button className="admin-secondary-btn" onClick={handleExportPdf}>
            <FileText size={15} />
            Export PDF
          </button>
          <button className="admin-primary-btn" onClick={handleExportCsv}>
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </div>

      {/* METRICS */}
      <div className="reports-metrics">
        {metrics.map((m) => (
          <div className="metric-card admin-panel-card" key={m.key}>
            <div className={`metric-icon ${m.tone}`}>
              <m.Icon size={18} />
            </div>

            <div className="metric-body">
              <p>{m.label}</p>
              <h3>{m.value}</h3>
            </div>

            <small>{m.note}</small>
          </div>
        ))}
      </div>

      {/* CHART + WORKLOAD */}
      <div className="reports-grid">
        <div className="admin-panel-card reports-panel">
          <div className="reports-panel-head">
            <h2>Ticket volume</h2>
            <p>Open versus resolved by week</p>
          </div>

          <div className="volume-chart">
            {volume.map((v) => (
              <div className="volume-group" key={v.week}>
                <div className="volume-bars">
                  <div
                    className="volume-bar open"
                    style={{ height: `${(v.open / maxBar) * 100}%` }}
                    title={`Open: ${v.open}`}
                  ></div>
                  <div
                    className="volume-bar resolved"
                    style={{ height: `${(v.resolved / maxBar) * 100}%` }}
                    title={`Resolved: ${v.resolved}`}
                  ></div>
                </div>
                <span className="volume-label">{v.week}</span>
              </div>
            ))}
          </div>

          <div className="volume-legend">
            <span>
              <i className="legend-dot open"></i>
              Open
            </span>
            <span>
              <i className="legend-dot resolved"></i>
              Resolved
            </span>
          </div>
        </div>

        <div className="admin-panel-card reports-panel">
          <div className="reports-panel-head">
            <h2>Technician workload</h2>
            <p>Active assignments</p>
          </div>

          <div className="workload-list">
            {workload.map((w) => (
              <div className="workload-row" key={w.name}>
                <div className="workload-info">
                  <strong>{w.name}</strong>
                  <small>{w.active} active</small>
                </div>

                <div className="workload-bar">
                  <div
                    className="workload-bar-fill"
                    style={{ width: `${w.load}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FREQUENT PROBLEMS */}
      <div className="admin-panel-card reports-panel problems-panel">
        <div className="reports-panel-head">
          <h2>Frequently reported problems</h2>
          <p>5 sample records aligned with the Prisma schema</p>
        </div>

        <div className="problem-list">
          {problems.map((p) => (
            <div className="problem-row" key={p.rank}>
              <span className="problem-rank">{p.rank}</span>

              <div className="problem-info">
                <strong>{p.title}</strong>
                <small>{p.category}</small>
              </div>

              <span className="problem-count">{p.count} tickets</span>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
