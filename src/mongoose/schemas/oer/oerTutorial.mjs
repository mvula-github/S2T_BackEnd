import mongoose from 'mongoose';

// Define the tutorial schema
const tutorialSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
});

// Create the Tutorial model
const Tutorial = mongoose.model('Tutorial', tutorialSchema);

// Export the Tutorial model
export default Tutorial;
