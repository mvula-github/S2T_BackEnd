import Rating from "../mongoose/schemas/ratings.mjs";
import Upload from "../mongoose/schemas/upload.mjs";
import {
  createRating,
  viewRatingByFileId,
} from "../controllers/ratinghander.mjs";
import * as validator from "express-validator";
import { isEmpty } from "underscore";

jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
  matchedData: jest.fn(),
}));

jest.mock("../mongoose/schemas/upload.mjs");
jest.mock("../mongoose/schemas/ratings.mjs");

describe("create new Rating", () => {
  let mockRequest, mockResponse;
  beforeEach(() => {
    mockRequest = {
      body: { rating: 5, comment: "greate file" },
      params: { file_Id: "67040e13654df1c77ee616e6" },
    };
    mockResponse = {
      status: jest.fn(() => mockResponse),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("return 400 if there are validation error", async () => {
    validator.validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid data" }],
    });

    await createRating(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith(["Invalid data"]);
  });

  it("should return 404 if the file is not found", async () => {
    validator.validationResult.mockReturnValue({ isEmpty: () => true });
    Upload.findById.mockResolvedValue(null);

    await createRating(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.send).toHaveBeenCalledWith("File not found");
  });

  it("should create a rating and return 201 if successful", async () => {
    validator.validationResult.mockReturnValue({ isEmpty: () => true });
    Upload.findById.mockResolvedValue({ id: "file123" });
    Rating.prototype.save = jest.fn().mockResolvedValue({ rating: 5 });

    await createRating(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalledWith(
      "File rated succesfully, rating: 5"
    );
  });

  it("should return 500 on internal server error", async () => {
    validator.validationResult.mockReturnValue({ isEmpty: () => true });
    mockRequest.params.file_Id = "file123";
    Upload.findById.mockRejectedValue(new Error("Database error"));

    await createRating(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith(
      "Internal server errorError: Database error"
    );
  });
});
