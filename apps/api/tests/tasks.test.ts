import request from "supertest";
import { app } from "../src/app";

describe("Tasks API", () => {
	test("GET /tasks returns a list", async () => {
		const response = await request(app).get("/tasks");

		expect(response.status).toBe(200);
		expect(Array.isArray(response.body)).toBe(true);
	});

	test("POST /tasks creates a task", async () => {
		const response = await request(app).post("/tasks").send({
			title: "Create task API",
			status: "todo",
		});

		expect(response.status).toBe(201);
		expect(response.body).toMatchObject({
			id: 1,
			title: "Create task API",
			status: "todo",
		});
	});

	test("GET /tasks/:id returns one task", async () => {
		const created = await request(app).post("/tasks").send({
			title: "Fetch me",
			status: "todo",
		});

		const response = await request(app).get(`/tasks/${created.body.id}`);

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject({
			id: created.body.id,
			title: "Fetch me",
			status: "todo",
		});
	});

	test("PATCH /tasks/:id updates a task", async () => {
		const created = await request(app).post("/tasks").send({
			title: "Old title",
			status: "todo",
		});

		const response = await request(app)
			.patch(`/tasks/${created.body.id}`)
			.send({
				title: "New title",
				status: "done",
			});

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject({
			id: created.body.id,
			title: "New title",
			status: "done",
		});
	});

	test("DELETE /tasks/:id deletes a task", async () => {
		const created = await request(app).post("/tasks").send({
			title: "Delete me",
			status: "todo",
		});

		const response = await request(app).delete(`/tasks/${created.body.id}`);

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			message: "Task deleted",
		});
	});

	test("Missing tasks return 404", async () => {
		const response = await request(app).get("/tasks/9999");

		expect(response.status).toBe(404);
		expect(response.body).toEqual({
			error: "Task not found",
		});
	});

	test("Creating a task without a title returns 400", async () => {
		const response = await request(app).post("/tasks").send({
			status: "todo",
		});

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			error: "title is required",
		});
	});
});
