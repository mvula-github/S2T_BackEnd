import express, { response, Router } from "express";
import { faqList } from "../utils/FAQ/faqData.mjs";
import {
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";
import {
  mainFAQvalidation,
  patchFAQvalidation,
} from "../utils/FAQ/faqValidation.mjs";

const app = Router();

//middleware to find the faq index, to stop repeeaating teh same code
const findFAQIndex = (request, response, next) => {
  const {
    body,
    params: { id },
  } = request;

  const parsedId = parseInt(id);
  if (isNaN(parsedId))
    return response.status(400).send("Bad request. Invalid value");

  const faqIndex = faqList.findIndex((item) => item.id === parsedId);
  if (faqIndex === -1)
    return response.status(404).send("FAQ index was not found");

  request.faqIndex = faqIndex;
  next();
};

//---------------------------------------------GET------------------------------------------------------
//displays all FAQ Q/A
app.get("/api/faqs", (request, response) => {
  response.status(200).send(faqList);
});

//display only one FAQ Q/A specified by the id
app.get("/api/faqs/:id", findFAQIndex, (request, response) => {
  const { faqIndex } = request;

  const findFAQ = faqList[faqIndex];
  if (!findFAQ) return response.sendStatus(404);

  return response.status(200).send(findFAQ);
});

//query request method (i.e. filter)
app.get("/api/faqs", (request, response) => {
  console.log(request.query);

  const {
    query: { filter, value },
  } = request;
  //if (!filter && !value) return response.send(faqList); // return all faq list because its undefined

  if (filter && value)
    return response.send(
      faqList.filter((item) => item[filter].includes(value))
    );

  return response.send(faqList);
});

//---------------------------------------------PATCH------------------------------------------------------
//to update the category, question, or answer for the faq page
app.patch(
  "/api/faqs/:id",
  checkSchema(patchFAQvalidation),
  findFAQIndex,
  (request, response) => {
    const errorResult = validationResult(request);
    console.log(errorResult);

    //handle the validations i.e. doesn't add invalid data to database
    if (!errorResult.isEmpty())
      return response.status(400).send({ error: errorResult.array() });

    const { faqIndex } = request;

    //To know if the data is valid or not
    const validData = matchedData(request);

    faqList[faqIndex] = { ...faqList[faqIndex], ...validData };
    return response.sendStatus(200);
  }
);

//---------------------------------------------PUT------------------------------------------------------
app.put(
  "/api/faqs/:id",
  checkSchema(mainFAQvalidation),
  findFAQIndex,
  (request, response) => {
    const errorResult = validationResult(request);
    console.log(errorResult);

    //handle the validations i.e. doesn't add invalid data to database
    if (!errorResult.isEmpty())
      return response.status(400).send({ error: errorResult.array() });

    const { faqIndex } = request;

    //To know if the data is valid or not
    const validData = matchedData(request);

    faqList[faqIndex] = { id: faqList[faqIndex].id, ...validData };
    return response.sendStatus(200);
  }
);

//---------------------------------------------POST------------------------------------------------------
app.post("/api/faqs", checkSchema(mainFAQvalidation), (request, response) => {
  const errorResult = validationResult(request);
  console.log(errorResult);

  //handle the validations i.e. doesn't add invalid data to database
  if (!errorResult.isEmpty())
    return response.status(400).send({ error: errorResult.array() });

  //To know if the data is valid or not
  const validData = matchedData(request);

  const newFAQ = { id: faqList[faqList.length - 1].id + 1, ...validData };
  faqList.push(newFAQ);

  return response.status(200).send("Added Succesfully");
});

//---------------------------------------------DELETE------------------------------------------------------
app.delete("/api/faqs/:id", findFAQIndex, (request, response) => {
  const { faqIndex } = request;
  faqList.splice(faqIndex, 1);
  return response.sendStatus(200);
});

export default app;
