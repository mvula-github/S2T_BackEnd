import request from "supertest";
import { createApp } from "../createApp.mjs";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

describe("Create a user account and login", () => {
  let app;

  beforeAll(() => {
    mongoose
      .connect(`${process.env.CONNECTION_STRING_TEST}`) //`mongodb://${process.env.CONNECTON_STRING}
      .then(() => console.log("Connected to Database"))
      .catch((err) => console.log(`Error: ${err}`));

    app = createApp();
  });

  it("should create a new user", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      fName: "cole",
      lName: "palmer",
      email: "coldpalmer@gmail.com",
      password: "jcole@12345",
      cPassword: "jcole@12345",
    });
    expect(response.status).toBe(201);
  });

  it("should login a valid user", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "coldpalmer@gmail.com",
      password: "jcole@12345",
    });
    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
