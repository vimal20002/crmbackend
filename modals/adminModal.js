import mongoose from "mongoose";
const adminSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    adminPassword:String,
    idx:Number,
    token:String
})
export const adminModel = mongoose.model("admin",adminSchema)