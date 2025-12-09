const express=require("express");
const router=express.Router();
const {plasceorderAddressGet,placeorderAddressAdd}=require("../controllers/placeorderAddressControllers");
router.get("/order/:user_id",plasceorderAddressGet);
router.post("/addorder",placeorderAddressAdd)
module.exports=router;
