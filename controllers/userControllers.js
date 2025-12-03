const User = require("../models/userModel");
const bcrypt = require("bcrypt");

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

const updateUser = async (req, res) => {
    try {

        const id = req.params.id;
        const { name, email, mobile, password } = req.body;

        const existingUser = await User.findUserById(id);
        if (!existingUser)
            return res.status(404).json({ message: "User not found" });

        
        if (email) {
            const userWithEmail = await User.findUserByEmail(email);
            if (userWithEmail && userWithEmail.id != id) {
                return res.status(400).json({ message: "Email already taken" });
            }
        }

        
        if (mobile) {
            const userWithMobile = await User.findUserByMobile(mobile);
            if (userWithMobile && userWithMobile.id != id) {
                return res.status(400).json({ message: "Mobile number already taken" });
            }
        }

       
        let hashedPassword = existingUser.password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

       
        let user_pic = existingUser.user_pic;
        if (req.file) user_pic = req.file.filename;

        
        const updatedData = {
            id,
            name: name || existingUser.name,
            email: email || existingUser.email,
            mobile: mobile || existingUser.mobile,
            password: hashedPassword,
            user_pic
        };

        const ok = await User.updateUser(updatedData);
        if (!ok)
            return res.status(400).json({ message: "Update failed" });

        const updatedUser = await User.findUserById(id);

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const patchUser = async (data) => {
    const fields = [];
    const values = [];

    if (data.name !== undefined) {
        fields.push("name = ?");
        values.push(data.name);
    }

    if (data.email !== undefined) {
        fields.push("email = ?");
        values.push(data.email);
    }

    if (data.mobile !== undefined) {
        fields.push("mobile = ?");
        values.push(data.mobile);
    }

    if (data.password !== undefined) {
        fields.push("password = ?");
        values.push(data.password);
    }

    if (data.user_pic !== undefined) {
        fields.push("user_pic = ?");
        values.push(data.user_pic);
    }

    // Add WHERE id
    values.push(data.id);

    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    const [result] = await pool.execute(sql, values);

    return result.affectedRows > 0;
};


module.exports = { getAllUsers ,updateUser,patchUser};
