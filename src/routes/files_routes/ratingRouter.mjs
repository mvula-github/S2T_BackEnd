import express from "express";
import { checkSchema } from "express-validator"; // for validation if needed
import { validateFileRating } from "../../utils/validation/ratingValidation.mjs";
import {
  createRating,
  viewRatingByFileId,
} from "../../controllers/ratinghander.mjs";
import Rating from "../../mongoose/schemas/ratings.mjs";

const router = express.Router();

router.post(
  "/api/ratings/:file_Id",
  checkSchema(validateFileRating),
  createRating
);

//views all ratings
router.get("/api/ratings/:file_Id", viewRatingByFileId);

// GET all ratings for a specific file by file ID
router.get("/api/ratings", async (request, response) => {
  const allRates = await Rating.find();

  response.send(allRates);
});

// PATCH (update) a rating for a specific file by file ID and user ID or session/cookie
/*router.patch(
  "api/ratings/:id",
  checkSchema(validateFileRating),
  updateRatingById
);*/

export default router;
