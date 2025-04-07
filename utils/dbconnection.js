import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
  path: "../utils/.env",
});

const databaseConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("database connected");
    })
    .catch((error) => {
      console.log(error);
    });
};
 export default databaseConnection;