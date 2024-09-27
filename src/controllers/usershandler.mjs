import { User } from "../mongoose/schemas/user.mjs";
import { requireAuth } from "../utils/middleware/middleware.mjs";

export const getAllUsers = async (request, response) => {
  try {
    if (!requireAuth) return response.status(401).send("User not logged in"); //verify if user is logged in

    const allUsers = await User.find();

    return response.status(200).send(allUsers);
  } catch (err) {
    return request.response.send(`${err} `);
  }
};
