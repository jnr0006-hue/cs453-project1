import { Router } from "express";
import {
	validateTaskId,
	validateCreateTask,
	validateUpdateTask,
} from "../middleware/taskValidation";
import {
	getAllTasks,
	getTaskById,
	createTask,
	updateTask,
	deleteTask,
} from "../services/taskServices";

const router = Router();

router.get("/", async (_req, res) => {
	try {
		const tasks = await getAllTasks();
		res.json(tasks);
	} catch (error) {
		console.error("Failed to fetch tasks:", error);
		res.status(500).json({
			error: "Failed to fetch tasks",
		});
	}
});

router.get("/:id", validateTaskId, async (req, res) => {
	const id = Number(req.params.id);

	try {
		const task = await getTaskById(id);

		if (!task) {
			return res.status(404).json({
				error: "Task not found",
			});
		}

		return res.json(task);
	} catch (error) {
		console.error(`Failed to fetch task ${id}:`, error);
		return res.status(500).json({
			error: "Failed to fetch task",
		});
	}
});

router.post("/", validateCreateTask, async (req, res) => {
	const { title, description, status } = req.body;

	try {
		const task = await createTask({
			title: title.trim(),
			description: typeof description === "string" ? description.trim() : undefined,
			status,
		});

		return res.status(201).json(task);
	} catch (error) {
		console.error("Failed to create task:", error);
		return res.status(500).json({
			error: "Failed to create task",
		});
	}
});

router.patch("/:id", validateTaskId, validateUpdateTask, async (req, res) => {
	const id = Number(req.params.id);
	const { title, description, status } = req.body;

	try {
		const task = await updateTask(id, {
			title: typeof title === "string" ? title.trim() : undefined,
			description:
				typeof description === "string" ? description.trim() : undefined,
			status,
		});

		if (!task) {
			return res.status(404).json({
				error: "Task not found",
			});
		}

		return res.json(task);
	} catch (error) {
		console.error(`Failed to update task ${id}:`, error);
		return res.status(500).json({
			error: "Failed to update task",
		});
	}
});

router.delete("/:id", validateTaskId, async (req, res) => {
	const id = Number(req.params.id);

	try {
		const deleted = await deleteTask(id);

		if (!deleted) {
			return res.status(404).json({
				error: "Task not found",
			});
		}

		return res.status(200).json({
			message: "Task deleted",
		});
	} catch (error) {
		console.error(`Failed to delete task ${id}:`, error);
		return res.status(500).json({
			error: "Failed to delete task",
		});
	}
});

export default router;
