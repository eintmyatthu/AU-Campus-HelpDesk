import { useEffect, useState } from "react";
import { getDnsDiagnostic } from "../api/client";
import "./NetworkDiagnostic.css";

export default function NetworkDiagnostic({ ticket, compact = false }) {
  const [result, setResult] = useState(() => ticket?.dnsDiagnostic
    ? { ticketId: ticket.dbId, diagnostic: ticket.dnsDiagnostic }
    : null);

  useEffect(() => {
    if (!ticket?.dbId || ticket.category !== "Network") {
      return undefined;
    }
    const controller = new AbortController();
    getDnsDiagnostic(ticket.dbId, controller.signal)
      .then((diagnostic) => setResult({ ticketId: ticket.dbId, diagnostic }))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setResult({
            ticketId: ticket.dbId,
            diagnostic: { performed: true, resolved: false, outcome: "unavailable" }
          });
        }
      });
    return () => controller.abort();
  }, [ticket?.dbId, ticket?.category]);

  if (ticket?.category !== "Network") return null;
  const diagnostic = result?.ticketId === ticket.dbId ? result.diagnostic : null;
  if (!diagnostic) return <p className="dns-diagnostic-note">Checking DNS resolution…</p>;
  if (!diagnostic.performed) {
    return diagnostic.reason === "no_hostname"
      ? <p className="dns-diagnostic-note">DNS diagnostic not performed — no hostname provided.</p>
      : null;
  }

  const resolution = diagnostic.resolved
    ? "Successful through Google Public DNS"
    : diagnostic.outcome === "no_a_records"
      ? "No usable A record returned"
      : diagnostic.outcome === "dns_error"
        ? `DNS error (status ${diagnostic.status})`
        : "Diagnostic unavailable";

  if (compact) {
    return <p className="dns-diagnostic-note">DNS: {diagnostic.hostname} — {resolution}</p>;
  }

  return (
    <div className="dns-diagnostic">
      <h2>Network Diagnostic</h2>
      <dl>
        <div><dt>Provider</dt><dd>{diagnostic.provider || "Google Public DNS"}</dd></div>
        <div><dt>Domain</dt><dd>{diagnostic.hostname || "Unavailable"}</dd></div>
        <div><dt>DNS resolution</dt><dd>{resolution}</dd></div>
        {diagnostic.addresses?.length > 0 && (
          <div><dt>IPv4 addresses</dt><dd>{diagnostic.addresses.join(", ")}</dd></div>
        )}
      </dl>
      <p className="dns-diagnostic-note">This checks public DNS resolution only; it does not test campus Wi-Fi connectivity.</p>
    </div>
  );
}
