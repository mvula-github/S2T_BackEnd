// assuming file structure
import { validationResult } from "express-validator"; // for validation if needed
import Rating from "../mongoose/schemas/ratings.mjs";
import Upload from "../mongoose/schemas/upload.mjs";
import { NotFoundError } from "../utils/classes/errors.mjs";

export const createRating = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).send(errors.array().map((err) => err.msg));

  const {
    body: { fileId, ...body },
  } = request;
  //const { _id } = request.params;

  try {
    //Check oif the file rated does exist
    const file = await Upload.findOne({ fileId });

    //assigning file id to be able to store it
    const file_Id = file.id;

    //error for when file is not found
    if (!file) throw new NotFoundError("File not found");

    const ratings = new Rating({ file_Id, ...body });

    await ratings.save();
    response
      .status(201)
      .json("File rated succesfully, rating: " + ratings.rating);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const viewRatingByFileId = async (req, res) => {
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
};

export const updateRatingById = async (req, res) => {
  const { fileId } = req.params;
  const { rating, comment } = req.body;

  try {
    const updatedRating = await Rating.findOneAndUpdate(
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
};
