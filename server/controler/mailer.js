import nodeMailer from 'nodemailer'
import mailGen from 'mailgen';
import dotenv from 'dotenv';
dotenv.config();

const email = process.env.EMAIL;
const password = process.env.PASSWORD;


let nodeConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: email, // generated ethereal user
        pass: password, // generated ethereal password
    }
}

let transporter = nodeMailer.createTransport(nodeConfig);


let mailGenerator = new mailGen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: "https://mailgen.js/"
    }
})


//POST https://localhost:5000/api/registerMail

//given data inside body
// {
//     "username":"Kannan@123",
//     "userEmail":"ssapphire527@gmail.com",
//     "subject":"Testing the email",
//     "text":"Hello Sapphire here....!"
// }


// erro showing

// {
//     "err": {
//         "code": "EAUTH",
//         "response": "535 Authentication failed",
//         "responseCode": 535,
//         "command": "AUTH PLAIN"
//     }
// }

//code

export const registerMail = async (req,res) => {
    const { username, userEmail, text, subject } = req.body;

    //body of the email
    var email = {
        body: {
            name: username,
            intro: text || "Welcome its a sample email using node mailer and mail generator",
            outro: "need help,or have questions? Just reply to this email"
        }
    }

    var emailBody = mailGenerator.generate(email);

    let message = {
        from: email,
        to: userEmail,
        subject: subject || "Register successfull...!",
        html: emailBody,
    }

    transporter.sendMail(message)
        .then(() => {
            return res.status(201).send({ msg: "You should reseave an email from us" });
        }).catch((err) => {
            return res.status(500).send({ err });
        })
}
