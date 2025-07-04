import { Request, Response, NextFunction } from "express";
import config from '../config';

const jwt = require("jsonwebtoken");

export const verifyJwtToken = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.header('Authorization');
    if (!auth) {
        return res.status(401).send('Access denied!!!')
    }

    let token = auth.split(' ')[1];
    if (!token) {
        return res.status(401).send('Access denied!!!')
    }

    try {
        jwt.verify(token, config.JWT_SECRET);
        next();
    } catch (err) {
        return res.status(400).send('Invalid token!!!');
    }
}