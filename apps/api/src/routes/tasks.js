const express = require("express");

function createTasksRouter() {
  const router = express.Router();

  const tasks = [];

  router.get("/", (req, res) => {
    res.json(tasks);
  });

  router.post("/", (req, res) => {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const newTask = { id: tasks.length + 1, title };
    tasks.push(newTask);

    res.status(201).json(newTask);
  });

  router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Task not found" });
    }

    tasks.splice(index, 1);
    res.status(204).send();
  });

  router.patch("/:id", (req, res) => {
    const id = Number(req.params.id);
    const { title } = req.body;

    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (title) {
      tasks[index].title = title;
    }

    res.status(200).json(tasks[index]);
  });

  return router;
}

module.exports = { createTasksRouter };