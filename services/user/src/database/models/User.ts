import mongoose, { Document, Schema } from "mongoose";
import User from "./User";

interface IUser extends Document {
    name: string,
    age: number,
    email: string,
    // password: string,
    authentication:{
        password: string,
        salt: string,
        sessionToken: string
    }    
}

const UserSchema: Schema = new Schema({
    name: {type: String, required: true},
    age: {type: Number, required: true},
    email: {type: String, required: true},
    // password: {type: String, required: true},
    authentication:{
        password: {type: String, required: true, select: false},
        salt: {type: String, select: false},
        sessionToken: {type: String, select: false}
    }
})

export default mongoose.model<IUser>("User", UserSchema);

export const getUserByEmail = (email: string) => User.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) => User.findOne({ sessionToken });