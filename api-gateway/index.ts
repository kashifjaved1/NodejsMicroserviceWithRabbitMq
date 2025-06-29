import express, { Response, Request } from 'express';
import proxy from 'express-http-proxy';
import cors from 'cors';
import config from './config';
import { verifySessionToken, verifyJwtToken } from '../services/user/src/middlewares';
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Public routes.
app.use('/user', proxy(config.USER_SERVICE_URL));

// Protected routes.
app.use('/order', verifyJwtToken, proxy(config.ORDER_SERVICE_URL));
app.use('/product', verifyJwtToken, proxy(config.PRODUCT_SERVICE_URL));
app.use('/client', verifySessionToken, proxy(config.CLIENT_SERVICE_URL));

app.use('/', (req:Request, res:Response) => {
    return res.status(200).json({msg: 'No endpoint specified'});
})

app.listen(config.PORT, ()=>{
    console.log(`Gateway running at port ${config.PORT}`);
}).on('error', (err:Error) => {
    console.log(err);
    process.exit();
});