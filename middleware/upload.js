const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = "uploads/user_pic";
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
   filename: function (req, file, cb) {
  const uniqueName = Date.now() + "_" + file.originalname;
  cb(null, uniqueName);
}

});

// File filter
const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only images are allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});


module.exports = {upload};
