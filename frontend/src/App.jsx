import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import RequireRole from "./components/RequireRole";
import Login from "../components/login/login-page";
import StudentDashboard from "../components/students/StudentDashboard";
import StudentTickets from "../components/students/StudentTickets";
import KnowledgeBase from "../components/students/KnowledgeBase";
import CampusStatus from "../components/students/CampusStatus";
import Settings from "../components/students/Settings";
import NewTicket from "../components/students/NewTicket";
import TicketDetail from "../components/students/TicketDetail";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminTickets from "../components/admin/AdminTickets";
import AdminUsers from "../components/admin/AdminUsers";
import AdminServiceSetup from "../components/admin/AdminServiceSetup";
import AdminReports from "../components/admin/AdminReports";
import AdminAuditLogs from "../components/admin/AdminAuditLogs";
import AdminTicketDetail from "../components/admin/AdminTicketDetail";
import TechnicianDashboard from "../components/technician/TechnicianDashboard";
import TechnicianQueue from "../components/technician/TechnicianQueue";
import TechnicianAssignments from "../components/technician/TechnicianAssignments";
import TechnicianKnowledgeBase from "../components/technician/TechnicianKnowledgeBase";
import TechnicianCampusStatus from "../components/technician/TechnicianCampusStatus";

const STUDENT_ROLES = ["STUDENT", "FACULTY"];
const ADMIN_ROLES = ["ADMIN"];
const TECH_ROLES = ["TECHNICIAN"];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* STUDENT */}
        <Route
          path="/student"
          element={
            <RequireRole roles={STUDENT_ROLES}>
              <StudentDashboard />
            </RequireRole>
          }
        />
        <Route
          path="/student/tickets"
          element={
            <RequireRole roles={STUDENT_ROLES}>
              <StudentTickets />
            </RequireRole>
          }
        />
        <Route
          path="/student/tickets/:id"
          element={
            <RequireRole roles={STUDENT_ROLES}>
              <TicketDetail />
            </RequireRole>
          }
        />
        <Route
          path="/student/new-ticket"
          element={
            <RequireRole roles={STUDENT_ROLES}>
              <NewTicket />
            </RequireRole>
          }
        />
        <Route
          path="/student/knowledge"
          element={
            <RequireRole roles={STUDENT_ROLES}>
              <KnowledgeBase />
            </RequireRole>
          }
        />
        <Route
          path="/student/status"
          element={
            <RequireRole roles={STUDENT_ROLES}>
              <CampusStatus />
            </RequireRole>
          }
        />
        <Route
          path="/student/settings"
          element={
            <RequireRole roles={STUDENT_ROLES}>
              <Settings />
            </RequireRole>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <RequireRole roles={ADMIN_ROLES}>
              <AdminDashboard />
            </RequireRole>
          }
        />
        <Route
          path="/admin/tickets"
          element={
            <RequireRole roles={ADMIN_ROLES}>
              <AdminTickets />
            </RequireRole>
          }
        />
        <Route
          path="/admin/tickets/:id"
          element={
            <RequireRole roles={ADMIN_ROLES}>
              <AdminTicketDetail />
            </RequireRole>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RequireRole roles={ADMIN_ROLES}>
              <AdminUsers />
            </RequireRole>
          }
        />
        <Route
          path="/admin/service"
          element={
            <RequireRole roles={ADMIN_ROLES}>
              <AdminServiceSetup />
            </RequireRole>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <RequireRole roles={ADMIN_ROLES}>
              <AdminReports />
            </RequireRole>
          }
        />
        <Route
          path="/admin/audit"
          element={
            <RequireRole roles={ADMIN_ROLES}>
              <AdminAuditLogs />
            </RequireRole>
          }
        />

        {/* TECHNICIAN */}
        <Route
          path="/technician"
          element={
            <RequireRole roles={TECH_ROLES}>
              <TechnicianDashboard />
            </RequireRole>
          }
        />
        <Route
          path="/technician/queue"
          element={
            <RequireRole roles={TECH_ROLES}>
              <TechnicianQueue />
            </RequireRole>
          }
        />
        <Route
          path="/technician/assignments"
          element={
            <RequireRole roles={TECH_ROLES}>
              <TechnicianAssignments />
            </RequireRole>
          }
        />
        <Route
          path="/technician/knowledge"
          element={
            <RequireRole roles={TECH_ROLES}>
              <TechnicianKnowledgeBase />
            </RequireRole>
          }
        />
        <Route
          path="/technician/status"
          element={
            <RequireRole roles={TECH_ROLES}>
              <TechnicianCampusStatus />
            </RequireRole>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
