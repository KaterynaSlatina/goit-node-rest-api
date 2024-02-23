import "dotenv/config";
import mongoose from "mongoose";

const DB_Host = process.env.DB_Host;

console.log(DB_Host);

mongoose
  .connect(DB_Host)
  .then(() => console.log("Database connection successful"));
process.exit(0).catch((error) => {
  console.log(error.message);
});
