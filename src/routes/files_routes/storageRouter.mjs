import express from "express";
import multer from "multer";
import path from "path";
import Storage from "../../mongoose/schemas/storage.mjs"; // Your storage schema

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, "uploads/"); // specify the upload folder
  },
  filename: function (request, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // generate a unique file name
  },
});

// File filter to accept only specific file types (e.g., PDF, images)
const fileFilter = (request, file, cb) => {
  const allowedTypes = ["application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

// Multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 15 }, // limit files to 15MB
  fileFilter: fileFilter,
});

// POST route for file upload
router.post("/api/upload", upload.single("file"), async (request, response) => {
  if (!request.file) {
    return response
      .status(400)
      .json({ message: "No file uploaded or invalid file type" });
  }

  // Save file metadata to the database
  const { originalname, path: filePath, size, mimetype } = request.file;
  const newFile = new Storage({
    originalName: originalname,
    filePath: filePath,
    size: size,
    mimetype: mimetype,
  });

  try {
    await newFile.save();
    response
      .status(201)
      .json({ message: "File uploaded successfully", file: newFile });
  } catch (error) {
    response.status(500).json({ message: "Error saving file metadata", error });
  }
});

export default router;
