const db=require("../db");
const OrderModel=require("../models/orderModel");


const getOrderByUserId= async (req,res) => {
    try{
      const {user_id} =req.params;
      const result=await OrderModel.getOrderByUserId(user_id);
      res.status(200).json({result});
    }catch(err){
      console.error("Order get error:", err);
    res.status(500).json({ message: "Server error" });
    }
};

const addOrderDetails = async (req, res) => {
  try {
    const orderData = req.body;

    const order = await OrderModel.addOrderDetails(orderData);

    res.status(201).json({
      message: "Order placed successfully",
      order
    });

  } catch (err) {
    console.error("Order create error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports={getOrderByUserId, addOrderDetails};