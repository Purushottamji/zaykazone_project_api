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
        const { name, email, mobile, bio} = req.body;

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

        let user_pic = existingUser.user_pic;
        if (req.file) user_pic = req.file.filename;

        const updatedData = {
            id,
            name: name || existingUser.name,
            email: email || existingUser.email,
            mobile: mobile || existingUser.mobile,
            user_bio: bio || existingUser.user_bio,
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

const patchUser = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, mobile, bio } = req.body;

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

        const updatedData = {
            id,
            name: name ?? existingUser.name,
            email: email ?? existingUser.email,
            mobile: mobile ?? existingUser.mobile,
            user_bio: bio || existingUser.user_bio,
            user_pic: req.file ? req.file.filename : existingUser.user_pic
        };

        const result = await User.patchUser(updatedData);
        if (!result)
            return res.status(400).json({ message: "Patch update failed" });

        const updatedUser = await User.findUserById(id);

        res.status(200).json({
            message: "User partially updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Patch error:", error);
        res.status(500).json({ message: "Server error: " + error });
    }
};

const deleteUser=async (req,res)=>{
    try{
       const {id}=req.params;

        const existingUser = await User.findUserById(id);
        if (!existingUser)
            return res.status(404).json({ message: "User not found" });

        const result= await User.deleteUser({id});
         if (!result)
            return res.status(400).json({ message: "Delete failed" });

         res.status(200).json({
            message: "User data delete successfully",
        });

    }catch(err){
        console.error("Delete error :" , err);
        res.status(500).json({ message: "Server error: " + err });
    }
}


module.exports = { getAllUsers ,updateUser, patchUser,deleteUser};
