import { Router } from "express";
import * as controler from '../controler/controlers.js'
import { registerMail } from "../controler/mailer.js";
import { auth, localVariable } from "../middleware/auth.js";

const router = Router()

//**POST meethod */

router.route('/register').post(controler.register);
router.route('/registerMail').post(registerMail);
router.route('/authenticate').post(controler.verifyUser, (req, res) => res.end());
router.route('/login').post(controler.verifyUser, controler.login);


//** GET method */
router.route('/user/:username').get(controler.getUser);
router.route('/generateOTP').get(controler.verifyUser, localVariable, controler.generateOTP);
router.route('/verifyOTP').get(controler.verifyUser, controler.verifyOTP);
router.route('/createResetSession').get(controler.createResetSession);

//**PUT method */
router.route('/updateuser').put(auth, controler.updateUser);
router.route('/resetPassword').put(controler.verifyUser, controler.resetPassword);

export default router;