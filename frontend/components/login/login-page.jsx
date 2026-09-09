import { useNavigate } from "react-router-dom";
import "./login.css";
import auLogo from "../../src/assets/AU_logo.jpeg";
import { useAuth } from "../../src/context/useAuth";

const HOME_BY_ROLE = {
  STUDENT: "/student",
  FACULTY: "/student",
  TECHNICIAN: "/technician",
  ADMIN: "/admin",
};

export default function Login() {
  const navigate = useNavigate();
  const { loginAs, loading, error } = useAuth();

  const handleMicrosoftLogin = () => {
    // Placeholder until Microsoft Entra ID is connected.
    console.log("Microsoft login");
  };

  const signIn = async (role) => {
    try {
      const user = await loginAs({ role });
      navigate(HOME_BY_ROLE[user.role] || "/student");
    } catch {
      // Error is surfaced via the auth context `error` state below.
    }
  };

  const handleStudentLogin = () => signIn("STUDENT");
  const handleAdminLogin = () => signIn("ADMIN");
  const handleTechnicianLogin = () => signIn("TECHNICIAN");

  return (
    <div className="login-page">
      {/* LEFT SIDE */}
      <section className="login-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <img
              src={auLogo}
              alt="Assumption University Logo"
            />
          </div>

          <p className="university-name">
            ASSUMPTION UNIVERSITY
          </p>

          <h1>
            Campus support that keeps
            <br />
            everyone moving.
          </h1>

          <p className="hero-description">
            One secure place to report, track, and resolve university IT issues.
          </p>
        </div>

        <div className="hero-circle circle-one"></div>
        <div className="hero-circle circle-two"></div>
      </section>

      {/* RIGHT SIDE */}
      <section className="login-section">
        <div className="login-card">
          <div className="security-icon">
            <img
              src={auLogo}
              alt="Assumption University Logo"
            />
          </div>

          <h2>Sign in to AU HelpDesk</h2>

          <p className="login-subtitle">
            Continue with your university Microsoft account.
          </p>

          <button
            className="microsoft-btn"
            onClick={handleMicrosoftLogin}
          >
            <span className="microsoft-logo">
              <span className="ms-red"></span>
              <span className="ms-green"></span>
              <span className="ms-blue"></span>
              <span className="ms-yellow"></span>
            </span>

            Continue with Microsoft
          </button>

          <p className="access-note">
            Access is limited to active university accounts.
            Sessions expire after inactivity.
          </p>

          <div className="divider"></div>

          <div className="dev-section">
            <p className="dev-title">
              DEVELOPMENT PREVIEW
            </p>

            <p className="dev-description">
              Use a test account until Microsoft Entra ID is connected.
            </p>

            <button
              className="student-login-btn"
              onClick={handleStudentLogin}
              disabled={loading}
            >
              Login as Student
            </button>
            <button
              className="student-login-btn"
              onClick={handleAdminLogin}
              disabled={loading}
            >
              Login as Admin
            </button>
            <button
              className="student-login-btn"
              onClick={handleTechnicianLogin}
              disabled={loading}
            >
              Login as Technician
            </button>

            {error && <p className="login-error">{error}</p>}
          </div>
        </div>
      </section>
    </div>
  );
}