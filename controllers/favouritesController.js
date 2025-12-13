const Favourites = require("../models/favouritesModel");

module.exports = {

  // GET favourites by USER ID
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

  // ADD favourite
  async addFavourite(req, res) {
    try {
      const { user_id, res_id } = req.body;

      // check user
      const [user] = await Favourites.checkUser(user_id);
      if (!user.length) {
        return res.status(400).json({ error: "User does not exist" });
      }

      // check restaurant
      const [restaurant] = await Favourites.checkRestaurant(res_id);
      if (!restaurant.length) {
        return res.status(400).json({ error: "Restaurant does not exist" });
      }

      // prevent duplicate
      const [exists] = await Favourites.checkFavouriteExists(user_id, res_id);
      if (exists.length) {
        return res.status(409).json({ error: "Already in favourites" });
      }

      const [result] = await Favourites.addFavourite(user_id, res_id);

      res.status(201).json({
        message: "Added to favourites",
        favourite_id: result.insertId
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE favourite
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
