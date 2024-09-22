import express, { Router } from "express";
import { faq } from "../mongoose/schemas/faq.mjs";
import {
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";
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
//displays all FAQ Q/A
app.get("/api/faqs", (request, response) => {
  console.log(request.session);
  console.log(request.session.id);
  request.sessionStore.get(request.session.id, (err, sessionData) => {
    if (err) {
    }
    console.log(sessionData);
  });
  if (request.cookies.hello && request.cookies.hello === "world")
    return response.status(200).send(faqList);

  return response.send({ msg: "Sorry, you need the correct cookie" });
});

//display only one FAQ Q/A specified by the id
app.get("/api/faqs/:id", (request, response) => {
  const { faqIndex } = request;

  const findFAQ = faqList[faqIndex];
  if (!findFAQ) return response.sendStatus(404);

  return response.status(200).send(findFAQ);
});

//---------------------------------------------PATCH------------------------------------------------------
//to update the category, question, or answer for the faq page
app.patch(
  "/api/faqs/:id",
  checkSchema(patchFAQvalidation),
  (request, response) => {
    const errorResult = validationResult(request);

    //handle the validations i.e. doesn't add invalid data to database
    if (!errorResult.isEmpty())
      return response.status(400).send({ error: errorResult.array() });

    const { faqIndex } = request;

    //To know if the data is valid or not
    const data = matchedData(request);
    try {
    } catch (err) {
      return response.status(500).send(`Failed to update FAQ: ${err}`);
    }

    faqList[faqIndex] = { ...faqList[faqIndex], ...data };
    return response.sendStatus(200);
  }
);

//---------------------------------------------PUT------------------------------------------------------
app.put(
  "/api/faqs/:id",
  checkSchema(mainFAQvalidation),
  async (request, response) => {
    const errorResult = validationResult(request);

    //handle the validations i.e. doesn't add invalid data to database
    if (!errorResult.isEmpty())
      return response.status(400).send({ error: errorResult.array() });

    const {
      params: { id },
    } = request;
    //To know if the data is valid or not
    const data = matchedData(request);

    try {
      const updatedFAQ = await faq.findByIdAndUpdate(id, data);

      if (!updatedFAQ) return response.status(404).send("FAQ not found");

      response.status(200).send("FAQ updated successlly");
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
