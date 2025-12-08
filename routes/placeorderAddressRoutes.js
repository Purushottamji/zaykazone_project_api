const express=require("express");
const router=express.Router();
const {plasceorderAddressGet,placeorderAddressAdd}=require("../controllers/placeorderAddressControllers");
router.get("/order",plasceorderAddressGet);
router.post("/addorder",placeorderAddressAdd)
module.exports=router;
