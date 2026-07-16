import type { NextFunction, Request, Response } from "express";
import type { TaskStatus } from "../services/taskServices";

const VALID_STATUSES: TaskStatus[] = ["todo", "in_progress", "done"];

function isNonEmptyString(value: unknown): value is string {
	return typeof value === "string" && value.trim().length > 0;
}

function isOptionalString(value: unknown): value is string | undefined {
	return value === undefined || typeof value === "string";
}

function isValidStatus(value: unknown): value is TaskStatus {
	return typeof value === "string" && VALID_STATUSES.includes(value as TaskStatus);
}

export function validateTaskId(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const id = Number(req.params.id);

	if (!Number.isInteger(id) || id < 1) {
		return res.status(400).json({
			error: "Invalid task id",
		});
	}

	next();
}

export function validateCreateTask(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const { title, description, status } = req.body;

	if (!isNonEmptyString(title)) {
		return res.status(400).json({
			error: "title is required",
		});
	}

	if (!isOptionalString(description)) {
		return res.status(400).json({
			error: "description must be a string",
		});
	}

	if (status !== undefined && !isValidStatus(status)) {
		return res.status(400).json({
			error: "status must be one of: todo, in_progress, done",
		});
	}

	next();
}

export function validateUpdateTask(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const { title, description, status } = req.body;

	if (
		title === undefined &&
		description === undefined &&
		status === undefined
	) {
		return res.status(400).json({
			error: "At least one field (title, description, status) is required",
		});
	}

	if (title !== undefined && !isNonEmptyString(title)) {
		return res.status(400).json({
			error: "title must be a non-empty string",
		});
	}

	if (!isOptionalString(description)) {
		return res.status(400).json({
			error: "description must be a string",
		});
	}

	if (status !== undefined && !isValidStatus(status)) {
		return res.status(400).json({
			error: "status must be one of: todo, in_progress, done",
		});
	}

	next();
}
