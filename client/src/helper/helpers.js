import axios from 'axios';
import jwt_decode from 'jwt-decode'

axios.defaults.baseURL = 'http://localhost:5000'


//**Make api request */

//** to get username from token */

export const getUsername = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return Promise.reject('Cannot find token');
    }

    let decode = jwt_decode(token);
    console.log(decode);
    return decode;
}


//authenticate user function
export const authenticate = async (username) => {
    try {
        return await axios.post('api/authenticate', { username });
    } catch (error) {
        return { error: "Usename doesn't exist...!" }
    }
}

//**get user details */
export const getUser = async ({ username }) => {
    try {
        const { data } = await axios.get(`api/user/${username}`)

        return { data };

    } catch (error) {
        return { error: "Password doesn't match" }
    }
}

//register user function
export const registerUser = async (credentials) => {
    try {

        const { data: { msg }, status } = await axios.post('api/register', { ...credentials });

        console.log(msg, status);

        let { username, email } = credentials;

        if (status == 201) {
            axios.post('api/registerMail', { username, userEmail: email, text: msg })
        }

        return Promise.resolve(msg);
    } catch (error) {
        return Promise.reject({ error })
    }
}

//**login function */
export const verifyPasssword = async ({ username, password }) => {
    try {
        if (username) {
            const { data } = await axios.post('api/login', { username, password });
            console.log(data);
            return Promise.resolve({ data })
        }
    } catch (error) {
        return Promise.reject({ error: "Password doesn't Match..!" });
    }
}

//**Update user Profile function */
export const updateUser = async (response) => {
    try {
        const token = localStorage.getItem('token');
        const data = await axios.put('/api/updateuser', response, { headers: { "Authorization": `${token}` } });

        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject({ error: "Couldn't Update Profile...!" })
    }
}

//** Generate OTP function */
export const generateOTP = async (username) => {
    try {
        const { data: { code }, status } = await axios.get('api/generateOTP', { params: { username } });

        //send mail with the OTP
        if (status === 201) {
            let { data: { email } } = await getUser({ username })
            let text = `Your Passowrd recovery OTP is ${code}, Verify and recover your password.`;

            await axios.post('api/registerMail', { username, userEmail: email, text, subject: "Passowrd Recovery OTP" });
        }

        return Promise.resolve(code);
    } catch (error) {
        return Promise.reject({ error })
    }
}

//** Verify OTP function */
export const verifyOTP = async ({ username, code }) => {

    try {
        const { data, status } = await axios.get('api/verifyOTP', { params: { username, code } });

        return Promise.resolve({ data, status });
    } catch (error) {
        return Promise.reject({ error })
    }
}

//**Reset Password function */
export const resetPassword = async ({ username, password }) => {

    try {
        const { data, status } = await axios.put('api/resetPassword', { username, password })
        console.log(data, status);
        return Promise.resolve({ data, status })
    } catch (error) {
        return Promise.reject({ error })
    }
}