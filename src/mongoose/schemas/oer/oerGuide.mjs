import mongoose from 'mongoose';

// Define the guide schema
const guideSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
});

// Create the Guide model
const Guide = mongoose.model('Guide', guideSchema);

// Export the Guide model
export default Guide;
