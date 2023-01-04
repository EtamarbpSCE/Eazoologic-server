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
    try{
            //  const values = [
            //     element.carrier,
            //     element.destination,
            //     element.origin,
            //     element.origin_country,
            //     element.destination_country,
            //     element.departure_time,
            //     element.landing_time,
            //     element.seat_left,
            //     element.connection,
            //     element.price,
            //     element.date,
            //  ];
             const query = `SELECT * FROM flights`;
             // (carrier, destination, origin, origin_country, destination_country, departure_time, landing_time , seats_left, connection, price, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            const result = connection.query(query, (error, results) => {
                if (error) throw error;
                // console.log(results);
                res.status(200).send(results);
              });
         
     }catch(e){
         console.log("Error While trying to fetching data from the DB, Error: ", e)
         res.status(400).send("Error While trying to fetching data from the DB, Error: ", e);
     }
});

app.post('/insertFlights', async (req, res) => {
    const flightsList = req.body.flights;
    console.log(req)
   
    try{
       flightsList.forEach(element => {
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
                element.price,
                element.date,
            ];
            const query = `
                INSERT INTO flights (carrier, destination, origin, origin_country, destination_country, departure_time, landing_time , seats_left, connection, price, date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            connection.query(query, values);
        });
    }catch(e){
        console.log("Error While trying to insert data to the DB, Error: ", e)
        res.status(400).send("Error While trying to insert data to the DB, Error: ", e);
    }
    res.status(200).send(req.body.flights);
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));