const request = require("supertest");
const { createApp } = require("../src/app");
const { apiHelper } = require("./helpers/api")

describe("Projects API", () => {
    let app;
    let api;
    beforeEach(() => {
        app = createApp();
        api = apiHelper(app);
    })

    test("GET /projects returns [] initially", async () => {
        const res = await request(app).get("/projects");

        expect(res.status).toBe(200);
        expect(res.body).toEqual([])
    });

    test("POST /projects create a project", async () => {
        const res = await request(app).post("/projects").send({ name: "Create project" });
        expect(res.status).toBe(201);
        expect(res.body).toEqual({ id: 1, name: "Create project" })
    })

    test("POST /projects without a name return 400", async () => {
        const res = await request(app).post("/projects").send({});
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "Name is required" });
    })

    test("PATCH /projects replaces the name", async () => {
        const setupRes = await request(app).post("/projects").send({ name: "Create project" });
        expect(setupRes.status).toBe(201);
        expect(setupRes.body).toEqual({ id: 1, name: "Create project" });
        const res = await request(app).patch("/projects/1").send({ name: "Replace name" });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ id: 1, name: "Replace name" });
    })

    test("DELETE /projects delete the project", async () => {
        const setupRes = await request(app).post("/projects").send({ name: "Create project" });
        expect(setupRes.status).toBe(201);
        expect(setupRes.body).toEqual({ id: 1, name: "Create project" });
        const res = await request(app).delete("/projects/1");
        expect(res.status).toBe(204);
        const assertRes = await request(app).get("/projects");
        expect(assertRes.status).toBe(200);
        expect(assertRes.body).toEqual([]);
    })

    test("POST /projects/:projectId/tasks creates a task in project", async () => {
        const setupRes = await request(app).post("/projects").send({ name: "Create project" });
        expect(setupRes.status).toBe(201);
        expect(setupRes.body).toEqual({ id: 1, name: "Create project" });
        const res = await request(app).post("/projects/1/tasks").send({ title: "Create task" });
        expect(res.status).toBe(201);
        expect(res.body).toEqual({ id: 1, title: "Create task", projectId: 1 });
    })

    test("GET /projects/:projectId/tasks returns all tasks for project", async () => {
        await request(app).post("/projects").send({ name: "Setup project" })
        await request(app).post("/projects/1/tasks").send({ title: "Setup task 1" });
        await request(app).post("/projects/1/tasks").send({ title: "Setup task 2" });
        const assertRes = await request(app).get("/projects/1/tasks");
        expect(assertRes.status).toBe(200);
        expect(assertRes.body.length).toBe(2);
        expect(assertRes.body[0].id).toBe(1);
        expect(assertRes.body[1].id).toBe(2);
        expect(assertRes.body[0].projectId).toBe(1);
        expect(assertRes.body[1].projectId).toBe(1);
    })

    test("DELETE /projects/:id deletes project and its tasks", async () => {
        const projectRes = await api.createProject("P1");
        const projectId = projectRes.body.id;
        await api.createTaskInProject("T1", projectId);
        await api.createTaskInProject("T2", projectId);
        const res = await request(app).delete(`/projects/${projectId}`);
        expect(res.status).toBe(204);
        const assertRes = await request(app).get("/projects");
        expect(assertRes.status).toBe(200)
        expect(assertRes.body).toEqual([]);
        const assertTasks = await request(app).get(`/projects/${projectId}/tasks`);
        expect(assertTasks.status).toBe(404)
        expect(assertTasks.body).toEqual({ error: "Project not found" })
        const allTasks = await request(app).get("/tasks");
        expect(allTasks.status).toBe(200);
        expect(allTasks.body).toEqual([]);
    })
});