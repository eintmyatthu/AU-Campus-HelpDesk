// Login.jsx
import "./login.css";
import auLogo from "../../src/assets/AU_logo.jpeg";
export default function Login() {
  const handleMicrosoftLogin = () => {
    // Replace this later with Microsoft Entra ID / MSAL login
    console.log("Microsoft login");
  };


  return (
    <div className="login-page">
      {/* LEFT SIDE */}
      <section className="login-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <img src={auLogo} alt="Assumption University Logo" />
          </div>

          <p className="university-name">ASSUMPTION UNIVERSITY</p>

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
        <div className="security-icon"><
          img src={auLogo} alt="Assumption University Logo" />
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
          Access is limited to active university accounts. Sessions expire
          after inactivity.
        </p>

        <div className="divider"></div>
      </div>
    </section>
  </div>
);
}