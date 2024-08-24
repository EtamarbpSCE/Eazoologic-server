const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
// const axios = require('axios');
const app = express();
const port = 3001;
// const env = require('dotenv');
const connection = require('./mySQL');
const authRouter = require('./routes/auth')
const vetsRouter = require('./routes/vets')
const keeperRouter = require('./routes/keeper')
const infoRouter = require('./routes/info')
const adminRouter = require('./routes/admin')
const {upload} = require('./middleware/uploadImage')
require('dotenv').config();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/auth', authRouter)
app.use('/vets', vetsRouter)
app.use('/keeper', keeperRouter)
app.use('/info', infoRouter)
app.use('/admin', adminRouter)
app.use('/images', express.static(path.join(__dirname, 'images')));


app.post('/upload', upload.array('images', 10), (req, res) => {
    try {
        const filePaths = req.files.map(file => `/images/${file.originalname}`);
        res.send({
            status: 'success',
            paths: filePaths
        });
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));