const express = require("express");
const { createTasksRouter } = require("./routes/tasks");
const { createProjectRouter } = require("./routes/projects");


function createApp(prisma) {
  const app = express();

  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ ok: true });
  });

  app.use("/tasks", createTasksRouter(prisma));
  app.use("/projects", createProjectRouter(prisma));

  return app;
}

module.exports = { createApp };