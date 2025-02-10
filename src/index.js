import dotenv from "dotenv"
import mongoose from "mongoose"
// import { DB_NAME } from "./constants.js"
import connectDB from "./db/index.js"
import { app } from "./app.js"
// import express from "express"
// const app = express()
// app.use(express.json());  // To parse JSON body


dotenv.config({
    path: "./env"
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is running on PORT: ${process.env.PORT}`)
        app.on("error", (error)=>{
            console.log("App is unable to connect with the Database", error)
            throw error
        })
    })
})
.catch((error)=>{
    console.log("MONGODB connection failed !!!", error)
})




/* import express from "express"

const app = express()

(async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URN}/${DB_NAME}`)
        app.on("error", (error)=>{
            console.log("App is unable to connect with the Database", error)
            throw error
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`"App is running on PORT" ${process.env.PORT}`)
        })    }
    catch(error){
        console.log("something went wrong", error)
    }
}) */