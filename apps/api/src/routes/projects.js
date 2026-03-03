const express = require("express");
const { default: prisma } = require("../prisma");

function createProjectRouter(projectStore, taskStore) {
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
            if(e.code === "P2025"){
                return res.status(404).json({ error: "Project not found" });
            }
            return res.status(500).json({ error: "Internal server error" });
        }
    })

    router.patch("/:id", async (req, res) => {
        const updatingProjectId = Number(req.params.id);
        const { name } = req.body;
        if(isNaN(updatingProjectId)){
            return res.status(400).json({ error: "Invalid project id"})
        }
        if (!name.trim()) {
            return res.status(400).json({ error: "Name is required" });
        }
        try{
            const updated = await prisma.project.update({
                where: {
                    id: updatingProjectId
                },
                data: {
                    name
                }
            })
            return res.status(200).json(updated);
        } catch(e) {
            if(e.code === "P2025"){
                return res.status(404).json({ error: "Project not found" });
            }
            return res.status(500).json({ error: "Internal server error" });
        }
    })

    router.post("/:projectId/tasks", async (req, res) => {
        const project = projectStore.getAllProjects().find(project => project.id === projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ error: "Title is required" })
        }
        const created = taskStore.createTask(title, projectId);
        return res.status(201).json(created);
    })

    router.get("/:projectId/tasks", (req, res) => {
        const projectId = Number(req.params.projectId);
        const project = projectStore.getAllProjects().find(project => project.id === projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        return res.status(200).json(taskStore.getTasksByProjectId(projectId));
    })

    return router;
}

module.exports = { createProjectRouter };