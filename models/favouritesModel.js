const db = require("../db");

module.exports = {

  getFavouritesByUser(userId) {
  const sql = `
      SELECT 
      f.fav_id AS favourite_id,
      fd.id AS food_id,
      fd.image,
      fd.rating,
      fd.name AS food_name,
      fd.price,
      r.res_id,
      r.name AS restaurant_name,
      r.address,
      r.image_url AS restaurant_image,
      r.rating AS restaurant_rating
    FROM favorites f
    LEFT JOIN food_details fd ON f.food_id = fd.id
    LEFT JOIN restaurant_details r ON fd.restaurant_id = r.res_id
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

  addFavourite(userId, resId, foodId) {
    return db.query(
      "INSERT INTO favorites (user_id, res_id, food_id) VALUES (?, ?, ?)",
      [userId, resId, foodId]
    );
  },

  deleteFavourite(favId) {
    return db.query(
      "DELETE FROM favorites WHERE fav_id = ?",
      [favId]
    );
  }
};
