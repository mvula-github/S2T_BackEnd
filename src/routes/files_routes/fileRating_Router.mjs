import express from 'express';
import FileRating from '../../mongoose/schemas/fileRating.mjs';  // assuming file structure
import { validationResult } from 'express-validator';  // for validation if needed
const router = express.Router();

// GET all ratings for a specific file by file ID
router.get('/:fileId', async (req, res) => {
    const { fileId } = req.params;
    try {
        const ratings = await FileRating.find({ fileId });
        if (!ratings) {
            return res.status(404).json({ message: 'No ratings found for this file' });
        }
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ratings', error });
    }
});

// POST a new rating for a file
router.post('/', async (req, res) => {
    const { fileId, rating, comment } = req.body;

    // Check if the user has already rated this file
    const existingRating = await FileRating.findOne({ fileId  });
    if (existingRating) {
        return res.status(400).json({ message: 'User has already rated this file' });
    }

    // Create a new rating
    const newRating = new FileRating({ fileId, rating, comment });
    try {
        await newRating.save();
        res.status(201).json(newRating);
    } catch (error) {
        res.status(400).json({ message: 'Error saving rating', error });
    }
});

// PATCH (update) a rating for a specific file by file ID and user ID
router.patch('/:fileId', async (req, res) => {
    const { fileId  } = req.params;
    const { rating, comment } = req.body;

    try {
        const updatedRating = await FileRating.findOneAndUpdate(
            { fileId },
            { rating, comment, updatedAt: Date.now() },  // update rating and comment
            { new: true }  // return the updated document
        );

        if (!updatedRating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        res.status(200).json(updatedRating);
    } catch (error) {
        res.status(500).json({ message: 'Error updating rating', error });
    }
});

export default router;
