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
import { requireAuth } from "../utils/middleware/middleware.mjs";

const router = Router();

//---------------------------------------------POST------------------------------------------------------
router.post("/api/faqs", checkSchema(mainFAQvalidation), addFAQ);

//---------------------------------------------GET------------------------------------------------------

router.get("/api/faqs", viewAllFAQs);

//display only one FAQ Q/A specified by the id
router.get("/api/faqs/:id", viewFAQbyId);

//---------------------------------------------PATCH------------------------------------------------------
//to update the category, question, or answer for the faq page
router.patch("/api/faqs/:id", checkSchema(patchFAQvalidation), updateFAQ);

//---------------------------------------------DELETE------------------------------------------------------
router.delete("/api/faqs/:id", deleteFAQ);

export default router;
