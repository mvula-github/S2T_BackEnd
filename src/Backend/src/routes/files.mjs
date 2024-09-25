
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

router.post(
	"/api/files",
	checkSchema(createFileValidationSchema),
	createFileHandler
);


export default router;
