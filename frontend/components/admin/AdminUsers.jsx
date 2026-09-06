import { useState } from "react";
import { Search, Plus, X } from "lucide-react";
import AdminShell from "./AdminShell";
import "./AdminUsers.css";

const ROLES = ["Student", "Faculty", "Technician", "Admin"];

const emptyDraft = {
  name: "",
  email: "",
  department: "",
  role: "Student",
};

const seedUsers = [
  {
    id: 1,
    name: "Test Student",
    email: "student@test.local",
    department: "Information Technology",
    role: "Student",
    active: true,
  },
  {
    id: 2,
    name: "Test Faculty",
    email: "faculty@au.edu",
    department: "Computer Science",
    role: "Faculty",
    active: true,
  },
  {
    id: 3,
    name: "Test Technician",
    email: "technician@test.local",
    department: "Campus IT",
    role: "Technician",
    active: true,
  },
  {
    id: 4,
    name: "Test Admin",
    email: "admin@test.local",
    department: "Campus IT",
    role: "Admin",
    active: true,
  },
];

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AdminUsers() {
  const [users, setUsers] = useState(seedUsers);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [formError, setFormError] = useState("");

  const setRole = (id, role) =>
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role } : u))
    );

  const toggleActive = (id) =>
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    );

  const updateDraft = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    if (formError) setFormError("");
  };

  const openCreate = () => {
    setDraft(emptyDraft);
    setFormError("");
    setShowCreate(true);
  };

  const cancelCreate = () => {
    setShowCreate(false);
    setDraft(emptyDraft);
    setFormError("");
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const submitCreate = (e) => {
    e.preventDefault();
    const name = draft.name.trim();
    const email = draft.email.trim();

    if (!name || !email) {
      setFormError("Name and email are required.");
      return;
    }
    if (!emailPattern.test(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setFormError("A user with that email already exists.");
      return;
    }

    setUsers((prev) => [
      {
        id: Math.max(0, ...prev.map((u) => u.id)) + 1,
        name,
        email,
        department: draft.department.trim() || "Unassigned",
        role: draft.role,
        active: true,
      },
      ...prev,
    ]);
    cancelCreate();
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  return (
    <AdminShell
      active="users"
      title="Users & roles"
      subtitle="Campus IT service workspace"
    >
      <div className="admin-page-head">
        <div>
          <h1>Users &amp; roles</h1>
          <p>Manage accounts, roles, and access across campus.</p>
        </div>

        <div className="admin-page-head-actions">
          <button className="admin-primary-btn" onClick={openCreate}>
            <Plus size={16} />
            Create user
          </button>
        </div>
      </div>

      <div className="users-toolbar">
        <div className="users-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search name or university email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {showCreate && (
        <form
          className="user-create-card admin-panel-card"
          onSubmit={submitCreate}
        >
          <div className="user-create-head">
            <h3>Create user</h3>
            <button
              type="button"
              className="user-create-close"
              onClick={cancelCreate}
              aria-label="Cancel"
            >
              <X size={16} />
            </button>
          </div>

          <div className="user-create-grid">
            <label className="user-field">
              <span>Full name</span>
              <input
                type="text"
                placeholder="e.g. Jane Doe"
                value={draft.name}
                onChange={(e) => updateDraft("name", e.target.value)}
              />
            </label>

            <label className="user-field">
              <span>University email</span>
              <input
                type="email"
                placeholder="e.g. jane@au.edu"
                value={draft.email}
                onChange={(e) => updateDraft("email", e.target.value)}
              />
            </label>

            <label className="user-field">
              <span>Department</span>
              <input
                type="text"
                placeholder="e.g. Computer Science"
                value={draft.department}
                onChange={(e) => updateDraft("department", e.target.value)}
              />
            </label>

            <label className="user-field">
              <span>Role</span>
              <select
                value={draft.role}
                onChange={(e) => updateDraft("role", e.target.value)}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {formError && <p className="user-create-error">{formError}</p>}

          <div className="user-create-actions">
            <button
              type="button"
              className="admin-secondary-btn"
              onClick={cancelCreate}
            >
              Cancel
            </button>
            <button type="submit" className="admin-primary-btn">
              <Plus size={16} />
              Add user
            </button>
          </div>
        </form>
      )}

      <div className="users-table admin-panel-card">
        <div className="users-header">
          <span>USER</span>
          <span>DEPARTMENT</span>
          <span>ROLE</span>
          <span>STATUS</span>
          <span></span>
        </div>

        {filtered.map((user) => (
          <div className="users-row" key={user.id}>
            <div className="users-identity">
              <div className="users-avatar">
                {initials(user.name)}
              </div>
              <div>
                <strong>{user.name}</strong>
                <small>{user.email}</small>
              </div>
            </div>

            <span className="users-dept">{user.department}</span>

            <span>
              <select
                className="users-role-select"
                value={user.role}
                onChange={(e) => setRole(user.id, e.target.value)}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </span>

            <span>
              <span
                className={`users-status ${
                  user.active ? "active" : "inactive"
                }`}
              >
                {user.active ? "Active" : "Inactive"}
              </span>
            </span>

            <span className="users-toggle-cell">
              <button
                className={`users-toggle ${user.active ? "on" : ""}`}
                onClick={() => toggleActive(user.id)}
                aria-pressed={user.active}
                aria-label={`Toggle ${user.name}`}
              >
                <span className="users-toggle-knob"></span>
              </button>
            </span>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="users-empty">No users match your search.</div>
        )}
      </div>
    </AdminShell>
  );
}
