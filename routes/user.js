import express from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'

const userRouter = express.Router();

// Route to register new user
userRouter.post('/register', async (req, res) => {
    const {username, password, role, department} = req.body;

    // generate hash password
    const hashPassword = await argon2.hash(password);

    // generate unique userId
    const randomNum = Math.floor(Math.random() * 1000);
    const userId = Date.now().toString().slice(7) + randomNum;

    try {
        const newUser = new User({username, userId, hashPassword, role, department});
        await newUser.save();       // saving new user info in DB

        res.status(201).json({
            message: 'User Created',
            user: {
                username: newUser.username,
                userId: newUser.userId,
                role: newUser.role,
                department: newUser.department,
            }
        });
    } catch(err) {
        res.status(500).json({message: "Internal server error"});
        console.log(err);
    }
});

// Route to login user
userRouter.get('/login', async (req, res) => {

    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if(!user) {
            return res.status(400). json({message: "invalid username or password"});
        }
        const isPasswordValid = argon2.verify(user.hashPassword, password);
        if(!isPasswordValid) {
            return res.status(400). json({message: "invalid username or password"});
        }
        const jwtToken = jwt.sign(
            {
                userId: user.userId,
                username: user.username,
                department: user.department,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        res.status(200).json({
            message: 'login successful',
            authToken: jwtToken,
        });

    } catch(err) {
        res.status(500).json({message:'Internal server error'});
        console.log(err);
    }
})

export default userRouter;