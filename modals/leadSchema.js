import mongoose from "mongoose";
const leadSchema=mongoose.Schema({
   phone:String,
   feed:[Object],
   status:Boolean,
   date:String,
   name:String,
   today:Boolean,
   tags:[String],
})
export const leadModel = mongoose.model("lead",leadSchema)