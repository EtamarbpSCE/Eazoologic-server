const express = require('express');
const router = express.Router();
const sql = require("../mySQL");
// const jwt = require('jsonwebtoken');
require('dotenv').config();
const {upload} = require('../middleware/uploadImage');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/vet_calls', authMiddleware, async (req, res) => {
    console.log("yes?")
    try{

        const [rows] = await sql.query(`
            SELECT 
                vc.*,
                vc.cage_id, 
                vc.animal_id, 
                vc.description, 
                vc.status,
                vc.photo_path_array, 
                a.*   
            FROM 
                vet_calls vc 
            JOIN 
                animals a ON vc.animal_id = a.id
            WHERE
                vc.status=0;
            `
                
        );
        console.log(rows)
        if (rows.length === 0) {
        return res.status(200).send('No rows to display.');
        }
        // need to retrive photos.
        const vet_calls = rows.map(element => ({
            id: element.id,
            cage_id: element.cage_id,
            type:element.animal_type,
            creationDate: element.creation_datetime,   
            expended_info:{
                desciption: element.description,
                name:element.animal_name,
                type:element.animal_type,    
                age:element.animal_age,
                    
            },
            images:element.photo_path_array
        }))
        res.status(200).send({ vet_calls });
    } catch(e){
        console.log("Error with get all_cages: ", e);

    }
});


router.post('/vet_call', authMiddleware, upload.array('images_array', 10) ,async (req, res) => {
    const { cage_id, animal_id, description } = req.body
    console.log(req.body)
    console.log('Uploaded files:', req.body);
    try{
        const filePaths = req.files.map(file => `/images/${file.filename}`);
        console.log(filePaths);
        const [result] = await sql.query(`
            INSERT INTO vet_calls (cage_id, animal_id, description, photo_path_array)
            VALUES (?, ?, ?, ?)
        `, [cage_id, animal_id, description, JSON.stringify(filePaths)]);
        return res.status(200).send('Insert succesfull');
    } catch(e){
        console.log("Error with get all_cages: ", e);
        return res.status(200).send('Problem inserting data.');
    }
});

router.post('/close_call',authMiddleware, async (req, res) => {
    const { call_id } = req.body
    try{

        const updateQuery = `
            UPDATE vet_calls
            SET status = 1
            WHERE id = ?
        `;
        const [updateResult] = await sql.query(updateQuery, [call_id]);
        return res.status(200).send('Updated succesfull');
    } catch(e){
        console.log("Error with get all_cages: ", e);
        return res.status(200).send('Problem Updateing data');
    }
});


module.exports = router;

