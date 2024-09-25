//contributorModel
// Import mongoose
import mongoose from 'mongoose';

// Create a schema for the contributors
const contributorSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },

});

// Export the model
export const contributorModel = mongoose.model('Contributor', contributorSchema);


