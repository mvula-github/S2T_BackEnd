import express from "express";
import { checkSchema } from "express-validator"; // for validation if needed
import { validateFileRating } from "../../utils/validation/ratingValidation.mjs";
import {
  createRating,
  updateRatingById,
  viewRatingByFileId,
} from "../../controllers/ratinghander.mjs";

const router = express.Router();

router.post("/api/ratings", checkSchema(validateFileRating), createRating);

// GET all ratings for a specific file by file ID
router.get("/api/ratings/:fileId", viewRatingByFileId);

// PATCH (update) a rating for a specific file by file ID and user ID or session/cookie
router.patch("api/ratings/:fileId", updateRatingById);

export default router;
