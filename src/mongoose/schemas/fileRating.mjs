import mongoose from 'mongoose';

const fileRatingSchema = new mongoose.Schema({
    fileId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'File' // assuming there is a File schema
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5  // rating should be between 1 and 5
    },
    comment: {
        type: String,
        maxlength: 500,  // optional comment with a max length of 500 characters
    }
}, {
    timestamps: true  // adds createdAt and updatedAt timestamps
});

const FileRating = mongoose.model('FileRating', fileRatingSchema);
export default FileRating;
