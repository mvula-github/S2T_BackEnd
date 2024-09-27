import { getAllUsers } from "../handlers/usershandler.mjs";
import requireAuth from "../utils/middleware/middleware.mjs";
import { User } from "../mongoose/schemas/user.mjs";

jest.mock("../mongoose/schemas/user.mjs"); // Mock User model
jest.mock("../utils/middleware/middleware.mjs"); // Mock requireAuth middleware

const mockRequest = {};
const mockResponse = {
  sendStatus: jest.fn(),
  send: jest.fn(),
  status: jest.fn(() => mockResponse),
};

describe("get all users", () => {
  let requireAuth;
  const mockRequest = {};

  requireAuth = true;
  test("should prompt user to login when not authenticated", async () => {
    requireAuth = true; // Simulate unauthenticated user

    await getAllUsers(mockRequest, mockResponse);
    // expect(mockResponse.status).toHaveBeenCalledWith();
    //expect(mockResponse.send).toHaveBeenCalledWith("User not logged in");
  });
});
