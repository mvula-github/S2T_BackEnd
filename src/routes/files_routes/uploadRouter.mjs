import express, { response } from "express";
import multer from "multer";
import path from "path";
import Upload from "../../mongoose/schemas/upload.mjs"; // Import the upload schema
import fs from "fs"; // Required for checking file existence
import { errorFileHandler } from "../../utils/middleware/middleware.mjs";

const router = express.Router();

// Global error handler for file validation errors
router.use(errorFileHandler);

// Set file size limit to 15MB
const MAX_FILE_SIZE = 30 * 1024 * 1024; //30mb

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, "C:\\Users\\user\\Desktop\\Backend\\src\\uploads");
  },
  filename: function (request, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Multer file filter
const fileFilter = (request, file, cb) => {
  const allowedFileTypes = [
    "application/pdf",
    "application/docx",
    "image/jpeg",
    "image/png",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Incorrect file type"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE }, // File size limit
  fileFilter: fileFilter,
});

// POST route for file upload
router.post(
  "/api/uploads",
  upload.single("file"),
  async (request, response) => {
    const {
      fileName,
      fileType,
      subject,
      grade,
      year,
      category,
      description,
      approved,
    } = request.body;

    // Check for required fields
    if (
      !fileName ||
      !fileType ||
      !subject ||
      !grade ||
      !request.file ||
      !year ||
      !category
    ) {
      return response
        .status(400)
        .send({ message: "All fields are required, including the file" });
    }

    // Check if the file already exists in the database
    const existingFile = await Upload.findOne({
      fileName: request.file.originalname, // Use the original filename
      fileType: request.file.mimetype.split("/")[1], // Check by file type
    });

    if (existingFile) {
      // If a file with the same name and type exists, send an error response
      return response.status(400).send({ message: "File already exists" });
    }

    const originalFilename = request.file.originalname;
    const fileExtension = path.extname(originalFilename);
    const pdfFilename = originalFilename.replace(fileExtension, ".pdf");

    // Check if the file extension is supported for conversion
    if (
      [".docx", ".doc", ".xlsx", ".xls", ".pptx", ".ppt"].includes(
        fileExtension
      )
    ) {
      // Convert the document to PDF
      await converter.convert(req.file.path, pdfFilename);

      // Send a success response with the PDF filename
      response.json({ message: "File converted successfully", pdfFilename });
    } else {
      // Handle unsupported file types
      response.status(400).json({ error: "Unsupported file type" });
    }

    // Validation for file type and size already handled by multer
    const newFile = new Upload({
      userFile: request.file.path,
      fileType: request.file.mimetype.split("/")[1], // Extract the extension (e.g., pdf)
      fileName: pdfFilename,
      size: request.file.size,
      subject,
      grade,
      year,
      category,
      description,
      approved: false,
    });
    if (request.file.path === Upload.findOne(request.file.path))
      return response.status(400).send("File already exits");
    try {
      await newFile.save();
      response
        .status(201)
        .send({ message: "File uploaded successfully", file: newFile });
    } catch (error) {
      response.status(500).send({ message: "File upload failed", error });
    }
  }
);

router.get("/api/files", async (request, response) => {
  try {
    const allUploads = await Upload.find();

    response.status(200).send(allUploads);
  } catch (err) {
    response.send(`${err}`);
  }
});

router.patch("/api/files/:id/approve/", async (request, response) => {
  const { id } = request.params;

  try {
    const file = await Upload.findById(id);
    console.log(id);
    file.approved = true;
    console.log(file.approved);
    file.save();

    if (!file) return response.status(404).send("File not found");

    response.status(201).send("File aprroved successlly");
  } catch (err) {
    return response.status(201).send(`${err}`);
  }
});

router.patch("/api/files/:id/disapprove", async (request, response) => {
  const { id } = request.params;
  const { approved } = request.body;

  try {
    const file = await Upload.findById(id);
    console.log(id);
    file.approved = false;
    console.log(file.approved);
    file.save();

    if (!file) return response.status(404).send("File not found");

    response.status(201).send("File disapproved successlly");
  } catch (err) {
    return response.status(201).send(`${err}`);
  }
});

router.delete("/api/files/:id", async (request, response) => {
  const { id } = request.params;

  try {
    const file = await Upload.findByIdAndDelete(id);

    if (!file) return response.status(404).send("File not found");

    response.status(201).send("File deleted successlly");
  } catch (err) {
    return response.status(500).send(`${err}`);
  }
});

export default router;
