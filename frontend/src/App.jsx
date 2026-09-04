import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "../components/login/login-page";
import StudentDashboard from "../components/students/StudentDashboard";
import StudentTickets from "../components/students/StudentTickets";
import KnowledgeBase from "../components/students/KnowledgeBase";
import CampusStatus from "../components/students/CampusStatus";
import Settings from "../components/students/Settings";
import NewTicket from "../components/students/NewTicket";
import TicketDetail from "../components/students/TicketDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/student"
          element={<StudentDashboard />}
        />
        <Route
           path="/student/tickets"
           element={<StudentTickets />}
        />
        <Route
           path="/student/tickets/:id"
           element={<TicketDetail />}
        />
        <Route
           path="/student/new-ticket"
           element={<NewTicket />}
        />
        <Route
          path="/student/knowledge"
          element={<KnowledgeBase />}
        />
        <Route
          path="/student/status"
          element={<CampusStatus />}
        />
        <Route
          path="/student/settings"
          element={<Settings />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;