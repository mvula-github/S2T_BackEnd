import mongoose from 'mongoose';

// Define the author schema
const authorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    bioLink: { type: String, required: true },
});

// Create the Author model
const Author = mongoose.model('Author', authorSchema);

// Export the Author model
export default Author;
