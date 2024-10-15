import express from "express";
import multer from "multer";
import path from "path";
import Upload from "../../mongoose/schemas/upload.mjs"; // Import the upload schema
import fs from "fs"; // Required for checking file existence
import { errorFileHandler } from "../../utils/middleware/middleware.mjs";
import { addFileValidation } from "../../utils/validation/uploadValidation.mjs";
import { validationResult, checkSchema } from "express-validator";
import {
  approveFileById,
  deleteFileById,
  disapproveFileById,
  getAllFiles,
} from "../../controllers/uploadController.mjs";

const router = express.Router();

// Global error handler for file validation errors
router.use(errorFileHandler);

// Set file size limit to 15MB
const MAX_FILE_SIZE = 100 * 1024 * 1024; //100mb

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
  const allowedFileTypes = ["application/pdf", "image/gif"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(`${new Error("Incorrect file type")}`, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE }, // File size limit
  fileFilter: fileFilter,
});

// Convert the uploaded file to PDF
const convertToPDF = async (filePath) => {
  const fileExtension = path.extname(filePath).toLowerCase();

  if (fileExtension === ".pptx") {
    const pdfBuffer = await officeToPdf(fs.readFileSync(filePath));
    return pdfBuffer;
  } else if (fileExtension === ".docx") {
    const result = await officeToPdf(fs.readFileSync(filePath));
    return result;
  } else if (fileExtension === ".xlsx") {
    const pdfBuffer = await officeToPdf(fs.readFileSync(filePath));
    return pdfBuffer;
  } else {
    throw new Error("Unsupported file type for conversion.");
  }
};

// POST route for file upload
router.post(
  "/api/uploads",
  upload.single("file"),
  checkSchema(addFileValidation),
  async (request, response) => {
    //handling the validation results if they are present
    const errors = validationResult(request);
    if (!errors.isEmpty())
      return response.status(400).send(errors.array().map((err) => err.msg));

    const { fileName, fileType, subject, grade, year, category, description } =
      request.body;

    // Check for required fields
    if (!request.file) {
      return response
        .status(400)
        .send({ message: "File upload is required. Please select a file" });
    }

    try {
      // Check if the file already exists in the database
      const existingFile = await Upload.findOne({
        fileName: request.file.originalname, // Use the original filename
        fileType: request.file.mimetype.split("/")[1], // Check by file type
      });

      // Validation for file type and size already handled by multer
      const newFile = new Upload({
        userFile: request.file.path,
        fileType: request.file.mimetype.split("/")[1], // Extract the extension (e.g., pdf)
        fileName,
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

      await newFile.save();

      response
        .status(201)
        .send({ message: "File uploaded successfully", file: newFile });
    } catch (error) {
      response.status(500).send({ message: "File upload failed" });
    }
  }
);

//get all files
router.get("/api/files", getAllFiles);

router.patch("/api/files/:id/approve", approveFileById);

router.patch("/api/files/:id/disapprove", disapproveFileById);

router.delete("/api/files/:id", deleteFileById);

export default router;
