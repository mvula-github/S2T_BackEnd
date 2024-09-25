import { matchedData, validationResult } from "express-validator";
import { mockFiles } from "../utils/mockFiles.mjs"; // Assuming mockFiles is an array of files

// Get all files that need moderation (where isModerated is false)
export const getFilesForModerationHandler = (request, response) => {
	const filesForModeration = mockFiles.filter(file => !file.isModerated);
	return response.status(200).send(filesForModeration);
};

// Approve a file by setting isModerated to true
export const approveFileHandler = (request, response) => {
	const fileIndex = mockFiles.findIndex(file => file.id === request.params.id);
	if (fileIndex === -1) return response.status(404).json({ message: 'File not found' });
	
	const file = mockFiles[fileIndex];
	file.isModerated = true; // Mark the file as moderated
	
	return response.status(200).json({ message: 'File approved successfully', file });
};

// Reject a file and remove it from mockFiles
export const rejectFileHandler = (request, response) => {
	const fileIndex = mockFiles.findIndex(file => file.id === request.params.id);
	if (fileIndex === -1) return response.status(404).json({ message: 'File not found' });

	// Remove the file from mockFiles
	mockFiles.splice(fileIndex, 1);
	
	return response.status(200).json({ message: 'File rejected and removed' });
};
