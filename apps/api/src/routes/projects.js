const express = require("express");
const {createProjectStore} = require("../store/projectsStore");
const {createTaskStore} = require("../store/tasksStore")

function createProjectRouter(){
    const router = express.Router();
    const store = createProjectStore();
    const tasksStore = createTaskStore();

    router.get("/", (req, res) => {
        return res.json(store.getAllProjects());
    });

    router.post("/", (req, res) => {
        const {name} = req.body;
        if(!name){
            return res.status(400).json({ error: "Name is required" });
        };
        const created = store.createProject(name);
        return res.status(201).json(created);
    })

    router.delete("/:id", (req, res) => {
        const projectId = Number(req.params.id);
        const deleted = store.deleteProject(projectId);
        if(!deleted){
            return res.status(404).json({error: "Project not found"});
        }
        tasksStore.deleteTasksByProjectId(projectId)
        return res.status(204).send();
    })

    router.patch("/:id", (req, res) => {
        const id = Number(req.params.id);
        const {name} = req.body;
        if(!name){
            return res.status(400).json({error: "Name is required"});
        }
        const updated = store.updateProject(id, name);
        if(!updated){
            return res.status(404).json({error: "Project not found"})
        }
        return res.status(200).json(updated);
    })

    router.post("/:projectId/tasks", (req, res) => {
        const projectId = Number(req.params.projectId);
        const project = store.getAllProjects().find(project => project.id === projectId);
        if(!project){
            return res.status(404).json({error: "Project not found"});
        }
        const {title} = req.body;
        if(!title){
            return res.status(400).json({error: "Title is required"})
        }
        const created = tasksStore.createTask(title, projectId);
        return res.status(201).json(created);
    })

    router.get("/:projectId/tasks", (req, res) => {
        const projectId = Number(req.params.projectId);
        const project = store.getAllProjects().find(project => project.id === projectId);
        if(!project){
            return res.status(404).json({error: "Project not found"});
        }
        return res.status(200).json(tasksStore.getTasksByProjectId(projectId));
    })

    return router;
}

module.exports = { createProjectRouter };