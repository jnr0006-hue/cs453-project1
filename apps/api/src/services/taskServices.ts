import { pool } from "../db/pool";

export type TaskStatus = "todo" | "in_progress" | "done";

export type Task = {
	id: number;
	title: string;
	description: string | null;
	status: TaskStatus;
	createdAt: string;
	updatedAt: string;
};

export type CreateTaskInput = {
	title: string;
	description?: string;
	status?: TaskStatus;
};

export type UpdateTaskInput = {
	title?: string;
	description?: string;
	status?: TaskStatus;
};

export async function getAllTasks(): Promise<Task[]> {
	const result = await pool.query<Task>(
		`SELECT id,
		        title,
		        description,
		        status,
		        created_at AS "createdAt",
		        updated_at AS "updatedAt"
		   FROM tasks
		  ORDER BY id`,
	);

	return result.rows;
}

export async function getTaskById(id: number): Promise<Task | null> {
	const result = await pool.query<Task>(
		`SELECT id,
		        title,
		        description,
		        status,
		        created_at AS "createdAt",
		        updated_at AS "updatedAt"
		   FROM tasks
		  WHERE id = $1`,
		[id],
	);

	return result.rows[0] ?? null;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
	const result = await pool.query<Task>(
		`INSERT INTO tasks (title, description, status)
		 VALUES ($1, $2, $3)
		 RETURNING id,
		           title,
		           description,
		           status,
		           created_at AS "createdAt",
		           updated_at AS "updatedAt"`,
		[
			input.title,
			input.description ?? null,
			input.status ?? "todo",
		],
	);

	return result.rows[0];
}

export async function updateTask(
	id: number,
	input: UpdateTaskInput,
): Promise<Task | null> {
	const fields: string[] = [];
	const values: Array<string | number> = [id];
	let paramIndex = 2;

	if (input.title !== undefined) {
		fields.push(`title = $${paramIndex++}`);
		values.push(input.title);
	}

	if (input.description !== undefined) {
		fields.push(`description = $${paramIndex++}`);
		values.push(input.description);
	}

	if (input.status !== undefined) {
		fields.push(`status = $${paramIndex++}`);
		values.push(input.status);
	}

	fields.push(`updated_at = NOW()`);

	const query = `
		UPDATE tasks
		   SET ${fields.join(", ")}
		 WHERE id = $1
		 RETURNING id,
		           title,
		           description,
		           status,
		           created_at AS "createdAt",
		           updated_at AS "updatedAt"
	`;

	const result = await pool.query<Task>(query, values);

	return result.rows[0] ?? null;
}

export async function deleteTask(id: number): Promise<boolean> {
	const result = await pool.query(
		`DELETE FROM tasks
		  WHERE id = $1
		  RETURNING id`,
		[id],
	);

	return (result.rowCount ?? 0) > 0;
}
