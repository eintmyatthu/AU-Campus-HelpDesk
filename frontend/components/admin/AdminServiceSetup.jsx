import { useState } from "react";
import { Tag, Plus, SlidersHorizontal } from "lucide-react";
import AdminShell from "./AdminShell";
import "./AdminServiceSetup.css";

const initialCategories = [
  { name: "Hardware", team: "Infrastructure Team", subs: 2, on: true },
  { name: "Software", team: "Device Support", subs: 3, on: true },
  { name: "Network", team: "Infrastructure Team", subs: 4, on: true },
  { name: "Account access", team: "Device Support", subs: 5, on: true },
  { name: "Classroom equipment", team: "Infrastructure Team", subs: 6, on: true },
  { name: "Printer", team: "Device Support", subs: 7, on: true },
  { name: "Other", team: "Infrastructure Team", subs: 8, on: true },
];

const teams = [
  { name: "Infrastructure Team", techs: 8, tickets: 21, load: 62 },
  { name: "Device Support", techs: 12, tickets: 34, load: 78 },
  { name: "Identity Team", techs: 6, tickets: 14, load: 44 },
  { name: "Application Support", techs: 9, tickets: 18, load: 52 },
];

const slaTargets = [
  { level: "Urgent", cls: "urgent", first: "15 min", resolution: "2 hours" },
  { level: "High", cls: "high", first: "30 min", resolution: "4 hours" },
  { level: "Medium", cls: "medium", first: "2 hours", resolution: "1 day" },
  { level: "Low", cls: "low", first: "4 hours", resolution: "3 days" },
];

const initialRules = [
  {
    key: "closure",
    title: "Automatic closure",
    description: "Close resolved tickets after 5 days",
    on: true,
  },
  {
    key: "reopen",
    title: "Reopen limit",
    description: "Prevent reopening after 30 days",
    on: true,
  },
  {
    key: "slawarn",
    title: "SLA warning",
    description: "Notify lead at 80% of target",
    on: true,
  },
];

export default function AdminServiceSetup() {
  const [categories, setCategories] = useState(initialCategories);
  const [rules, setRules] = useState(initialRules);

  const toggleCategory = (name) =>
    setCategories((prev) =>
      prev.map((c) => (c.name === name ? { ...c, on: !c.on } : c))
    );

  const toggleRule = (key) =>
    setRules((prev) =>
      prev.map((r) => (r.key === key ? { ...r, on: !r.on } : r))
    );

  return (
    <AdminShell
      active="service"
      title="Service"
      subtitle="Campus IT service workspace"
    >
      <div className="admin-page-head service-head">
        <div>
          <h1>Service configuration</h1>
          <p>Teams, categories, priority rules, and SLA targets.</p>
        </div>

        <button className="admin-primary-btn">
          <Plus size={16} />
          Add category
        </button>
      </div>

      <div className="service-grid">
        {/* ROUTING CATEGORIES */}
        <div className="admin-panel-card service-card">
          <div className="service-card-head">
            <h2>Routing categories</h2>
            <p>Matches the backend Category enum</p>
          </div>

          <div className="service-list">
            {categories.map((cat) => (
              <div className="service-row" key={cat.name}>
                <div className="service-row-icon">
                  <Tag size={16} />
                </div>

                <div className="service-row-info">
                  <strong>{cat.name}</strong>
                  <small>
                    {cat.team} · {cat.subs} subcategories
                  </small>
                </div>

                <button
                  className={`svc-toggle ${cat.on ? "on" : ""}`}
                  onClick={() => toggleCategory(cat.name)}
                  aria-pressed={cat.on}
                  aria-label={cat.name}
                >
                  <span className="svc-toggle-knob"></span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* TECHNICIAN TEAMS */}
        <div className="admin-panel-card service-card">
          <div className="service-card-head">
            <h2>Technician teams</h2>
            <p>Assignment and workload routing</p>
          </div>

          <div className="service-list">
            {teams.map((team) => (
              <div className="team-row" key={team.name}>
                <div className="team-info">
                  <strong>{team.name}</strong>
                  <small>
                    {team.techs} technicians · {team.tickets} active tickets
                  </small>
                </div>

                <div className="team-load">
                  <div
                    className="team-load-fill"
                    style={{ width: `${team.load}%` }}
                  ></div>
                </div>

                <button className="team-config" aria-label="Configure team">
                  <SlidersHorizontal size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SLA TARGETS */}
        <div className="admin-panel-card service-card">
          <div className="service-card-head">
            <h2>SLA targets</h2>
            <p>Automatic deadline and escalation rules</p>
          </div>

          <div className="service-list">
            {slaTargets.map((sla) => (
              <div className="sla-row" key={sla.level}>
                <span className="sla-level">
                  <i className={`sla-dot ${sla.cls}`}></i>
                  {sla.level}
                </span>

                <div className="sla-metric">
                  <small>First response</small>
                  <strong>{sla.first}</strong>
                </div>

                <div className="sla-metric">
                  <small>Resolution</small>
                  <strong>{sla.resolution}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AUTOMATION RULES */}
        <div className="admin-panel-card service-card">
          <div className="service-card-head">
            <h2>Automation rules</h2>
            <p>Controlled workflow safeguards</p>
          </div>

          <div className="service-list">
            {rules.map((rule) => (
              <div className="rule-row" key={rule.key}>
                <div className="rule-info">
                  <strong>{rule.title}</strong>
                  <small>{rule.description}</small>
                </div>

                <button
                  className={`svc-toggle ${rule.on ? "on" : ""}`}
                  onClick={() => toggleRule(rule.key)}
                  aria-pressed={rule.on}
                  aria-label={rule.title}
                >
                  <span className="svc-toggle-knob"></span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
