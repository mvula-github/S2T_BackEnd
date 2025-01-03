import request from "supertest";
import { createApp } from "../createApp.mjs";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

describe("testing my home page", () => {
  let app;

  beforeAll(() => {
    mongoose
      .connect(`${process.env.CONNECTION_STRING_TEST}`) //`mongodb://${process.env.CONNECTON_STRING}
      .then(() => console.log("Connected to Database"))
      .catch((err) => console.log(`Error: ${err}`));

    app = createApp();
  });

  it("should display hello world", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
