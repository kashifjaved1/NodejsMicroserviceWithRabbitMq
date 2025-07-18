import amqplib, { Channel, ConsumeMessage } from 'amqplib';
import config from '../config';
import ProductService from '../service/product-service';

const MESSAGE_BROKER_URL = config.MESSAGE_BROKER_URL;
const EXCHANGE_NAME = config.EXCHANGE_NAME;
const QUEUE_NAME = config.QUEUE_NAME;
const ROUTING_KEY = config.ROUTING_KEY;

export const CreateChannel = async () => {
    try {        
        const connection = await amqplib.connect(MESSAGE_BROKER_URL);
        const channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, 'direct');
        return channel;
    }
    catch(err) {
        throw err;
    }
}

export const PublishMessage = async (channel: Channel, routing_key: string, message: any) => {
    console.log('Message published');
    try {
        channel.publish(EXCHANGE_NAME, routing_key, Buffer.from(message));
    }
    catch(err) {
        throw err;
    }
}

export const SubscribeMessage = async (channel: Channel, service: ProductService) => {
    const queue = await channel.assertQueue(QUEUE_NAME);
    channel.bindQueue(queue.queue, EXCHANGE_NAME, ROUTING_KEY);
    channel.consume(queue.queue, (data:ConsumeMessage | null) => {
        if(data) {
            console.log('Consumer received data');
            channel.ack(data); // acknowledging back to producer that data is successfully consumed.
        }
    });
}