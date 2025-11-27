const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body;

        if (!name || !email || !password)
            return res.status(400).json({ message: "All fields are required" });

        const existing = await User.findUserByEmail(email);
        if (existing)
            return res.status(400).json({ message: "Email already in use" });

        const hashed = await bcrypt.hash(password, 10);
        const user_pic = req.file ? req.file.filename : null;

        const { insertId } = await User.createUser({
            name,
            email,
            password: hashed,
            mobile,
            user_pic
        });

        const user = await User.findUserById(insertId);
        res.status(201).json({ user });

    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: "All fields are required" });

        const user = await User.findUserByEmail(email);
        if (!user)
            return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user.id, email: user.email }, "secret123", {
            expiresIn: "7d",
        });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                user_pic: user.user_pic ?? null,
            }
        });

        console.log("Login Request Body:", req.body);
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { registerUser, loginUser };
