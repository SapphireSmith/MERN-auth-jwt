import express from 'express'
import cors from 'cors'
import morgan from 'morgan';
import connect from './database/connection.js';
import router from './router/route.js';
import bodyParser from 'body-parser';


const app = express();


app.use(bodyParser.json({ limit: '5mb' }));
app.use(express.json())
app.use(cors({
    origin:'https://mern-auth-2kq7.onrender.com'
}));
app.use(morgan('tiny'));
app.disable('x-power-by') //less hackers know aabout our stack
//**API routes */
app.use('/api', router)


//**HTTP get requiest */

app.get('/', (req, res) => {
    res.sendStatus(200)
})

connect().then(() => {
    app.listen(4000, () => {
        console.log(`Server running on http://localhost:4000`);
    })
}).catch((error) => {
    console.log(error);
    console.log("Invalid database connection...!");
})
