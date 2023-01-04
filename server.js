const flights = require('./constants/flights')
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 3001;
const connection = require('./mySQL');

// Where we will keep books
let books = [];

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

console.log(flights);
app.get('/getFlights', async (req, res) => {
    res.status(200).send(flights, 200);
});

app.post('/insertFlights', async (req, res) => {
    const flightsList = req.body.flightsList
    
    const query = `
        INSERT INTO flights (carrier, destination, origin, origin_country, destination_country, takeoff, departure_time, seats_left, connection, date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    try{
        flightsList.array.forEach(element => {
            const values = [
                element.carrier,
                element.destination,
                element.origin,
                element.origin_country,
                element.destination_country,
                element.departure_time,
                element.landing_time,
                element.seat_left,
                element.connection,
                element.date,
            ];
        });
            
        connection.query(query, values, (error, results) => {
            if (error) throw error;
            res.status(200).send(results);

        });
    }catch(e){
        console.log("Error While trying to insert data to the DB, Error: ", e)
        res.status(400).send("Error While trying to insert data to the DB, Error: ", e);
    }
    res.status(200).send(flights, 200);
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));