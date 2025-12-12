const express = require("express");
const router = express.Router();

const { getFavourites, addFavourite, deleteFavourite } = require("../controllers/favouritesController");

router.get("/user/:id", getFavourites);   
router.post("/", addFavourite);           
router.delete("/:fevo_id", deleteFavourite); 

module.exports = router;
