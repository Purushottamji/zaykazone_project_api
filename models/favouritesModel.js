const db = require("../db");

module.exports = {

  //Get favourites 
  getFavouritesByUser(userId) {
    const sql = `
      SELECT 
        f.fav_id,
        fd.id AS food_id,
        fd.name AS food_name,
        fd.restaurant_name,
        fd.price,
        fd.image,
        fd.rating
      FROM favorites f
      JOIN food_details fd ON f.food_id = fd.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `;
    return db.query(sql, [userId]);
  },

  //Check food exists
  checkFood(foodId) {
    return db.query(
      "SELECT id FROM food_details WHERE id = ?",
      [foodId]
    );
  },

  //Already favourite?
  checkFavouriteExists(userId, foodId) {
    return db.query(
      "SELECT fav_id FROM favorites WHERE user_id = ? AND food_id = ?",
      [userId, foodId]
    );
  },

  //Add favourite
  addFavourite(userId, foodId) {
    return db.query(
      "INSERT INTO favorites (user_id, food_id) VALUES (?, ?)",
      [userId, foodId]
    );
  },

  //Get favourite by id (for delete auth)
  getFavouriteById(favId) {
    return db.query(
      "SELECT fav_id, user_id FROM favorites WHERE fav_id = ?",
      [favId]
    );
  },

  //Delete favourite
  deleteFavourite(favId) {
    return db.query(
      "DELETE FROM favorites WHERE fav_id = ?",
      [favId]
    );
  }
};