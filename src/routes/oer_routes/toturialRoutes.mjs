// tutorialRoutes.mjs
import express from 'express';
import multer from 'multer';
import { body, validationResult } from 'express-validator';
import Tutorial from '../mongoose/schemas/oer/Tutorial.mjs'; // Adjust the path as necessary

const router = express.Router();

// Create a new tutorial
router.post('/', [
    body('title').isString().notEmpty(), // Validation for title
    body('content').isString().notEmpty(), // Validation for content
], async (req, res) => {
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
        res.status(500).json({ message: 'Error creating tutorial', error });
    }
});

// Other routes (GET, etc.) can be added here

export default router; // Export the router
