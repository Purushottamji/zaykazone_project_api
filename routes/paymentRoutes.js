const express=require("express");
const router=express.Router();
const {getPaymentByUserId,addPaymentDetails,deletePaymentDetails}=require("../controllers/paymentController");

router.get("/:user_id", getPaymentByUserId);
router.post("/addPayment/:user_id", addPaymentDetails);
router.delete("/deletePayment/:payment_id", deletePaymentDetails);

module.exports=router;
