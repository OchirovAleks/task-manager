const express = require("express");
const { createError } = require("../utils/createError");

function createTasksRouter(taskRepo) {
  const router = express.Router();

  router.delete("/:id", async (req, res,next) => {
    const taskId = Number(req.params.id);
    if (isNaN(taskId)) return next(createError("Invalid task id", 400))
    try {
      const deleted = await taskRepo.deleteById(taskId)
      return res.status(204).send()
    } catch (error) {
      if (error.code === "P2025") {
        return next(createError("Project not found", 404))
      }
      console.error("DELETE /task/:taskId failed:", error);
      next(error)
    }
  });

  router.patch("/:id", async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return next(createError("Invalid task id", 400))
    const { title } = req.body;
    if(typeof title !== "string") return next(createError("Invalid task title", 400))
    const cleanTitle = title.trim();
    if (!cleanTitle) return next(createError("Invalid task title", 400))
    try {
      const updated = await taskRepo.updateById(id, cleanTitle)
      return res.status(200).json(updated)
    } catch (error) {
      if (error.code === "P2025") {
        return next(createError("Project not found", 404))
      }
      console.error("PATCH /tasks/:taskId failed:", error);
      next(error)
    }
  });

  return router;
}

module.exports = { createTasksRouter };