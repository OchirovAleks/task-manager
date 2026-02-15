const express = require("express");
const { createTaskStore } = require('../store/tasksStore');


function createTasksRouter() {
  const router = express.Router();
  const store = createTaskStore();


  router.get("/", (req, res) => {
    return res.json(store.getAllTasks());
  });

  router.post("/", (req, res) => {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const created = store.createTask(title);
    return res.status(201).json(created);
  });

  router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    const deleted = store.deleteTask(id);
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
    const updated = store.updateTask(id, title);
    if (!updated) {
      return res.status(404).json({ error: "Task not found" })
    }
    return res.status(200).json(updated);
  });

  return router;
}

module.exports = { createTasksRouter };