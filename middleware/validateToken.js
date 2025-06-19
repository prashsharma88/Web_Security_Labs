import jwt from 'jsonwebtoken';

const validateJWT = (req, res, next) => {
    console.log("validating token")
    const token = req.header('Authorization').replace('Bearer', '');
    if(!token) {
        return res.status(401).json({
            message: "No token, authorization denied",
        })
    }
    try {
        const user = jwt.decode(token, process.env.JWT_SECRET); // extract user info from token
        req.user = user;                                        // put user info in req object to easy access
        next();                                                 // calling next middleware in the chain
    } catch(err) {
        res.status(500).json({message: "internal server error"});
        console.log(err);
    }
}

export default validateJWT;