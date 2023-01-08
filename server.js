const flights = require('./constants/flights')
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 3001;
const connection = require('./mySQL');

// TODO:
// Create routes for Editing and Deleting from DB.
// Add Admin password
// 

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
                element.seat,
            ];
            const query = `
                INSERT INTO seats (flight_id, seat)
                VALUES (?, ?)
            `;
            connection.query(query, values);
        });
    }catch(e){
        console.log("Error While trying to insert data to the DB, Error: ", e)
        res.status(400).send("Error While trying to insert data to the DB, Error: ", e);
    }
} 
const book_flight = async (flightId, payment_info)=>{
    try{
        const values = [
            flightId,
            payment_info.id.value,
            'card',
            payment_info.phone_number.value,
            payment_info.credit_card.value,
            payment_info.CVV.value,
        ];
        const query = `
            INSERT INTO orders (flight_id, costumer_id,payment_method,phone_number,credit_card,CVV)
            VALUES (?, ?, ?, ?, ?, ?)
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
    const flight_id = req.query.flightId;
    console.log("flight_id ", flight_id);
    try{
            const query = `SELECT seat FROM seats where flight_id = ${flight_id}`;
            const result = connection.query(query, (error, results) => {
                if (error) throw error;
                res.status(200).send(results);
            });
         
     }catch(e){
            console.log("Error While trying to fetching data from the DB (getFlights), Error: ", e)
            res.status(400).send("Error While trying to fetching data from the DB (getFlights), Error: ", e);
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
    const flightId = req.body.flightId
    const payment_info = req.body
    const seats_list = req.body.seats_list;
    await insert_seat(flightId, req.body.seats_list)
    await book_flight(flightId,payment_info )
    try{
        const query = `
            UPDATE flights SET seats_left = seats_left - ${seats_list.length} WHERE flights.id = ${flightId} 
        `;
        connection.query(query);
    }catch(e){
        console.log("Error While trying to insert data to the DB, Error: ", e)
        res.status(400).send("Error While trying to insert data to the DB, Error: ", e);
    }
    res.status(200).send(req.body.flights);
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));