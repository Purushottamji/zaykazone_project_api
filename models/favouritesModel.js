const db = require("../db");

module.exports = {

  getFavouritesByUser(userId) {
    const sql = `
      SELECT 
        f.fav_id AS favourite_id,
        r.res_id,
        r.name,
        r.address,
        r.image_url,
        r.rating
      FROM favorites f
      JOIN restaurant_details r ON f.res_id = r.res_id
      WHERE f.user_id = ?
    `;
    return db.query(sql, [userId]);
  },

  checkUser(userId) {
    return db.query(
      "SELECT id FROM user_info WHERE id = ?",
      [userId]
    );
  },

  checkRestaurant(resId) {
    return db.query(
      "SELECT res_id FROM restaurant_details WHERE res_id = ?",
      [resId]
    );
  },

  checkFavouriteExists(userId, resId) {
    return db.query(
      "SELECT fav_id FROM favorites WHERE user_id = ? AND res_id = ?",
      [userId, resId]
    );
  },

  addFavourite(userId, resId) {
    return db.query(
      "INSERT INTO favorites (user_id, res_id) VALUES (?, ?)",
      [userId, resId]
    );
  },

  deleteFavourite(favId) {
    return db.query(
      "DELETE FROM favorites WHERE fav_id = ?",
      [favId]
    );
  }
};
