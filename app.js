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

import path from 'path';
import { fileURLToPath } from 'url';

// load envirnment variables from .env file by calling config function
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

/**
 * Adding "public" folder at "/static" path. express.static function takes an optional "Options" object,
 * since we don't need it hence not passing any object.
 * There are two ways of doing it.
 * 
 * Option 1: This will serve files from "public" folder at path "/" path.
 * Hence in public/index.html file, while linking CSS file we don't have to prefix '/static/' to the CSS file path.
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Option 2: This will serve the files from "public" folder at "/static/" path.
 * Hence in public/index.html file, while linking CSS file we have to prefix '/static/' to the CSS fiel path
 */
// app.use('/static', express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public','index.html'));
})

app.get('/dashboard', (req,res) => {
    if(req.isAuthenticated()) {
        res.sendFile(path.join(__dirname,'public','dashboard.html'))
    } else {
        res.redirect('/');
    }
})

http.createServer(app).listen(3000, () => {
    console.log("server started at port: 3000")
})