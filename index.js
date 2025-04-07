import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./utils/dbconnection.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route.js";
import tweetRoute from "./routes/tweet.route.js"
import cors from "cors";

dotenv.config({
  path: "./.env",
});

const corsOptions = {
  origin: "https://twitter-clone-coral.vercel.app",
  credentials: true
}

databaseConnection();
const app = express();

// middlewear

app.use(express.urlencoded({
    extended:true
}))
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions))


// api

app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet", tweetRoute);



app.listen(process.env.PORT || 4000, () => {
  console.log(`server is listening on this ${process.env.PORT}`);
});
