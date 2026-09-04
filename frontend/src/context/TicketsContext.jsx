import {
  useCallback,
  useMemo,
  useState,
} from "react";
import { TicketsContext } from "./ticketsContextObject";

// Category/priority enum values map to friendly labels for display.
const CATEGORY_LABELS = {
  NETWORK: "Network",
  SOFTWARE: "Software",
  HARDWARE: "Hardware",
  ACCOUNT_ACCESS: "Account access",
  CLASSROOM_EQUIPMENT: "Classroom equipment",
  PRINTER: "Printer",
  OTHER: "Other",
};

const PRIORITY_LABELS = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};



// Seed data so the list is not empty on first load.
const seedTickets = [
  {
    id: "ICT-2481",
    title: "Campus Wi-Fi disconnects in CL Building",
    description:
      "The Wi-Fi in CL Building room 403 drops every few minutes on both my laptop and phone. It started this morning around 9am.",
    location: "CL Building · 403",
    category: "Network",
    priority: "High",
    status: "In progress",
    response: "Today, 15:00",
    createdAt: "Today, 09:12",
    reporter: "Test Student",
    assignee: "Narin Somchai",
    comments: [
      {
        id: 1,
        author: "IT Support",
        role: "staff",
        message:
          "Thanks for reporting. We are seeing similar reports in CL Building and are investigating the access point.",
        at: "Today, 10:05",
      },
    ],
    history: [
      { id: 1, action: "Ticket created", at: "Today, 09:12" },
      { id: 2, action: "Assigned to Narin Somchai", at: "Today, 09:40" },
      { id: 3, action: "Status changed to In progress", at: "Today, 10:05" },
    ],
  },
  {
    id: "ICT-2476",
    title: "Unable to access Microsoft 365 account",
    description:
      "I get an error when signing in to Outlook on the web. My password works for other services.",
    location: "Online service",
    category: "Account access",
    priority: "Medium",
    status: "Waiting for user",
    response: "Waiting for your reply",
    createdAt: "Yesterday, 16:40",
    reporter: "Test Student",
    assignee: "Maya Prasert",
    comments: [
      {
        id: 1,
        author: "IT Support",
        role: "staff",
        message:
          "Could you confirm whether multi-factor authentication is prompting on your device?",
        at: "Yesterday, 17:10",
      },
    ],
    history: [
      { id: 1, action: "Ticket created", at: "Yesterday, 16:40" },
      { id: 2, action: "Assigned to Maya Prasert", at: "Yesterday, 16:55" },
      {
        id: 3,
        action: "Status changed to Waiting for user",
        at: "Yesterday, 17:10",
      },
    ],
  },
];

export function TicketsProvider({ children }) {
  const [tickets, setTickets] = useState(seedTickets);

  const addTicket = useCallback((form) => {
    let created;
    setTickets((prev) => {
      created = {
        // Simple mock ticket number generator based on list size.
        id: `ICT-${2482 + prev.length}`,
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.roomNumber?.trim() || "Not specified",
        category: CATEGORY_LABELS[form.category] || "Other",
        priority: PRIORITY_LABELS[form.priority] || "Medium",
        status: "Open",
        response: "Awaiting triage",
        createdAt: "Just now",
        reporter: "Test Student",
        assignee: null,
        comments: [],
        history: [{ id: 1, action: "Ticket created", at: "Just now" }],
      };
      return [created, ...prev];
    });
    return created;
  }, []);

  const getTicket = useCallback(
    (id) => tickets.find((t) => t.id === id),
    [tickets]
  );

  const addComment = useCallback(
    (id, message, author = "You", role = "student") => {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                comments: [
                  ...t.comments,
                  {
                    id: t.comments.length + 1,
                    author,
                    role,
                    message: message.trim(),
                    at: "Just now",
                  },
                ],
              }
            : t
        )
      );
    },
    []
  );

  const appendHistory = (ticket, action) => ({
    ...ticket,
    history: [
      ...(ticket.history || []),
      { id: (ticket.history?.length || 0) + 1, action, at: "Just now" },
    ],
  });

  const assignTicket = useCallback((id, technician) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? appendHistory(
              {
                ...t,
                assignee: technician || null,
                // Auto-advance a brand-new ticket when first assigned.
                status: t.status === "Open" ? "In progress" : t.status,
              },
              technician
                ? `Assigned to ${technician}`
                : "Unassigned"
            )
          : t
      )
    );
  }, []);

  const setTicketStatus = useCallback((id, status) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? appendHistory(
              { ...t, status },
              `Status changed to ${status}`
            )
          : t
      )
    );
  }, []);

  const setTicketPriority = useCallback((id, priority) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? appendHistory(
              { ...t, priority },
              `Priority changed to ${priority}`
            )
          : t
      )
    );
  }, []);

  const value = useMemo(
    () => ({
      tickets,
      addTicket,
      getTicket,
      addComment,
      assignTicket,
      setTicketStatus,
      setTicketPriority,
    }),
    [
      tickets,
      addTicket,
      getTicket,
      addComment,
      assignTicket,
      setTicketStatus,
      setTicketPriority,
    ]
  );

  return (
    <TicketsContext.Provider value={value}>
      {children}
    </TicketsContext.Provider>
  );
}
