const express = require("express");
const {upload} = require("../middleware/upload");
const { getAllUsers,updateUser } = require("../controllers/userControllers");

const router = express.Router();

router.get("/", getAllUsers);
router.patch("/update/:id", upload.single("user_pic"), updateUser);
router.put("/update/:id", upload.single("user_pic"), updateUser);


module.exports = router;
