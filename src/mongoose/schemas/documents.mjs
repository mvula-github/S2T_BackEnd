import mongoose, { mongo, Types } from "mongoose";

const docSchema = new mongoose.Schema({
    title: {type: String, required: true},
    subject: {type: String, required: true},
    grade: { type: Number, require: true},
    fileUrl: { type: String, required: true},
    description: {type: String},
    uploadDate: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Document', docSchema);