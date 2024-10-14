import request from "supertest";
import express from "express";

const app = express();

app.get("/hello", (req, res) => res.sendStatus(200));

describe("hello endpoint", () => {
  it("get /hello and expect 200", async () => {
    const response = await request(app).get("/hello").expect(200);
    expect(response.statusCode).toBe(200);
  });
});
