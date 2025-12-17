const express=require("express");
const router=express.Router();
const {addFoodSize,getFoodSize}=require("../controllers/foodSizeControllers");

router.get("/getAll",getFoodSize);
router.post("/post",addFoodSize);

module.exports=router;