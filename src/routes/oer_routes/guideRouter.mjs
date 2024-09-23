import express from 'express';
import Guide from '../mongoose/schemas/oer/Guide.mjs';

const router = express.Router();

// Get all guides
router.get('/', async (req, res) => {
    try {
        const guides = await Guide.find();
        res.status(200).json(guides);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching guides', error });
    }
});

// Create a new guide
router.post('/', async (req, res) => {
    const { title, description, link } = req.body;

    const newGuide = new Guide({ title, description, link });
    try {
        await newGuide.save();
        res.status(201).json(newGuide);
    } catch (error) {
        res.status(400).json({ message: 'Error creating guide', error });
    }
});

export default router;
