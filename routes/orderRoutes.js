const express =require("express");
const router= express.Router();
const {getOrderByUserId,addOrderDetails}=require("../controllers/orderController");

router.get("/:user_id", getOrderByUserId);
router.post("/add", addOrderDetails);

module.exports=router;