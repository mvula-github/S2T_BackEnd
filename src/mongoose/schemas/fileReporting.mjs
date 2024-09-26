import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    fileId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'File'  // assuming you have a File schema
    },
    reason: {
        type: String,
        required: true,
        minlength: 10
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Report = mongoose.model('Report', reportSchema);
export default Report;
