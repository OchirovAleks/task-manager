const request = require("supertest");
const { createApp } = require("../src/app");

describe("Projects API", () => {
    let app;
    beforeEach(() => {
        app = createApp();
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

    test("DELETE /tasks delete the project", async () => {
        const setupRes = await request(app).post("/projects").send({ name: "Create project" });
        expect(setupRes.status).toBe(201);
        expect(setupRes.body).toEqual({ id: 1, name: "Create project" });
        const res = await request(app).delete("/projects/1");
        expect(res.status).toBe(204);
        const assertRes = await request(app).get("/projects");
        expect(assertRes.status).toBe(200);
        expect(assertRes.body).toEqual([]);
    })
});