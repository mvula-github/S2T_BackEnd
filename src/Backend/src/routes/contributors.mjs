
import { Router } from "express";
import {
	query,
	validationResult,
	checkSchema,
	matchedData,
} from "express-validator";
import { mockContributors } from "../utils/constants.mjs";
import { createContributorValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexByContributorId } from "../utils/middlewares.mjs";
import { Contributor } from "../mongoose/schemas/contributor.mjs";
import { hashPassword } from "../utils/helpers.mjs";
import { createContributorHandler, getContributorByIdHandler } from "../handlers/contributors.mjs";

const router = Router();

router.get(
	"/api/contributors",
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
				mockContributors.filter((contributor) => contributor[filter].includes(value))
			);
		return response.send(mockContributors);
	}
);

router.get("/api/contributors/:id", resolveIndexByContributorId, getContributorByIdHandler);

router.post(
	"/api/contributors",
	checkSchema(createContributorValidationSchema),
	createContributorHandler
);

router.put("/api/contributors/:id", resolveIndexByContributorId, (request, response) => {
	const { body, findContributorIndex } = request;
	mockContributors[findContributorIndex] = { id: mockContributors[findContributorIndex].id, ...body };
	return response.sendStatus(200);
});

router.patch("/api/contributors/:id", resolveIndexByContributorId, (request, response) => {
	const { body, findContributorIndex } = request;
	mockContributors[findContributorIndex] = { ...mockContributors[findContributorIndex], ...body };
	return response.sendStatus(200);
});

router.delete("/api/contributors/:id", resolveIndexByContributorId, (request, response) => {
	const { findContributorIndex } = request;
	mockContributors.splice(findContributorIndex, 1);
	return response.sendStatus(200);
});

export default router;
