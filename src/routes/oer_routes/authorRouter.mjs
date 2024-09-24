import express from "express";
import Author from '"../../mongoose/schemas/oer/oerAuthors';

const router = express.Router();

// Get all authors
router.get("/", async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching authors", error });
  }
});

// Create a new author
router.post("/", async (req, res) => {
  const { name, bioLink } = req.body;

  const newAuthor = new Author({ name, bioLink });
  try {
    await newAuthor.save();
    res.status(201).json(newAuthor);
  } catch (error) {
    res.status(400).json({ message: "Error creating author", error });
  }
});

export default router;
