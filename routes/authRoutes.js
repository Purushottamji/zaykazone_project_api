const express = require("express");
const {upload} = require("../middleware/upload");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authControllers");


router.post("/register", upload.single("user_pic"), registerUser);

router.post("/login", loginUser);

module.exports = router;
