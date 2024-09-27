// tutorialRoutes.mjs
import express, { Router } from "express";
import multer from "multer";
import { body, validationResult } from "express-validator";
import Tutorial from "../../mongoose/schemas/oer.mjs"; // Adjust the path as necessary

const router = Router();

// Create a new tutorial
router.post(
  "/api/tutorials",
  [
    body("title").isString().notEmpty(), // Validation for title
    body("content").isString().notEmpty(), // Validation for content
  ],
  async (req, res) => {
    const errors = validationResult(req); // Check for validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Return errors if any
    }

    const { title, content } = req.body;
    const newTutorial = new Tutorial({ title, content });

    try {
      await newTutorial.save(); // Save the tutorial
      res.status(201).json(newTutorial); // Respond with the created tutorial
    } catch (error) {
      res.status(500).json({ message: "Error creating tutorial", error });
    }
  }
);

// Other routes (GET, etc.) can be added here
// GET all tutorials
router.get("/", async (req, res) => {
  try {
    const tutorials = await Tutorial.find();
    res.status(200).json(tutorials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a tutorial by ID
router.get("/:id", async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);
    if (!tutorial)
      return res.status(404).json({ message: "Tutorial not found" });
    res.status(200).json(tutorial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new tutorial
router.post("/", async (req, res) => {
  const tutorial = new Tutorial(req.body);
  try {
    const newTutorial = await tutorial.save();
    res.status(201).json(newTutorial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH (update) a tutorial by ID
router.patch("/:id", async (req, res) => {
  try {
    const tutorial = await Tutorial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!tutorial)
      return res.status(404).json({ message: "Tutorial not found" });
    res.status(200).json(tutorial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a tutorial by ID
router.delete("/:id", async (req, res) => {
  try {
    const tutorial = await Tutorial.findByIdAndDelete(req.params.id);
    if (!tutorial)
      return res.status(404).json({ message: "Tutorial not found" });
    res.status(200).json({ message: "Tutorial deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; // Export the router