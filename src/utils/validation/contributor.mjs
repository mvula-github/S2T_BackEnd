import { matchedData, validationResult } from "express-validator";
import { mockContributors } from "../utils/mockContributors.mjs"; // Assume mockContributors is an array of contributors
import { hashPassword } from "../utils/helpers.mjs";

// Retrieve a contributor by ID
export const getContributorByIdHandler = (request, response) => {
	const contributorIndex = mockContributors.findIndex(contributor => contributor.id === request.params.id);
	const contributor = mockContributors[contributorIndex];
	if (!contributor) return response.sendStatus(404);
	return response.send(contributor);
};

// Create a new contributor
export const createContributorHandler = (request, response) => {
	const result = validationResult(request);
	if (!result.isEmpty()) return response.status(400).send(result.array());

	const data = matchedData(request);
	data.password = hashPassword(data.password); // Hash the password

	// Generate a mock ID and new contributor object
	const newContributor = {
		id: `contributor_${mockContributors.length + 1}`, // Generate an ID based on the array length
		FName: data.FName,
		LName: data.LName,
		Email: data.Email,
		Password: data.password,
		Role: data.Role,
		Credentials: data.Credentials || "", // Optional credentials
	};

	// Add the new contributor to the mock array
	mockContributors.push(newContributor);

	return response.status(201).json({ message: "Contributor created successfully", contributor: newContributor });
};

// Update an existing contributor
export const updateContributorHandler = (request, response) => {
	const contributorIndex = mockContributors.findIndex(contributor => contributor.id === request.params.id);
	if (contributorIndex === -1) return response.status(404).json({ message: "Contributor not found" });

	const data = matchedData(request);
	const contributor = mockContributors[contributorIndex];

	// Update contributor's fields
	contributor.FName = data.FName || contributor.FName;
	contributor.LName = data.LName || contributor.LName;
	contributor.Email = data.Email || contributor.Email;
	contributor.Password = data.password ? hashPassword(data.password) : contributor.Password; // Hash the new password if provided
	contributor.Role = data.Role || contributor.Role;
	contributor.Credentials = data.Credentials || contributor.Credentials;

	return response.status(200).json({ message: "Contributor updated successfully", contributor });
};

// Delete a contributor
export const deleteContributorHandler = (request, response) => {
	const contributorIndex = mockContributors.findIndex(contributor => contributor.id === request.params.id);
	if (contributorIndex === -1) return response.status(404).json({ message: "Contributor not found" });

	// Remove the contributor from mockContributors
	mockContributors.splice(contributorIndex, 1);

	return response.status(200).json({ message: "Contributor deleted successfully" });
};
