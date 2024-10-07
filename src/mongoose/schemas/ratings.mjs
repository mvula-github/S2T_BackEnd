import mongoose from "mongoose";

const fileRatingSchema = new mongoose.Schema(
  {
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "File", // assuming there is a File schema
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      maxlength: 500, // optional comment with a max length of 500 characters
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt timestamps
  }
);

const Rating = mongoose.model("Rating", fileRatingSchema);
export default Rating;
