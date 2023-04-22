import mongoose from "mongoose";
const userSchema = mongoose.Schema({
    fname:String,
    lname:String,
    email:String,
    phone:String,
    pos:Number,
    neg:Number,
    target:Number,
    done:Number,
})
export const userModal = mongoose.model("user",userSchema)
