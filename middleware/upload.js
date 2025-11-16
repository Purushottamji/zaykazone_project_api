const multer = require("multer");
const path = require("path");

// Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/user_pics");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + "_" + Math.random().toString(36).substring(2) + ext);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type"), false);
};

module.exports = multer({ storage, fileFilter });
