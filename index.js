import express from "express"
import userRoutes from './routes/userRoutes.js'
import mongoose from "mongoose";
import cors from "cors"
import dotenv from "dotenv"



const app  = express();
dotenv.config();
app.use(express.json({limit:"300mb" ,extended:true}))
app.use(express.urlencoded({limit:"300mb" ,extended:true}))

app.use(cors())
const uri =process.env.URI

mongoose.connect(uri).then(()=>{
    console.log("Connected")
}).catch((err)=>{
    console.log(err)
})
app.use(userRoutes)
app.listen(7000,()=>{
    console.log("Running at 7000")
})