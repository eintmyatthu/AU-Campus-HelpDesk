import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import auLogo from "../../src/assets/AU_logo.jpeg";
import { useAuth } from "../../src/context/useAuth";
import { isMicrosoftConfigured } from "../../src/auth/microsoft";

const HOME_BY_ROLE = {
  STUDENT: "/student",
  FACULTY: "/student",
  TECHNICIAN: "/technician",
  ADMIN: "/admin",
};

export default function Login() {
  const navigate = useNavigate();
  const { passwordLogin, microsoftLogin, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleMicrosoftLogin = async () => {
    try {
      const user = await microsoftLogin();
      navigate(HOME_BY_ROLE[user.role] || "/student");
    } catch {
      // Error is surfaced via the auth context `error` state below.
    }
  };

  const handlePasswordLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await passwordLogin({ email, password });
      navigate(HOME_BY_ROLE[user.role] || "/student");
    } catch {
      // Error is surfaced via the auth context `error` state below.
    }
  };

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
            Sign in with your HelpDesk account or university Microsoft account.
          </p>

          <form className="credential-form" onSubmit={handlePasswordLogin}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@au.edu"
              required
              disabled={loading}
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />

            <button className="credential-login-btn" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {error && <p className="login-error" role="alert">{error}</p>}

          <div className="login-divider"><span>or</span></div>

          <button
            className="microsoft-btn"
            onClick={handleMicrosoftLogin}
            disabled={loading || !isMicrosoftConfigured()}
          >
            <span className="microsoft-logo">
              <span className="ms-red"></span>
              <span className="ms-green"></span>
              <span className="ms-blue"></span>
              <span className="ms-yellow"></span>
            </span>

            Continue with Microsoft
          </button>

          {!isMicrosoftConfigured() && (
            <p className="login-error">
              Microsoft sign-in needs the Entra tenant and client IDs.
            </p>
          )}

          <p className="access-note">
            Access is limited to active university accounts.
            Sessions expire after inactivity.
          </p>

        </div>
      </section>
    </div>
  );
}
