const express=require("express");
const router=express.Router();
const {upload} =require("../middleware/upload");
const {addRestaurant,getRestaurant,putRestaurant,patchRestaurant,deleteRestaurant,addRestaurantFood,putRestaurantFood,patchRestaurantFood}=require("../controllers/restaurantController");

router.get("/all_res",getRestaurant);
router.post("/post_res", upload.single("image_url"),addRestaurant);
router.put("/:res_id", upload.single("image_url"), putRestaurant);
router.patch("/:res_id", upload.single("image_url"), patchRestaurant);
router.delete("/:res_id", deleteRestaurant);

router.post("/:res_id/food", upload.single("image"), addRestaurantFood);
router.put("/:res_id/food", upload.array("images"), putRestaurantFood);
router.patch("/:res_id/food", upload.single("image"), patchRestaurantFood);


module.exports=router;