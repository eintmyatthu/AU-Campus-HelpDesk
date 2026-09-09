import { useEffect, useState } from "react";
import { getHealth } from "../api/client";

export default function ApiHealthCheck() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Checking HelpDesk API…");

  useEffect(() => {
    const controller = new AbortController();

    async function checkHealth() {
      setStatus("loading");
      setMessage("Checking HelpDesk API…");

      try {
        const data = await getHealth(controller.signal);
        setStatus("healthy");
        setMessage(data?.message || "HelpDesk API is running");
      } catch (error) {
        if (error.name === "AbortError") return;
        setStatus("error");
        setMessage(error.message || "Unable to connect to the HelpDesk API.");
      }
    }

    checkHealth();
    return () => controller.abort();
  }, []);

  return (
    <div
      className={`api-health-status api-health-status--${status}`}
      role="status"
      aria-live="polite"
      data-api-health={status}
    >
      {message}
    </div>
  );
}
