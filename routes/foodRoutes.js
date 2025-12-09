
const express=require("express");
const router=express.Router();
const {upload} =require("../middleware/upload");
const {getFood,postFoodDetails,putFoodDetails,patchFoodDetails,deleteFoodDetails}=require("../controllers/foodController");

router.get("/get",getFood);
router.post("/post", upload.single("image"), postFoodDetails);
router.put("/:id", upload.single("image"), putFoodDetails);
router.patch("/:id", upload.single("image"), patchFoodDetails);
router.delete("/:id", deleteFoodDetails);


module.exports=router;