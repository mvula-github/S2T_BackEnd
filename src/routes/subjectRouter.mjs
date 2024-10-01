// file for displaying subjects

import express from "express";
import Document from "../mongoose/schemas/documents.mjs";
import path from "path";

const router = express.Router();

//to fetch all the documents from the database
router.get("/api/subjects", async (req, res) => {
  try {
    const documents = await Document.find();
    res.json(documents);
    // error handling
  } catch (error) {
    res.status(500).json({ error: "Cannot fetch documents" });
  }
});

// getting a specific document by ID
router.get("/api/subjects/:id", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document)
      return res.status(404).json({ error: "Cannot find document" });
    res.json(document);

    //error handling
  } catch (error) {
    res.status(500).json({ error: "Cannot fetch the document" });
  }
});

// previewing a document
router.get("/api/subjects/preview/:id", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    // error handling
    if (!document) return res.status(404).json({ error: "Document not found" });

    // send the file url so it can be used in the frontend
    res.json({ fileUrl: document.fileUrl });
    // error handling
  } catch (error) {
    res.status(500).json({ error: "Cannot show document" });
  }
});

// downloading a pdf document
router.get("/api/subjects/download/:id", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document)
      return res
        .status(404)
        .json({ error: "This document could not be found" });

    // declared file path
    const filePath = path.join(path.resolve(), document.fileUrl);

    //sending the file for download
    res.download(filePath, document.title + "pdf", (err) => {
      if (err)
        res.status(500).json({ error: "Could not download the document" });
    });

    // error handling
  } catch (error) {
    res.status(500).json({ error: "Could not download the document" });
  }
});

//to be able to search documents, subjects or grade
router.get("/api/subjects/search", async (req, res) => {
  try {
    const { subject, grade, title } = req.query;
    const filter = {};

    // applying filters for subjects, grade and title
    if (subject) filter.subject = new RegExp(subject, "i");
    if (grade) filter.grade = grade;
    if (title) filter.title = new RegExp(title, "i");

    //for fetching documents based on the filter
    const documents = await Document.find(filter);
    res.json(documents);
  } catch (error) {
    // error handling
    res.status(500).json({ error: "Error fetching documents" });
  }
});

export default router;
