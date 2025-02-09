import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB = async() => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URN}/${DB_NAME}`)
        console.log(`DB connect to the host ${connectionInstance.connection.host}`)
    }
    catch(error){
        console.log("something went wrong: ", error)
        process.exit(1)
    }
}

export default connectDB