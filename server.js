const flights = require('./constants/flights')
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 3001;
const env = require('dotenv')
const connection = require('./mySQL');
const bcrypt = require('bcryptjs')
const CryptoJS = require('crypto-js')

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
const salt = "etamelidron"
console.log(salt)

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

app.post('/getCreditCard', async (req, res) => {
    const body = req.body;
    let resu;
    try{
        const query = `SELECT password FROM payment_data WHERE userId=${body.id.value}`;
        const result =  connection.query(query, (error, results) => {
            if (error) throw error;
            resu = results;
            // res.status(200).send(results);

            if(results.length === 0){
                if(body.credit_card.value.length < 8) res.status(200).send("Please insert credit card number");
                const encryptCard = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(body.credit_card.value), salt)
                const encryptPassword = CryptoJS.AES.encrypt(body.password, salt);
                const values = [
                    body.id.value,
                    encryptCard.toString(),
                    encryptPassword.toString(),
                ];
                const query = `
                    INSERT INTO payment_data (userId, creditcard, password)
                    VALUES (?, ?, ?)
                `;
                connection.query(query, values);
                res.status(200).send("Payment data has saved succesfully")
                return;
            }
            else{
                const decrypted = CryptoJS.AES.decrypt(results[0].password, salt);
                console.log(results[0].password, decrypted);
                console.log(body.password, decrypted);
                if(body.password === decrypted.toString(CryptoJS.enc.Utf8)){
                    const query = `SELECT creditcard FROM payment_data WHERE userId=${body.id.value}`;
                    const result = connection.query(query, (error, results) => {
                        if (error) throw error;
                        resu = results;
                        res.status(200).send(CryptoJS.AES.decrypt(resu[0].creditcard, salt).toString(CryptoJS.enc.Utf8));
                    });
                }else{
                    res.status(200).send("Wrong Passwrod!");
                }
            }
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

app.post('/insertFlight', async (req, res) => {
    const flightsList = req.body.formFields;
    console.log(req.body.formFields)
   
    try{
        const values = [
            flightsList.carrier,
            flightsList.destination,
            flightsList.origin,
            flightsList.origin_country,
            flightsList.destinaton_country,
            flightsList.departure_time,
            flightsList.landing_time,
            flightsList.seats_quantity,
            0,
            flightsList.price,
            flightsList.date,
        ];
        console.log(values);
        const query = `
            INSERT INTO flights (carrier, destination, origin, origin_country, destination_country, departure_time, landing_time , seats_left, connection, price, date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        connection.query(query, values);
    }catch(e){
        console.log("Error While trying to insert data to the DB, Error: ", e)
        res.status(400).send("Error While trying to insert data to the DB, Error: ", e);
    }
    res.status(200).send("YAYAYA");
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
app.post('/editFlight', async (req, res) => {
    const flightId = req.body.formFields.flightId
    const flight_info = req.body.formFields
    console.log(req.body.formFields)
    // const values = [
    //     flight_info.carrier,
    //     flight_info.destination,
    //     flight_info.origin,
    //     flight_info.origin_country,
    //     flight_info.destination_country,
    //     flight_info.departure_time,
    //     flight_info.landing_time,
    //     flight_info.seat_left,
    //     flight_info.connection,
    //     flight_info.price,
    //     flight_info.date,
    // ];
    try{
        const query = `
            UPDATE flights SET carrier='${flight_info.carrier}', destination='${flight_info.destination}', origin='${flight_info.origin}', origin_country='${flight_info.origin_country}', destination_country='${flight_info.destinaton_country}', departure_time='${flight_info.departure_time}', landing_time='${flight_info.landing_time}', seats_left=${flight_info.seats_quantity}, connection=0, price=${flight_info.price}, date=${flight_info.date} WHERE flights.id = ${flight_info.flightId} 
        `;
        connection.query(query);
    }catch(e){
        console.log("Error While trying to insert data to the DB, Error: ", e)
        res.status(400).send("Error While trying to insert data to the DB, Error: ", e);
    }
    res.status(200).send(req.body);
});

app.post('/deleteFlight', async (req, res) => {
    const flightId = req.body.formFields.flightId
    console.log(req.body.formFields)
    // const values = [
    //     flight_info.carrier,
    //     flight_info.destination,
    //     flight_info.origin,
    //     flight_info.origin_country,
    //     flight_info.destination_country,
    //     flight_info.departure_time,
    //     flight_info.landing_time,
    //     flight_info.seat_left,
    //     flight_info.connection,
    //     flight_info.price,
    //     flight_info.date,
    // ];
    try{
        const query = `
            DELETE FROM flights WHERE id=${flightId}
        `;
        connection.query(query);
    }catch(e){
        console.log("Error While trying to insert data to the DB, Error: ", e)
        res.status(400).send("Error While trying to insert data to the DB, Error: ", e);
    }
    res.status(200).send(req.body);
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));