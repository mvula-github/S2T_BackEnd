import { Router } from "express";
import { Author } from "../../mongoose/schemas/oer.mjs";

const router = Router();

//other routes for author will be added here
// GET all authors
router.get("/api/authors", async (request, response) => {
  try {
    const authors = await Author.find();
    response.status(200).json(authors);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

// GET author by ID
router.get("/api/authors/:id", async (request, response) => {
  try {
    const author = await Author.findById(request.params.id);
    if (!author)
      return response.status(404).json({ message: "Author not found" });
    response.status(200).json(author);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

// POST new author
router.post("/api/authors", async (request, response) => {
  const author = new Author(request.body);
  try {
    const newAuthor = await author.save();
    response.status(201).json(newAuthor);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
});

// PATCH author by ID
router.patch("/api/authors/:id", async (request, response) => {
  try {
    const author = await Author.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
      }
    );
    if (!author)
      return response.status(404).json({ message: "Author not found" });
    response.status(200).json(author);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

// DELETE author by ID
router.delete("/api/authors/:id", async (request, response) => {
  try {
    const author = await Author.findByIdAndDelete(request.params.id);
    if (!author)
      return response.status(404).json({ message: "Author not found" });
    response.status(200).json({ message: "Author deleted" });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

export default router;
