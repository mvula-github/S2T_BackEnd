// assuming file structure
import { validationResult } from "express-validator"; // for validation if needed
import Rating from "../mongoose/schemas/ratings.mjs";
import Upload from "../mongoose/schemas/upload.mjs";

export const createRating = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).send(errors.array().map((err) => err.msg));

  const { rating, comment } = request.body;
  const file_Id = request.params.file_Id;

  try {
    //Check oif the file rated does exist
    const file = await Upload.findById(file_Id);

    //error for when file is not found
    if (!file || file.length === 0)
      return response.status(404).send("File not found");

    const ratings = new Rating({ file_Id, rating, comment });

    await ratings.save();
    response.status(201).send("File rated succesfully, rating: " + rating);
  } catch (error) {
    return response.status(500).send("Internal server error" + error);
  }
};

export const viewRatingByFileId = async (request, response) => {
  const file_Id = request.params.file_Id;
  console.log(file_Id);

  try {
    const fileRatings = await Rating.find({ file_Id });
    //console.log(fileRatings);

    if (!fileRatings) {
      return response
        .status(404)
        .json({ message: "No ratings found for this file" });
    }
    response.status(200).json(fileRatings);
  } catch (error) {
    response.status(500).json({ message: "Error fetching ratings: " + error });
  }
};

export const getAllRating = async (request, response) => {
  const allRates = await Rating.find();
  response.send(allRates);
};

/*export const updateRatingById = async (request, response) => {
  const { id } = request.params;
  const { rating, comment } = request.body;

  try {
    const updatedRating = await Rating.findOneAndUpdate(
      { id },
      { rating, comment, updatedAt: Date.now() }, // update rating and comment
      { new: true } // return the updated document
    );

    if (!updatedRating) {
      throw new NotFoundError("Rating not found");
    }

    response.status(200).json(updatedRating);
  } catch (error) {
    next(`${error}`);
  }
};
*/
