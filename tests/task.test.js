const request = require("supertest");
const app = require("../index");

describe("Task API", () => {
    it("should create a new task", async () => {
        const res = await request(app)
            .post("/api/tasks")
            .send({ title: "Test Task", description: "Test Description" });
        expect(res.statusCode).toBe(201);
    });
});
