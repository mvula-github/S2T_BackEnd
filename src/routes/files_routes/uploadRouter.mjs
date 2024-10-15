import express from "express";
import multer from "multer";
import path from "path";
import Upload from "../../mongoose/schemas/upload.mjs"; // Import the upload schema
import fs from "fs"; // Required for checking file existence
import crypto from "crypto"; // For generating file hashes
import officeToPdf from "office-to-pdf"; // For converting to PDF
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
  const allowedFileTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  ];
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

// Helper function to generate a file hash
const generateFileHash = (filePath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("md5");
    const stream = fs.createReadStream(filePath);

    stream.on("data", (data) => hash.update(data));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", (err) => reject(err));
  });
};

// Convert uploaded Office file to PDF
const convertToPDF = async (filePath) => {
  const fileExtension = path.extname(filePath).toLowerCase();

  // Check if the file is already a PDF
  if (fileExtension === ".pdf") {
    return null; // No conversion needed
  }

  const pdfBuffer = await officeToPdf(fs.readFileSync(filePath));
  const newFilePath = filePath.replace(fileExtension, ".pdf"); // Replace extension with .pdf

  // Save the converted PDF file
  fs.writeFileSync(newFilePath, pdfBuffer);

  return newFilePath; // Return the path of the converted file
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

    try {
      const {
        fileName,
        fileType,
        subject,
        grade,
        year,
        category,
        description,
      } = request.body;

      // Check for required fields
      if (!request.file) {
        return response
          .status(400)
          .send({ message: "File upload is required. Please select a file" });
      }

      // Generate file hash to check uniqueness
      const filePath = request.file.path;
      const fileHash = await generateFileHash(filePath);

      // Check if the file already exists in the database
      const existingFile = await Upload.findOne({ fileHash });
      if (existingFile) {
        // File already exists
        return response
          .status(400)
          .send({ message: "This file has already been uploaded" });
      }

      // Convert the file to PDF if necessary
      const convertedFilePath = await convertToPDF(filePath);
      const finalFilePath = convertedFilePath || filePath; // Use the converted file path if conversion happened

      // Check if a file with the same name already exists in the storage folder
      const finalFileName = path.basename(finalFilePath);
      const fileExistsInFolder = fs.existsSync(
        path.join(
          "C:\\Users\\user\\Desktop\\Backend\\src\\uploads",
          finalFileName
        )
      );

      // if (fileExistsInFolder) {
      //   return response
      //     .status(400)
      //     .send({ message: "A file with this name already exists in storage" });
      // }

      // Create a new upload document in MongoDB
      const newFile = new Upload({
        userFile: finalFilePath,
        fileHash, // Save the hash in the database for future checks
        fileType: "pdf", // Since all files are converted to PDcccF
        fileName: request.file.originalname, // Use the original filename
        size: request.file.size,
        subject,
        grade,
        year,
        category,
        description,
        approved: false,
      });

      await newFile.save();

      response
        .status(201)
        .send({ message: "File uploaded successfully", file: newFile });
    } catch (error) {
      response.status(500).send({
        message: `File upload failed 
         ${error}`,
      });
    }
  }
);

//get all files
router.get("/api/files", getAllFiles);

router.patch("/api/files/:id/approve", approveFileById);

router.patch("/api/files/:id/disapprove", disapproveFileById);

router.delete("/api/files/:id", deleteFileById);

export default router;
