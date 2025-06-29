import { Channel } from "amqplib";
import { Express, NextFunction, Request, Response } from "express"
import ProductService from "../service/product-service";
import { SubscribeMessage, PublishMessage } from "../util/broker";
import config from "../config";

const ProductAPI = (app:Express, channel:Channel) => {

    const productService = new ProductService();
    SubscribeMessage(channel, productService);

    app.get('/list', async (req:Request & {
        // specify your query params here.
        query: {
            page: number | null;
            dateFrom: Date | null;
            dateTo: Date | null;
        }
    }, res:Response, next:NextFunction) => {
        const products = await productService.GetProducts();

        const payload = {
            event: null,
            data: products
        }

        PublishMessage(channel, config.ROUTING_KEY, JSON.stringify(payload));

        return res.status(200).json({
            products
        }).end();
    });
}

export default ProductAPI;