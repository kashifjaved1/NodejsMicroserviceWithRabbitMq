import { HttpStatusCode } from "axios";
import { authentication, random } from "../helpers";
import { User } from "../models";
import { getUserByEmail } from "../models/User";

class UserRepository {    
    
    GetUsers = async () => {
        return ['some', 'list', 'of', 'users'];
    }

    AddUser = async (data: any) => {
        try {
            const salt = random();

            const user = new User ({
                name: data.name,
                email: data.email,
                age: data.age,
                authentication: {
                    salt,
                    password: authentication(salt, data.password)
                }
            });

            await user.save();
            
            return user;
        }
        catch (error) {
            return error;
        }        
    }

    GetUser = async (email: string, password: string) => {
        try {
            const user = await getUserByEmail(email).select('+authentication.salt +authentication.password'); // v.v.imp to access the nested object.

            if(!user){
                return {
                    data: null,
                    error: "Invalid email or password."
                };
            }

            const expectedHash = authentication(user.authentication.salt, password);

            if(user.authentication.password != expectedHash){
                return {
                    data: null,
                    error: "Invalid email or password."
                };
            }

            const salt = random();
            user.authentication.sessionToken = authentication(salt, user.id.toString());
            await user.save();

            return {
                data: user,
                error: null
            };
        } 
        catch (error) {
            return {
                data: null,
                error: error
            };
        }
    }
}


export default UserRepository;