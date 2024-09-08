import express, { response, Router } from "express";
import { faqList } from "../utils/FAQ/faqData.mjs";

const faq = Router();

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
faq.get("/api/faqs", (request, response) => {
  response.status(200).send(faqList);
});

//display only one FAQ Q/A specified by the id
faq.get("/api/faqs/:id", findFAQIndex, (request, response) => {
  const { faqIndex } = request;

  const findFAQ = faqList[faqIndex];
  if (!findFAQ) return response.sendStatus(404);

  return response.status(200).send(findFAQ);
});

//query request method (i.e. filter)
faq.get("/api/faqs", (request, response) => {
  console.log(request.query);
  const {
    query: { filter, value },
  } = request;
  //if (!filter && !value) return response.send(faqList); // return all faq list because its undefined

  if (filter && value)
    return response.send(
      faqList.filter((item) => item[filter].includes(value))
    );
});

//---------------------------------------------PATCH------------------------------------------------------
//to update the category, question, or answer for the faq page
faq.patch("/api/faqs/:id", findFAQIndex, (request, response) => {
  const { body, faqIndex } = request;

  faqList[faqIndex] = { ...faqList[faqIndex], ...body };
  return response.sendStatus(200);
});

//---------------------------------------------PUT------------------------------------------------------
faq.put("/api/faqs", findFAQIndex, (request, response) => {
  const { body, faqIndex } = request;

  faqList[faqIndex] = { id: faqList[faqIndex].id, ...body };
  return response.sendStatus(200);
});

//---------------------------------------------POST------------------------------------------------------
faq.post("/api/faqs", (request, response) => {
  const { body } = request;

  const newFAQ = { id: faqList[faqList.length - 1].id + 1, ...body };
  faqList.push(newFAQ);

  return response.status(200).send("Added Succesfully");
});

//---------------------------------------------DELETE------------------------------------------------------
faq.delete("/api/faqs/:id", findFAQIndex, (request, response) => {
  const { faqIndex } = request;
  faqList.splice(faqIndex, 1);
  return response.sendStatus(200);
});

export default faq;
