import mongoose, { Connection } from "mongoose";
import { DB_NAME } from "./constants";


const connectDB = async () => {
    try {
        const response = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${response}`);
    } catch (error) {
        console.error("ERROR: ",error);
        process.exit(1)
    }
}

export default connectDB;