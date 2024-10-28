import express from "express";
import {
  createReport,
  getAllReports,
  getReportsById,
} from "../../controllers/reportController.mjs";
import { requireAuth } from "../../utils/middleware/middleware.mjs";

const router = express.Router();

// POST route for submitting a file report
router.post("/api/reports/:fileId", createReport);

router.get("/api/reports/:fileId", requireAuth(["admin"]), getReportsById);

router.get("/api/reports", requireAuth, getAllReports);

export default router;
