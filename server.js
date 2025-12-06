const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const addressRoutes = require("./routes/addRoutes");
const otpRoutes = require("./routes/otpRoutes");
const phoneOtpRoutes = require("./routes/phoneOtp");
const imageRoutes = require("./routes/onlyImageRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const foodRoutes= require("./routes/foodRoutes");
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

app.get("/payment", async (req, res) => {
  try {
    const viewQuery = "SELECT * FROM payment";
    const [rows] = await database.query(viewQuery); 

    res.status(200).json(rows);

  } catch (error) {
    res.status(500).json({ message: "server error: " + error });
  }
});


app.post("/addPayment", async (req, res) => {
  try {
    const { user_id, card_holder_name, card_number, exp_date, cvv } = req.body;

    const insertQuery = "INSERT INTO payment (user_id, card_holder_name, card_number, exp_date, cvv) VALUES (?, ?, ?, ?, ?)";

    const values = [user_id, card_holder_name, card_number, exp_date, cvv];

    const [result] = await database.query(insertQuery, values);

    res.status(201).json({
    
    user_id,card_holder_name,card_number,exp_date,cvv
    });

  } catch (error) {
    
   return res.status(500).json({ message: "Server Error: " + error });
  }
});

const PORT=process.env.PORT || 3000;
app.listen(PORT,(err)=>{
    if(err) return console.error("server error :"+err.message);
    console.log(`server running on port ${PORT}`);


})

