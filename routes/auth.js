const express = require('express');
const User = require('../models/User');
const argon2 = require('argon2');       // library to hash the password.


const router = express.Router();    // getting a router object to create Authentication routes.


router.post('/register', async (req, res) => {
    try {
        
        console.log(`Body: ${req.body.email}`); // testing if we are getting correct info in request object

        const {email, password} = req.body;     // destructuring body object to get email and password.

        const hashPassword = await argon2.hash(password);

        const newUser = new User({email: email, password: hashPassword});   // create a newUser using User model object

        await newUser.save();           // saving newUser to DB

        res.status(201).json({message:"User registered successfully"}); // sending response code 201, with message


    } catch(err) {
        res.status(500).json({error:"Internal server error"});
        console.log(`error in auth register route: ${err}`)
    }
})

router.post('/login', async(request, res) => {
    try {
        const {email, password} = request.body;

        const user = await User.findOne({email})
        if(!user)
            return res.status(400).json({message: "invalid Username or Password"});

        const isMatch = await argon2.verify(user.password, password);

        if(!isMatch)
            return res.status(400).json({message: "Invalid Username or Password"});

        res.status(200).json({message: "Login Successful"});
    } catch (error) {
        res.status(500).json({message: "Internal server error"})
        console.log(`Error while login ${error.message}`);
    }
});


module.exports = router