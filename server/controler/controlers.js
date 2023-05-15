import userModel from "../model/user.model.js";
import OTP from 'otp-generator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();


const JWT_SECRET = 'jwtsceret';


//*** midleware for verify user */

export const verifyUser = async (req, res, next) => {

    try {
        const { username } = req.method === 'GET' ? req.query : req.body;

        //check the user existance
        let exist = await userModel.findOne({ username });
        if (!exist) return res.status(404).send({ error: "can't find the user!" });
        next();

    } catch (error) {
        return res.status(404).send({ err: "Authentication error" });
    }
}


//POST
export const register = async (req, res) => {
    try {

        const { username, password, email, profile } = req.body;

        //check the user is existing
        const existUsername = userModel.findOne({ username })
            .then((user) => {
                if (user) throw { error: "Please use unique username" };
            })
            .catch((err) => {
                throw new Error(err);
            });

        //check for existing email
        const existEmail = userModel.findOne({ email })
            .then((email) => {
                if (email) throw { error: "please use unique email" };
            })
            .catch((err) => {
                throw new Error(err);
            });

        //if not then hashig password for registering
        Promise.all([existUsername, existEmail])
            .then(() => {
                if (password) {
                    bcrypt.hash(password, 10)
                        .then((hashedPassword) => {
                            const user = new userModel({
                                username,
                                password: hashedPassword,
                                profile: profile || '',
                                email
                            });

                            //return save result as a response
                            user.save()
                                .then((result) => {
                                    res.status(201).send({ msg: "User Registered successfully" });
                                })
                                .catch((error) => {
                                    res.status(500).send({ error: "Can't register user" })
                                })
                        }).catch((error) => {
                            return res.status(500).send({
                                error: "Enable to hashed password"
                            })
                        })
                }
            }).catch((error) => {
                return res.status(500).send({ error: 'Please try again later' })
            })
    } catch (error) {
        return res.status(500).send(error);
    }
}


//POST
export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        //check for user in the db
        const user = await userModel.findOne({ username });

        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        //check the pwd
        const passwordCheck = await bcrypt.compare(password, user.password);

        if (!passwordCheck) {
            return res.status(400).send({ error: "Incorrect Password" });
        }

        //Create JWT token
        const token = jwt.sign({
            userId: user._id,
            username: user.username
        }, JWT_SECRET, { expiresIn: '1hr' });

        return res.status(201).send({
            msg: "Login Successful...!",
            username: user.username,
            token
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: "Server Error" });
    }
};


//GET
export const getUser = async (req, res) => {
    const { username } = req.params;

    try {
        if (!username) return res.status(501).send({ err: "Invalid Username" });

        const user = await userModel.findOne({ username }).select("-password");

        if (!user) {
            return res.status(404).send({ error: " Couldn't find the user " })
        }

        return res.status(200).send(user);

    } catch (error) {
        console.error(`Error fetching user: ${error}`);
        return res.status(500).send({ error: "Server Error" });
    }
}

//PUT 
export const updateUser = async (req, res) => {
    try {
        // const id = req.query.id;

        const { userId } = req.user;

        if (userId) {
            const body = req.body;

            //update the record
            userModel.updateOne({ _id: userId }, body)
                .then(() => {
                    return res.status(201).send({ msg: "Record Updated" })
                }).catch((err) => {
                    console.log(err);
                    return res.status(401).send({ error: "User Not Found" })
                })
        } else {
            return res.status(401).send({ err: 'invalid user id' });
        }
    } catch (error) {

        return res.status(401).status({ error: "Server error...!" })
    }
}

//GET
export const generateOTP = async (req, res) => {
    req.app.locals.OTP = await OTP.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    })
    res.status(201).send({ code: req.app.locals.OTP })
}

//GET
export const verifyOTP = async (req, res) => {
    const { code } = req.query;

    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null
        req.app.locals.resetSession = true

        return res.status(201).send({ msg: "OTP verified..." })
    }

    res.status(401).send({ error: "Invalid OTP" });
}

//GET
// This function creates a reset session and allows access to the route only once
export const createResetSession = async (req, res) => {

    // Check if there is already an active reset session
    if (req.app.locals.resetSession) {
        req.app.locals.resetSession = false; // Set the reset session flag to false so that it can't be used again
        return res.status(201).send({ flag: req.app.locals.resetSession }); // Return a success message with status 201
    }

    // If there is no active reset session, return an error message with status 440
    return res.status(440).send({ error: "Session expired!" });
}

//PUT
export const resetPassword = async (req, res) => {
    try {

        if (req.app.locals.resetSession) return res.status(440).send({ error: "Session expired!" })

        const { username, password } = req.body;

        // Find the user based on the given username
        const user = await userModel.findOne({ username });

        if (!user) {
            return res.status(404).send({ msg: "User not found" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password
        await userModel.updateOne({ username }, { password: hashedPassword });

        return res.status(201).send({ msg: "Record Updated.." });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ msg: "Internal server error" });
    }
}