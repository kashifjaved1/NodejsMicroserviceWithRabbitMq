import { Channel } from "amqplib";
import { Express, NextFunction, Request, Response } from "express"
import ClientService from "../service/client-service";
import { PublishMessage, SubscribeMessage } from '../util/broker';
import config from "../config";

const ClientAPI = (app:Express, channel:Channel) => {

    const clientService = new ClientService();
    SubscribeMessage(channel, clientService);

    app.get('/list', async (req:Request & {
        // specify your query params here.
        query: {
            page: number | null;
            dateFrom: Date | null;
            dateTo: Date | null;
        }
    }, res:Response, next:NextFunction) => {
        const clients = await clientService.GetClients();

        const payload = {
            event: null,
            data: clients
        }

        PublishMessage(channel, config.ROUTING_KEY, JSON.stringify(payload));

        return res.status(200).json({
            clients
        }).end();
    });

}

export default ClientAPI;