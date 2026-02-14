const express = require("express");
const {createProjectStore} = require("../store/projectsStore");

function createProjectRouter(){
    const router = express.Router();
    const store = createProjectStore();

    router.get("/", (req, res) => {
        res.json(store.getAllProjects());
    });

    router.post("/", (req, res) => {
        const {name} = req.body;
        if(!name){
            return res.status(400).json({ error: "Name is required" });
        };
        const created = store.createProject(name);
        res.status(201).json(created);
    })

    router.delete("/:id", (req, res) => {
        const id = Number(req.params.id);
        const deleted = store.deleteProject(id);
        if(!deleted){
            return res.status(404).json({error: "Project not found"});
        }
        res.status(204).send();
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
        res.status(200).json(updated);
    })

    return router;
}

module.exports = { createProjectRouter };