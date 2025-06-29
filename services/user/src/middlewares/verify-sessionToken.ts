import express, { NextFunction } from 'express';
import { getUserBySessionToken } from '../database/models/User';

export const verifySessionToken = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const sessionToken = req.cookies['X-AUTH'];

        if (sessionToken == "undefined") {
            return res.status(403).json({ msg: 'Forbidden: No token' });
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if (!existingUser) {
            return res.status(403).json({ msg: 'Forbidden: Invalid token' });
        }

        (req as any).identity = existingUser;

        return next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
};