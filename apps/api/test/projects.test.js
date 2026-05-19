const request = require("supertest");
const { createApp } = require("../src/app");
const { apiHelper } = require("./helpers/api")
const { prisma } = require("../src/prisma");

describe("Projects API", () => {
    let app;
    let api;
    let token;
    let userId;
    beforeEach(async() => {
        app = createApp(prisma);
        api = apiHelper(app);
        const auth = await api.createAndLoginUser();
        token = auth.token
        userId = auth.user.id
    })


    test("GET /projects returns [] initially", async () => {
        const res = await request(app).get("/projects").set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual([])
    });

    test("POST /projects create a project", async () => {
        const res = await request(app).post("/projects").set("Authorization", `Bearer ${token}`).send({ name: "Create project" });
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({ id: 1, name: "Create project", userId})
    })

    test("POST /projects without a name return 400", async () => {
        const res = await request(app).post("/projects").set("Authorization", `Bearer ${token}`).send({});
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "Name is required" });
    })

    test("PATCH /projects replaces the name", async () => {
        const setupRes = await request(app).post("/projects").set("Authorization", `Bearer ${token}`).send({ name: "Create project" });
        expect(setupRes.status).toBe(201);
        expect(setupRes.body).toMatchObject({ id: 1, name: "Create project", userId});
        const res = await request(app).patch("/projects/1").set("Authorization", `Bearer ${token}`).send({ name: "Replace name" });
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ id: 1, name: "Replace name" , userId});
    })

    test("DELETE /projects delete the project", async () => {
        const setupRes = await request(app).post("/projects").set("Authorization", `Bearer ${token}`).send({ name: "Create project" });
        expect(setupRes.status).toBe(201);
        expect(setupRes.body).toMatchObject({ id: 1, name: "Create project" , userId});
        const res = await request(app).delete("/projects/1").set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(204);
        const assertRes = await request(app).get("/projects").set("Authorization", `Bearer ${token}`);
        expect(assertRes.status).toBe(200);
        expect(assertRes.body).toEqual([]);
    })

    test("POST /projects/:projectId/tasks creates a task in project", async () => {
        const setupRes = await request(app).post("/projects").set("Authorization", `Bearer ${token}`).send({ name: "Create project" });
        expect(setupRes.status).toBe(201);
        expect(setupRes.body).toMatchObject({ id: 1, name: "Create project" , userId});
        const res = await request(app).post("/projects/1/tasks").set("Authorization", `Bearer ${token}`).send({ title: "Create task" });
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({ id: 1, title: "Create task", projectId: 1 , userId});
    })

    test("GET /projects/:projectId/tasks returns all tasks for project", async () => {
        await request(app).post("/projects").set("Authorization", `Bearer ${token}`).send({ name: "Setup project" })
        await request(app).post("/projects/1/tasks").set("Authorization", `Bearer ${token}`).send({ title: "Setup task 1" });
        await request(app).post("/projects/1/tasks").set("Authorization", `Bearer ${token}`).send({ title: "Setup task 2" });
        const assertRes = await request(app).get("/projects/1/tasks").set("Authorization", `Bearer ${token}`);
        expect(assertRes.status).toBe(200);
        expect(assertRes.body.length).toBe(2);
        expect(assertRes.body[0].id).toBe(1);
        expect(assertRes.body[1].id).toBe(2);
        expect(assertRes.body[0].projectId).toBe(1);
        expect(assertRes.body[1].projectId).toBe(1);
    })

    test("DELETE /projects/:id deletes project and its tasks", async () => {
        const projectRes = await api.createProject("P1", token);
        const projectId = projectRes.body.id;
        await api.createTaskInProject("T1", projectId, token);
        await api.createTaskInProject("T2", projectId, token);
        const res = await request(app).delete(`/projects/${projectId}`).set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(204);
        const assertRes = await request(app).get("/projects").set("Authorization", `Bearer ${token}`);
        expect(assertRes.status).toBe(200)
        expect(assertRes.body).toEqual([]);
        const assertTasks = await request(app).get(`/projects/${projectId}/tasks`).set("Authorization", `Bearer ${token}`);
        expect(assertTasks.status).toBe(404)
        expect(assertTasks.body).toEqual({ error: "Project not found" })
        const tasksOfProject = await prisma.task.findMany({
            where: {
                projectId: projectId
            }
        })
        expect(tasksOfProject).toEqual([]);
    })
});