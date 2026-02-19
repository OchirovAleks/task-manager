const express = require("express");


function createTasksRouter(taskStore) {
  const router = express.Router();


  router.get("/", (req, res) => {
    return res.json(taskStore.getAllTasks());
  });

  router.post("/", (req, res) => {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const created = taskStore.createTask(title);
    return res.status(201).json(created);
  });

  router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    const deleted = taskStore.deleteTask(id);
    if (!deleted) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.status(204).send();
  });

  router.patch("/:id", (req, res) => {
    const id = Number(req.params.id);
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is requared" });
    }
    const updated = taskStore.updateTask(id, title);
    if (!updated) {
      return res.status(404).json({ error: "Task not found" })
    }
    return res.status(200).json(updated);
  });

  return router;
}

module.exports = { createTasksRouter };