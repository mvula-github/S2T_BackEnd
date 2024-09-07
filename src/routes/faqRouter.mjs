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

export default faq;
