const express = require("express");
const { createTasksRouter } = require("./routes/tasks");
const { createProjectRouter } = require("./routes/projects");

const { createTaskStore } = require("./store/tasksStore");
const { createProjectStore } = require("./store/projectsStore");


function createApp() {
  const app = express();

  app.use(express.json());

  const taskStore = createTaskStore();
  const projectStore = createProjectStore();

  app.get("/health", (req, res) => {
    res.json({ ok: true });
  });

  app.use("/tasks", createTasksRouter(taskStore));
  app.use("/projects", createProjectRouter(projectStore, taskStore));

  return app;
}

module.exports = { createApp };