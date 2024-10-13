import { User } from "../mongoose/schemas/user.mjs";
import {
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from "../controllers/usershandler.mjs";
import * as validator from "express-validator";

jest.mock("../mongoose/schemas/user.mjs"); // Mock User model
jest.mock("../utils/middleware/middleware.mjs"); // Mock requireAuth middleware

jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
  matchedData: jest.fn(),
}));

const mockRequest = {};
const mockResponse = {
  sendStatus: jest.fn(),
  send: jest.fn(),
  status: jest.fn(() => mockResponse),
};

describe("get all users", () => {
  const mockRequest = {};
  const mockResponse = {
    send: jest.fn(),
    status: jest.fn(() => mockResponse),
  };

  it("If any user is not found(404)", async () => {
    // Mock User.find to return an empty array
    User.find.mockResolvedValue(null);

    await getAllUsers(mockRequest, mockResponse);
    expect(mockResponse.send).toHaveBeenCalled();

    // Optionally, ensure that status and send are called
    expect(mockResponse.status).toHaveBeenCalledWith(404);

    expect(mockResponse.send).toHaveBeenCalledWith("No users are found");
  });

  it("should display all users (200)", async () => {
    const allUsers = [{ fName: "Jane Doe" }, { fName: "John Doe" }];

    // Mock User.find to return some users
    User.find.mockResolvedValue(allUsers);

    await getAllUsers(mockRequest, mockResponse);

    // Ensure send is called with the users
    expect(mockResponse.send).toHaveBeenCalledWith(allUsers);
    expect(User.find).toHaveBeenCalled();
    expect(User.find).toHaveBeenCalledTimes(1);

    // Ensure send & status are called correctly
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalled();

    // Ensure User.find is called once
  });

  it("should return server error(500)", async () => {
    User.find.mockRejectedValue(new Error("Server Error"));

    await getAllUsers(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalled();
    expect(mockResponse.send).toHaveBeenCalledWith(
      expect.stringContaining("Internal server error")
    );
  });
});

describe("gets user by their id", () => {
  let mockRequest, mockResponse;
  beforeEach(() => {
    // Mock Express request and response objects
    mockRequest = {
      params: { id: "507f191e810c19729de860ea" }, // Example MongoDB ObjectID
    };

    mockResponse = {
      status: jest.fn(() => mockResponse),
      send: jest.fn(),
    };

    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("If no user is found(404)", async () => {
    // Mock User.find to return an empty array
    const user = null;
    User.findById.mockResolvedValue(user);

    await getUserById(mockRequest, mockResponse);

    //ensure that send is called
    expect(mockResponse.send).toHaveBeenCalled();

    // Optionally, ensure that status and send are called
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.send).toHaveBeenCalled();
  });

  it("shoudl return 1 user based on Id ", async () => {
    const mockUser = { id: "507f191e810c19729de860ea", name: "Test User" };
    User.findById.mockResolvedValue(mockUser); // Simulate found user

    await getUserById(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith(mockUser);
  });

  it("should return 500 on any error thrown", async () => {
    User.findById.mockRejectedValue(new Error("Some error occurred")); // Simulate error

    await getUserById(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith(
      expect.stringContaining("Some error occurred")
    );
  });
});

describe("update the user by Id", () => {
  let mockRequest, mockResponse;

  beforeEach(() => {
    mockRequest = {
      params: { _id: "507f191e810c19729de860ea" },
      body: { name: "Updated Name" },
    };

    mockResponse = {
      send: jest.fn(),
      status: jest.fn(() => mockResponse),
    };

    jest.clearAllMocks(); // Clear mocks between tests
  });

  it("should return 400 if validation errors are present", async () => {
    const errors = {
      isEmpty: jest.fn(() => false),
      array: jest.fn().mockReturnValue([{ msg: "Invalid data" }]),
    };
    validator.validationResult.mockReturnValue(errors);

    await updateUserById(mockRequest, mockResponse);

    expect(validator.validationResult).toHaveBeenCalledWith(mockRequest);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith(["Invalid data"]);
  });

  it("should return 404 if user is not found", async () => {
    const errors = { isEmpty: jest.fn().mockReturnValue(true) };
    validator.validationResult.mockReturnValue(errors);
    validator.matchedData.mockReturnValue({ name: "Updated Name" }); // Simulating valid matched data

    User.findByIdAndUpdate.mockResolvedValue(null); // Simulate user not found

    await updateUserById(mockRequest, mockResponse);

    expect(User.findByIdAndUpdate).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.send).toHaveBeenCalledWith("User not found");
  });

  it("should update the user successfully and return 201", async () => {
    const errors = { isEmpty: jest.fn().mockReturnValue(true) };
    validator.validationResult.mockReturnValue(errors);
    validator.matchedData.mockReturnValue({ name: "Updated Name" }); // Simulate valid matched data

    User.findByIdAndUpdate.mockResolvedValue({
      id: "123",
      name: "Updated Name",
    }); // Simulate successful user update

    await updateUserById(mockRequest, mockResponse);

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "507f191e810c19729de860ea",
      {
        name: "Updated Name",
      }
    );
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalledWith("User updated successlly");
  });

  it("should return 500 on any error thrown", async () => {
    User.findByIdAndUpdate.mockRejectedValue(new Error("Some error occurred")); // Simulate error

    await getUserById(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith(
      expect.stringContaining("Some error occurred")
    );
  });
});

describe("delete the user by id", () => {
  let mockRequest, mockResponse;

  beforeEach(() => {
    mockRequest = {
      params: { _id: "507f191e810c19729de860ea" },
    };

    mockResponse = {
      send: jest.fn(),
      status: jest.fn(() => mockResponse),
    };

    jest.clearAllMocks(); // Clear mocks between tests
  });

  it("returns 400 if validation errors are present", async () => {
    const errors = {
      isEmpty: jest.fn(() => false),
      array: jest.fn().mockReturnValue([{ msg: "Invalid data" }]),
    };
    validator.validationResult.mockReturnValue(errors);

    await deleteUserById(mockRequest, mockResponse);

    expect(validator.validationResult).toHaveBeenCalledWith(mockRequest);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith(["Invalid data"]);
  });

  it("should return 404 if user is not found", async () => {
    const errors = { isEmpty: jest.fn().mockReturnValue(true) };
    validator.validationResult.mockReturnValue(errors);
    validator.matchedData.mockReturnValue({ name: "Updated Name" }); // Simulating valid matched data

    User.findByIdAndDelete.mockResolvedValue(null); // Simulate user not found

    await deleteUserById(mockRequest, mockResponse);

    expect(User.findByIdAndDelete).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.send).toHaveBeenCalledWith("User not found");
  });

  it("should delete the user successfully and return 200", async () => {
    const errors = { isEmpty: jest.fn().mockReturnValue(true) };
    validator.validationResult.mockReturnValue(errors);

    User.findByIdAndDelete.mockResolvedValue({
      id: "507f191e810c19729de860ea",
    }); // Simulate successful user deletion

    await deleteUserById(mockRequest, mockResponse);

    expect(User.findByIdAndDelete).toHaveBeenCalledWith({
      _id: "507f191e810c19729de860ea",
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith("User removed successfully");
  });

  it("should return 500 on any error thrown", async () => {
    User.findByIdAndDelete.mockRejectedValue(new Error("Some error occurred")); // Simulate error

    await deleteUserById(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith(
      expect.stringContaining("Some error occurred")
    );
  });
});
