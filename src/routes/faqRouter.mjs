import { Router } from "express";
import { faq } from "../mongoose/schemas/faq.mjs";
import { validationResult, matchedData, checkSchema } from "express-validator";
import {
  mainFAQvalidation,
  patchFAQvalidation,
} from "../utils/validation/faqValidation.mjs";

const app = Router();

//---------------------------------------------POST------------------------------------------------------
app.post(
  "/api/faqs",
  checkSchema(mainFAQvalidation),
  async (request, response) => {
    const errorResult = validationResult(request);
    console.log(errorResult);

    //handle the validations i.e. doesn't add invalid data to database
    if (!errorResult.isEmpty())
      return response.status(400).send({ error: errorResult.array() });

    //To know if the data is valid or not
    const data = matchedData(request);

    //adding the new FAQ category, question and answer
    try {
      const newFAQ = new faq(data);
      await newFAQ.save();
      return response.status(201).send("Added Succesfully");
    } catch (err) {
      return response.sendStatus(400);
    }
  }
);

//---------------------------------------------GET------------------------------------------------------

app.get("/api/faqs", async (request, response) => {
  try {
    const allFAQs = await faq.find();
    response.status(200).send(allFAQs);
  } catch (err) {
    return response.status(500).send("Failed to retrieve all FAQs");
  }
});

//display only one FAQ Q/A specified by the id
app.get("/api/faqs/:id", async (request, response) => {
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
});

//---------------------------------------------PATCH------------------------------------------------------
//to update the category, question, or answer for the faq page
app.patch(
  "/api/faqs/:id",
  checkSchema(patchFAQvalidation),
  async (request, response) => {
    const errorResult = validationResult(request);

    //handle the validations i.e. doesn't add invalid data to database
    if (!errorResult.isEmpty())
      return response.status(400).send({ error: errorResult.array() });

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
  }
);

//---------------------------------------------DELETE------------------------------------------------------
app.delete("/api/faqs/:id", async (request, response) => {
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
});

export default app;
