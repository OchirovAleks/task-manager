const request = require("supertest");
const { createApp } = require("../src/app");

describe("Tasks API", () => {
  let app
  beforeEach(() => {
    app = createApp();
  })

  test("GET /tasks returns [] initially", async () => {
    //const app = createApp();

    const res = await request(app).get("/tasks");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([])
  });

  test("POST /tasks create a task", async () => {
    //const app = createApp();
    const res = await request(app).post("/tasks").send({ title: "Learn tests" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({id: 1, title: "Learn tests", projectId: null})
  })

  test("POST /tasks without a title return 400", async () => {
    //const app = createApp();
    const res = await request(app).post("/tasks").send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Title is required" });
  })

  test("PATCH /tasks replaces the title", async () => {
    //const app = createApp();
    const setupRes = await request(app).post("/tasks").send({title: "Create task"});
    expect(setupRes.status).toBe(201);
    expect(setupRes.body).toEqual({id: 1, title: "Create task", projectId: null});
    const res = await request(app).patch("/tasks/1").send({title: "Replace title"});
    expect(res.status).toBe(200);
    expect(res.body).toEqual({id: 1, title: "Replace title", projectId: null});
  })

  test("DELETE /tasks delete the task", async () => {
    //const app = createApp();
    const setupRes = await request(app).post("/tasks").send({title: "Create task"});
    expect(setupRes.status).toBe(201);
    expect(setupRes.body).toEqual({id: 1, title: "Create task", projectId: null});
    const res = await request(app).delete("/tasks/1");
    expect(res.status).toBe(204);
    const assertRes = await request(app).get("/tasks");
    expect(assertRes.status).toBe(200);
    expect(assertRes.body).toEqual([]);
  })
});