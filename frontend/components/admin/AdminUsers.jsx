import { useState } from "react";
import { Search, Plus } from "lucide-react";
import AdminShell from "./AdminShell";
import "./AdminUsers.css";

const ROLES = ["Student", "Faculty", "Technician", "Admin"];

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

  const setRole = (id, role) =>
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role } : u))
    );

  const toggleActive = (id) =>
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    );

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
      title="Users"
      subtitle="Campus IT service workspace"
    >
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

        <button className="admin-primary-btn">
          <Plus size={16} />
          Create user
        </button>
      </div>

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
