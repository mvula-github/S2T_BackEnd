import express from "express";
import multer from "multer";
import path from "path";
import Upload from "../../mongoose/schemas/upload.mjs"; // Import the upload schema

const router = express.Router();

// Set file size limit to 15MB
const MAX_FILE_SIZE = 15 * 1024 * 1024;

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Multer file filter
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = [
    "application/pdf",
    "application/msword",
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
router.post("/upload", upload.single("userFile"), async (req, res) => {
  const { fileName, fileType, subject, grade } = req.body;

  // Check for required fields
  if (!fileName || !fileType || !subject || !grade || !req.file) {
    return res
      .status(400)
      .json({ message: "All fields are required, including the file" });
  }

  // Validation for file type and size already handled by multer

  const newFile = new Upload({
    userFile: req.file.path,
    fileType: req.file.mimetype.split("/")[1], // Extract the extension (e.g., pdf)
    fileName,
    subject,
    grade,
  });

  try {
    await newFile.save();
    res
      .status(201)
      .json({ message: "File uploaded successfully", file: newFile });
  } catch (error) {
    res.status(500).json({ message: "File upload failed", error });
  }
});

// Global error handler for file validation errors
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File is too large. Maximum file size is 5MB." });
    }
  } else if (err.message === "Incorrect file type") {
    return res.status(400).json({
      message:
        "Incorrect file type. Allowed types are PDF, DOC, DOCX, JPEG, PNG.",
    });
  }
  return res
    .status(500)
    .json({ message: "An error occurred", error: err.message });
});

export default router;
