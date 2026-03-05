const express = require("express");

function createProjectRouter(prisma) {
    const router = express.Router();

    router.get("/", async (req, res) => {
        try {
            const projects = await prisma.project.findMany({
                orderBy: {
                    id: "asc"
                }
            });
            return res.json(projects);
        } catch (e) {
            return res.status(500).json({ error: "Internal server error" });
        }
    });

    router.post("/", async (req, res) => {
        const { name } = req.body
        if (!name.trim()) {
            return res.status(400).json({ error: "Name is required" });
        };
        try {
            const created = await prisma.project.create({
                data: {
                    name
                }
            })
            return res.status(201).json(created)
        } catch (e) {
            return res.status(500).json({ error: "Internal server error" });
        }
    })

    router.delete("/:id", async (req, res) => {
        const projectId = Number(req.params.id);
        if (isNaN(projectId)) {
            return res.status(400).json({ error: "Invalid project id" });
        }
        try {
            await prisma.project.delete({
                where: {
                    id: projectId
                }
            })
            return res.status(204).send()
        } catch (e) {
            if (e.code === "P2025") {
                return res.status(404).json({ error: "Project not found" });
            }
            return res.status(500).json({ error: "Internal server error" });
        }
    })

    router.patch("/:id", async (req, res) => {
        const updatingProjectId = Number(req.params.id);
        const { name } = req.body;
        if (isNaN(updatingProjectId)) {
            return res.status(400).json({ error: "Invalid project id" })
        }
        if (!name.trim()) {
            return res.status(400).json({ error: "Name is required" });
        }
        try {
            const updated = await prisma.project.update({
                where: {
                    id: updatingProjectId
                },
                data: {
                    name
                }
            })
            return res.status(200).json(updated);
        } catch (e) {
            if (e.code === "P2025") {
                return res.status(404).json({ error: "Project not found" });
            }
            return res.status(500).json({ error: "Internal server error" });
        }
    })

    router.post("/:projectId/tasks", async (req, res) => {
        const projectIdForTasks = Number(req.params.projectId);
        const { title } = req.body;
        const cleanTitle = title.trim();
        if (isNaN(projectIdForTasks)) {
            return res.status(400).json({ error: "Invalid project id" });
        }
        if (!cleanTitle || typeof cleanTitle !== 'string') {
            return res.status(400).json({ error: "Title is required" })
        }
        const project = await prisma.project.findUnique({
            where: { id: projectIdForTasks }
        })
        if(!project) return res.status(404).json({ error: "Project not found" });
        try {
            const createdTask = await prisma.task.create({
                data: {
                    title: cleanTitle,
                    project: { connect: { id: projectIdForTasks } }
                }
            })
            return res.status(201).json(createdTask)
        } catch (e) {
            return res.status(500).json({ error: "Internal server error" });
        }
    })

    router.get("/:projectId/tasks", async (req, res) => {
        const projectId = Number(req.params.projectId);
        if (isNaN(projectId)) {
            return res.status(400).json({ error: "Invalid project id" });
        }
        try{
            const project = await prisma.project.findUnique({
                where: {id: projectId}
            })
            if(!project) return res.status(404).json({ error: "Project not found" });
            const tasks = await prisma.task.findMany({
                orderBy: { id: "asc" },
                where: {projectId}
            })
            return res.json(tasks)
        }catch(e){
            return res.status(500).json({ error: "Internal server error" });
        }
    })

    return router;
}

module.exports = { createProjectRouter };