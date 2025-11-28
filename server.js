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

const db=require("./db");
app.post("/locationupdate", (req, res) => {
  const {deliveryBoyId, orderId, latitude,longitude, speed} = req.body;

  if (!deliveryBoyId || !orderId || !latitude || !longitude || !speed) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const sql = `
    INSERT INTO delivery_locations 
    (deliveryBoyId, orderId, latitude, longitude, speed) 
    VALUES (?, ?, ?, ?, ?);
  `;

  db.query(
    sql,
    [deliveryBoyId, orderId, latitude, longitude, speed],
    (err,result) => {
      if (err) {
        return res.status(500).json({ message: "DB error", error: err });
      }
      res.json({ message: "Location track successfully",data:result });
    }
  );
});



const PORT=process.env.PORT || 3000;
app.listen(PORT,(err)=>{
    if(err) return console.error("server error :"+err.message);
    console.log(`server running on port ${PORT}`);
});





