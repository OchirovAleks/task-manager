const express = require("express");
const { createError } = require("../utils/createError");

function createProjectRouter(projectRepo) {
    const router = express.Router();

    router.get("/", async (req, res, next) => {
        try {
            const projects = await projectRepo.getAll();
            return res.json(projects);
        } catch (error) {
            console.error("GET /projects failed:", error);
            next(error);
        }
    });

    router.post("/", async (req, res, next) => {
        const { name } = req.body
        if (typeof name !== "string") {
            return next(createError("Name is required", 400));
        }

        const cleanName = name.trim();

        if (!cleanName) {
            return next(createError("Name is required", 400));
        }
        try {
            const created = await projectRepo.create(cleanName);
            return res.status(201).json(created)
        } catch (error) {
            console.error("POST /projects failed:", error);
            next(error)
        }
    })

    router.delete("/:id", async (req, res, next) => {
        const projectId = Number(req.params.id);
        if (isNaN(projectId)) {
            return next(createError("Invalid project id", 400));
        }
        try {
            await projectRepo.deleteById(projectId)
            return res.status(204).send()
        } catch (error) {
            if (error.code === "P2025") {
                return next(createError("Project not found", 404));
            }
            console.error("DELETE /projects failed:", error);
            next(error)
        }
    })

    router.patch("/:id", async (req, res, next) => {
        const updatingProjectId = Number(req.params.id);
        const { name } = req.body;
        if (typeof name !== "string") {
            next(createError("Name is required", 400))
        }
        const cleanName = name.trim();
        if (!cleanName) {
            next(createError("Name is required", 400))
        }
        if (isNaN(updatingProjectId)) {
            return next(createError("Invalid project id", 400))
        }
        try {
            const updated = await projectRepo.updateById(updatingProjectId, cleanName)
            return res.status(200).json(updated);
        } catch (error) {
            if (error.code === "P2025") {
                return next(createError("Project not found", 404));
            }
            console.error("PATCH /projects failed:", error);
            next(error);
        }
    })

    router.post("/:projectId/tasks", async (req, res, next) => {
        const projectIdForTasks = Number(req.params.projectId);
        const { title } = req.body;
        if (typeof title !== 'string') {
            return next(createError("Title is required", 400))
        }
        const cleanTitle = title.trim();
        if (!cleanTitle) {
            return next(createError("Title is required", 400))
        }
        if (isNaN(projectIdForTasks)) {
            return next(createError("Invalid project id", 400))
        }
        try {
            const project = await projectRepo.findById(projectIdForTasks)
            if (!project) return next(createError("Project not found", 404))

            const createdTask = await prisma.task.create({
                data: {
                    title: cleanTitle,
                    project: { connect: { id: projectIdForTasks } }
                }
            })
            return res.status(201).json(createdTask)
        } catch (error) {
            console.error("POST /tasks failed:", error);
            next(error)
        }
    })

    router.get("/:projectId/tasks", async (req, res, next) => {
        const projectId = Number(req.params.projectId);
        if (isNaN(projectId)) {
            return next(createError("Invalid project id", 400))
        }
        try {
            const project = await projectRepo.findById(projectIdForTasks);
            if (!project) return next(createError("Project not found", 404))
            const tasks = await prisma.task.findMany({
                orderBy: { id: "asc" },
                where: { projectId }
            })
            return res.json(tasks)
        } catch (error) {
            console.error("GET /projects/:projectId/tasks failed:", error);
            next(error)
        }
    })

    return router;
}

module.exports = { createProjectRouter };