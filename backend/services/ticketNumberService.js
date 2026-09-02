async function generateTicketNumber(database) {
  const year = new Date().getFullYear();
  const sequence = await database.ticketSequence.upsert({
    where: { year },
    update: { lastNumber: { increment: 1 } },
    create: { year, lastNumber: 1 }
  });

  return `IT-${year}-${String(sequence.lastNumber).padStart(6, "0")}`;
}

module.exports = { generateTicketNumber };
