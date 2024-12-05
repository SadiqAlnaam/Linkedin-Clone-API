import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

//routes
import authRoutes from "./routes/auth.router.js";
import userRoutes from "./routes/user.route.js";

//MongooDB connection
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.listen(PORT, () => {
    console.log(`Server runing in port ${PORT}`);
    connectDB();
});