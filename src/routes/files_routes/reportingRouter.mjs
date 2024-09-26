import express from "express";
import Report from "../../mongoose/schemas/report.mjs"; // You would need to create a Report schema

const router = express.Router();

// POST route for submitting a file report
router.post("/api/report", async (req, res) => {
  const { fileId, reason } = req.body;

  if (!fileId || !reason) {
    return res
      .status(400)
      .json({ message: "Please select file and provide reason are required" });
  }

  try {
    const newReport = new Report({ fileId, reason });
    await newReport.save();
    res.status(201).json({ message: "Report submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error submitting report", error });
  }
});

export default router;
