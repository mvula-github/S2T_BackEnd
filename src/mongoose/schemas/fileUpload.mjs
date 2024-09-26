import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    userFile: {
        type: String,  // Path of the file saved on the server
        required: true
    },
    fileType: {
        type: String,
        required: true,
        enum: ["pdf", "doc", "docx", "jpeg", "png"] // Limit allowed file types
    },
    fileName: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

const File = mongoose.model("File", fileSchema);
export default File;
