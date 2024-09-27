import express, { response } from "express";
import Report from "../../mongoose/schemas/report.mjs"; // You would need to create a Report schema

const router = express.Router();

// POST route for submitting a file report
router.post("/api/reports", async (request, response) => {
  const { fileId, reason } = request.body;

  if (!fileId || !reason) {
    return response
      .status(400)
      .json({ message: "Please select file and provide reason are required" });
  }

  try {
    const newReport = new Report({ fileId, reason });
    await newReport.save();
    response.status(201).json({ message: "Report submitted successfully" });
  } catch (error) {
    response.status(500).json({ message: "Error submitting report", error });
  }
});

router.get("/api/reports/:fileId", async (request, response) => {
  const { fileId } = request.params;
  try {
    const reports = await Report.findOne({ fileId });
    console.log(reports);
    if (!reports) {
      return response
        .status(404)
        .json({ message: "No reports found for this file" });
    }
    response.status(200).json(reports);
  } catch (error) {
    response.status(500).json({ message: "Error fetching reports", error });
  }
});

export default router;
