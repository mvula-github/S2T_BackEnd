import mongoose from "mongoose";

const storageSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const Storage = mongoose.model("Storage", storageSchema);
export default File;
