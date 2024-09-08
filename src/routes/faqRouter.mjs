import express, { Router } from "express";
import { faqList } from "../utils/FAQ/faqData.mjs";

const faq = Router();

//displays all faq questions and answers
faq.get("/api/faqs", (request, response) => {
  response.status(200).send(faqList);
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

  //return response.send(faqList);
});

faq.patch("/api/faqs/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;

  const parsedId = parseInt(id);
  if (isNaN(parsedId))
    return response.status(400).send("Bad Request. Invalid Value");

  const findUserIndex = faqList.findIndex((item) => item.id === parsedId);
  if (findUserIndex === -1) return response.status(404).send("Not Found");

  faqList[findUserIndex] = { ...faqList[findUserIndex], ...body };
  return response.sendStatus(200);
});

export default faq;
