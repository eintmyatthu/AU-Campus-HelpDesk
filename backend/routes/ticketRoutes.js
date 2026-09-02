const express = require("express");
const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  claimTicket,
  updateTicketStatus,
  resolveTicket
} = require("../controllers/ticketController");
const { addComment, getComments } = require("../controllers/ticketCommentController");
const { getTicketHistory } = require("../controllers/ticketHistoryController");

const router = express.Router();

router.post("/", createTicket);
router.get("/", getAllTickets);
router.get("/:id", getTicketById);
router.patch("/:id", updateTicket);
router.post("/:id/comments", addComment);
router.get("/:id/comments", getComments);
router.get("/:id/history", getTicketHistory);
router.post("/:id/claim", claimTicket);
router.patch("/:id/status", updateTicketStatus);
router.post("/:id/resolve", resolveTicket);

module.exports = router;
