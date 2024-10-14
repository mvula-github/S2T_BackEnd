import { report } from "process";
import {
  createReport,
  getReportsById,
  getAllReports,
} from "../controllers/reportController.mjs";
import Report from "../mongoose/schemas/report.mjs";
import { clearScreenDown } from "readline";
import { param } from "express-validator";

jest.mock("../mongoose/schemas/report.mjs");

const mockResponse = {
  sendStatus: jest.fn(),
  send: jest.fn(),
  status: jest.fn(() => mockResponse),
};

describe("create a new report(201)", () => {
  let mockResponse, mockRequest;

  beforeEach(() => {
    mockRequest = {
      params: { id: "507f191e810c19729de860ea" }, // Example MongoDB ObjectID
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    jest.clearAllMocks(); // Clear mocks before each tes
  });

  it("should return validation(400)", async () => {
    const mockRequest = { body: { reason: "" }, params: { fileId: "" } };

    await createReport(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: "Please select file and provide reason are required",
    });
  });

  it("save report in database(201)", async () => {
    const mockRequest = {
      body: {
        reason: "Inappropriate content",
      },
      params: { fileId: "670c1741a65fdd4df216c4f0" },
    };

    const savemethod = jest.spyOn(Report.prototype, "save");

    await createReport(mockRequest, mockResponse);
    expect(savemethod).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: "Report submitted successfully",
    });
  });

  it("returns  internal server error(500)", async () => {
    const mockRequest = {
      body: {
        reason: "Inappropriate content",
      },
      params: { fileId: "670c1741a65fdd4df216c4f0" },
    };

    Report.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("Database error")),
    }));

    await createReport(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: "Error submitting report",
      error: expect.any(Error),
    });
  });
});

describe("get report by Id", () => {
  let mockResponse, mockRequest;

  beforeEach(() => {
    mockRequest = {
      params: { id: "507f191e810c19729de860ea" }, // Example MongoDB ObjectID
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    jest.clearAllMocks(); // Clear mocks before each tes
  });

  it("returns 404 if  user not found", async () => {
    Report.find.mockResolvedValue(null);

    await getReportsById(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: "No reports found for this file",
    });
  });

  it("returns the report(200)", async () => {
    const reports = [
      { fileId: "507f191e810c19729de860ea", reason: "Inapproriate content" },
    ];

    Report.find.mockResolvedValue(reports);
    await getReportsById(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith(reports);
  });

  it("returns  internal server error(500)", async () => {
    Report.find.mockRejectedValue(new Error("Database error"));

    await getReportsById(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: "Error fetching reports",
    });
  });
});
