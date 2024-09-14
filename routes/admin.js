const express = require('express');
const router = express.Router();
const sql = require("../mySQL");
const fs = require('fs');
const path = require('path');
// const jwt = require('jsonwebtoken');
require('dotenv').config();
const QRCode = require('qrcode');

const {upload} = require('../middleware/uploadImage');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/new_cage', authMiddleware, async (req, res) => {
    const { animalType, title, description, image_path, animals } = req.body;

    try {
        // Insert the new cage into the database
        const query = await sql.query(`
            INSERT INTO 
                cages (animal_type, title, content, image_path)
            VALUES (?, ?, ?, ?) 
        `, [animalType, title, description, "test"]);
        
        const cageId = query[0].insertId;
        console.log("Cage ", cageId)
        console.log("Cage ", animals)
        animals.forEach(async element => {
            const query = await sql.query(`
                INSERT INTO 
                    animals (animal_type, cage_id, animal_name, animal_age)
                VALUES (?, ?, ?, ?) 
            `, [animalType, cageId, element.animalName, element.animalAge]);
        });

        // Create JSON object for QR code
        const qrCodeJson = {
            details: {
                id: cageId
            }
        };
        console.log("Cage QR", qrCodeJson)

        // Generate QR code as a data URL
        const qrCodeText = JSON.stringify(qrCodeJson);
        const qrCodePath = path.join( __dirname,'..', 'Images', `qr_${cageId}.png`);
        await QRCode.toFile(qrCodePath, qrCodeText);

        // Update the cage row with the QR code path
        await sql.query(`
            UPDATE cages 
            SET QR_path = ? 
            WHERE id = ?
        `, [qrCodePath, cageId]);

        // Respond with the details JSON object including the QR code
        res.status(200).json({
            details: {
                id: cageId,
                qr_code: qrCodePath
            }
        });
    } catch (e) {
        console.log("Error with creating new cage: ", e);
        res.status(500).send({error:e});
    }
});

router.post('/new_cage/:id', authMiddleware, async (req, res) => {
    const { animalType, title, description, image_path, animals } = req.body;
    const cageId = req.params.id;

    try {
        // Update the existing cage
        await sql.query(`
            UPDATE cages 
            SET animal_type = ?, title = ?, content = ?, image_path = ?
            WHERE id = ?
        `, [animalType, title, description, image_path, cageId]);

        // Process each animal in the request
        for (const element of animals) {
            if (element.animal_id) {
                // If animalId is present, update the existing animal
                await sql.query(`
                    UPDATE animals 
                    SET animal_type = ?, animal_name = ?, animal_age = ?
                    WHERE id = ? AND cage_id = ?
                `, [animalType, element.animalName, element.animalAge, element.animal_id, cageId]);
            } else {
                // If animalId is not present, insert a new animal
                await sql.query(`
                    INSERT INTO 
                        animals (animal_type, cage_id, animal_name, animal_age)
                    VALUES (?, ?, ?, ?) 
                `, [animalType, cageId, element.animalName, element.animalAge]);
            }
        }

        // Create JSON object for QR code
        const qrCodeJson = {
            details: {
                id: cageId
            }
        };

        // Generate QR code as a data URL
        const qrCodeText = JSON.stringify(qrCodeJson);
        const qrCodePath = path.join(__dirname, '..', 'Images', `qr_${cageId}.png`);
        await QRCode.toFile(qrCodePath, qrCodeText);

        // Update the cage row with the QR code path
        await sql.query(`
            UPDATE cages 
            SET QR_path = ? 
            WHERE id = ?
        `, [qrCodePath, cageId]);

        // Respond with the details JSON object including the QR code
        res.status(200).json({
            details: {
                id: cageId,
                qr_code: qrCodePath
            }
        });
    } catch (e) {
        console.log("Error with updating cage: ", e);
        res.status(500).send({error:e});
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

