import { mockContributors } from "././contributorsMiddlewares";

export const resolveIndexByContributorId = (request, response, next) => {
	const {
		params: { id },
	} = request;
	const parsedId = parseInt(id);
	if (isNaN(parsedId)) return response.sendStatus(400);
	const findContributorIndex = mockContributors.findIndex((contributor) => contributor.id === parsedId);
	if (findContributorIndex === -1) return response.sendStatus(404);
	request.findContributorIndex = findContributorIndex;
	next();
};