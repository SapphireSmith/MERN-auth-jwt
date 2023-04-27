import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET

export const auth = async (req, res, next) => {
    try {

        //access authorize header to validate request
        const token = req.headers.authorization;
        const decodedToken = await jwt.verify(token, JWT_SECRET);

        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).send({ err: "Authentication failed" })
    }
}

export const localVariable = async (req,res,next)=>{
    req.app.locals = {
        OTP:null,
        resetSession:false
    }
    next();
}