const express = require('express');
const router = express.Router();
const sql = require("../mySQL");
const authMiddleware = require('../middleware/authMiddleware');
// const jwt = require('jsonwebtoken');
require('dotenv').config();


router.post('/feed_log',authMiddleware, async (req, res) => {
    const requestData = req.body;
  
    try {
        const [result] = await sql.query(`
            INSERT INTO feeding_logs (user_id, cage_id, type, amount, units)
            VALUES (?, ?, ?, ?, ?)
        `, [2, requestData.cageId, requestData.foodType, requestData.amount, requestData.units]);
        res.status(200).send(result);
    } catch (e) {
        console.error("Error occurred: ", e);
        res.status(500).send(e);
    }
});


module.exports = router;

