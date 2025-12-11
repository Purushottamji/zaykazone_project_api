const express=require("express");
const router=express.Router();
const {plasceorderAddressGet,placeorderAddressAdd, placeorderAddressPatch}=require("../controllers/placeorderAddressControllers");
router.get("/order/:user_id",plasceorderAddressGet);
router.post("/addorder",placeorderAddressAdd);
router.patch("/patchorder/:id",placeorderAddressPatch);

module.exports=router;
