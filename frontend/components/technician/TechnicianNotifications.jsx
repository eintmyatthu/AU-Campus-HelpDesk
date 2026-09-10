import { useEffect, useId, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTickets } from "../../src/context/useTickets";
import "./TechnicianNotifications.css";

export default function TechnicianNotifications({ buttonClassName, dotClassName }) {
  const { queueTickets, loading, error } = useTickets();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const panelId = useId();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const dismiss = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div className="technician-notifications" ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        className={buttonClassName}
        aria-label="Notifications"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <Bell size={18} />
        {!loading && !error && queueTickets.length > 0 && <span className={dotClassName}></span>}
      </button>
      {open && (
        <section id={panelId} className="technician-notifications-panel" aria-label="Notifications">
          <h3>Notifications</h3>
          <p>Open tickets awaiting a technician</p>
          {loading ? <p role="status">Loading tickets…</p> : error ? (
            <p role="alert">{error}</p>
          ) : queueTickets.length === 0 ? <p>No unassigned open tickets.</p> : (
            <ul>
              {queueTickets.map((ticket) => (
                <li key={ticket.id}>
                  <button type="button" onClick={() => {
                    setOpen(false);
                    navigate("/technician/queue");
                  }}>
                    <strong>{ticket.id}</strong>
                    <span>{ticket.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
