/**
 * Setup a HTTP server using express app. Add get method for
 * home ('/') route
 */
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');  // body parser will help in reading the body of request object
const router = require('./routes/auth');
const adminRoutes = require('./routes/admin');

require('dotenv').config(); // loading variables from .env file

console.log(process.env.SERVER_PORT)

const app = express();

app.use(bodyParser.json())         // In our Lab, we are sending json object in our body.

app.use('/api/auth', router)        // adding auth router as middleware in express app to handle all request at /api/auth route

app.use('/api/admin', adminRoutes)  // adding adminRoutes as middleware in express app to handle all request by admin user.

app.get('/', (req, res) => {
    res.send("hello world");
})

// mongoose.connect(
//     process.env.DB_URL+
//     '/'+
//     process.env.DATABASE_NAME
// ).then(() => console.log("Connected to MongoDB"))
// .catch((err) => console.log(`error in connecting to mongoDB: ${err}`))


async function connectToDB() {
    try {
        await mongoose.connect(process.env.DB_URL+'/'+process.env.DATABASE_NAME)
        console.log("Connected to MongoDB")
    } catch(err) {
        console.log(`error in connecting to mongoDB: ${err}`)
    }
}



http.createServer(app).listen(process.env.SERVER_PORT, () => {
    console.log(`HTTP server is running at port ${process.env.SERVER_PORT}`);
    connectToDB();
})