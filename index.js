import express from "express"
import userRoutes from './routes/userRoutes.js'
import mongoose from "mongoose";
import cors from "cors"
const app  = express();
app.use(express.json({limit:"300mb" ,extended:true}))
app.use(express.urlencoded({limit:"300mb" ,extended:true}))

app.use(cors())
const uri ="mongodb+srv://skk180509:r5zmhMf8w2iMib1L@cluster0.nsecd1l.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(uri).then(()=>{
    console.log("Connected")
}).catch((err)=>{
    console.log(err)
})
app.use(userRoutes)
app.listen(7000,()=>{
    console.log("Running at 7000")
})