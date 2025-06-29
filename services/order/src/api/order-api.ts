import { Express, NextFunction, Request, Response } from "express";
import { Channel } from "amqplib";
import OrderService from "../service/order-service";
import { PublishMessage, SubscribeMessage } from "../util/broker";
import config from "../config";

const OrderAPI = (app: Express, channel: Channel) => {

    const orderService = new OrderService();
    SubscribeMessage(channel, orderService);

    app.get('/list', async (req:Request & {
        // specify your query params here.
        query: {
            page: number | null;
            dateFrom: Date | null;
            dateTo: Date | null;
        }
    }, res:Response, next:NextFunction) => {
        const orders = await orderService.GetOrders();

        const payload = {
            event: null,
            data: orders
        };

        PublishMessage(channel, config.ROUTING_KEY, JSON.stringify(payload));        

        return res.status(200).json({
            clients
        }).end();
    });
}

export default OrderAPI;