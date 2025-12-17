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
    const {
      user_id,
      res_id,
      food_name,
      quantity,
      total_price,
      p_o_a_id
    } = req.body;

    if (
      !user_id ||
      !res_id ||
      !food_name ||
      !quantity ||
      !total_price ||
      !p_o_a_id
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (quantity <= 0 || total_price <= 0) {
      return res.status(400).json({
        message: "Invalid quantity or price"
      });
    }

    const order = await OrderModel.addOrderDetails(req.body);

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