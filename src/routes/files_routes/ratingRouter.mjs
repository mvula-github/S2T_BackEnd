import express from "express";
import Rating from "../../mongoose/schemas/ratings.mjs"; // assuming file structure
import { validationResult, checkSchema } from "express-validator"; // for validation if needed
import { validateFileRating } from "../../utils/validation/fileRatingValidation.mjs";

const router = express.Router();

router.post(
  "/api/ratings",
  checkSchema(validateFileRating),
  async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
      return response.status(400).send(errors.array().map((err) => err.msg));

    try {
      const { fileId, rating, comment } = request.body;

      // Create a new file rating
      const ratings = new Rating({
        fileId,
        rating,
        comment,
      });

      await ratings.save();
      response.status(201).json(ratings);
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  }
);

// GET all ratings for a specific file by file ID
router.get("/api/ratings/:fileId", async (req, res) => {
  const { fileId } = req.params;
  try {
    const ratings = await Rating.find({ fileId });
    if (!ratings) {
      return res
        .status(404)
        .json({ message: "No ratings found for this file" });
    }
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ratings", error });
  }
});

// PATCH (update) a rating for a specific file by file ID and user ID or session/cookie
router.patch("api/ratings/:fileId", async (req, res) => {
  const { fileId } = req.params;
  const { rating, comment } = req.body;

  try {
    const updatedRating = await FileRating.findOneAndUpdate(
      { fileId },
      { rating, comment, updatedAt: Date.now() }, // update rating and comment
      { new: true } // return the updated document
    );

    if (!updatedRating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    res.status(200).json(updatedRating);
  } catch (error) {
    res.status(500).json({ message: "Error updating rating", error });
  }
});

export default router;
