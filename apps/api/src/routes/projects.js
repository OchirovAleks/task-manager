const express = require("express");

function createProjectRouter(projectStore, taskStore){
    const router = express.Router();

    router.get("/", (req, res) => {
        return res.json(projectStore.getAllProjects());
    });

    router.post("/", (req, res) => {
        const {name} = req.body;
        if(!name){
            return res.status(400).json({ error: "Name is required" });
        };
        const created = projectStore.createProject(name);
        return res.status(201).json(created);
    })

    router.delete("/:id", (req, res) => {
        const projectId = Number(req.params.id);
        const deleted = projectStore.deleteProject(projectId);
        if(!deleted){
            return res.status(404).json({error: "Project not found"});
        }
        taskStore.deleteTasksByProjectId(projectId)
        return res.status(204).send();
    })

    router.patch("/:id", (req, res) => {
        const id = Number(req.params.id);
        const {name} = req.body;
        if(!name){
            return res.status(400).json({error: "Name is required"});
        }
        const updated = projectStore.updateProject(id, name);
        if(!updated){
            return res.status(404).json({error: "Project not found"})
        }
        return res.status(200).json(updated);
    })

    router.post("/:projectId/tasks", (req, res) => {
        const projectId = Number(req.params.projectId);
        const project = projectStore.getAllProjects().find(project => project.id === projectId);
        if(!project){
            return res.status(404).json({error: "Project not found"});
        }
        const {title} = req.body;
        if(!title){
            return res.status(400).json({error: "Title is required"})
        }
        const created = taskStore.createTask(title, projectId);
        return res.status(201).json(created);
    })

    router.get("/:projectId/tasks", (req, res) => {
        const projectId = Number(req.params.projectId);
        const project = projectStore.getAllProjects().find(project => project.id === projectId);
        if(!project){
            return res.status(404).json({error: "Project not found"});
        }
        return res.status(200).json(taskStore.getTasksByProjectId(projectId));
    })

    return router;
}

module.exports = { createProjectRouter };