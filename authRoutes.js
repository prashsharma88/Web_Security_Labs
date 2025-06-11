/**
 * This file will have google authentication login and the handling of callback url
 */

import { Router } from "express";
import passport from "./auth/passport.js";

const router = Router();

/**
 * /auth/google route to handle "login with google" option
 */
router.get('/auth/google', 
    passport.authenticate('google', {scope: ['profile', 'email']})
)


/**
 * In the 'get' handler for callback url we are adding passport middleware to verify the 
 * response sent by google. If authentication fails the faliureRedirect url will be used.
 */
router.get('/auth/google/callback', 
    passport.authenticate('google', {failureRedirect: '/'}),
    (req, res) => {
        res.redirect('/dashboard');
    }
)

router.get('/logout', (req,res) => {
    req.logOut(() => {
        res.redirect('/')
    })
})

export default router;