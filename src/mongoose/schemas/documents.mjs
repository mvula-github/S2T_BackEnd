
const mongoose = require('mongoose');

// how the schema of the document should be
const docSchema = new mongoose.Schema({
    title: {type: String, required: true},
    subject: {type: String, required: true},
    grade: { type: Number, require: true},
    fileUrl: { type: String, required: true},
    description: {type: String},
    uploadDate: {type: Date, default: Date.now},
});

export default mongoose.model('Document', docSchema);