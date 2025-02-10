import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: "16kb"
}))

// express.urlencoded will encode the your url 
// and with the use of extended command the objects in the url will futher divided into objects. this will nested ur url
app.use(express.urlencoded({
    extended:true, 
    limit:"16kb"
}))

//express.static will store the files into ur local sever or ur system similar to the "public" file we have in the backend folder
app.use(express.static("public"))
app.use(cookieParser())


//routes
import userRouter from './routes/user.routes.js'

//routes declaration
app.use("/api/v1/users", userRouter)
export { app }