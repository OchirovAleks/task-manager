const request = require("supertest");

function apiHelper(app) {

    const createProject = (name, token) => {
        return request(app)
            .post("/projects")
            .set("Authorization", `Bearer ${token}`)
            .send({ name });
    };

    const createTaskInProject = (title, projectId, token) => {
        return request(app)
            .post(`/projects/${projectId}/tasks`)
            .set("Authorization", `Bearer ${token}`)
            .send({ title });
    };

    const createAndLoginUser = async () => {
        const email = `test${Date.now()}@example.com`;
        const password = 'Password123';
        const response = await request(app).post("/auth/register").send({
            email,
            password
        })
        return {
            token: response.body.token,
            user: response.body.user
        }
    }


    return {
        createProject,
        createTaskInProject,
        createAndLoginUser
    }
}

module.exports = { apiHelper }; 