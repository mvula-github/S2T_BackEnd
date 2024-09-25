
import { Router } from "express";
import {
	query,
	validationResult,
	checkSchema,
	matchedData,
} from "express-validator";
import { mockFiles } from "../utils/constants.mjs";
import { createFileValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexByFileId } from "../utils/middlewares.mjs";
import { File } from "../mongoose/schemas/file.mjs";
//import { hashPassword } from "../utils/helpers.mjs";
import { createFileHandler, getFileByIdHandler } from "../handlers/files.mjs";

const router = Router();

router.get(
	"/api/files",
	query("filter")
		.isString()
		.notEmpty()
		.withMessage("Must not be empty")
		.isLength({ min: 3, max: 10 })
		.withMessage("Must be at least 3-10 characters"),
	(request, response) => {
		request.sessionStore.get(request.session.id, (err, sessionData) => {
			if (err) {
				throw err;
			}
		});
		const result = validationResult(request);
		const {
			query: { filter, value },
		} = request;
		if (filter && value)
			return response.send(
				mockFiles.filter((file) => file[filter].includes(value))
			);
		return response.send(mockFiles);
	}
);

router.get("/api/files/:id", resolveIndexByFileId, getFileByIdHandler);

router.put("/api/files/:id", resolveIndexByFileId, (request, response) => {
	const { body, findFileIndex } = request;
	mockFiles[findFileIndex] = { id: mockFiles[findFileIndex].id, ...body };
	return response.sendStatus(200);
});

router.patch("/api/files/:id", resolveIndexByFileId, (request, response) => {
	const { body, findFileIndex } = request;
	mockFiles[findFileIndex] = { ...mockFiles[findFileIndex], ...body };
	return response.sendStatus(200);
});

router.delete("/api/files/:id", resolveIndexByFileId, (request, response) => {
	const { findFileIndex } = request;
	mockFiles.splice(findFileIndex, 1);
	return response.sendStatus(200);
});

export default router;
