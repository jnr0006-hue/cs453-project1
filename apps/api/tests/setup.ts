import { pool } from "../src/db/pool";

beforeAll(async () => {
	await pool.query(`
		CREATE TABLE IF NOT EXISTS tasks (
			id SERIAL PRIMARY KEY,
			title TEXT NOT NULL,
			description TEXT,
			status TEXT NOT NULL DEFAULT 'todo',
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		)
	`);
});

beforeEach(async () => {
	await pool.query("TRUNCATE TABLE tasks RESTART IDENTITY CASCADE");
});

afterAll(async () => {
	await pool.end();
});
