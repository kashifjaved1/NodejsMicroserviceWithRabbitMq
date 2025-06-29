import config from './config';

const jwt = require("jsonwebtoken");

export const signToken = async (user: Object) => {
    const token = jwt.sign({ user }, config.JWT_SECRET, {
        expiresIn: config.JWT_LIFETIME
    });

    return token;
}