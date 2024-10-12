import express from "express";
import {
  getAllReports,
  getReportsById,
} from "../../controllers/reportController.mjs";

const router = express.Router();

// POST route for submitting a file report
router.post("/api/reports");

router.get("/api/reports/:fileId", getReportsById);

router.get("/api/reports", getAllReports);

export default router;
