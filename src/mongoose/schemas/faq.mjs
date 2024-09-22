import mongoose, { mongo, Types } from "mongoose";

const FAQSchema = new mongoose.Schema({
  category: { type: String, required: true },
  question: { type: String, required: true, unique: true },
  answer: { type: String, required: true, unique: true },
});

export const faq = mongoose.model("faq", FAQSchema);
