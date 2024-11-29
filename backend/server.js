import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./src/db/connect.js"; 
import cookieParser from "cookie-parser";
import fs from "node:fs";
import router from "./src/routes/userRoutes.js";
import errorHandler from "./src/middleware/errorHandler.js";



dotenv.config();


const port = process.env.PORT || 8000;

const app = express();

//  some middleware
app.use(cors({
    origin: process.env.CLIENT_URL,

    // working with cookies
    credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// error handler middleware
app.use(errorHandler);

//routes
const routeFiles = fs.readdirSync("./src/routes");

routeFiles.forEach((file) => {
  // use dynamic import
  import(`./src/routes/${file}`)
    .then((route) => {
      app.use("/api/v1", route.default);
    })
    .catch((err) => {
      console.log("Failed to load route file", err);
    });
});

 
const server = async () => {
    try {
        await connect();
  
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    } catch (error) {
      console.log("Failed to start server.....", error.message);
      process.exit(1);
    }
  };
  
  server();