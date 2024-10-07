import { Router } from "express";
import { checkSchema } from "express-validator";
import {
  mainFAQvalidation,
  patchFAQvalidation,
} from "../utils/validation/faqValidation.mjs";
import {
  addFAQ,
  deleteFAQ,
  updateFAQ,
  viewAllFAQs,
  viewFAQbyId,
} from "../controllers/faqhandler.mjs";

const app = Router();

//---------------------------------------------POST------------------------------------------------------
app.post("/api/faqs", checkSchema(mainFAQvalidation), addFAQ);

//---------------------------------------------GET------------------------------------------------------

app.get("/api/faqs", viewAllFAQs);

//display only one FAQ Q/A specified by the id
app.get("/api/faqs/:id", viewFAQbyId);

//---------------------------------------------PATCH------------------------------------------------------
//to update the category, question, or answer for the faq page
app.patch("/api/faqs/:id", checkSchema(patchFAQvalidation), updateFAQ);

//---------------------------------------------DELETE------------------------------------------------------
app.delete("/api/faqs/:id", deleteFAQ);

export default app;
