const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  config = require("./config"),
  db = require("./models"),
  middleware = require("./middleware"),
  notesRoutes = require("./routes/notes"),
  authRoutes = require("./routes/auth");

const PORT = process.env.SERVER_PORT || config.SERVER_PORT;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/api/", function(req, res) {
  res.send("Send a request to /api/auth/login to authenticate!!!");
});

app.use("/api/notes/", middleware.authenticate, notesRoutes);
app.use("/api/auth/", authRoutes);

app.listen(PORT, (req, res) => {
  console.log(`The server is running on http://localhost:${PORT}`);
});
