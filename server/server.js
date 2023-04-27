import express from 'express'
import cors from 'cors'
import morgan from 'morgan';
import connect from './database/connection.js';
import router from './router/route.js';

const app = express();

app.use(express.json())
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-power-by') //less hackers know aabout our stack
//**API routes */
app.use('/api', router)

const port = 5000;

//**HTTP get requiest */

app.get('/', (req, res) => {
    res.status(201).json("Home route");
})


connect().then(() => {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    })
}).catch((error) => {
    console.log(error);
    console.log("Invalid database connection...!");
})
