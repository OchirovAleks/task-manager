const request = require("supertest");
const { createApp } = require("../src/app");
const { prisma } = require("../src/prisma");
const { apiHelper } = require("./helpers/api")

describe("Tasks API", () => {
  let app;
  let api;

  beforeEach(() => {
    app = createApp(prisma);
    api = apiHelper(app);
  })

  test("PATCH /tasks replaces the title", async () => {
    const projectRes = await api.createProject("P1");
    const projectId = projectRes.body.id;
    expect(projectRes.status).toBe(201);
    const setupRes = await api.createTaskInProject("T1", projectId);
    expect(setupRes.status).toBe(201);
    expect(setupRes.body).toEqual({ id: 1, title: "T1", projectId: projectId });
    const res = await request(app).patch("/tasks/1").send({ title: "Replace title" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, title: "Replace title", projectId: projectId });
  })

  test("DELETE /tasks delete the task", async () => {
    const projectRes = await api.createProject("P1");
    const projectId = projectRes.body.id;
    expect(projectRes.status).toBe(201);
    const setupRes = await api.createTaskInProject("T1", projectId);
    const taskId = setupRes.body.id
    expect(setupRes.status).toBe(201);
    const res = await request(app).delete(`/tasks/${taskId}`);
    expect(res.status).toBe(204);
    const assertRes = await request(app).get(`/projects/${projectId}/tasks`);
    expect(assertRes.status).toBe(200);
    expect(assertRes.body).toEqual([]);
  })
});