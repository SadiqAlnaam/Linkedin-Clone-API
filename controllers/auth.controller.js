import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendWelcomEmail } from "../emails/emailHandlers.js";

dotenv.config();
export const signup = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        if (!name || !username || !email || !password) return res.status(400).json({ message: "All field are required" });

        //Check if email is exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: "Email already exists!" });

        //Check if Username isexists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) return res.status(400).json({ message: "Username already exists!" });

        //Check if password less than 6char
        if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            username
        });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
        res.cookie("jwt-linkedin", token, {
            httpOnly: true, //prevent XSS attack
            maxAge: 3 * 24 * 60 * 1000,
            sameSite: "strict", //prevent CSRF attacks
            secure: process.env.NODE_ENV === "production", //prevent man-in-the-middle attacks
        });

        res.status(201).json({ message: "User registered successfully" });

        //ToDo: send email welcom
        const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username
        try {
            await sendWelcomEmail(user.email, user.name, profileUrl)
        } catch (emailError) {
            console.log(emailError)
        }
    } catch (error) {
        console.log("Error in signup", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: "All field are required" });

        //check if user is exists
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Invalid username or password" });

        //chech password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid username or password" });

        //create and send token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
        await res.cookie("jwt-linkedin", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });
        res.json({ message: "Logged in successfully" });

    } catch (error) {
        console.error("Error in login controller:", error);
        res.json({ message: "server error" });
    }
}
export const logout = (req, res) => {
    res.clearCookie("jwt-linkenin");
    res.json({ message: "Logged out sucessfully" });
}

export const getCurrentUser = (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        console.log("Error in getCurrentUse controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}