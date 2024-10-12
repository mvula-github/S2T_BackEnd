import express, { Router } from "express";
import { Guide } from "../../mongoose/schemas/oer.mjs";

const router = Router();

//other routes for guides will be added here
// GET all guides
router.get("/api/guides", async (req, res) => {
  try {
    const guides = await Guide.find();
    res.status(200).json(guides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET guide by ID
router.get("/api/guides/:id", async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) return res.status(404).json({ message: "Guide not found" });
    res.status(200).json(guide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new guide
router.post("/api/guides", async (req, res) => {
  const guide = new Guide(req.body);
  try {
    const newGuide = await guide.save();
    res.status(201).json(newGuide);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH guide by ID
router.patch("/api/guides/:id", async (req, res) => {
  try {
    const guide = await Guide.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!guide) return res.status(404).json({ message: "Guide not found" });
    res.status(200).json(guide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE guide by ID
router.delete("/api/guides/:id", async (req, res) => {
  try {
    const guide = await Guide.findByIdAndDelete(req.params.id);
    if (!guide) return res.status(404).json({ message: "Guide not found" });
    res.status(200).json({ message: "Guide deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
