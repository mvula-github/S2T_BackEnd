import express from "express";
import { checkSchema } from "express-validator"; // for validation if needed
import { validateFileRating } from "../../utils/validation/ratingValidation.mjs";
import {
  createRating,
  getAllRating,
  viewRatingByFileId,
} from "../../controllers/ratinghander.mjs";
import { requireAuth } from "../../utils/middleware/middleware.mjs";

const router = express.Router();

router.post(
  "/api/ratings/:file_Id",
  requireAuth,
  checkSchema(validateFileRating),
  createRating
);

//views all ratings
router.get("/api/ratings/:file_Id", requireAuth, viewRatingByFileId);

// GET all ratings for a specific file by file ID
router.get("/api/ratings", requireAuth, getAllRating);

// PATCH (update) a rating for a specific file by file ID and user ID or session/cookie
/*router.patch(
  "api/ratings/:id",
  checkSchema(validateFileRating),
  updateRatingById
);*/

export default router;
