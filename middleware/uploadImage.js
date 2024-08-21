const multer = require('multer');
const path = require('path');
const fs = require('fs');


const imageDir = path.join(__dirname, '..' , 'images');
console.log(imageDir)
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Request body in destination callback:', req.body);
        cb(null, imageDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid filename conflicts
    }
});

const upload = multer({ storage: storage });

module.exports = { upload };