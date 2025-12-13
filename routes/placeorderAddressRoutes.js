const express=require("express");
const router=express.Router();
const {plasceorderAddressGet,placeorderAddressAdd, placeorderAddressPatch, placeorderAddreddDelete}=require("../controllers/placeorderAddressControllers");
router.get("/order/:user_id",plasceorderAddressGet);
router.post("/addorder",placeorderAddressAdd);
router.patch("/patchorder/:id",placeorderAddressPatch);
router.delete("/deleteorder/:id",placeorderAddreddDelete);

module.exports=router;
