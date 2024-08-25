const express = require('express');
const router = express.Router();
const sql = require("../mySQL");
const bcrypt = require('bcrypt');
const { generateToken, verifyToken, generateRandomString } = require('../constants/utils');
const { sendEmail, sendEmailNewUser, sendEmailRegistrationSuccesfull, sendEmailPasswordReset } = require('../services/email');
const { verify } = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
// const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email)
    console.log(password)
    try {
        // Fetch the user from the database by email
        const [rows] = await sql.query('SELECT * FROM users WHERE email = ? AND active = 1', [email]);
        console.log(rows)
        // If user not found, return an error
        if (rows.length === 0) {
            return res.status(401).send('Invalid credentials');
        }
        
        const user = rows[0];
        
        // Compare the provided password with the stored hashed password
        // const passwordIsValid = await bcrypt.compare(password, user.password);
        
        // // If password is invalid, return an error
        // if (!passwordIsValid) {
        //     return res.status(401).send('Invalid credentials');
        // }
        
        // Generate a token if credentials are valid
        const token = generateToken({ id: user.id, email: user.email, role: user.role }, "12h");
        
        // Send the token to the client
        res.status(200).send({ token });
        
    } catch (error) {
        // Handle errors and send a 500 status
        res.status(500).send(error);
    }
});


router.post('/createUser', async (req, res) => {
    const { fullName, email, password, role } = req.body;

    try {
        // Check if the user already exists
        const [existingUser] = await sql.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(200).send({code:1, message:'User already exists'});
        }
        const token = generateToken({email: email, role: role }, "12h");

        sendEmailNewUser(email, token);
        // Hash the password
        const randomString = generateRandomString();
        const hashedPassword = await bcrypt.hash(randomString, 10);

        // Insert the new user into the database
        const [result] = await sql.query(
            'INSERT INTO users (full_name, email, password, role, token, active, creation_datetime) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [fullName, email, hashedPassword, role, token, 0, new Date()]
        );

        // Generate a token for the new user

        res.status(201).send({status:"Registered Succesfully."});
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});



router.post('/get_registration_token', async (req, res) => {
    const { email, token} = req.body;

    try {
        // Check if the user already exists
        const [existingUser] = await sql.query('SELECT * FROM users WHERE email = ?', [email]);
        console.log(existingUser, email)
        if (existingUser.length === 0) {
            return res.status(200).send({code:1, message:'User not exists'});
        }
        if(!verifyToken(token)){
            console.log("what")
            return res.status(200).send({code:1, message:'Invalid Token'});
        }
        console.log(existingUser)
        if(token != existingUser[0].token){
            return res.status(200).send({code:1, message:'Invalid Token'});
        }
        
        res.status(201).send({status:"Token is valid"});
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        
        sendEmailRegistrationSuccesfull(email);
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const [existingUser] = await sql.query('UPDATE users SET password = ?, active = 1 WHERE email = ?', [hashedPassword, email]);

        res.status(201).send({status:"Registered Succesfully."});
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});

router.post('/reset_password', async (req, res) => {
    const { email, reset=false } = req.body;
    console.log(email)
    try {
        const token = generateToken({email: email}, "1h");

        // Hash the password
        const [existingUser] = await sql.query('UPDATE users SET token = ?, active = 1 WHERE email = ?', [token, email]);
        if(reset){
            sendEmailPasswordReset(email, token);
        } else {
            sendEmailNewUser(email, token)
        }
        
        res.status(201).send({status:"success."});
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});

router.post('/users/:id', authMiddleware, async (req, res) => {
    const {id} = req.params
    const {fullName, role, email} = req.body
    console.log(fullName)
    try{

        const [rows] = await sql.query(`
            UPDATE 
                users
            SET
                full_name = ?,
                role = ?,
                email = ?
            WHERE
                id = ?;
            `
        ,[fullName, role, email, id]);
        if (rows.length === 0) {
            return res.status(200).send('No rows to display.');
        }
        
        res.status(200).send({ rows });
    } catch(e){
        console.log("Error with get all_cages: ", e);

    }
});


module.exports = router;

