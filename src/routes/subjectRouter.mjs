// file for displaying subjects

import express from "express";
import {
  downloadSubject,
  getAllSubjects,
  getSubjectById,
  previewSubject,
  searchSubjects,
} from "../controllers/subjectController.mjs";

const router = express.Router();

//to fetch all the documents from the database
router.get("/api/subjects", getAllSubjects);

// getting a specific document by ID
router.get("/api/subjects/:id", getSubjectById);

// previewing a document
router.get("/api/subjects/preview/:id", previewSubject);

// downloading a pdf document
router.get("/api/subjects/download/:id", downloadSubject);

//to be able to search documents, subjects or grade
router.get("/api/subjects/search", searchSubjects);

export default router;
