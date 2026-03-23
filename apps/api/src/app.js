const express = require("express");
const cors = require("cors");
const { createTasksRouter } = require("./routes/tasks");
const { createProjectRouter } = require("./routes/projects");
const { errorHandler } = require("./middlewares/errorHandler");
const { createProjectRepo } = require("../repositories/projectsRepo")


function createApp(prisma) {
  const app = express();
  const projectRepo = createProjectRepo(prisma);

  app.use(cors());
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ ok: true });
  });
  app.use("/projects", createProjectRouter(projectRepo));
  app.use("/tasks", createTasksRouter(prisma));
  app.use(errorHandler)

  return app;
}

module.exports = { createApp };