const Favourites = require("../models/favouritesModel");

module.exports = {

  async getFavourites(req, res) {
    try {
      const { user_id } = req.params;

      const [rows] = await Favourites.getFavouritesByUser(user_id);
      res.json(rows);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },

  async addFavourite(req, res) {
    try {
      const { user_id, res_id, food_id} = req.body;

      const [user] = await Favourites.checkUser(user_id);
      if (!user.length) {
        return res.status(400).json({ error: "User does not exist" });
      }

      const [restaurant] = await Favourites.checkRestaurant(res_id);
      if (!restaurant.length) {
        return res.status(400).json({ error: "Restaurant does not exist" });
      }

      const [exists] = await Favourites.checkFavouriteExists(user_id, res_id, food_id);
      if (exists.length) {
        return res.status(409).json({ error: "Already in favourites" });
      }

      const [result] = await Favourites.addFavourite(user_id, res_id, food_id);

      res.status(201).json({
        message: "Added to favourites",
        favourite_id: result.insertId
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },

  async deleteFavourite(req, res) {
    try {
      const { fav_id } = req.params;

      await Favourites.deleteFavourite(fav_id);

      res.json({ message: "Removed from favourites" });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
};
