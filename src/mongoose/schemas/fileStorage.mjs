import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    originalName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

const File = mongoose.model('File', fileSchema);
export default File;
