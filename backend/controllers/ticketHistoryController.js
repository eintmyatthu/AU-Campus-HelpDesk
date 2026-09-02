const prisma = require("../config/prisma");

async function getTicketHistory(req, res) {
  const ticketId = Number(req.params.id);
  if (!Number.isInteger(ticketId) || ticketId < 1) return res.status(400).json({ error: "Invalid ticket id." });

  try {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId }, select: { id: true } });
    if (!ticket) return res.status(404).json({ error: "Ticket not found." });
    const history = await prisma.ticketHistory.findMany({
      where: { ticketId },
      include: { changedBy: { select: { id: true, name: true, email: true, role: true } } },
      orderBy: { createdAt: "asc" }
    });
    return res.json(history);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to retrieve ticket history." });
  }
}

module.exports = { getTicketHistory };
