import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js"
dotenv.config();

app.use((err, req, res, next) => {
  console.error("There seems to be an error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

const Listen = async() => {
    try {
       await connectDB()

        app.listen(process.env.PORT || 5000,() => {
            console.log("App listening on Port : ",process.env.PORT);
        })
    } catch (error) {
        console.error("Error at calling the DB function: ",error);
    }
}

Listen();


