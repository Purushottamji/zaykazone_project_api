// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const sharp = require("sharp");

// const uploadPath = path.join(__dirname, "..", "uploads", "user_pic");

// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + "_" + file.originalname;
//     cb(null, uniqueName);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
//   if (allowed.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images are allowed"), false);
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,

// });

// module.exports = { upload };

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const uploadPath = path.join(__dirname, "..", "uploads", "user_pic");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// 1️⃣ Memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

// 2️⃣ Compress Middleware
const compressImage = async (req, res, next) => {
  try {
    if (!req.file) return next();

    const uniqueName = Date.now() + ".webp";
    const outputPath = path.join(uploadPath, uniqueName);

    let quality = 80;
    let width = 1080;
    let buffer;

    do {
      buffer = await sharp(req.file.buffer)
        .resize({ width })
        .webp({ quality })
        .toBuffer();

      if (buffer.length > 2 * 1024 * 1024) {
        quality -= 10;

        if (quality <= 20) {
          width -= 200; // 🔥 reduce dimension if quality too low
          quality = 80; // reset quality
        }
      }
    } while (buffer.length > 2 * 1024 * 1024 && width > 300);

    if (buffer.length > 2 * 1024 * 1024) {
      return res.status(400).json({
        message: "Image too large even after compression",
      });
    }

    fs.writeFileSync(outputPath, buffer);

    req.file.filename = uniqueName;
    req.file.path = outputPath;

    next();
  } catch (error) {
    res.status(500).json({ message: "Image compression failed" });
  }
};

module.exports = { upload, compressImage };
