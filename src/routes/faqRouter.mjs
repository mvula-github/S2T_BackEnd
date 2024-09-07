import express, { Router } from "express";
import { faqList } from "../utils/FAQ/faqData.mjs";

const faq = Router();

//displays all faq questions and answers
faq.get("/api/faqs", (request, response) => {
  response.status(200).send(faqList);
});

export default faq;
