const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const addressRoutes = require("./routes/addRoutes");
const otpRoutes = require("./routes/otpRoutes");
const phoneOtpRoutes = require("./routes/phoneOtp");
const imageRoutes = require("./routes/onlyImageRoutes");
const foodRoutes = require("./routes/foodRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const placeOrderRoutes = require("./routes/placeorderAddressRoutes");


const database = require("./db");
const db = require("./db");

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/phone", phoneOtpRoutes);
app.use("/users", userRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/address", addressRoutes);
app.use("/otp", otpRoutes);
app.use("/restaurant", restaurantRoutes);
app.use("/image_add", imageRoutes);
app.use("/food", foodRoutes);
app.use("/payment", paymentRoutes);
app.use('/place', placeOrderRoutes);


app.get("/rating/:user_id", async (req, res) => {
    try {
        const id = req.params.user_id;
        const viewQuery = "SELECT * FROM product_rating WHERE user_id = ?";
        const [rows] = await db.query(viewQuery, [id]);

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({
            message: "database fetching error: " + error,
        });
    }
});

app.post("/add_data", async (req, res) => {
    try {
        const {
            user_id,
            res_id,
            product_name,
            experience,
            rating
        } = req.body;

        if (!res_id || !product_name || !experience || !rating) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const insertQuery = `
      INSERT INTO product_rating 
      (user_id,res_id, product_name, experience, rating)
      VALUES (?, ?, ?, ?,?)
    `;

        const [result] = await db.query(insertQuery, [
            user_id,
            res_id, product_name, experience, rating
        ]);

        res.status(201).json({
            message: "Rating added successfully",
            data: result.insertId
        });

    } catch (error) {
        res.status(500).json({ message: "Database insert error: " + error });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if (err) return console.error("server error :" + err.message);
    console.log(`server running on port ${PORT}`);
});
