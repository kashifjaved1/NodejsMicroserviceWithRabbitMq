import express, { Express, Request, Response, NextFunction } from "../node_modules1/@types/express";
import cors from '../node_modules1/@types/cors';
import { Channel } from "../node_modules1/@types/amqplib";
import OrderAPI from "./api/order-api";

const ExpressLogic = async (app:Express, channel:Channel) => {

    app.use(express.json({ limit: '1mb' }));
    app.use(cors());

    OrderAPI(app, channel);

    app.use('/', (req:Request, res:Response, next:NextFunction)=>{
        return res.status(200).json({msg: 'Product service response'});
    });
    
}

export default ExpressLogic;