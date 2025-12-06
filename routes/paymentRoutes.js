const express=require("express");
const router=express.Router();
const {getPaymentByUserId,addPaymentDetails}=require("../controllers/paymentController");

router.get("/:user_id", getPaymentByUserId);
router.post("/addPayment", addPaymentDetails);

module.exports=router;

