const express = require("express");
const cors = require("cors");
const { createTasksRouter } = require("./routes/tasks");
const { createProjectRouter } = require("./routes/projects");
const {errorHandler} = require("./middlewares/errorHandler");


function createApp(prisma) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ ok: true });
  });

  app.use("/tasks", createTasksRouter(prisma));
  app.use("/projects", createProjectRouter(prisma));
  app.use(errorHandler)

  return app;
}

module.exports = { createApp };