import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import userRouter from "./routes/user.routes.js";

const app = express();

// Security headers
if (process.env.NODE_ENV === "development") {
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'", "http://localhost:8000"],
        connectSrc: ["'self'", "http://localhost:8000", process.env.CORS_ORIGIN || ""],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'"]
      }
    })
  );
}



// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Static files & cookies
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRouter);

export default app;
