import "dotenv/config";
import mongoose from "mongoose";

// const DB_Host = process.env.DB_Host;
const DB_Host =
  "mongodb+srv://Kateryna:TVY2b8EgUFmwGiRk@cluster0.alapfrk.mongodb.net/db-contacts?retryWrites=true&w=majority";

mongoose
  .connect(DB_Host)
  .then(() => console.log("Database connection successful"))
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
