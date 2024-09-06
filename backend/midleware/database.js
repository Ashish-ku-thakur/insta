import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({})

let dbConnection = async () => {
    // let connection = await mongoose.connect(process.env.MONGO_URI)
    let connection = await mongoose.connect(process.env.MONGO_URI)

    if (connection) {
        console.log("dbconnected successfully");
    } else {
        console.log("dbconnected is not connected");
    }
}

export default dbConnection
