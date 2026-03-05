const express = require("express");


function createTasksRouter(prisma) {
  const router = express.Router();

  router.delete("/:id", async (req, res) => {
    const taskId = Number(req.params.id);
    if (isNaN(taskId)) return res.status(400).json({ error: "Invalid task id" })
    try {
      const deleted = await prisma.task.delete({
        where: { id: taskId }
      })
      return res.status(204).send()
    } catch (e) {
      if (e.code === "P2025") {
        return res.status(404).json({ error: "Task not found" });
      }
      return res.status(500).json({error: "Internal server error"})
    }
  });

  router.patch("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if(isNaN(id)) return res.status(400).json({error: "Invalid task id"})
    const { title } = req.body;
    const cleanTitle = title.trim();
    if(!cleanTitle || typeof cleanTitle !== "string") return res.status(400).json({error: "Invalid task title"})
    try{
      const updated = await prisma.task.update({
        where: {id},
        data: {title: cleanTitle}
      })
      return res.status(200).json(updated)
    }catch(e){
      if (e.code === "P2025") {
        return res.status(404).json({ error: "Task not found" });
      }
      return res.status(500).json({error: "Internal server error"})
    }
  });

  return router;
}

module.exports = { createTasksRouter };