import mongoose from "mongoose";
const userSchema = mongoose.Schema({
    fname:String,
    lname:String,
    email:String,
    phone:String,
    password:String,
    pos:Number,
    total:Number,
    target:Number,
    done:Number,
    leadList:[Object],
    current:[Object],
})
export const userModal = mongoose.model("user",userSchema)
