const express = require("express");
const router = express.Router();
const { getFoodIngredients, addFoodIngredients, patchFoodIngredients } = require("../controllers/foodIngredientsControllers");

router.get("/get", getFoodIngredients);
router.post("/post", addFoodIngredients);
router.patch("/:id", patchFoodIngredients);



module.exports = router;