import express from "express";
import {
  createReport,
  getAllReports,
  getReportsById,
} from "../../controllers/reportController.mjs";

const router = express.Router();

// POST route for submitting a file report
router.post("/api/reports/:fileId", createReport);

router.get("/api/reports/:fileId", getReportsById);

router.get("/api/reports", getAllReports);

export default router;
