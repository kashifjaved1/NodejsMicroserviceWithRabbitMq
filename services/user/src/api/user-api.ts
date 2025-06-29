import { Channel } from "amqplib";
import { Express, NextFunction, Request, Response } from "express";
import UserService from "../service/user-service";
import { SubscribeMessage, PublishMessage } from "../util/broker";
import { signToken } from "../sign-token";
import config from "../config";

const UserAPI = (app:Express, channel:Channel) => {

    const userService = new UserService();
    SubscribeMessage(channel, userService);

    app.get('/list', async (req:Request & {
        // specify your query params here.
        query: {
            page: number | null;
            dateFrom: Date | null;
            dateTo: Date | null;
        }
    }, res:Response, next:NextFunction) => {
        const users = await userService.GetUsers();

        const payload = {
            event: null,
            data: users
        }

        PublishMessage(channel, config.ROUTING_KEY, JSON.stringify(payload));

        return res.status(200).json({
            users
        }).end();
    });

    app.post('/register', async (req: Request & 
        {
            // specify your request body here, e.g. register user body:
            body: {
                name: string,
                age: number,
                email: string,
                password: string
            }
        }, 
        res: Response, next: NextFunction) => {
            try {
                console.log("here");
                const {name, age, email, password} = req.body;

                if(!name || !age || !email || !password) {
                    return res.status(400).json({
                        error: "All fields are required."
                    });
                }

                const result = await userService.RegisterUser(req.body);
                console.log("result: ", result);

                return res.status(201).json({ 
                    message: "User registered successfully"
                });
            } 
            catch (error) {
                return res.status(500).json({ 
                    error: "Internal Server Error"
                });
            }
        }
    );

    app.post('/login', async (req: Request & 
        {
            // specify your request body here, e.g. register user body:
            body: {
                email: string,
                password: string
            }
        }, 
        res: Response, next: NextFunction) => {
            try {
                const {email, password} = req.body;

                if(!email || !password) {
                    return res.status(400).json({
                        error: "All fields are required."
                    });
                }

                const result = await userService.FetchUser(email, password);
                const user = result.data;

                const userData = {
                    name: user?.name,
                    email: user?.email,
                    age: user?.age
                }

                // jwt token 👇
                var token = await signToken(userData);
                res.header('Authorization', `Bearer ${token}`);

                // session token 👇
                // res.cookie('X-AUTH', user?.authentication.sessionToken, {
                //     domain: 'localhost', // This specifies the domain for which the cookie is valid. In this case, the cookie will only be accessible for requests sent to localhost.
                //     path: '/', // The path defines the scope of the cookie. This means the cookie will be sent with requests made to any URL under the root / (i.e., it will be sent with every request to the site).
                //     httpOnly: true,  // Prevents client-side access to the cookie
                //     secure: process.env.NODE_ENV === 'production',  // Only set Secure in production (i.e., when using HTTPS)
                //     sameSite: 'lax',  // Helps prevent CSRF attacks (you can set it to 'None' for cross-site requests or 'Lax' for // allowing cookies for same-site requests and cross-origin if necessary)
                //     maxAge: 1000 * 60 * 60 * 24,  // Cookie expiry time (in milliseconds)
                // });

                return res.json({
                    user: userData,
                    token
                }).end();
            } 
            catch (error) {
                return res.status(500).json({ 
                    error: "Internal Server Error"
                });
            }
        }
    );
}

export default UserAPI;