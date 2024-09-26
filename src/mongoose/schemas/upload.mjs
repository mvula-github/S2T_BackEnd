import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  userFile: {
    type: String, // Path of the file saved on the server
    required: true,
  },
  fileType: {
    type: String,
    required: true,
    enum: ["pdf"], // Limit allowed file types
  },
  fileName: {
    type: String,
    required: true,
  },
  subject: {
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
  grade: {
    type: String,
    required: true,
  },
  year: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  //add SIZE, PATH, EXTENTION, AUTHOR, TAGS, DESCRIPTION
});

const Upload = mongoose.model("Upload", uploadSchema);
export default Upload;
