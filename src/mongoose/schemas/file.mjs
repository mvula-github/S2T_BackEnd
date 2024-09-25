//file schema/model
// Import mongoose
import mongoose from "mongoose";

// Create a schema for the files
const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: [true, "Please provide a file name"],
    trim: true,
    maxlength: [20, "File name cannot be more than 20 characters"],
  },
  fileType: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: [String],
    default: [],
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Reference to the User model
    required: true,
  },
  isModerated: {
    type: Boolean,
    default: false, // False by default, will be changed once moderated
  },
});

// Export the model
export const File = mongoose.model("File", fileSchema);
