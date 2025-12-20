

const Favourites = require("../models/favouritesModel");

module.exports = {

  //GET favourites 
  async getFavourites(req, res) {
    try {
      const user_id = req.user.id;

      const [rows] = await Favourites.getFavouritesByUser(user_id);
      res.status(200).json(rows);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  //ADD favourite
  async addFavourite(req, res) {
    try {
      const user_id = req.user.id;
      const { food_id } = req.body;

      if (!food_id) {
        return res.status(400).json({ error: "food_id is required" });
      }

      // Food exists?
      const [food] = await Favourites.checkFood(food_id);
      if (!food.length) {
        return res.status(400).json({ error: "Food does not exist" });
      }

      // Already favourite?
      const [exists] = await Favourites.checkFavouriteExists(user_id, food_id);
      if (exists.length) {
        return res.status(409).json({ error: "Already in favourites" });
      }

      const [result] = await Favourites.addFavourite(user_id, food_id);

      res.status(201).json({
        message: "Added to favourites",
        favourite_id: result.insertId
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE favourite
  async deleteFavourite(req, res) {
    try {
      const user_id = req.user.id;
      const { fav_id } = req.params;

      const [fav] = await Favourites.getFavouriteById(fav_id);
      if (!fav.length || fav[0].user_id !== user_id) {
        return res.status(403).json({ error: "Not authorized" });
      }

      await Favourites.deleteFavourite(fav_id);
      res.json({ message: "Removed from favourites" });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
