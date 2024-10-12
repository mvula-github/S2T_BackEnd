import mongoose from "mongoose";

// Define the author schema
const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bioLink: { type: String, required: true },
});

// Create the Author model
export const Author = mongoose.model("Author", authorSchema);

// Define the guide schema
const guideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
});

// Create the Guide model
export const Guide = mongoose.model("Guide", guideSchema);

const tutorialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

// Create the Tutorial model
export const Tutorial = mongoose.model("Tutorial", tutorialSchema);
