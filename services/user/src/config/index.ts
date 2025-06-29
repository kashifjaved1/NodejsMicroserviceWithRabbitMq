import dotenv from 'dotenv';

if(process.env.NODE_ENV !== 'production') {
    const cfg = `./.env.${process.env.NODE_ENV}`;
    dotenv.config({path: cfg});
}else {
    dotenv.config();
}

export default {
    PORT: process.env.PORT,
    DB: process.env.DB,
    MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL || '',
    EXCHANGE_NAME: 'MICROSERVICES-BASE',
    QUEUE_NAME: 'USER-QUEUE',
    ROUTING_KEY: 'USER-ROUTING-KEY',
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_LIFETIME: process.env.JWT_LIFETIME
}