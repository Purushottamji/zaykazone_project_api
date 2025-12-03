const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const database=require("../db");

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

const patchUser= async (req,res) =>{
   try {
    const id = req.params.id;
    const updates = req.body;

    if (req.file) updates.image_url = req.file.filename;

    const fields = Object.keys(updates).map(field => `${field}=?`).join(", ");
    const values = Object.values(updates);

    const updateQuery = `UPDATE user_info SET ${fields} WHERE id = ?`;

    const [result] = await database.query(updateQuery, [...values, restaurantId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User partially updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Database patch error: " + error });
  }
}


module.exports = { getAllUsers ,updateUser,patchUser};
