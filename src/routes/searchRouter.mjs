const express = require('express');
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
    }
    catch (error){
    res.status(500).json({error: 'Error fetching documents'})
    }
});

module.exports = router;