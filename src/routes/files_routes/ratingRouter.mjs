import express from "express";
import { checkSchema } from "express-validator"; // for validation if needed
import { validateFileRating } from "../../utils/validation/ratingValidation.mjs";
import {
  createRating,
  updateRatingById,
  viewRatingByFileId,
} from "../../controllers/ratinghander.mjs";
import Rating from "../../mongoose/schemas/ratings.mjs";

const router = express.Router();

router.post(
  "/api/ratings/:file_Id",
  checkSchema(validateFileRating),
  createRating
);

// GET all ratings for a specific file by file ID
router.get("/api/ratings/:file_Id", viewRatingByFileId);

router.get("/api/ratings", async (request, response) => {
  const allRates = await Rating.find();

  response.send(allRates);
});

// PATCH (update) a rating for a specific file by file ID and user ID or session/cookie
router.patch("api/ratings/:fileId", updateRatingById);

export default router;
