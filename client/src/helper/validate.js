import toast from "react-hot-toast";
import { authenticate } from "./helpers";

/** Validate login page username */
export async function usernameValidate(values) {
    const errors = usernameVerify({}, values);

    if (values.username) {
        const {status} = await authenticate(values.username);

        if (status !== 200) {
            errors.exist = toast.error('User does not exist')
        }
    }
    return errors
}

//** Validate Username */
function usernameVerify(error = {}, values) {
    if (!values.username) {
        error.username = toast.error("Username Required...!");
    } else if (values.username.includes(" ")) {
        error.message = toast.error("Invalid Username...!")
    }

    return error
}

//** Validate password */

export async function passwordValidate(values) {
    const errors = passwordVerify({}, values);

    return errors
}

//**Validate password  */

function passwordVerify(error = {}, values) {

    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (!values.password) {
        error.password = toast.error("Password Required");
    } else if (values.password.includes(" ")) {
        error.password = toast.error("Password Required");
    } else if (values.password.length < 4) {
        error.password = toast.error("Password must be 4 characters long");
    } else if (!specialChars.test(values.password)) {
        error.password = toast.error("Password must have special character");
    }

    return error
}

//** Validate reset Password */

export const resetPaswordValidation = async (values) => {
    const errors = passwordVerify({}, values);

    if (values.password !== values.confirm_pwd) {
        errors.exit = toast.error('Password Not Match.')
    }
    return errors
}

//** Validate Register form */

export const registerValidation = (values) => {
    const errors = usernameVerify({}, values);
    passwordVerify(errors, values)
    emailVerify(errors, values)

    return errors;
}


const emailVerify = (error = {}, values) => {
    if (!values.email) {
        error.email = toast.error("Email Required...!");
    } else if (values.email.includes(" ")) {
        error.email = toast.error("Wrong Email....!")
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        error.email = toast.error('Invalid email address');
    }

    return error
}

//** Profile Validation */

export const profileValidation = (values) => {
    const errors = emailVerify({}, values);

    return errors;
} 