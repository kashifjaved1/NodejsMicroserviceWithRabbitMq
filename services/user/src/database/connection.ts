import mongoose from 'mongoose';
import config from '../config';

const dbConnection = async () => {
    console.log('Connecting to DB');

    const dbURI = config.DB;    
    if(!dbURI || dbURI.length < 1) {
        console.log('No database URI found');
        return;
    }
    
    const connection = (await mongoose.connect(dbURI as string)).connection;

    connection.on('connected', () => console.log("connected."));
    connection.on('error', () => console.log("connection error."));

    connection.once('connection', () => {
        console.log('DB connection successful.');
    });

    return connection;
}

export default dbConnection;