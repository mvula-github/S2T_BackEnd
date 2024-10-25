import request from "supertest";
import { createApp } from "../createApp.mjs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { response } from "express";
import Upload from "../mongoose/schemas/upload.mjs";
dotenv.config();

describe("File uploading, approving & disapproving", () => {
  let app;

  beforeAll(() => {
    mongoose
      .connect(`${process.env.CONNECTION_STRING_TEST}`) //`mongodb://${process.env.CONNECTON_STRING}
      .then(() => console.log("Connected to Database"))
      .catch((err) => console.log(`Error: ${err}`));

    app = createApp();
  });

  let fileId;

  it("should upload the file to server", async () => {
    const filePath = path.join(
      __dirname,
      "../../../../",
      "Downloads",
      "Full-Stack Marking Rubric.xlsx"
    );

    const response = await request(app)
      .post("/api/uploads")
      .field("subject", "IT Devs")
      .field("grade", 11)
      .field("year", 2020)
      .field("category", "Assignments")
      .field("description", "mark allocation")
      .attach("file", filePath);

    expect(response.status).toBe(201);

    fileId = response.body.file._id;
  });

  it("should approve a file", async () => {
    const response = await request(app).patch(`/api/files/${fileId}/approve`);

    expect(response.status).toBe(201);
  });

  it("should disapprove a file and delete it", async () => {
    const response = await request(app).patch(
      `/api/files/${fileId}/disapprove`
    );

    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
