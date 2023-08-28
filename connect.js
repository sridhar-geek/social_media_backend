import mongoose from "mongoose";

export const connectToDb = (url)=> {
    mongoose.connect(url);
    console.log("Connected to Database")
}