const express = require('express');
const router = express.Router();
const sql = require("../mySQL");
const authMiddleware = require('../middleware/authMiddleware');
// const jwt = require('jsonwebtoken');
require('dotenv').config();


router.get('/all_cages',authMiddleware, async (req, res) => {
    console.log("yes?")
    try{

        const [rows] = await sql.query(`
            SELECT 
                C.id,
                C.animal_type,
                C.title,
                C.content,
                COALESCE(
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'animal_id', A.id,
                            'animal_name', A.animal_name,
                            'animal_age', A.animal_age,
                            'animal_type', A.animal_type
                        )
                    ),
                    JSON_ARRAY()
                ) AS animals
            FROM 
                cages C
            LEFT JOIN 
                animals A ON C.id = A.cage_id
            GROUP BY 
                C.id, C.animal_type, C.title, C.content
            ORDER BY 
                C.id;
        `);
        console.log(rows)
        if (rows.length === 0) {
        return res.status(200).send('No rows to display.');
        }
        res.status(200).send({ rows });
    } catch(e){
        console.log("Error with get all_cages: ", e);

    }
});

router.get('/cage/:id',authMiddleware, async (req, res) => {
    const {id:cage_id} = req.params
    console.log(cage_id)
    try{

        const [rows] = await sql.query(`
            SELECT 
                *
            FROM 
                animals
            WHERE
                cage_id = ? 
            `
        ,[cage_id]);
        console.log(rows)
        if (rows.length === 0) {
        return res.status(200).send('No rows to display.');
        }
        res.status(200).send({ rows });
    } catch(e){
        console.log("Error with get all_cages: ", e);

    }
});

router.get('/feed_log', authMiddleware, async (req, res) => {
    try {
        const [result] = await sql.query(`
            SELECT fl.*, u.full_name 
            FROM feeding_logs fl
            JOIN users u ON fl.user_id = u.id
        `);
        res.status(200).send(result);
    } catch (e) {
        console.error("Error occurred: ", e);
        res.status(500).send(e);
    }
});


router.get('/vet_calls_logs', authMiddleware, async (req, res) => {
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
router.get('/users', authMiddleware, async (req, res) => {
    try{

        const [rows] = await sql.query(`
            SELECT 
                *
            FROM
                users
            WHERE
                active = 1;
            `
        );
        if (rows.length === 0) {
            return res.status(200).send('No rows to display.');
        }
        
        res.status(200).send({ rows });
    } catch(e){
        console.log("Error with get all_cages: ", e);

    }
});

router.get('/users/:id', authMiddleware, async (req, res) => {
    const {id} = req.params
    console.log(id)
    try{

        const [rows] = await sql.query(`
            SELECT 
                full_name,
                role,
                email
            FROM
                users
            WHERE
                id = ?;
            `
        ,[id]);
        if (rows.length === 0) {
            return res.status(200).send('No rows to display.');
        }
        
        res.status(200).send({ rows });
    } catch(e){
        console.log("Error with get all_cages: ", e);

    }
});



module.exports = router;

