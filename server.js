import express from "express";
import dotenv from "dotenv";

//MongooDB connection
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server runing in port ${PORT}`);
    connectDB();
});