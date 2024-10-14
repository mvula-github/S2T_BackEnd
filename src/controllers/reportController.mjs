import { clearScreenDown } from "readline";
import Report from "../mongoose/schemas/report.mjs"; // You would need to create a Report schema

export const createReport = async (request, response) => {
  const { fileId } = request.params;
  const { reason } = request.body;

  try {
    if (!fileId || !reason)
      return response.status(400).send({
        message: "Please select file and provide reason are required",
      });

    const newReport = new Report({ fileId, reason });
    await newReport.save();

    response.status(201).send({ message: "Report submitted successfully" });
  } catch (error) {
    response.status(500).send({ message: "Error submitting report", error });
  }
};

export const getReportsById = async (request, response) => {
  const { fileId } = request.params;

  try {
    const reports = await Report.find({ fileId });

    //console.log(reports);

    if (!reports || reports.length === 0) {
      return response
        .status(404)
        .send({ message: "No reports found for this file" });
    }

    return response.status(200).send(reports);
  } catch (error) {
    return response.status(500).send({ message: "Error fetching reports" });
  }
};

export const getAllReports = async (request, response) => {
  const allReports = await Rating.find();
  response.status(200).send(allReports);
};
