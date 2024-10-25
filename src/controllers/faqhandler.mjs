import { validationResult, matchedData } from "express-validator";
import { faq } from "../mongoose/schemas/faq.mjs";

export const addFAQ = async (request, response) => {
  const errorResult = validationResult(request);

  //handle the validations i.e. doesn't add invalid data to database
  if (!errorResult.isEmpty())
    return response.status(400).send(errors.array().map((err) => err.msg));

  const { question } = request.body;
  console.log(question);

  const theFaq = await faq.findOne({ question: question });
  console.log(theFaq);
  if (theFaq) return response.status(400).send("Question already exist!!");

  //To know if the data is valid or not
  const data = matchedData(request);

  //adding the new FAQ category, question and answer
  try {
    const newFAQ = new faq(data);
    await newFAQ.save();
    return response.status(201).send("Added Succesfully");
  } catch (err) {
    return response.status(500).send(`Internal server error: ${err}`);
  }
};

export const viewAllFAQs = async (request, response) => {
  try {
    const allFAQs = await faq.find();
    response.status(200).send(allFAQs);
  } catch (err) {
    return response.status(500).send("Failed to retrieve all FAQs");
  }
};

export const viewFAQbyId = async (request, response) => {
  const {
    params: { id },
  } = request;

  try {
    const theFaq = await faq.findById(id);
    if (!theFaq) return response.status(404).send("FAQ not found");

    response.status(200).send(theFaq);
  } catch (err) {
    response.status(500).send(`Failed to retrieve the FAQ: ${err}`);
  }
};

export const updateFAQ = async (request, response) => {
  const errorResult = validationResult(request);

  //handle the validations i.e. doesn't add invalid data to database
  if (!errorResult.isEmpty())
    return response.status(400).send(errors.array().map((err) => err.msg));

  //To know if the data is valid or not
  const {
    params: { id },
  } = request;
  const data = matchedData(request);
  try {
    const updatedFAQ = await faq.findByIdAndUpdate(id, data);

    if (!updatedFAQ) return response.status(404).send("FAQ not found");

    response.status(201).send("FAQ updated successlly");
  } catch (err) {
    return response.status(500).send(`Failed to update FAQ: ${err}`);
  }
};

export const deleteFAQ = async (request, response) => {
  const {
    params: { id },
  } = request;

  try {
    const deletedFAQ = await faq.findByIdAndDelete(id);

    if (!deletedFAQ) return response.status(404).send("FAQ not found");

    response.status(200).send("FAQ deleted successfully");
  } catch (err) {
    return response.status(500).send(`Failed to delete FAQ: ${err}`);
  }
};
