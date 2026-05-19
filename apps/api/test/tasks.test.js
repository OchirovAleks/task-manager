const request = require("supertest");
const { createApp } = require("../src/app");
const { prisma } = require("../src/prisma");
const { apiHelper } = require("./helpers/api")

describe("Tasks API", () => {
  let app;
  let api;
  let token;
  let userId
  beforeEach(async () => {
    app = createApp(prisma);
    api = apiHelper(app);
    const auth = await api.createAndLoginUser();
    token = auth.token
    userId = auth.user.id
  })

  test("PATCH /tasks replaces the title", async () => {
    const projectRes = await api.createProject("P1", token);
    const projectId = projectRes.body.id;
    expect(projectRes.status).toBe(201);
    const setupRes = await api.createTaskInProject("T1", projectId, token);
    expect(setupRes.status).toBe(201);
    expect(setupRes.body).toMatchObject({ id: 1, title: "T1", projectId: projectId ,userId});
    const res = await request(app).patch("/tasks/1").set("Authorization", `Bearer ${token}`).send({ title: "Replace title" });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, title: "Replace title", projectId: projectId ,userId});
  })

  test("DELETE /tasks delete the task", async () => {
    const projectRes = await api.createProject("P1", token);
    const projectId = projectRes.body.id;
    expect(projectRes.status).toBe(201);
    const setupRes = await api.createTaskInProject("T1", projectId, token);
    const taskId = setupRes.body.id
    expect(setupRes.status).toBe(201);
    const res = await request(app).delete(`/tasks/${taskId}`).set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
    const assertRes = await request(app).get(`/projects/${projectId}/tasks`).set("Authorization", `Bearer ${token}`);
    expect(assertRes.status).toBe(200);
    expect(assertRes.body).toEqual([]);
  })
});