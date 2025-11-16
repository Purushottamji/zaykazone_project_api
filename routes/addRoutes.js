const express=require("express");
const {createAddress, getUserAddress, updateAddress, deleteAddress} =require("../controllers/addControllers");

const router= express.Router();

router.post("/add",createAddress);
router.get("/:user_id",getUserAddress);
router.put("/:add_id",updateAddress);
router.delete("/:add_id",deleteAddress);

module.exports=router;