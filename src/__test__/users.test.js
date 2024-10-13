import Auth from "../utils/middleware/middleware.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { getAllUsers } from "../controllers/usershandler.mjs";
import * as errors from "../utils/classes/errors.mjs";
import { find } from "underscore";

jest.mock("../mongoose/schemas/user.mjs"); // Mock User model
jest.mock("../utils/middleware/middleware.mjs"); // Mock requireAuth middleware
jest.mock("../utils/classes/errors.mjs");

// jest.mock("../utils/classes/errors.mjs", () => ({
//   NotFoundError: jest.fn(() => [{ msg: "User not found" }]),
//   UnauthorizedError: jest.fn(() => [{ msg: "User must log in" }]),
// })); // Mock class Errors

const mockRequest = {};
const mockResponse = {
  sendStatus: jest.fn(),
  send: jest.fn(),
  status: jest.fn(() => mockResponse),
};

describe("get all users", () => {
  const mockRequest = {};
  const mockResponse = {
    //sendStatus: jest.fn(),
    send: jest.fn(),
    status: jest.fn(() => mockResponse),
  };

  it("should send NotFoundError(404) if no user found", async () => {
    await getAllUsers(mockRequest, mockResponse);
    expect(errors.NotFoundError).toHaveBeenCalled();
    //   expect(mockResponse.send).toHaveBeenCalled();
  });

  it("should display all users", async () => {
    const findMethod = jest.spyOn(User.prototype, find);

    await getAllUsers(mockRequest, mockResponse);
    //normal testing if the response.send function works
    expect(mockResponse.send).toHaveBeenCalled();
    expect(findMethod).toHaveBeenCalled();

    //refine the test to check if users are returned properly

    //expect(mockResponse.send).toHaveBeenCalledWith(allUsers);
    expect(mockResponse.send).toHaveBeenCalledTimes(1); //returns true/passed if called 1 time
  });
});
