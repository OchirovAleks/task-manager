const express = require("express");
const { createTasksRouter } = require("./routes/tasks");
const { createProjectRouter } = require("./routes/projects");

function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ ok: true });
  });

  app.use("/projects", createProjectRouter());
  app.use("/tasks", createTasksRouter());

  return app;
}

module.exports = { createApp };