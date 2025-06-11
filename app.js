/**
 * Create a folder (GoogleOAuth_Lab) for this lab, cd into that folder
 * initialize a npm project (npm init -y) in that folder
 * Create a simple express app (npm install express) to handle get request on home ('/') route
 */

import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import { config } from 'dotenv';
import http from 'http';
import passport from './auth/passport.js';
import router from './authRoutes.js';

// load envirnment variables from .env file by calling config function
config();

const app = express();
app.use(helmet());

// adding session configuration using express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}
}))

/**
 * Adding passport as middleware in express app
 */
app.use(passport.initialize());
app.use(passport.session());

/**
 * Adding authentication routes to my express app
 */
app.use(router)

app.get('/', (req, res) => {
    res.send("<h1>Welcome to GoogleOAuth Lab</h1>");
})

app.get('/dashboard', (req,res) => {
    if(req.isAuthenticated()) {
        res.send("<h1>User is authenticated, Yayyy!!</h1>");
    } else {
        res.redirect('/');
    }
})

http.createServer(app).listen(3000, () => {
    console.log("server started at port: 3000")
})