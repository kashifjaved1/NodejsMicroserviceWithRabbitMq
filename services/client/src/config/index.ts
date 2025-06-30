import dotenv from 'dotenv';

if(process.env.NODE_ENV == 'development' || process.env.NODE_ENV === 'development') {
    const cfg = `../.env.${process.env.NODE_ENV}`;
    dotenv.config({path: cfg});
}else {
    dotenv.config();
}

export default {
    PORT: process.env.PORT,
    DB: process.env.DB,
    MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL || '',
    EXCHANGE_NAME: process.env.EXCHANGE_NAME || '',
    QUEUE_NAME: process.env.QUEUE_NAME || '',
    ROUTING_KEY: process.env.ROUTING_KEY || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    JWT_LIFETIME: process.env.JWT_LIFETIME || ''
}