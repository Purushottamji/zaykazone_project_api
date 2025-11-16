const User = require("../models/userModel");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.status(200).json({
            message: "All user data fetched",
            data: users
        });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getAllUsers };
