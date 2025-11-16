const express=require("express");
const dotenv=require("dotenv");
const authRoutes=require("./routes/authRoutes");
const userRoutes=require("./routes/userRoutes");
const addressRoutes= require("./routes/addRoutes");
dotenv.config();
const app=express();
app.use(express.json());

app.use("/auth",authRoutes);
app.use("/users",userRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/address",addressRoutes);



const PORT=process.env.PORT || 3000;
app.listen(PORT,(err)=>{
    if(err) return console.error("server error :"+err.message);
    console.log(`server running on port ${PORT}`);
});
