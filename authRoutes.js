/**
 * This file will have google authentication login and the handling of callback url
 */

import { Router } from "express";
import passport from "./auth/passport.js";

const router = Router();

router.get('/auth/google', 
    passport.authenticate('google', {scope: ['profile', 'email']})
)

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