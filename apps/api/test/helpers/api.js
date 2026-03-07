const request = require("supertest");

function apiHelper(app){

    const createProject = (name) => {
        return request(app).post("/projects").send({name});
    }

    const createTaskInProject = (title, projectId) => {
        return request(app).post(`/projects/${projectId}/tasks`).send({title});
    }

	
    return {
        createProject,
        createTaskInProject
    }
}

module.exports = {apiHelper}; 