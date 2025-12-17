const express=require("express");
const router=express.Router();
const {orderHistoryGet,orderHistoryPost}= require("../controllers/orderhitsoryController");
router.get("/order/:user_id", orderHistoryGet);

router.post("/order",orderHistoryPost);
module.exports=router;