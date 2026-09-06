import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { TicketsContext } from "./ticketsContextObject";
import { useAuth } from "./useAuth";
import * as api from "../api/client";
import {
  toUiTicket,
  CATEGORY_ENUM,
  PRIORITY_ENUM,
  STATUS_ENUM,
} from "../api/mappers";

export function TicketsProvider({ children }) {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.listTickets();
      setTickets((data || []).map(toUiTicket));
    } catch (err) {
      setError(err.message || "Unable to load tickets.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load tickets once a user is signed in; clear them on logout.
  // The async work is deferred so we don't call setState synchronously
  // inside the effect body.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) {
        if (!cancelled) setTickets([]);
        return;
      }
      try {
        const data = await api.listTickets();
        if (!cancelled) setTickets((data || []).map(toUiTicket));
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load tickets.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const getTicket = useCallback(
    (id) => tickets.find((t) => t.id === id || String(t.dbId) === String(id)),
    [tickets]
  );

  // Resolve a UI ticket (by display id) to its numeric database id.
  const dbIdFor = useCallback(
    (id) => {
      const t = getTicket(id);
      return t ? t.dbId : null;
    },
    [getTicket]
  );

  const addTicket = useCallback(
    async (form) => {
      if (!user) throw new Error("You must be signed in to submit a ticket.");
      const created = await api.createTicket({
        title: form.title,
        description: form.description,
        roomNumber: form.roomNumber,
        reporterId: user.id,
      });
      const uiTicket = toUiTicket(created);
      setTickets((prev) => [uiTicket, ...prev]);
      return uiTicket;
    },
    [user]
  );

  const addComment = useCallback(
    async (id, message) => {
      if (!user) throw new Error("You must be signed in to comment.");
      const dbId = dbIdFor(id);
      if (!dbId) throw new Error("Ticket not found.");
      await api.addComment(dbId, user.id, message);
      await refresh();
    },
    [user, dbIdFor, refresh]
  );

  // In the backend model, "assigning" a technician is claiming the ticket.
  const assignTicket = useCallback(
    async (id, technicianId) => {
      const dbId = dbIdFor(id);
      if (!dbId) throw new Error("Ticket not found.");
      const techId = technicianId ?? user?.id;
      if (!techId) throw new Error("A technician is required to claim a ticket.");
      await api.claimTicket(dbId, Number(techId));
      await refresh();
    },
    [dbIdFor, refresh, user]
  );

  const setTicketStatus = useCallback(
    async (id, status) => {
      if (!user) throw new Error("You must be signed in.");
      const dbId = dbIdFor(id);
      if (!dbId) throw new Error("Ticket not found.");
      const enumStatus = STATUS_ENUM[status] || status;
      await api.updateTicketStatus(dbId, enumStatus, user.id);
      await refresh();
    },
    [user, dbIdFor, refresh]
  );

  const setTicketPriority = useCallback(
    async (id, priority) => {
      if (!user) throw new Error("You must be signed in.");
      const dbId = dbIdFor(id);
      if (!dbId) throw new Error("Ticket not found.");
      const enumPriority = PRIORITY_ENUM[priority] || priority;
      await api.updateTicket(dbId, {
        priority: enumPriority,
        changedById: user.id,
      });
      await refresh();
    },
    [user, dbIdFor, refresh]
  );

  const setTicketCategory = useCallback(
    async (id, category) => {
      if (!user) throw new Error("You must be signed in.");
      const dbId = dbIdFor(id);
      if (!dbId) throw new Error("Ticket not found.");
      const enumCategory = CATEGORY_ENUM[category] || category;
      await api.updateTicket(dbId, {
        category: enumCategory,
        changedById: user.id,
      });
      await refresh();
    },
    [user, dbIdFor, refresh]
  );

  const value = useMemo(
    () => ({
      tickets,
      loading,
      error,
      refresh,
      getTicket,
      addTicket,
      addComment,
      assignTicket,
      setTicketStatus,
      setTicketPriority,
      setTicketCategory,
    }),
    [
      tickets,
      loading,
      error,
      refresh,
      getTicket,
      addTicket,
      addComment,
      assignTicket,
      setTicketStatus,
      setTicketPriority,
      setTicketCategory,
    ]
  );

  return (
    <TicketsContext.Provider value={value}>
      {children}
    </TicketsContext.Provider>
  );
}
