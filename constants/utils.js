const jwt = require('jsonwebtoken');


const generateToken = (token_details, experation)=>{
    const jwt_secret = process.env.JWT_SECRET
    const token = jwt.sign(token_details, jwt_secret, {
        expiresIn: experation
    });
    return token;
}

const verifyToken = (token)=>{
    const jwt_secret = process.env.JWT_SECRET
    const  verified = jwt.verify(token, jwt_secret);
    return verified;
}

function generateRandomString(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
module.exports = {generateToken, verifyToken, generateRandomString}