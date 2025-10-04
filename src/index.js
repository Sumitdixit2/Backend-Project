import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js"
dotenv.config

const Listen = async() => {
    try {
       await connectDB()

        app.use((err) => {
            console.log("There seems to be an error: ",err);
            throw new Error
        })

        app.listen(process.env.PORT || 5000,() => {
            console.log("App listening on Port : ",process.env.PORT);
        })
    } catch (error) {
        console.error("Error at calling the DB function: ",error);
    }
}

Listen();


