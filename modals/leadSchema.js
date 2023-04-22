import mongoose from "mongoose";
const leadSchema=mongoose.Schema({
   phone:String,
   feed:[Object],
   status:Boolean,
   date:String,
   name:String
})
export const leadModel = mongoose.model("lead",leadSchema)