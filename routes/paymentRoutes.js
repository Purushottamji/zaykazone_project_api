const express=require("express");
const router=express.Router();
const {getPaymentByUserId,addPaymentDetails,deletePaymentDetails}=require("../controllers/paymentController");

router.get("/:user_id", getPaymentByUserId);
router.post("/addPayment/:user_id", addPaymentDetails);
router.delete("/deletePayment/:id", deletePaymentDetails);

module.exports=router;
