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


const insert_seat = async (flightId, seats_list)=>{
    try{
        seats_list.forEach(element => {
            const values = [
                flightId,
                element,
            ];
            const query = `
                INSERT INTO seats (fligh_id, seat)
                VALUES (?, ?)
            `;
            connection.query(query, values);
        });
    }catch(e){
        console.log("Error While trying to insert data to the DB, Error: ", e)
        res.status(400).send("Error While trying to insert data to the DB, Error: ", e);
    }
} 
const book_flight = async (flightId, payment_details)=>{
    try{
        const values = [
            flightId,
            element,
        ];
        const query = `
            INSERT INTO seats (fligh_id, seat)
            VALUES (?, ?)
        `;
        connection.query(query, values);
    }catch(e){
        console.log("Error While trying to insert data to the DB, Error: ", e)
        res.status(400).send("Error While trying to insert data to the DB, Error: ", e);
    }
} 
console.log(flights);
app.get('/getFlights', async (req, res) => {
    try{
            const query = `SELECT * FROM flights`;
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

app.get('/getTakenSeats', async (req, res) => {
    const flight_id = req.body.flight_info.id;
    try{
            const query = `SELECT seat FROM seats where flight_id = ${flight_id}`;
            const result = connection.query(query, (error, results) => {
                if (error) throw error;
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
app.post('/bookFlight', async (req, res) => {
    const seats_list = req.body.flights;
    const flightId = req.body.flight_info.id
    await insert_seat(seats_list, flightId)
    try{
        seats_list.forEach(element => {
            const values = [
                flightId,
                element,
            ];
            const query = `
                INSERT INTO seats (fligh_id, seat)
                VALUES (?, ?)
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