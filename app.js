import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import contactsRouter from "./routes/contactsRouter.js";
import mongoose from "mongoose";

const DB_Host = process.env.DB_Host;
console.log(DB_Host);

// const DB_Host =
//   "mongodb+srv://Kateryna:TVY2b8EgUFmwGiRk@cluster0.alapfrk.mongodb.net/db-contacts?retryWrites=true&w=majority";

mongoose
  .connect(DB_Host)
  .then(() => console.log("Database connection successful"))
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
