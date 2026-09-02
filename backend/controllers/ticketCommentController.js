const prisma = require("../config/prisma");

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function addComment(req, res) {
  const ticketId = parseId(req.params.id);
  const userId = parseId(req.body.userId);
  const { message } = req.body;
  if (!ticketId || !userId || !message?.trim()) {
    return res.status(400).json({ error: "Valid ticket id, userId, and a non-empty message are required." });
  }

  try {
    const [ticket, user] = await Promise.all([
      prisma.ticket.findUnique({ where: { id: ticketId } }),
      prisma.user.findUnique({ where: { id: userId } })
    ]);
    if (!ticket) return res.status(404).json({ error: "Ticket not found." });
    if (!user || !user.isActive) return res.status(404).json({ error: "Active user not found." });

    const comment = await prisma.ticketComment.create({
      data: { ticketId, userId, message: message.trim() },
      include: { user: { select: { id: true, name: true, email: true, role: true } } }
    });
    return res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to add comment." });
  }
}

async function getComments(req, res) {
  const ticketId = parseId(req.params.id);
  if (!ticketId) return res.status(400).json({ error: "Invalid ticket id." });

  try {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId }, select: { id: true } });
    if (!ticket) return res.status(404).json({ error: "Ticket not found." });
    const comments = await prisma.ticketComment.findMany({
      where: { ticketId },
      include: { user: { select: { id: true, name: true, email: true, role: true } } },
      orderBy: { createdAt: "asc" }
    });
    return res.json(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to retrieve comments." });
  }
}

module.exports = { addComment, getComments };
