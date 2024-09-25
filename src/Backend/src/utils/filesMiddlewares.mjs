import { mockFiles } from "./filesMiddlewares";

export const resolveIndexByFileId = (request, response, next) => {
	const {
		params: { id },
	} = request;
	const parsedId = parseInt(id);
	if (isNaN(parsedId)) return response.sendStatus(400);
	const findFileIndex = mockFiles.findIndex((file) => file.id === parsedId);
	if (findFileIndex === -1) return response.sendStatus(404);
	request.findFileIndex = findFileIndex;
	next();
};