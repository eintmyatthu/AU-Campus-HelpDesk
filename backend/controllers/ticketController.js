const prisma = require("../config/prisma");
const { generateTicketNumber } = require("../services/ticketNumberService");

const CATEGORIES = [
  "HARDWARE", "SOFTWARE", "NETWORK", "ACCOUNT_ACCESS",
  "CLASSROOM_EQUIPMENT", "PRINTER", "OTHER"
];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const STATUSES = ["OPEN", "CLAIMED", "IN_PROGRESS", "RESOLVED", "CLOSED", "REOPENED"];
const ALLOWED_TRANSITIONS = {
  OPEN: ["CLAIMED"],
  CLAIMED: ["IN_PROGRESS"],
  IN_PROGRESS: ["RESOLVED"],
  RESOLVED: ["CLOSED", "REOPENED"],
  CLOSED: ["REOPENED"],
  REOPENED: ["CLAIMED", "IN_PROGRESS"]
};
const ticketInclude = {
  reporter: { select: { id: true, name: true, email: true, role: true } },
  technician: { select: { id: true, name: true, email: true, role: true } }
};

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function sendServerError(res, error, message) {
  console.error(error);
  return res.status(500).json({ error: message });
}

async function createTicket(req, res) {
  const { title, description, roomNumber, reporterId } = req.body;
  const parsedReporterId = parseId(reporterId);

  if (!title?.trim() || !description?.trim() || !parsedReporterId) {
    return res.status(400).json({ error: "title, description, and a valid reporterId are required." });
  }

  try {
    const reporter = await prisma.user.findUnique({ where: { id: parsedReporterId } });
    if (!reporter || !reporter.isActive) {
      return res.status(404).json({ error: "Active reporter not found." });
    }

    const ticket = await prisma.$transaction(async (tx) => {
      const ticketNumber = await generateTicketNumber(tx);
      const created = await tx.ticket.create({
        data: {
          ticketNumber,
          title: title.trim(),
          description: description.trim(),
          roomNumber: roomNumber?.trim() || null,
          reporterId: parsedReporterId,
          category: "OTHER",
          priority: "MEDIUM",
          status: "OPEN"
        }
      });
      await tx.ticketHistory.create({
        data: {
          ticketId: created.id,
          changedById: parsedReporterId,
          action: "TICKET_CREATED",
          newStatus: "OPEN"
        }
      });
      return tx.ticket.findUnique({ where: { id: created.id }, include: ticketInclude });
    });

    return res.status(201).json(ticket);
  } catch (error) {
    return sendServerError(res, error, "Unable to create ticket.");
  }
}

async function getAllTickets(req, res) {
  try {
    const tickets = await prisma.ticket.findMany({
      include: ticketInclude,
      orderBy: { createdAt: "desc" }
    });
    return res.json(tickets);
  } catch (error) {
    // In development without a database, return an empty list instead of a
    // 500 so the UI can load. Remove once a DATABASE_URL is configured.
    if (error.name === "PrismaClientInitializationError") {
      console.warn("Tickets unavailable: no database connection. Returning empty list.");
      return res.json([]);
    }
    return sendServerError(res, error, "Unable to retrieve tickets.");
  }
}

async function getTicketById(req, res) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid ticket id." });

  try {
    const ticket = await prisma.ticket.findUnique({ where: { id }, include: ticketInclude });
    if (!ticket) return res.status(404).json({ error: "Ticket not found." });
    return res.json(ticket);
  } catch (error) {
    return sendServerError(res, error, "Unable to retrieve ticket.");
  }
}

async function updateTicket(req, res) {
  const id = parseId(req.params.id);
  const changedById = parseId(req.body.changedById);
  if (!id) return res.status(400).json({ error: "Invalid ticket id." });
  if (!changedById) return res.status(400).json({ error: "A valid changedById is required." });

  const data = {};
  for (const field of ["title", "description", "roomNumber"]) {
    if (req.body[field] !== undefined) {
      if (typeof req.body[field] !== "string" || (field !== "roomNumber" && !req.body[field].trim())) {
        return res.status(400).json({ error: `${field} must be a valid string.` });
      }
      data[field] = req.body[field].trim() || null;
    }
  }
  if (req.body.category !== undefined) {
    if (!CATEGORIES.includes(req.body.category)) return res.status(400).json({ error: "Invalid category." });
    data.category = req.body.category;
  }
  if (req.body.priority !== undefined) {
    if (!PRIORITIES.includes(req.body.priority)) return res.status(400).json({ error: "Invalid priority." });
    data.priority = req.body.priority;
  }
  if (!Object.keys(data).length) return res.status(400).json({ error: "No supported fields were provided." });

  try {
    const [ticket, user] = await Promise.all([
      prisma.ticket.findUnique({ where: { id } }),
      prisma.user.findUnique({ where: { id: changedById } })
    ]);
    if (!ticket) return res.status(404).json({ error: "Ticket not found." });
    if (!user || !user.isActive) return res.status(404).json({ error: "Active user not found." });

    const updated = await prisma.$transaction(async (tx) => {
      await tx.ticket.update({ where: { id }, data });
      await tx.ticketHistory.create({
        data: { ticketId: id, changedById, action: "TICKET_UPDATED", previousStatus: ticket.status, newStatus: ticket.status }
      });
      return tx.ticket.findUnique({ where: { id }, include: ticketInclude });
    });
    return res.json(updated);
  } catch (error) {
    return sendServerError(res, error, "Unable to update ticket.");
  }
}

async function claimTicket(req, res) {
  const id = parseId(req.params.id);
  const technicianId = parseId(req.body.technicianId);
  if (!id || !technicianId) return res.status(400).json({ error: "Valid ticket id and technicianId are required." });

  try {
    const [ticket, technician] = await Promise.all([
      prisma.ticket.findUnique({ where: { id } }),
      prisma.user.findUnique({ where: { id: technicianId } })
    ]);
    if (!ticket) return res.status(404).json({ error: "Ticket not found." });
    if (!technician || !technician.isActive) return res.status(404).json({ error: "Active technician not found." });
    if (!["TECHNICIAN", "ADMIN"].includes(technician.role)) {
      return res.status(403).json({ error: "Only a technician or admin can claim a ticket." });
    }
    if (ticket.technicianId !== null || ticket.status !== "OPEN") {
      return res.status(409).json({ error: "Ticket is already assigned or is not open." });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.ticket.updateMany({
        where: { id, technicianId: null, status: "OPEN" },
        data: { technicianId, status: "CLAIMED" }
      });
      if (result.count !== 1) {
        const conflict = new Error("CLAIM_CONFLICT");
        conflict.code = "CLAIM_CONFLICT";
        throw conflict;
      }
      await tx.ticketHistory.create({
        data: { ticketId: id, changedById: technicianId, action: "TICKET_CLAIMED", previousStatus: "OPEN", newStatus: "CLAIMED" }
      });
      return tx.ticket.findUnique({ where: { id }, include: ticketInclude });
    });
    return res.json(updated);
  } catch (error) {
    if (error.code === "CLAIM_CONFLICT") return res.status(409).json({ error: "Another technician already claimed this ticket." });
    return sendServerError(res, error, "Unable to claim ticket.");
  }
}

async function updateTicketStatus(req, res) {
  const id = parseId(req.params.id);
  const changedById = parseId(req.body.changedById);
  const { status } = req.body;
  if (!id || !changedById) return res.status(400).json({ error: "Valid ticket id and changedById are required." });
  if (!STATUSES.includes(status)) return res.status(400).json({ error: "Invalid ticket status." });

  try {
    const [ticket, user] = await Promise.all([
      prisma.ticket.findUnique({ where: { id } }),
      prisma.user.findUnique({ where: { id: changedById } })
    ]);
    if (!ticket) return res.status(404).json({ error: "Ticket not found." });
    if (!user || !user.isActive) return res.status(404).json({ error: "Active user not found." });
    if (!ALLOWED_TRANSITIONS[ticket.status].includes(status)) {
      return res.status(409).json({ error: `Cannot change status from ${ticket.status} to ${status}.` });
    }

    const updated = await prisma.$transaction(async (tx) => {
      await tx.ticket.update({ where: { id }, data: { status } });
      await tx.ticketHistory.create({
        data: { ticketId: id, changedById, action: "STATUS_CHANGED", previousStatus: ticket.status, newStatus: status }
      });
      return tx.ticket.findUnique({ where: { id }, include: ticketInclude });
    });
    return res.json(updated);
  } catch (error) {
    return sendServerError(res, error, "Unable to update ticket status.");
  }
}

async function resolveTicket(req, res) {
  const id = parseId(req.params.id);
  const technicianId = parseId(req.body.technicianId);
  const { resolutionNote } = req.body;
  if (!id || !technicianId || !resolutionNote?.trim()) {
    return res.status(400).json({ error: "Valid ticket id, technicianId, and resolutionNote are required." });
  }

  try {
    const [ticket, technician] = await Promise.all([
      prisma.ticket.findUnique({ where: { id } }),
      prisma.user.findUnique({ where: { id: technicianId } })
    ]);
    if (!ticket) return res.status(404).json({ error: "Ticket not found." });
    if (!technician || !technician.isActive) return res.status(404).json({ error: "Active technician not found." });
    if (!["TECHNICIAN", "ADMIN"].includes(technician.role)) {
      return res.status(403).json({ error: "Only a technician or admin can resolve a ticket." });
    }
    if (ticket.technicianId && ticket.technicianId !== technicianId && technician.role !== "ADMIN") {
      return res.status(403).json({ error: "Ticket is assigned to another technician." });
    }
    if (!["CLAIMED", "IN_PROGRESS", "REOPENED"].includes(ticket.status)) {
      return res.status(409).json({ error: `A ticket in ${ticket.status} status cannot be resolved.` });
    }

    const updated = await prisma.$transaction(async (tx) => {
      await tx.ticket.update({
        where: { id },
        data: { technicianId, resolutionNote: resolutionNote.trim(), status: "RESOLVED" }
      });
      await tx.ticketHistory.create({
        data: { ticketId: id, changedById: technicianId, action: "TICKET_RESOLVED", previousStatus: ticket.status, newStatus: "RESOLVED" }
      });
      return tx.ticket.findUnique({ where: { id }, include: ticketInclude });
    });
    return res.json(updated);
  } catch (error) {
    return sendServerError(res, error, "Unable to resolve ticket.");
  }
}

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  claimTicket,
  updateTicketStatus,
  resolveTicket
};
