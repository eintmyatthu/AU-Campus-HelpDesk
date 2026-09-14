const express = require("express");
const cors = require("cors");

const ticketRoutes = require("./routes/ticketRoutes");
const userRoutes = require("./routes/userRoutes");
const dnsRoutes = require("./routes/dnsRoutes");

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
app.use("/helpdesk/api/tools/dns", dnsRoutes);

module.exports = app;
