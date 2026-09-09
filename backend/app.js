const express = require("express");
const cors = require("cors");
const ticketRoutes = require("./routes/ticketRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/helpdesk/api/health", (req, res) => {
  res.json({
    message: "Campus IT HelpDesk API is running"
  });
});

app.use("/helpdesk/api/tickets", ticketRoutes);
app.use("/helpdesk/api/users", userRoutes);

module.exports = app;
