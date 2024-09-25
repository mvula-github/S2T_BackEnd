import { matchedData, validationResult } from "express-validator";
import { mockFiles } from "../mockFiles.mjs"; // Assuming mockFiles is an array of files

// Upload file and contribute
export const contributeFileHandler = (request, response) => {
  const { subject, grade, tags } = request.body;
  const contributor = request.contributor; // Assuming contributor comes from JWT middleware

  // Check required fields
  if (!request.file || !subject || !grade) {
    return response.status(400).json({ message: "Required fields missing" });
  }

  // File size/type validation, file size limit of 10MB
  if (request.file.size > 10000000) {
    return response.status(400).json({ message: "File too large" });
  }

  // Generate a mock file ID
  const fileId = `file_${mockFiles.length + 1}`;

  try {
    // Create new mock file object
    const newFile = {
      id: fileId,
      fileName: request.file.filename,
      fileType: request.file.mimetype,
      subject,
      grade,
      tags,
      createdBy: user.id, // Assuming user object has an 'id' property
      fileSize: request.file.size,
      isModerated: false, // Default state for new files
    };

    // Save to mockFiles array
    mockFiles.push(newFile);

    // Send success response
    response
      .status(201)
      .json({ message: "File uploaded successfully", file: newFile });
  } catch (error) {
    // Handle error
    response
      .status(500)
      .json({ message: "File upload failed", error: error.message });
  }
};
