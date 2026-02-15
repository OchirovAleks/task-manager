const request = require("supertest");

function apiHelper(app){

    const createProject = (name) => {
        return request(app).post("/projects").send({name});
    }

    const createTask = (title) => {
        return request(app).post("/tasks").send({title});
    }

    const createTaskInProject = (title, projectId) => {
        return request(app).post(`/projects/${projectId}/tasks`).send({title});
    }

	
    return {
        createProject,
        createTask,
        createTaskInProject
    }
}

module.exports = {apiHelper}; 