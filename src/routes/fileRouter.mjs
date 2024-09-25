import express, { Router } from "express";
import { File } from "../mongoose/schemas/file.mjs";
import {
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";
import {
  mainFileValidation,
  patchFileValidation,
} from "../utils/validation/fileValidation.mjs";

const app = Router();

//---------------------------------------------POST------------------------------------------------------
app.post(
  "/api/files",
  checkSchema(mainFileValidation),
  async (request, response) => {
    if (request.session.user) {
      const errorResult = validationResult(request);
      console.log(errorResult);

      //handle the validations i.e. doesn't add invalid data to database
      if (!errorResult.isEmpty())
        return response.status(400).send({ error: errorResult.array() });

      //To know if the data is valid or not
      const data = matchedData(request);

      //adding the new File
      try {
        const newFile = new File(data);
        await newFile.save();
        return response.status(201).send("Added Successfully");
      } catch (err) {
        return response.sendStatus(400);
      }
    } else {
      response.status(401).send("User not logged in");
    }
  }
);

//---------------------------------------------GET------------------------------------------------------

app.get("/api/files", async (request, response) => {
  try {
    const allFiles = await File.find();
    response.status(200).send(allFiles);
  } catch (err) {
    return response.status(500).send("Failed to retrieve all Files");
  }
});

//display only one File specified by the id
app.get("/api/files/:id", async (request, response) => {
  const {
    params: { id },
  } = request;

  try {
    const theFile = await File.findById(id);
    if (!theFile) return response.status(404).send("File not found");

    response.status(200).send(theFile);
  } catch (err) {
    response.status(500).send(`Failed to retrieve the File: ${err}`);
  }
});

//---------------------------------------------PATCH------------------------------------------------------
//to update the file for the contribute page
app.patch(
  "/api/files/:id",
  checkSchema(patchFileValidation),
  async (request, response) => {
    if (request.session.user) {
      const errorResult = validationResult(request);

      //handle the validations i.e. doesn't add invalid data to database
      if (!errorResult.isEmpty())
        return response.status(400).send({ error: errorResult.array() });

      //To know if the data is valid or not
      const {
        params: { id },
      } = request;
      const data = matchedData(request);
      try {
        const updatedFile = await F.findByIdAndUpdate(id, data);

        if (!updatedFile) return response.status(404).send("File not found");

        response.status(201).send("File updated successfully");
      } catch (err) {
        return response.status(500).send(`Failed to update File: ${err}`);
      }
    } else {
      response.status(401).send("User not logged in");
    }
  }
);

//---------------------------------------------PUT------------------------------------------------------
app.put(
  "/api/files/:id",
  checkSchema(mainFileValidation),
  async (request, response) => {
    if (request.session.user) {
      const errorResult = validationResult(request);

      //handle the validations i.e. doesn't add invalid data to database
      if (!errorResult.isEmpty())
        return response.status(400).send({ error: errorResult.array() });

      const {
        params: { id },
      } = request;

      //To know if the stored data is valid or not
      const data = matchedData(request);

      try {
        const updatedFile = await File.findByIdAndUpdate(id, data);

        if (!updatedFile) return response.status(404).send("File not found");

        response.status(201).send("File updated successfully");
      } catch (err) {
        return response.status(500).send(`Failed to update File: ${err}`);
      }
    } else {
      response.status(401).send("User not logged in");
    }
  }
);

//---------------------------------------------DELETE------------------------------------------------------
app.delete("/api/files/:id", async (request, response) => {
  if (request.session.user) {
    const {
      params: { id },
    } = request;

    try {
      const deletedFile = await File.findByIdAndDelete(id);

      if (!deletedFile) return response.status(404).send("File not found");

      response.status(200).send("File deleted successfully");
    } catch (err) {
      return response.status(500).send(`Failed to delete File: ${err}`);
    }
  } else {
    response.status(401).send("User not logged in");
  }
});

export default app;
