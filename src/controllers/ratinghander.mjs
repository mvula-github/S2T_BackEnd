import { matchedData, validationResult } from "express-validator"; // for validation if needed
import Upload from "../mongoose/schemas/upload.mjs";
import { NotFoundError, UnauthorizedError } from "../utils/classes/errors.mjs";
import Rating from "../mongoose/schemas/ratings.mjs";

export const createRating = async (request, response, next) => {
  const errors = validationResult(request);

  if (!errors.isEmpty())
    return response.status(400).send(errors.array().map((err) => err.msg));

  try {
    const { fileId, rating, comment } = request.body;

    const file = await Upload.findById(fileId);
    console.log(file);

    //if (!file) throw new NotFoundError("file not found");
    //const data = matchedData(request);

    const ratings = await Rating(fileId, rating, comment);
    await ratings.save();

    response.status(201).json(ratings);
  } catch (error) {
    next(`${error} `);
  }
};

export const viewRatingById = async (request, response) => {
  const { fileId } = request.params;
  try {
    const ratings = await Rating.find({ fileId });
    if (!ratings) {
      return response
        .status(404)
        .json({ message: "No ratings found for this file" });
    }
    response.status(200).json(ratings);
  } catch (error) {
    response.status(500).json({ message: "Error fetching ratings", error });
  }
};

export const updateRatingByRating = async (request, response) => {
  const { fileId } = request.params;
  const { rating, comment } = request.body;

  try {
    const updatedRating = await Rating.findOneAndUpdate(
      { fileId },
      { rating, comment, updatedAt: Date.now() }, // update rating and comment
      { new: true } // return the updated document
    );

    if (!updatedRating) {
      return response.status(404).json({ message: "Rating not found" });
    }

    response.status(200).json(updatedRating);
  } catch (error) {
    response.status(500).json({ message: "Error updating rating", error });
  }
};
