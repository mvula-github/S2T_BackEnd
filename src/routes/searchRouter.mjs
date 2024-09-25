import express from 'express';
import Document from '../mongoose/schemas/documents.mjs'

const router = express.Router();

//to be able to search documents, subjects or grade

router.get('/', async(req, res) => {
    try{
        const { subject, grade, title } = req.query;
        const filter = {};

        // applying filters for subjects, grade and title 
        if(subject) filter.subject= new RegExp(subject, 'i');
        if(grade) filter.grade = grade;
        if(title) filter.title = new RegExp(title, 'i');

        //for fetching documents based on the filter
        const documents = await Document.find(filter);
        res.json(documents);
    }
    // error handling
    catch (error){
    res.status(500).json({error: 'Error fetching documents'})
    }
});

export default router;