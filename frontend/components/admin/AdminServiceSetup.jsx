import { useState } from "react";
import { Tag, Plus, SlidersHorizontal, X } from "lucide-react";
import AdminShell from "./AdminShell";
import "./AdminServiceSetup.css";

const TEAM_OPTIONS = [
  "Infrastructure Team",
  "Device Support",
  "Identity Team",
  "Application Support",
];
export default function AdminServiceSetup() {
  const [categories, setCategories] = useState([
    {
      name: "Hardware",
      team: "Infrastructure Team",
      subcategories: 2,
      enabled: true,
    },
    {
      name: "Software",
      team: "Device Support",
      subcategories: 3,
      enabled: true,
    },
    {
      name: "Network",
      team: "Infrastructure Team",
      subcategories: 4,
      enabled: true,
    },
    {
      name: "Account access",
      team: "Device Support",
      subcategories: 5,
      enabled: true,
    },
    {
      name: "Classroom equipment",
      team: "Infrastructure Team",
      subcategories: 6,
      enabled: true,
    },
    {
      name: "Printer",
      team: "Device Support",
      subcategories: 7,
      enabled: true,
    },
    {
      name: "Other",
      team: "Infrastructure Team",
      subcategories: 8,
      enabled: true,
    },
  ]);

  const teams = [
    {
      name: "Infrastructure Team",
      technicians: 8,
      tickets: 21,
      load: 42,
    },
    {
      name: "Device Support",
      technicians: 12,
      tickets: 34,
      load: 68,
    },
    {
      name: "Identity Team",
      technicians: 6,
      tickets: 14,
      load: 28,
    },
    {
      name: "Application Support",
      technicians: 9,
      tickets: 18,
      load: 36,
    },
  ];

  const sla = [
    {
      priority: "Urgent",
      response: "15 min",
      resolution: "2 hours",
      type: "urgent",
    },
    {
      priority: "High",
      response: "30 min",
      resolution: "4 hours",
      type: "high",
    },
    {
      priority: "Medium",
      response: "2 hours",
      resolution: "1 day",
      type: "medium",
    },
    {
      priority: "Low",
      response: "4 hours",
      resolution: "3 days",
      type: "low",
    },
  ];

  const [rules, setRules] = useState([
    {
      name: "Automatic closure",
      description: "Close resolved tickets after 5 days",
      enabled: true,
    },
    {
      name: "Reopen limit",
      description: "Prevent reopening after 30 days",
      enabled: true,
    },
    {
      name: "SLA warning",
      description: "Notify lead at 80% of target",
      enabled: true,
    },
  ]);

  const toggleCategory = (index) => {
    setCategories((current) =>
      current.map((category, i) =>
        i === index
          ? {
              ...category,
              enabled: !category.enabled,
            }
          : category
      )
    );
  };

  const toggleRule = (index) => {
    setRules((current) =>
      current.map((rule, i) =>
        i === index
          ? {
              ...rule,
              enabled: !rule.enabled,
            }
          : rule
      )
    );
  };

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTeam, setNewTeam] = useState(TEAM_OPTIONS[0]);
  const [addError, setAddError] = useState("");

  const openAdd = () => {
    setNewName("");
    setNewTeam(TEAM_OPTIONS[0]);
    setAddError("");
    setShowAdd(true);
  };

  const cancelAdd = () => {
    setShowAdd(false);
    setNewName("");
    setAddError("");
  };

  const submitAdd = (event) => {
    event.preventDefault();
    const name = newName.trim();
    if (!name) {
      setAddError("Category name is required.");
      return;
    }
    if (
      categories.some(
        (category) => category.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      setAddError("That category already exists.");
      return;
    }
    setCategories((current) => [
      ...current,
      { name, team: newTeam, subcategories: 0, enabled: true },
    ]);
    cancelAdd();
  };

  return (
    <AdminShell
      title="Service setup"
      active="service"
    >
      <div className="admin-page-head">
        <div>
          <h1>Service configuration</h1>

          <p>
            Teams, categories, priority rules, and SLA targets.
          </p>
        </div>

        <div className="admin-page-head-actions">
          <button className="admin-primary-btn" onClick={openAdd}>
            <Plus size={16} />
            Add category
          </button>
        </div>
      </div>

      {showAdd && (
        <form className="category-add-card admin-panel-card" onSubmit={submitAdd}>
          <div className="category-add-head">
            <h3>Add category</h3>
            <button
              type="button"
              className="category-add-close"
              onClick={cancelAdd}
              aria-label="Cancel"
            >
              <X size={16} />
            </button>
          </div>

          <div className="category-add-grid">
            <label className="category-field">
              <span>Category name</span>
              <input
                type="text"
                placeholder="e.g. Email &amp; calendar"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  if (addError) setAddError("");
                }}
              />
            </label>

            <label className="category-field">
              <span>Routing team</span>
              <select
                value={newTeam}
                onChange={(e) => setNewTeam(e.target.value)}
              >
                {TEAM_OPTIONS.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {addError && <p className="category-add-error">{addError}</p>}

          <div className="category-add-actions">
            <button
              type="button"
              className="admin-secondary-btn"
              onClick={cancelAdd}
            >
              Cancel
            </button>
            <button type="submit" className="admin-primary-btn">
              <Plus size={16} />
              Add category
            </button>
          </div>
        </form>
      )}

      <section className="service-grid">
        {/* ROUTING CATEGORIES */}
        <article className="service-card">
          <div className="service-card-head">
            <h2>Routing categories</h2>

            <p>
              Matches the backend Category enum
            </p>
          </div>

          <div className="service-list">
            {categories.map((category, index) => (
              <div
                className="service-row"
                key={category.name}
              >
                <div className="service-row-icon">
                  <Tag size={16} />
                </div>

                <div className="service-row-info">
                  <strong>
                    {category.name}
                  </strong>

                  <small>
                    {category.team} ·{" "}
                    {category.subcategories} subcategories
                  </small>
                </div>

                <button
                  className={`svc-toggle ${
                    category.enabled ? "on" : ""
                  }`}
                  onClick={() =>
                    toggleCategory(index)
                  }
                >
                  <span className="svc-toggle-knob"></span>
                </button>
              </div>
            ))}
          </div>
        </article>

        {/* TECHNICIAN TEAMS */}
        <article className="service-card">
          <div className="service-card-head">
            <h2>Technician teams</h2>

            <p>
              Assignment and workload routing
            </p>
          </div>

          <div className="service-list">
            {teams.map((team) => (
              <div
                className="team-row"
                key={team.name}
              >
                <div className="team-info">
                  <strong>
                    {team.name}
                  </strong>

                  <small>
                    {team.technicians} technicians ·{" "}
                    {team.tickets} active tickets
                  </small>
                </div>

                <div className="team-load">
                  <div
                    className="team-load-fill"
                    style={{
                      width: `${team.load}%`,
                    }}
                  ></div>
                </div>

                <button className="team-config" aria-label="Configure team">
                  <SlidersHorizontal size={15} />
                </button>
              </div>
            ))}
          </div>
        </article>

        {/* SLA */}
        <article className="service-card">
          <div className="service-card-head">
            <h2>SLA targets</h2>

            <p>
              Automatic deadline and escalation rules
            </p>
          </div>

          <div className="service-list">
            {sla.map((item) => (
              <div
                className="sla-row"
                key={item.priority}
              >
                <div className="sla-level">
                  <span
                    className={`sla-dot ${item.type}`}
                  ></span>

                  {item.priority}
                </div>

                <div className="sla-metric">
                  <small>
                    First response
                  </small>

                  <strong>
                    {item.response}
                  </strong>
                </div>

                <div className="sla-metric">
                  <small>
                    Resolution
                  </small>

                  <strong>
                    {item.resolution}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </article>

        {/* AUTOMATION */}
        <article className="service-card">
          <div className="service-card-head">
            <h2>Automation rules</h2>

            <p>
              Controlled workflow safeguards
            </p>
          </div>

          <div className="service-list">
            {rules.map((rule, index) => (
              <div
                className="rule-row"
                key={rule.name}
              >
                <div className="rule-info">
                  <strong>
                    {rule.name}
                  </strong>

                  <small>
                    {rule.description}
                  </small>
                </div>

                <button
                  className={`svc-toggle ${
                    rule.enabled ? "on" : ""
                  }`}
                  onClick={() =>
                    toggleRule(index)
                  }
                >
                  <span className="svc-toggle-knob"></span>
                </button>
              </div>
            ))}
          </div>
        </article>
      </section>
    </AdminShell>
  );
}