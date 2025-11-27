const express=require("express");
const dotenv=require("dotenv");
const authRoutes=require("./routes/authRoutes");
const userRoutes=require("./routes/userRoutes");
const addressRoutes= require("./routes/addRoutes");
const otpRoutes=require("./routes/otpRoutes");
const phoneOtpRoutes=require("./routes/phoneOtp");
dotenv.config();
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/auth",authRoutes);
app.use("/phone",phoneOtpRoutes);
app.use("/users",userRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/address",addressRoutes);
app.use("/otp",otpRoutes);



const PORT=process.env.PORT || 3000;
app.listen(PORT,(err)=>{
    if(err) return console.error("server error :"+err.message);
    console.log(`server running on port ${PORT}`);
});
