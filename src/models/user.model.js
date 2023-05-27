import mongoose from "mongoose";

const userCollection =  'users'

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role: String
});

mongoose.set('strictQuery', false);
const userModel = mongoose.model(userCollection, userSchema);

export default userModel



